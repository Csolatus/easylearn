package com.easylearn.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "classroom_courses")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ClassroomCourse {

    @EmbeddedId
    private ClassroomCourseId id;

    @Column(name = "assigned_at", updatable = false)
    private LocalDateTime assignedAt;

    @PrePersist
    private void prePersist() {
        if (assignedAt == null) assignedAt = LocalDateTime.now();
    }
}
