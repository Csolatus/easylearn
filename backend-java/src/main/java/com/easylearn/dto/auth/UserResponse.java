package com.easylearn.dto.auth;

import com.easylearn.entity.User;
import com.easylearn.entity.UserRole;
import com.fasterxml.jackson.annotation.JsonProperty;

import java.util.UUID;

/** Mappe 1:1 le UserResponse Pydantic du backend Python. */
public record UserResponse(
        UUID id,
        @JsonProperty("first_name") String firstName,
        @JsonProperty("last_name") String lastName,
        String email,
        UserRole role
) {
    public static UserResponse from(User user) {
        return new UserResponse(
                user.getId(),
                user.getFirstName(),
                user.getLastName(),
                user.getEmail(),
                user.getRole()
        );
    }
}
