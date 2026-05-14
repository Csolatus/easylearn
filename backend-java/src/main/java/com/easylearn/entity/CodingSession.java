package com.easylearn.entity;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "coding_sessions")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CodingSession {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(name = "student_id", nullable = false)
    private UUID studentId;

    @Column(name = "lesson_id", nullable = false)
    private UUID lessonId;

    // nullable — un étudiant peut avoir une session sans exercice assigné
    @Column(name = "exercise_id")
    private UUID exerciseId;

    @Column(name = "code_content", columnDefinition = "TEXT")
    private String codeContent;

    @UpdateTimestamp
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;
}
