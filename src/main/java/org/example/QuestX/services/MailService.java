package org.example.QuestX.services;

import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import lombok.AllArgsConstructor;
import org.example.QuestX.Model.ServiceStatus;
import org.example.QuestX.dtos.VerifyOtpRequest;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.Random;
import java.util.concurrent.TimeUnit;

@Service
@AllArgsConstructor
public class MailService {

    private final JavaMailSender mailSender;
    private final RedisTemplate<String, String> redisTemplate;

    public String generateOtp(){
        return String.format("%06d", new Random().nextInt(999999));
    }
    public void sendOtpEmail(String email) throws MessagingException {

        //Generate Otp
        String otp = generateOtp();
        //save otp in Redis
        redisTemplate.opsForValue().set(email, otp , 5 , TimeUnit.MINUTES);
        //Send Otp via email to User
        MimeMessage message = mailSender.createMimeMessage();
        MimeMessageHelper helper = new MimeMessageHelper(message, true);
        helper.setTo(email);
        helper.setSubject("Your OTP Code");
        helper.setText("Your OTP is: " + otp);
        mailSender.send(message);
    }


    public void resendOtp(String email) throws MessagingException {
        sendOtpEmail(email);
    }

    public Boolean verifyOtp(VerifyOtpRequest request) {
        String cachedOtp = redisTemplate.opsForValue().get(request.getEmail());
        if(cachedOtp != null && cachedOtp.equals(request.getOtp())){
            redisTemplate.delete(request.getEmail());
            return true;
        }
        return false;
    }

    public void sendMailToTechnician(String userName , String technicianEmail ) throws MessagingException {
        MimeMessage message = mailSender.createMimeMessage();
        MimeMessageHelper helper = new MimeMessageHelper(message, true);
        helper.setTo(technicianEmail);
        helper.setSubject("Service Request : ");
        helper.setText("<h1>You got a Service Request :  From "+userName+"</h1> " +
                "Check your Profile for Further more details .\n Thank you , Have a nice day ." +
                        "\n Your regards \n QuestX"
                , true);
        mailSender.send(message);

    }

    public void  sendMailtoUser(
            String userEmail , String technicianName , String service,
            LocalDateTime appointmentTime, ServiceStatus serviceStatus
    ) throws MessagingException {
        MimeMessage message = mailSender.createMimeMessage();
        MimeMessageHelper helper = new MimeMessageHelper(message,true);
        helper.setTo(userEmail);
        helper.setSubject("Service Request Update : ");
        helper.setText("Your Service Request for "+service+" has Been "+serviceStatus+" By "
                +technicianName+" and Fixed for "+appointmentTime+
                " for Further more details , contact your technician , Thank you .!\n" +
                "\n Your regards \n QuestX");
        mailSender.send(message);
    }

}
