package org.example.servicehub.Controller;

import jakarta.mail.MessagingException;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.validation.Valid;
import lombok.AllArgsConstructor;
import org.example.servicehub.Model.Role;
import org.example.servicehub.Model.Status;
import org.example.servicehub.Model.User;
import org.example.servicehub.Repository.UserRepository;
import org.example.servicehub.config.JwtConfig;
import org.example.servicehub.config.PasswordConfig;
import org.example.servicehub.dtos.JwtResponse;
import org.example.servicehub.dtos.SignupRequest;
import org.example.servicehub.dtos.UserLoginRequest;
import org.example.servicehub.dtos.VerifyOtpRequest;
import org.example.servicehub.services.JwtService;
import org.example.servicehub.services.OtpService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.web.bind.annotation.*;

@AllArgsConstructor
@RequestMapping("/auth")
@RestController
public class AuthController {

    private final  AuthenticationManager authenticationManager;
    private final  UserRepository userRepository;
    private final JwtService jwtService;
    private final JwtConfig jwtConfig;
    private final PasswordConfig passwordConfig;
    private final OtpService otpService;

    @PostMapping("/signup/user")
    public ResponseEntity<?> signup(@RequestBody SignupRequest request) throws MessagingException {
        if(userRepository.existsByEmail(request.getEmail())) {
            return ResponseEntity.badRequest().body("Email already exists");
        }

        User user = new User();
        user.setName(request.getName());
        user.setEmail(request.getEmail());
        user.setPassword(passwordConfig.passwordEncoder().encode(request.getPassword()));
        user.setRole(Role.USER);
        user.setStatus(Status.PENDING);
        userRepository.save(user);

        otpService.saveOtp(user);
        return ResponseEntity.ok("OTP has been sent to your email");
    }

    @PostMapping("/signup/user/resend-otp")
    public ResponseEntity<?> resendOtp(@RequestParam String email) throws MessagingException {
        otpService.resendOtp(email);
        return ResponseEntity.ok("OTP has been sent to your email");
    }

    @PostMapping("signup/user/verify-otp")
    public ResponseEntity<?> verifyOtp(
            @RequestBody VerifyOtpRequest request ,
            HttpServletResponse response) throws MessagingException
    {
        Boolean verified = otpService.verifyOtp(request);
        if(!verified) {
            return ResponseEntity.badRequest().body("OTP is not verified");
        }
        var user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new RuntimeException("User not found"));

        return generateAndSetCookie(user,response);

    }

    @PostMapping("/login/user")
    public ResponseEntity<?> login(
            @Valid @RequestBody UserLoginRequest request,
            HttpServletResponse response
    ){
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        request.getEmail(),
                        request.getPassword()
                )
        );
        User user = userRepository.findByEmail(request.getEmail()).orElseThrow();
        return generateAndSetCookie(user,response);
    }

    public ResponseEntity<?> generateAndSetCookie(User user , HttpServletResponse response){
        var accessToken =jwtService.generateAccessToken(user);
        var refreshToken =jwtService.generateRefreshToken(user);

        var cookie = new Cookie("Refresh", refreshToken.toString());
        cookie.setPath("/");
        cookie.setHttpOnly(true);
        cookie.setSecure(true);
        cookie.setMaxAge(jwtConfig.getRefreshTokenExpiration());
        response.addCookie(cookie);

        return ResponseEntity.ok(new JwtResponse(accessToken.toString()));
    }
}
