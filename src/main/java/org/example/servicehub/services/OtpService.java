package org.example.servicehub.services;

import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import lombok.AllArgsConstructor;
import org.example.servicehub.Model.User;
import org.example.servicehub.Repository.UserRepository;
import org.example.servicehub.dtos.VerifyOtpRequest;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.Optional;
import java.util.Random;
import java.util.concurrent.TimeUnit;

@Service
@AllArgsConstructor
public class OtpService {

    private final UserRepository userRepository;
    private final JavaMailSender mailSender;
    private final RedisTemplate<String, String> redisTemplate;

    public String generateOtp(){
        return String.format("%06d", new Random().nextInt(999999));
    }

    public void saveOtp(String email) throws MessagingException {
        String otp = generateOtp();
        //save otp in Redis
        redisTemplate.opsForValue().set(email, otp , 5 , TimeUnit.MINUTES);

        sendOtpEmail(email, otp);
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
        saveOtp(email);
    }

    public Boolean verifyOtp(VerifyOtpRequest request) throws MessagingException {
        String cachedOtp = redisTemplate.opsForValue().get(request.getEmail());
        if(cachedOtp != null && cachedOtp.equals(request.getOtp())){
            redisTemplate.delete(request.getEmail());
            return true;
        }
        return false;
    }

}
