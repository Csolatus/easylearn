package com.easylearn.repository;

import com.easylearn.entity.CourseProgress;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface CourseProgressRepository extends JpaRepository<CourseProgress, UUID> {
    Optional<CourseProgress> findByStudentIdAndLessonId(UUID studentId, UUID lessonId);
    List<CourseProgress> findByStudentId(UUID studentId);

    @Query(value = """
            SELECT cp.* FROM course_progress cp
            JOIN lessons l ON l.id = cp.lesson_id
            WHERE cp.student_id = :studentId AND l.course_id = :courseId
            """, nativeQuery = true)
    List<CourseProgress> findByStudentIdAndCourseId(
            @Param("studentId") UUID studentId,
            @Param("courseId") UUID courseId);
}
