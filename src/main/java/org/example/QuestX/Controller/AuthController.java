package org.example.QuestX.Controller;

import lombok.AllArgsConstructor;
import org.example.QuestX.exception.TechnicianNotFoundException;
import org.example.QuestX.exception.UserNotFoundException;
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
import org.example.QuestX.services.JwtService;
import org.example.QuestX.services.MailService;
import org.example.QuestX.services.ResetPasswordService;
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

    // SignUp
    @PostMapping("/signup/user")
    public ResponseEntity<?> signupUser(@RequestBody SignupRequest request) throws MessagingException {
        return signup(request, userRepository, Role.USER);
    }

    @PostMapping("/signup/technician")
    public ResponseEntity<?> signupTechnician(@RequestBody SignupRequest request) throws MessagingException {
        return signup(request, technicianRepository, Role.TECHNICIAN);
    }

    private ResponseEntity<?> signup(SignupRequest request, Object repo, Role role) throws MessagingException {
        if (emailExists(request.getEmail(), repo)) {
            return ResponseEntity.badRequest().body("Email already exists");
        }
        if (!request.getPassword().equals(request.getConfirmPassword())){
            return ResponseEntity.badRequest().body("Passwords do not match");
        }
        if (request.getPassword().length() < 8 || request.getPassword().length() > 32)
            return ResponseEntity.badRequest().body("Password must be 8-32 characters");

        Object entity = role == Role.USER ? new User() : new Technician();

        if (entity instanceof User u) {
            u.setName(request.getName());
            u.setEmail(request.getEmail());
            u.setPassword(passwordConfig.passwordEncoder().encode(request.getPassword()));
            u.setRole(role);
            u.setStatus(Status.PENDING);
            u.setCreatedAt(LocalDateTime.now());
            userRepository.save(u);
        } else {
            Technician t = (Technician) entity;
            t.setName(request.getName());
            t.setEmail(request.getEmail());
            t.setPassword(passwordConfig.passwordEncoder().encode(request.getPassword()));
            t.setRole(role);
            t.setStatus(Status.PENDING);
            t.setCreatedAt(LocalDateTime.now());
            technicianRepository.save(t);
        }

        otpService.sendOtpEmail(request.getEmail());
        return ResponseEntity.ok("OTP has been sent to your email");
    }

    private boolean emailExists(String email, Object repo) {
        if (repo instanceof UserRepository ur){
            return ur.existsByEmail(email);
        }
        if (repo instanceof TechnicianRepository tr) {
            return tr.existsByEmail(email);
        }
        return false;
    }

    // Verify OTP
    @PostMapping("/signup/user/verify-otp")
    public ResponseEntity<?> verifyOtpUser(@RequestBody VerifyOtpRequest request, HttpServletResponse response) {
        return verifyOtp(request, userRepository, response);
    }

    @PostMapping("/signup/technician/verify-otp")
    public ResponseEntity<?> verifyOtpTechnician(@RequestBody VerifyOtpRequest request, HttpServletResponse response) {
        return verifyOtp(request, technicianRepository, response);
    }

    private  ResponseEntity<?> verifyOtp(VerifyOtpRequest request, Object repo, HttpServletResponse response) {
        boolean verified = otpService.verifyOtp(request);
        if (!verified) {
            return ResponseEntity.badRequest().body("OTP verification failed");
        }

        if (repo instanceof UserRepository ur) {
            var user = ur.findByEmail(request.getEmail()).orElseThrow();
            user.setIsEmailVerified(true);
            ur.save(user);
            return ResponseEntity.ok(jwtService.generateAccessTokenAndSetCookie(user, response));
        } else if (repo instanceof TechnicianRepository tr) {
            var tech = tr.findByEmail(request.getEmail());
            tech.setIsEmailVerified(true);
            tr.save(tech);
            return ResponseEntity.ok(jwtService.generateAccessTokenAndSetCookie(tech, response));
        }
        return ResponseEntity.badRequest().body("Unknown repository");
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
}
