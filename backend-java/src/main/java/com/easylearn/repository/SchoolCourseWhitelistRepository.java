package com.easylearn.repository;

import com.easylearn.entity.SchoolCourseWhitelist;
import com.easylearn.entity.SchoolCourseWhitelistId;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.UUID;

public interface SchoolCourseWhitelistRepository extends JpaRepository<SchoolCourseWhitelist, SchoolCourseWhitelistId> {
    List<SchoolCourseWhitelist> findByIdSchoolId(UUID schoolId);

    @Query(value = """
            SELECT c.* FROM courses c
            JOIN school_course_whitelists w ON w.course_id = c.id
            WHERE w.school_id = :schoolId
            """, nativeQuery = true)
    List<Object[]> findWhitelistedCoursesRaw(@Param("schoolId") UUID schoolId);
}
