package org.example.QuestX.Controller.auth;


import jakarta.mail.MessagingException;
import jakarta.servlet.http.HttpServletResponse;
import lombok.AllArgsConstructor;
import org.example.QuestX.Model.Role;
import org.example.QuestX.Model.Status;
import org.example.QuestX.Model.Technician;
import org.example.QuestX.Repository.TechnicianRepository;
import org.example.QuestX.config.PasswordConfig;
import org.example.QuestX.dtos.JwtResponse;
import org.example.QuestX.dtos.LoginRequest;
import org.example.QuestX.dtos.SignupRequest;
import org.example.QuestX.dtos.VerifyOtpRequest;
import org.example.QuestX.services.JwtService;
import org.example.QuestX.services.OtpService;
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

        otpService.saveOtp(request.getEmail());
        return ResponseEntity.ok("OTP successfully sent");
    }

    @PostMapping("/signup/technician/verify-otp")
    public ResponseEntity<?> verifyOtp(@RequestBody VerifyOtpRequest request,
                                       HttpServletResponse response) throws MessagingException {
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

}
