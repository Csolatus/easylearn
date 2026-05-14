package com.easylearn.repository;

import com.easylearn.entity.Choice;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.UUID;

public interface ChoiceRepository extends JpaRepository<Choice, UUID> {
    List<Choice> findByQuestionId(UUID questionId);
    List<Choice> findByQuestionIdAndIsCorrectTrue(UUID questionId);
    void deleteByQuestionId(UUID questionId);
}
