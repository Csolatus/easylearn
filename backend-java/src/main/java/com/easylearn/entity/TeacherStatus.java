package com.easylearn.entity;

import jakarta.persistence.AttributeConverter;
import jakarta.persistence.Converter;

public enum TeacherStatus {
    INVITED("invited"),
    ACTIVE("active"),
    SUSPENDED("suspended"),
    REMOVED("removed");

    private final String value;

    TeacherStatus(String value) { this.value = value; }

    public String getValue() { return value; }

    public static TeacherStatus from(String value) {
        for (TeacherStatus s : values()) {
            if (s.value.equals(value)) return s;
        }
        throw new IllegalArgumentException("Unknown status: " + value);
    }

    @Converter(autoApply = true)
    public static class Persist implements AttributeConverter<TeacherStatus, String> {
        @Override
        public String convertToDatabaseColumn(TeacherStatus status) {
            return status == null ? null : status.value;
        }

        @Override
        public TeacherStatus convertToEntityAttribute(String dbValue) {
            return dbValue == null ? null : TeacherStatus.from(dbValue);
        }
    }
}
