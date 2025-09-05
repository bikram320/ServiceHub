package org.example.QuestX.services;

import lombok.AllArgsConstructor;
import org.example.QuestX.dtos.VerifyOtpRequest;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.util.Map;
import java.util.UUID;
import java.util.concurrent.TimeUnit;

@Service
@AllArgsConstructor
public class ResetPasswordService {

    private final RedisTemplate<String, String> redisTemplate;
    private final OtpService otpService;

    public Map<String , String > verifyOtpAndGenerateResetToken(VerifyOtpRequest request){
        Boolean verified = otpService.verifyOtp(request);
        if(!verified) {
            throw  new IllegalArgumentException("OTP verification failed");
        }

        String resetToken = UUID.randomUUID().toString();
        storeResetToken(request.getEmail(), resetToken);
        return Map.of("message", "OTP verified. Proceed to reset password.",
                "resetToken", resetToken);
    }

    public void storeResetToken(String email , String token) {
        redisTemplate.opsForValue().set(email, token , 5 , TimeUnit.MINUTES);
    }

    public Boolean verifyResetToken(String email , String token) {
        var ops = redisTemplate.opsForValue();
        String storedToken = ops.get(email);
        return storedToken != null && storedToken.equals(token);
    }

    public void removeResetToken(String email) {
        redisTemplate.delete(email);
    }
}
