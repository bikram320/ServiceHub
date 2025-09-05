package org.example.QuestX.services.UserDetailsService;

import lombok.AllArgsConstructor;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Service;

import java.util.concurrent.TimeUnit;

@Service
@AllArgsConstructor
public class ResetTokenService {

    private final RedisTemplate<String, String> redisTemplate;

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
