package com.easylearn.security;

import lombok.RequiredArgsConstructor;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.stereotype.Service;

import java.time.Duration;

/**
 * Blacklist Redis — corrige la dette de sécurité du backend Python
 * où la blacklist était un Set en mémoire (perdu au restart).
 *
 * Clé : "blacklist:<token>"  |  Valeur : "1"  |  TTL : durée restante du JWT
 * → les tokens expirés sont automatiquement purgés par Redis.
 */
@Service
@RequiredArgsConstructor
public class RedisTokenBlacklistService implements TokenBlacklistService {

    private static final String PREFIX = "blacklist:";

    private final StringRedisTemplate redisTemplate;

    @Override
    public void revoke(String token, Duration ttl) {
        if (ttl.isPositive()) {
            redisTemplate.opsForValue().set(PREFIX + token, "1", ttl);
        }
    }

    @Override
    public boolean isRevoked(String token) {
        return Boolean.TRUE.equals(redisTemplate.hasKey(PREFIX + token));
    }
}
