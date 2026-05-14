package com.easylearn.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "student_classrooms")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class StudentClassroom {

    @EmbeddedId
    private StudentClassroomId id;

    @Column(name = "joined_at", updatable = false)
    private LocalDateTime joinedAt;

    @PrePersist
    private void prePersist() {
        if (joinedAt == null) joinedAt = LocalDateTime.now();
    }
}
