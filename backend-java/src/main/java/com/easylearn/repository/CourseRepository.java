package com.easylearn.repository;

import com.easylearn.entity.Course;
import com.easylearn.entity.CourseVisibility;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.UUID;

public interface CourseRepository extends JpaRepository<Course, UUID> {
    List<Course> findByCreatedBy(UUID createdBy);
    List<Course> findByVisibility(CourseVisibility visibility);

    // Cours visibles par une école : publics + whitelistés pour cette école
    @Query(value = """
            SELECT c.* FROM courses c
            WHERE c.visibility = 'public'
            OR c.id IN (
                SELECT course_id FROM school_course_whitelists WHERE school_id = :schoolId
            )
            """, nativeQuery = true)
    List<Course> findVisibleForSchool(@Param("schoolId") UUID schoolId);
}
