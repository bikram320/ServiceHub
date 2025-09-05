package org.example.QuestX.Controller.auth;


import jakarta.mail.MessagingException;
import jakarta.servlet.http.HttpServletResponse;
import lombok.AllArgsConstructor;
import org.example.QuestX.Model.Role;
import org.example.QuestX.Model.Status;
import org.example.QuestX.Model.Technician;
import org.example.QuestX.Repository.TechnicianRepository;
import org.example.QuestX.config.PasswordConfig;
import org.example.QuestX.dtos.*;
import org.example.QuestX.services.JwtService;
import org.example.QuestX.services.OtpService;
import org.example.QuestX.services.ResetPasswordService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.web.bind.annotation.*;


@AllArgsConstructor
@RestController
@RequestMapping("auth")
public class TechnicianAuthController {

    private final AuthenticationManager authenticationManager;
    private final TechnicianRepository technicianRepository;
    private final PasswordConfig passwordConfig;
    private final OtpService otpService;
    private final JwtService jwtService;
    private final ResetPasswordService resetPasswordService;

    @PostMapping("/signup/technician")
    public ResponseEntity<?> technicianSignup(@RequestBody SignupRequest request ) throws MessagingException {
        if(technicianRepository.existsByEmail(request.getEmail())) {
            return ResponseEntity.badRequest().body("Email already exists");
        }

        Technician technician = new Technician();
        technician.setName(request.getName());
        technician.setEmail(request.getEmail());
        technician.setPassword(passwordConfig.passwordEncoder().encode(request.getPassword()));
        technician.setRole(Role.TECHNICIAN);
        technician.setStatus(Status.PENDING);
        technicianRepository.save(technician);

        otpService.sendOtpEmail(request.getEmail());
        return ResponseEntity.ok("OTP successfully sent");
    }

    @PostMapping("/signup/technician/verify-otp")
    public ResponseEntity<?> verifyOtp(@RequestBody VerifyOtpRequest request,
                                       HttpServletResponse response)  {
        boolean verified = otpService.verifyOtp(request);
        if(!verified) {
            return ResponseEntity.badRequest().body("OTP verification failed");
        }
        Technician technician = technicianRepository.findByEmail(request.getEmail());
        technician.setIsEmailVerified(true);
        technicianRepository.save(technician);

        JwtResponse jwtResponse = jwtService.generateAndSetCookie(technician,response);
        return ResponseEntity.ok(jwtResponse);
    }

    @PostMapping("/signup/technician/resend-otp")
    public ResponseEntity<?> resendOtp(@RequestParam String email) throws MessagingException {
        otpService.resendOtp(email);
        return ResponseEntity.ok("OTP successfully sent");
    }

    @PostMapping("/login/technician")
    public ResponseEntity<?> login(@RequestBody LoginRequest request,
                                   HttpServletResponse response) {
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        request.getEmail(),
                        request.getPassword()
                )
        );
        Technician technician = technicianRepository.findByEmail(request.getEmail());
        if(technician == null) {
            return ResponseEntity.badRequest().body("Invalid email or password");
        }
        JwtResponse jwtResponse = jwtService.generateAndSetCookie(technician,response);
        return ResponseEntity.ok(jwtResponse);
    }

    @PostMapping("/login/technician/forget-password")
    public ResponseEntity<?> forgetPassword(
            @RequestParam String email
    ) throws MessagingException {

        var technician = technicianRepository.findByEmail(email);
        if(technician == null) {
            return ResponseEntity.badRequest().body("User doesn't exist");
        }
        otpService.sendOtpEmail(technician.getEmail());
        return ResponseEntity.ok("OTP has been sent to your email");
    }
    @PostMapping("/login/technician/forget-password/verify-otp")
    public ResponseEntity<?> verifyOtpForPasswordChange(@RequestBody VerifyOtpRequest request) {
        return ResponseEntity.ok(resetPasswordService.verifyOtpAndGenerateResetToken(request));

    }

    @PostMapping("/login/technician/forget-password/reset-password")
    public ResponseEntity<?> resetPassword(@RequestBody ResetPasswordRequest request) {
        boolean verified = resetPasswordService.verifyResetToken(request.getEmail(),request.getResetToken());
        if(!verified) {
            return ResponseEntity.badRequest().body("Reset token is not verified");
        }
        var technician = technicianRepository.findByEmail(request.getEmail());
        if (technician == null) {
            return ResponseEntity.badRequest().body("User doesn't exist");
        }
        technician.setPassword(passwordConfig.passwordEncoder().encode(request.getPassword()));
        technicianRepository.save(technician);

        resetPasswordService.removeResetToken(request.getEmail());

        return ResponseEntity.ok("Password has been Reset Successfully");
    }

}
