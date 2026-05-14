package com.easylearn.entity;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "ai_generations")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AiGeneration {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    // nullable — une génération peut ne pas être liée à une conversation
    @Column(name = "conversation_id")
    private UUID conversationId;

    @Column(name = "student_id", nullable = false)
    private UUID studentId;

    // nullable — contexte de cours optionnel
    @Column(name = "course_id")
    private UUID courseId;

    @Column(nullable = false, columnDefinition = "TEXT")
    private String prompt;

    @Column(columnDefinition = "TEXT")
    private String output;

    @Builder.Default
    private Boolean pending = true;

    @CreationTimestamp
    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;
}
