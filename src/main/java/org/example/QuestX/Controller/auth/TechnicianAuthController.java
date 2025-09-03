package org.example.QuestX.Controller.auth;


import jakarta.mail.MessagingException;
import lombok.AllArgsConstructor;
import org.example.QuestX.Model.Role;
import org.example.QuestX.Model.Status;
import org.example.QuestX.Model.Technician;
import org.example.QuestX.Repository.TechnicianRepository;
import org.example.QuestX.config.PasswordConfig;
import org.example.QuestX.dtos.SignupRequest;
import org.example.QuestX.services.OtpService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;


@AllArgsConstructor
@RestController
@RequestMapping("auth")
public class TechnicianAuthController {

    private final TechnicianRepository technicianRepository;
    private final PasswordConfig passwordConfig;
    private final OtpService otpService;

    @PostMapping("/technician/signup")
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
}
