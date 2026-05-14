package com.easylearn.repository;

import com.easylearn.entity.ClassroomCourse;
import com.easylearn.entity.ClassroomCourseId;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.UUID;

public interface ClassroomCourseRepository extends JpaRepository<ClassroomCourse, ClassroomCourseId> {
    List<ClassroomCourse> findByIdClassroomId(UUID classroomId);
    List<ClassroomCourse> findByIdCourseId(UUID courseId);
}
