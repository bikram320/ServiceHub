package org.example.QuestX.services;

import jakarta.servlet.http.HttpServletResponse;
import lombok.AllArgsConstructor;
import org.example.QuestX.Model.*;
import org.example.QuestX.Repository.PendingSignupRepository;
import org.example.QuestX.Repository.TechnicianRepository;
import org.example.QuestX.Repository.UserRepository;
import org.example.QuestX.dtos.VerifyOtpRequest;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;

@AllArgsConstructor
@Service
public class SignupService {

    private final PendingSignupRepository pendingSignupRepository;
    private final UserRepository userRepository;
    private final TechnicianRepository technicianRepository;
    private final JwtService jwtService;
    private final MailService mailService;

    @Transactional
    public ResponseEntity<?> verifyOtpAndSave(VerifyOtpRequest request, Role role, HttpServletResponse response) {
        if (!mailService.verifyOtp(request)) {
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
            user.setStatus(Status.PENDING);
            user.setCreatedAt(LocalDateTime.now());
            userRepository.save(user);

            pendingSignupRepository.deleteByEmail(pending.getEmail()); // ✅ works because inside transaction
            return ResponseEntity.ok(jwtService.generateAccessTokenAndSetCookie(user, response));

        } else if (role == Role.TECHNICIAN) {
            Technician tech = new Technician();
            tech.setName(pending.getName());
            tech.setEmail(pending.getEmail());
            tech.setPassword(pending.getPassword());
            tech.setRole(Role.TECHNICIAN);
            tech.setIsEmailVerified(true);
            tech.setStatus(Status.PENDING);
            tech.setCreatedAt(LocalDateTime.now());
            technicianRepository.save(tech);

            pendingSignupRepository.deleteByEmail(pending.getEmail());
            return ResponseEntity.ok(jwtService.generateAccessTokenAndSetCookie(tech, response));
        }

        return ResponseEntity.badRequest().body("Invalid role");
    }
}
