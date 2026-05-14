package com.easylearn.repository;

import com.easylearn.entity.PracticalExercise;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;
import java.util.UUID;

public interface PracticalExerciseRepository extends JpaRepository<PracticalExercise, UUID> {
    Optional<PracticalExercise> findByLessonId(UUID lessonId);
    boolean existsByLessonId(UUID lessonId);
    void deleteByLessonId(UUID lessonId);
}
