package com.easylearn.repository;

import com.easylearn.entity.Lesson;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface LessonRepository extends JpaRepository<Lesson, UUID> {
    List<Lesson> findByCourseIdOrderByOrdre(UUID courseId);
    Optional<Lesson> findByIdAndCourseId(UUID id, UUID courseId);
    void deleteByCourseId(UUID courseId);
}
