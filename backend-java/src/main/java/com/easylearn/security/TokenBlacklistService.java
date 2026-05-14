package com.easylearn.security;

import java.time.Duration;

/**
 * Interface de blacklist de tokens JWT.
 * Implémentation Redis en production — peut être mockée en test.
 */
public interface TokenBlacklistService {

    /** Révoque un token pour la durée ttl (doit correspondre à l'expiration restante du JWT). */
    void revoke(String token, Duration ttl);

    boolean isRevoked(String token);
}
