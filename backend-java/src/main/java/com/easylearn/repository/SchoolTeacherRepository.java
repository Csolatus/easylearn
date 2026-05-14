package com.easylearn.repository;

import com.easylearn.entity.SchoolTeacher;
import com.easylearn.entity.TeacherStatus;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface SchoolTeacherRepository extends JpaRepository<SchoolTeacher, UUID> {
    List<SchoolTeacher> findBySchoolId(UUID schoolId);
    List<SchoolTeacher> findByTeacherId(UUID teacherId);
    List<SchoolTeacher> findBySchoolIdAndStatus(UUID schoolId, TeacherStatus status);
    Optional<SchoolTeacher> findBySchoolIdAndTeacherId(UUID schoolId, UUID teacherId);
    boolean existsBySchoolIdAndTeacherIdAndStatus(UUID schoolId, UUID teacherId, TeacherStatus status);
}
