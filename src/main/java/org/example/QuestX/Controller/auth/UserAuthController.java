package org.example.QuestX.Controller.auth;

import jakarta.mail.MessagingException;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.validation.Valid;
import lombok.AllArgsConstructor;
import org.example.QuestX.Model.Role;
import org.example.QuestX.Model.Status;
import org.example.QuestX.Model.User;
import org.example.QuestX.Repository.UserRepository;
import org.example.QuestX.config.PasswordConfig;
import org.example.QuestX.dtos.*;
import org.example.QuestX.exception.UserNotFoundException;
import org.example.QuestX.services.JwtService;
import org.example.QuestX.services.MailService;
import org.example.QuestX.services.ResetPasswordService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;


@AllArgsConstructor
@RequestMapping("/auth")
@RestController
public class UserAuthController {

    private final  AuthenticationManager authenticationManager;
    private final  UserRepository userRepository;
    private final JwtService jwtService;
    private final PasswordConfig passwordConfig;
    private final MailService otpService;
    private final ResetPasswordService resetPasswordService;

    @PostMapping("/signup/user")
    public ResponseEntity<?> userSignup(@RequestBody SignupRequest request) throws MessagingException {
        if(userRepository.existsByEmail(request.getEmail())) {
            return ResponseEntity.badRequest().body("Email already exists");
        }

        User user = new User();
        user.setName(request.getName());
        if(userRepository.existsByEmail(request.getEmail())) {
            return ResponseEntity.badRequest().body("Email already exists");
        }
        user.setEmail(request.getEmail());
        if(!request.getPassword().equals(request.getConfirmPassword())) {
            return ResponseEntity.badRequest().body("Passwords do not match");
        }
        user.setPassword(passwordConfig.passwordEncoder().encode(request.getPassword()));
        user.setRole(Role.USER);
        user.setStatus(Status.PENDING);
        user.setCreatedAt(LocalDateTime.now());
        userRepository.save(user);

        otpService.sendOtpEmail(request.getEmail());
        return ResponseEntity.ok("OTP has been sent to your email");
    }

    @PostMapping("/signup/user/resend-otp")
    public ResponseEntity<?> resendOtp(@RequestParam String email) throws MessagingException {
        otpService.resendOtp(email);
        return ResponseEntity.ok("OTP has been sent to your email");
    }

    @PostMapping("/signup/user/verify-otp")
    public ResponseEntity<?> verifyOtp(
            @RequestBody VerifyOtpRequest request ,
            HttpServletResponse response)
    {
        Boolean verified = otpService.verifyOtp(request);
        if(!verified) {
            return ResponseEntity.badRequest().body("OTP is not verified");
        }
        var user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new RuntimeException("User not found"));
        user.setIsEmailVerified(true);
        userRepository.save(user);

        JwtResponse jwtResponse = jwtService.generateAccessTokenAndSetCookie(user,response);
        return ResponseEntity.ok(jwtResponse);

    }

    @PostMapping("/login/user")
    public ResponseEntity<?> login(
            @Valid @RequestBody LoginRequest request,
            HttpServletResponse response
    ){
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        request.getEmail(),
                        request.getPassword()
                )
        );
        User user = userRepository.findByEmail(request.getEmail()).orElseThrow();

        JwtResponse jwtResponse = jwtService.generateAccessTokenAndSetCookie(user,response);
        return ResponseEntity.ok(jwtResponse);
    }

    @PostMapping("/login/user/forget-password")
    public ResponseEntity<?> forgetPassword(
            @RequestParam String email
    ) throws MessagingException {

        var user = userRepository.findByEmail(email).orElseThrow(
                ()-> new UserNotFoundException("User not found")
        );
        otpService.sendOtpEmail(user.getEmail());
        return ResponseEntity.ok("OTP has been sent to your email");
    }
    @PostMapping("/login/user/forget-password/verify-otp")
    public ResponseEntity<?> verifyOtpForPasswordChange(@RequestBody VerifyOtpRequest request) {
        return ResponseEntity.ok(resetPasswordService.verifyOtpAndGenerateResetToken(request));
    }

    @PostMapping("/login/user/forget-password/reset-password")
    public ResponseEntity<?> resetPassword(@RequestBody ResetPasswordRequest request) {
        boolean verified = resetPasswordService.verifyResetToken(request.getEmail(),request.getResetToken());
        if(!verified) {
            return ResponseEntity.badRequest().body("Reset token is not verified");
        }
        var user = userRepository.findByEmail(request.getEmail()).orElseThrow(
                ()-> new UserNotFoundException("User not found")
        );
        user.setPassword(passwordConfig.passwordEncoder().encode(request.getPassword()));
        userRepository.save(user);

        resetPasswordService.removeResetToken(request.getEmail());

        return ResponseEntity.ok("Password has been Reset Successfully");
    }

}
