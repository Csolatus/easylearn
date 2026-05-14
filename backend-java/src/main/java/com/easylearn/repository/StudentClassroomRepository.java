package com.easylearn.repository;

import com.easylearn.entity.StudentClassroom;
import com.easylearn.entity.StudentClassroomId;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.UUID;

public interface StudentClassroomRepository extends JpaRepository<StudentClassroom, StudentClassroomId> {
    List<StudentClassroom> findByIdStudentId(UUID studentId);
    List<StudentClassroom> findByIdClassroomId(UUID classroomId);
}
