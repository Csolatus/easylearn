package com.easylearn.repository;

import com.easylearn.entity.QuizResult;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.UUID;

public interface QuizResultRepository extends JpaRepository<QuizResult, UUID> {
    List<QuizResult> findByStudentIdAndQuizId(UUID studentId, UUID quizId);
    List<QuizResult> findByStudentId(UUID studentId);
}
