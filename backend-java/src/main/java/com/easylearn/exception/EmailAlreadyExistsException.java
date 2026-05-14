package com.easylearn.exception;

public class EmailAlreadyExistsException extends RuntimeException {
    public EmailAlreadyExistsException(String email) {
        super("Un compte existe déjà avec cet email : " + email);
    }
}
