package org.example.QuestX.services;

import lombok.AllArgsConstructor;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Service;

import java.util.concurrent.TimeUnit;

@AllArgsConstructor
@Service
public class TokenBlackListService {

    private final RedisTemplate<String, String> redisTemplate;

    public void blacklistToken(String token, long expirationMillis) {
        redisTemplate.opsForValue().set(token ,"BLACK LISTED " ,expirationMillis , TimeUnit.MINUTES);
    }
    public boolean isBlacklisted(String token) {
        return redisTemplate.hasKey(token).equals(Boolean.TRUE);
    }
}
