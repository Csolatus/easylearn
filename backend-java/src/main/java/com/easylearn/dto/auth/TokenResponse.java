package com.easylearn.dto.auth;

import com.fasterxml.jackson.annotation.JsonProperty;

/** Mappe 1:1 le TokenResponse Pydantic du backend Python. */
public record TokenResponse(
        @JsonProperty("access_token") String accessToken,
        @JsonProperty("token_type") String tokenType
) {
    public static TokenResponse of(String token) {
        return new TokenResponse(token, "bearer");
    }
}
