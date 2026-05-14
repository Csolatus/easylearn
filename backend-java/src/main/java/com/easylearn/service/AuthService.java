package com.easylearn.service;

import com.easylearn.dto.auth.LoginRequest;
import com.easylearn.dto.auth.RegisterRequest;
import com.easylearn.dto.auth.TokenResponse;
import com.easylearn.dto.auth.UserResponse;
import com.easylearn.entity.User;
import com.easylearn.exception.EmailAlreadyExistsException;
import com.easylearn.repository.UserRepository;
import com.easylearn.security.JwtService;
import com.easylearn.security.TokenBlacklistService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final TokenBlacklistService blacklistService;

    @Transactional
    public UserResponse register(RegisterRequest request) {
        if (userRepository.existsByEmail(request.email())) {
            throw new EmailAlreadyExistsException(request.email());
        }

        User user = User.builder()
                .firstName(request.firstName())
                .lastName(request.lastName())
                .email(request.email())
                .password(passwordEncoder.encode(request.password()))
                .role(request.role())
                .build();

        return UserResponse.from(userRepository.save(user));
    }

    @Transactional(readOnly = true)
    public TokenResponse login(LoginRequest request) {
        User user = userRepository.findByEmail(request.email())
                .orElseThrow(() -> new BadCredentialsException("Email ou mot de passe incorrect"));

        if (!passwordEncoder.matches(request.password(), user.getPassword())) {
            throw new BadCredentialsException("Email ou mot de passe incorrect");
        }

        return TokenResponse.of(jwtService.generateToken(user));
    }

    /**
     * Révoque le token dans Redis avec un TTL = durée restante du JWT.
     * Le token expire donc naturellement — aucune entrée orpheline dans Redis.
     */
    public void logout(String token) {
        blacklistService.revoke(token, jwtService.getRemainingTtl(token));
    }
}
