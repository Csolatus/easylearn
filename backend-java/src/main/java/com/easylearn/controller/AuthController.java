package com.easylearn.controller;

import com.easylearn.dto.auth.LoginRequest;
import com.easylearn.dto.auth.RegisterRequest;
import com.easylearn.dto.auth.TokenResponse;
import com.easylearn.dto.auth.UserResponse;
import com.easylearn.security.UserPrincipal;
import com.easylearn.service.AuthService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;

    /** POST /auth/register — rate limit Bucket4j ajouté en Phase 4 (5 req/min). */
    @PostMapping("/register")
    @ResponseStatus(HttpStatus.CREATED)
    public UserResponse register(@Valid @RequestBody RegisterRequest request) {
        return authService.register(request);
    }

    /** POST /auth/login — rate limit Bucket4j ajouté en Phase 4 (10 req/min). */
    @PostMapping("/login")
    public TokenResponse login(@Valid @RequestBody LoginRequest request) {
        return authService.login(request);
    }

    /** GET /auth/me — retourne l'utilisateur courant depuis le SecurityContext. */
    @GetMapping("/me")
    public UserResponse me(@AuthenticationPrincipal UserPrincipal principal) {
        return UserResponse.from(principal.getUser());
    }

    /** POST /auth/logout — révoque le token JWT dans Redis. */
    @PostMapping("/logout")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void logout(@RequestHeader("Authorization") String authHeader) {
        authService.logout(authHeader.substring(7));
    }
}
