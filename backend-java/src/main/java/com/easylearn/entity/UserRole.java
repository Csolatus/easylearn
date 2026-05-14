package com.easylearn.entity;

import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonValue;
import jakarta.persistence.AttributeConverter;
import jakarta.persistence.Converter;

public enum UserRole {
    STUDENT("student"),
    TEACHER("teacher"),
    SCHOOL_ADMIN("school_admin"),
    SUPER_ADMIN("super_admin");

    private final String value;

    UserRole(String value) { this.value = value; }

    @JsonValue
    public String getValue() { return value; }

    @JsonCreator
    public static UserRole from(String value) {
        for (UserRole r : values()) {
            if (r.value.equals(value)) return r;
        }
        throw new IllegalArgumentException("Unknown role: " + value);
    }

    @Converter(autoApply = true)
    public static class Persist implements AttributeConverter<UserRole, String> {
        @Override
        public String convertToDatabaseColumn(UserRole role) {
            return role == null ? null : role.value;
        }

        @Override
        public UserRole convertToEntityAttribute(String dbValue) {
            return dbValue == null ? null : UserRole.from(dbValue);
        }
    }
}
