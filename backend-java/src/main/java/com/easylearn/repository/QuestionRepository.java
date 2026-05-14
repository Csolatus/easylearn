package com.easylearn.repository;

import com.easylearn.entity.Question;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.UUID;

public interface QuestionRepository extends JpaRepository<Question, UUID> {
    List<Question> findByQuizIdOrderByOrdre(UUID quizId);
    void deleteByQuizId(UUID quizId);
}
