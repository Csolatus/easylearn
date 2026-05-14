package com.easylearn.security;

import com.easylearn.entity.User;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.JwtException;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import javax.crypto.SecretKey;
import java.nio.charset.StandardCharsets;
import java.time.Duration;
import java.util.Date;
import java.util.UUID;

@Service
public class JwtService {

    private final SecretKey key;
    private final long expirationMs;

    public JwtService(
            @Value("${jwt.secret}") String secret,
            @Value("${jwt.expiration-minutes:60}") long expirationMinutes) {
        this.key = Keys.hmacShaKeyFor(secret.getBytes(StandardCharsets.UTF_8));
        this.expirationMs = expirationMinutes * 60 * 1000;
    }

    /** Génère un JWT signé contenant l'UUID et le rôle de l'utilisateur. */
    public String generateToken(User user) {
        Date now = new Date();
        Date exp = new Date(now.getTime() + expirationMs);
        return Jwts.builder()
                .subject(user.getId().toString())
                .claim("role", user.getRole().getValue())
                .issuedAt(now)
                .expiration(exp)
                .signWith(key)
                .compact();
    }

    public UUID extractUserId(String token) {
        return UUID.fromString(parseClaims(token).getSubject());
    }

    public String extractRole(String token) {
        return parseClaims(token).get("role", String.class);
    }

    /**
     * Durée restante avant expiration — utilisée pour le TTL Redis à la déconnexion.
     * Retourne Duration.ZERO si le token est déjà expiré.
     */
    public Duration getRemainingTtl(String token) {
        try {
            Date exp = parseClaims(token).getExpiration();
            long remaining = exp.getTime() - System.currentTimeMillis();
            return remaining > 0 ? Duration.ofMillis(remaining) : Duration.ZERO;
        } catch (JwtException e) {
            return Duration.ZERO;
        }
    }

    public boolean isTokenValid(String token) {
        try {
            parseClaims(token);
            return true;
        } catch (JwtException | IllegalArgumentException e) {
            return false;
        }
    }

    private Claims parseClaims(String token) {
        return Jwts.parser()
                .verifyWith(key)
                .build()
                .parseSignedClaims(token)
                .getPayload();
    }
}
