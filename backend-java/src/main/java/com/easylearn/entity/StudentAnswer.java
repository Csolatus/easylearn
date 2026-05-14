package com.easylearn.entity;

import jakarta.persistence.*;
import lombok.*;

import java.util.UUID;

@Entity
@Table(name = "student_answers")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class StudentAnswer {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(name = "quiz_result_id", nullable = false)
    private UUID quizResultId;

    @Column(name = "question_id", nullable = false)
    private UUID questionId;

    @Column(name = "choice_id", nullable = false)
    private UUID choiceId;
}
