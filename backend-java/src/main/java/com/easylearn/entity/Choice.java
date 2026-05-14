package com.easylearn.entity;

import jakarta.persistence.*;
import lombok.*;

import java.util.UUID;

@Entity
@Table(name = "choices")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Choice {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(name = "question_id", nullable = false)
    private UUID questionId;

    @Column(nullable = false)
    private String text;

    @Column(name = "is_correct")
    @Builder.Default
    private Boolean isCorrect = false;
}
