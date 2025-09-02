package org.example.servicehub.services;

import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import lombok.AllArgsConstructor;
import org.example.servicehub.Model.EmailVerificationToken;
import org.example.servicehub.Model.User;
import org.example.servicehub.Repository.EmailVerificationTokenRepository;
import org.example.servicehub.Repository.UserRepository;
import org.example.servicehub.dtos.VerifyOtpRequest;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.Optional;
import java.util.Random;

@Service
@AllArgsConstructor
public class OtpService {

    private final UserRepository userRepository;
    EmailVerificationTokenRepository emailVerificationTokenRepository;
    private final JavaMailSender mailSender;

    public String generateOtp(){
        return String.format("%06d", new Random().nextInt(999999));
    }

    public void saveOtp(User user) throws MessagingException {
        String otp = generateOtp();

        // Save OTP
        EmailVerificationToken token = new EmailVerificationToken();
        token.setUser(user);
        token.setOtp(otp);
        token.setCreatedAt(LocalDateTime.now());
        token.setExpiryTime(LocalDateTime.now().plusMinutes(5));
        emailVerificationTokenRepository.save(token);

        sendOtpEmail(user.getEmail(), otp);
    }

    private void sendOtpEmail(String email, String otp) throws MessagingException {
        // Send email
        MimeMessage message = mailSender.createMimeMessage();
        MimeMessageHelper helper = new MimeMessageHelper(message, true);
        helper.setTo(email);  // use the extracted String email
        helper.setSubject("Your OTP Code");
        helper.setText("Your OTP is: " + otp);
        mailSender.send(message);
    }

    public void resendOtp(String email) throws MessagingException {

        var existingOtp = emailVerificationTokenRepository.findByUser_Email(email)
                .orElseThrow(() -> new RuntimeException("No OTP found for this email, please register first."));

        // 2. Generate a new OTP
        String newOtp = generateOtp();
        existingOtp.setOtp(newOtp);
        existingOtp.setExpiryTime(LocalDateTime.now().plusMinutes(5));
        existingOtp.setCreatedAt(LocalDateTime.now());

        emailVerificationTokenRepository.save(existingOtp);

        sendOtpEmail(email, newOtp);
    }

    public Boolean verifyOtp(VerifyOtpRequest request) throws MessagingException {
        Optional<EmailVerificationToken> otpToken = emailVerificationTokenRepository.findByUser_EmailAndOtp(request.getEmail(),request.getOtp());

        if(otpToken.isEmpty()) return false;

        if (otpToken.get().getExpiryTime().isBefore(LocalDateTime.now())) {
            return false;
        }

        EmailVerificationToken token = otpToken.get();
        token.setIsVerified(true);
        emailVerificationTokenRepository.save(token);

        User user = userRepository.findByEmail(request.getEmail()).
                orElseThrow(() -> new RuntimeException("User not found"));
        user.setIsEmailVerified(true);
        userRepository.save(user);

        return true;
    }

}
