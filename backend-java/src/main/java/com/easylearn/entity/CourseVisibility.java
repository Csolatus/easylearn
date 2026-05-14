package com.easylearn.entity;

import jakarta.persistence.AttributeConverter;
import jakarta.persistence.Converter;

public enum CourseVisibility {
    PUBLIC("public"),
    SCHOOL("school"),
    PRIVATE("private");

    private final String value;

    CourseVisibility(String value) { this.value = value; }

    public String getValue() { return value; }

    public static CourseVisibility from(String value) {
        for (CourseVisibility v : values()) {
            if (v.value.equals(value)) return v;
        }
        throw new IllegalArgumentException("Unknown visibility: " + value);
    }

    @Converter(autoApply = true)
    public static class Persist implements AttributeConverter<CourseVisibility, String> {
        @Override
        public String convertToDatabaseColumn(CourseVisibility visibility) {
            return visibility == null ? null : visibility.value;
        }

        @Override
        public CourseVisibility convertToEntityAttribute(String dbValue) {
            return dbValue == null ? null : CourseVisibility.from(dbValue);
        }
    }
}
