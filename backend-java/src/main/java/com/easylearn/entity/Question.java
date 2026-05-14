package com.easylearn.entity;

import jakarta.persistence.*;
import lombok.*;

import java.util.UUID;

@Entity
@Table(name = "questions")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Question {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(name = "quiz_id", nullable = false)
    private UUID quizId;

    @Column(nullable = false, columnDefinition = "TEXT")
    private String statement;

    @Column(nullable = false)
    private Integer ordre;
}
