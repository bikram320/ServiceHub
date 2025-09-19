package org.example.QuestX.Controller;

import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import lombok.AllArgsConstructor;
import org.example.QuestX.Repository.PendingSignupRepository;
import org.example.QuestX.exception.TechnicianNotFoundException;
import org.example.QuestX.exception.UserNotFoundException;
import org.example.QuestX.services.*;
import org.springframework.http.HttpStatus;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import jakarta.mail.MessagingException;
import jakarta.servlet.http.HttpServletResponse;
import org.example.QuestX.Model.*;
import org.example.QuestX.Repository.AdminRepository;
import org.example.QuestX.Repository.TechnicianRepository;
import org.example.QuestX.Repository.UserRepository;
import org.example.QuestX.config.PasswordConfig;
import org.example.QuestX.dtos.*;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;

@AllArgsConstructor
@RestController
@RequestMapping("/auth")
public class AuthController {
    private final AuthenticationManager authenticationManager;
    private final AdminRepository adminRepository;
    private final TechnicianRepository technicianRepository;
    private final UserRepository userRepository;
    private final PasswordConfig passwordConfig;
    private final MailService otpService;
    private final JwtService jwtService;
    private final ResetPasswordService resetPasswordService;
    private final TokenBlackListService tokenBlackListService;
    private final PendingSignupRepository pendingSignupRepository;

    // login
    @PostMapping("/login/admin")
    public ResponseEntity<?> loginAdmin(@RequestBody LoginRequest request,
                                        HttpServletResponse response) {
        Admin admin = adminRepository.findByEmail(request.getEmail());
        if (admin == null) {
            throw new BadCredentialsException("Admin not found");
        }
        return login(request.getEmail(), request.getPassword(),
                admin, response);
    }

    @PostMapping("/login/user")
    public ResponseEntity<?> loginUser(@RequestBody LoginRequest request, HttpServletResponse response) {
        var user = userRepository.findByEmail(request.getEmail()).orElseThrow(
                () -> new UserNotFoundException("User not found")
        );
        return login(request.getEmail(), request.getPassword(), user, response);
    }

    @PostMapping("/login/technician")
    public ResponseEntity<?> loginTechnician(@RequestBody LoginRequest request,
                                             HttpServletResponse response) {
        var technician = technicianRepository.findByEmail(request.getEmail());
        if (technician == null) {
            throw new TechnicianNotFoundException("Technician not found");
        }
        return login(request.getEmail(), request.getPassword(), technician, response);
    }

    private <T> ResponseEntity<?> login(String email, String password,
                                        T entity, HttpServletResponse response) {
        if (entity == null) {
            return ResponseEntity.badRequest().body("Invalid email or password");
        }
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(email, password)
        );
        return ResponseEntity.ok(jwtService.generateAccessTokenAndSetCookie((JwtUser) entity, response));
    }

    @PostMapping("/signup/user")
    public ResponseEntity<?> signupUser(@RequestBody SignupRequest request) throws MessagingException {
        return initiateSignup(request, Role.USER);
    }

    @PostMapping("/signup/technician")
    public ResponseEntity<?> signupTechnician(@RequestBody SignupRequest request) throws MessagingException {
        return initiateSignup(request, Role.TECHNICIAN);
    }

    private ResponseEntity<?> initiateSignup(SignupRequest request, Role role) throws MessagingException {
        // 1️ Check if email already exists in users or technicians
        if (userRepository.existsByEmail(request.getEmail()) || technicianRepository.existsByEmail(request.getEmail())) {
            return ResponseEntity.badRequest().body("Email already exists");
        }
        if (!request.getPassword().equals(request.getConfirmPassword())) {
            return ResponseEntity.badRequest().body("Passwords do not match");
        }
        if (request.getPassword().length() < 8 || request.getPassword().length() > 32) {
            return ResponseEntity.badRequest().body("Password must be 8-32 characters");
        }

        //  Remove any previous pending signup with the same email (cleanup)
        pendingSignupRepository.deleteByEmail(request.getEmail());

        // Store pending signup in DB
        PendingSignup pending = new PendingSignup();
        pending.setName(request.getName());
        pending.setEmail(request.getEmail());
        pending.setPassword(passwordConfig.passwordEncoder().encode(request.getPassword())); // encode before saving
        pending.setRole(role);
        pending.setCreatedAt(LocalDateTime.now());
        pendingSignupRepository.save(pending);

        // ️Send OTP
        otpService.sendOtpEmail(request.getEmail());

        return ResponseEntity.ok("OTP sent. Please verify to complete signup.");
    }

    // --- Verify OTP & Create User/Technician ---
    @PostMapping("/signup/user/verify-otp")
    public ResponseEntity<?> verifyOtpUser(@RequestBody VerifyOtpRequest request, HttpServletResponse response) {
        return verifyOtpAndSave(request, Role.USER, response);
    }

    @PostMapping("/signup/technician/verify-otp")
    public ResponseEntity<?> verifyOtpTechnician(@RequestBody VerifyOtpRequest request, HttpServletResponse response) {
        return verifyOtpAndSave(request, Role.TECHNICIAN, response);
    }

    private ResponseEntity<?> verifyOtpAndSave(VerifyOtpRequest request, Role role, HttpServletResponse response) {
        if (!otpService.verifyOtp(request)) {
            return ResponseEntity.badRequest().body("OTP verification failed");
        }

        PendingSignup pending = pendingSignupRepository.findByEmail(request.getEmail())
                .orElse(null);

        if (pending == null) {
            return ResponseEntity.badRequest().body("No pending signup found for this email");
        }

        if (role == Role.USER) {
            User user = new User();
            user.setName(pending.getName());
            user.setEmail(pending.getEmail());
            user.setPassword(pending.getPassword());
            user.setRole(Role.USER);
            user.setIsEmailVerified(true);
            user.setCreatedAt(LocalDateTime.now());
            userRepository.save(user);
            pendingSignupRepository.deleteByEmail(pending.getEmail());
            return ResponseEntity.ok(jwtService.generateAccessTokenAndSetCookie(user, response));

        } else if (role == Role.TECHNICIAN) {
            Technician tech = new Technician();
            tech.setName(pending.getName());
            tech.setEmail(pending.getEmail());
            tech.setPassword(pending.getPassword());
            tech.setRole(Role.TECHNICIAN);
            tech.setIsEmailVerified(true);
            tech.setCreatedAt(LocalDateTime.now());
            technicianRepository.save(tech);
            pendingSignupRepository.deleteByEmail(pending.getEmail());
            return ResponseEntity.ok(jwtService.generateAccessTokenAndSetCookie(tech, response));
        }

        return ResponseEntity.badRequest().body("Invalid role");
    }

    @PostMapping({"/signup/user/resend-otp",
            "/signup/technician/resend-otp"})
    public ResponseEntity<?> resendOtp(@RequestParam String email) throws MessagingException {
        otpService.resendOtp(email);
        return ResponseEntity.ok("OTP successfully sent");
    }

    // Forget Password
    @PostMapping({"/login/user/forget-password",
            "/login/technician/forget-password"})
    public ResponseEntity<?> forgetPassword(@RequestParam String email) throws MessagingException {
        otpService.sendOtpEmail(email);
        return ResponseEntity.ok("OTP has been sent to your email");
    }

    @PostMapping({"/login/user/forget-password/verify-otp",
            "/login/technician/forget-password/verify-otp"})
    public ResponseEntity<?> verifyOtpForPasswordChange(@RequestBody VerifyOtpRequest request) {
        return ResponseEntity.ok(resetPasswordService.verifyOtpAndGenerateResetToken(request));
    }

    @PostMapping({"/login/user/forget-password/reset-password",
            "/login/technician/forget-password/reset-password"})
    public ResponseEntity<?> resetPassword(@RequestBody ResetPasswordRequest request) {

        boolean verified = resetPasswordService.verifyResetToken(request.getEmail(),
                request.getResetToken());

        if (!verified) {
            return ResponseEntity.badRequest().body("Reset token is not verified");
        }

        if (userRepository.findByEmail(request.getEmail()).isPresent()) {
            var user = userRepository.findByEmail(request.getEmail()).orElseThrow();
            user.setPassword(passwordConfig.passwordEncoder().encode(request.getPassword()));
            userRepository.save(user);
        } else {
            var tech = technicianRepository.findByEmail(request.getEmail());
            tech.setPassword(passwordConfig.passwordEncoder().encode(request.getPassword()));
            technicianRepository.save(tech);
        }

        resetPasswordService.removeResetToken(request.getEmail());
        return ResponseEntity.ok("Password has been Reset Successfully");
    }

    @PostMapping("/logout")
    public ResponseEntity<?> logout(
            @CookieValue(name = "Access", required = false) String accessToken,
            @RequestHeader(value = "Authorization", required = false) String authHeader,
            HttpServletResponse response
    ) {

        // Use token from header if present
        String token = accessToken;
        if (authHeader != null && authHeader.startsWith("Bearer ")) {
            token = authHeader.substring(7);
        }

        // Blacklist the token
        if (token != null) {
            long expiration = jwtService.getExpirationFromToken(token);
            tokenBlackListService.blacklistToken(token, expiration);
        }

        // Clear cookies
        Cookie refreshCookie = new Cookie("Refresh", null);
        refreshCookie.setHttpOnly(true);
        refreshCookie.setSecure(true);
        refreshCookie.setPath("/");
        refreshCookie.setMaxAge(0);
        response.addCookie(refreshCookie);

        Cookie accessCookie = new Cookie("Access", null);
        accessCookie.setHttpOnly(true);
        accessCookie.setSecure(true);
        accessCookie.setPath("/");
        accessCookie.setMaxAge(0);
        response.addCookie(accessCookie);

        return ResponseEntity.ok("Logged out successfully");
    }

    //refresh token

    @PostMapping("/refresh")
    public ResponseEntity<?> refreshToken(HttpServletRequest request, HttpServletResponse response) {
        String refreshToken = null;
        if (request.getCookies() != null) {
            for (Cookie cookie : request.getCookies()) {
                if (cookie.getName().equals("Refresh")) {
                    refreshToken = cookie.getValue();
                    break;
                }
            }
        }

        if (refreshToken == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Refresh token missing");
        }

        Jwt refreshJwt = jwtService.parseToken(refreshToken);
        if (refreshJwt == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid refresh token");
        }

        Long userId = refreshJwt.getUserId();
        var user = userRepository.findById(userId).orElseThrow(
                () -> new UserNotFoundException("User not found")
        );
        var jwtResponse = jwtService.generateAccessTokenAndSetCookie(user, response);

        return ResponseEntity.ok(jwtResponse);
    }
}
