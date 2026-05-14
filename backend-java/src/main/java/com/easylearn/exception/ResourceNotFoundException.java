package com.easylearn.exception;

/** Exception générique 404 — réutilisée dans tous les modules Phase 3+. */
public class ResourceNotFoundException extends RuntimeException {
    public ResourceNotFoundException(String message) {
        super(message);
    }
}
