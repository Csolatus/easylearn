package com.easylearn.repository;

import com.easylearn.entity.CodingSession;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;
import java.util.UUID;

public interface CodingSessionRepository extends JpaRepository<CodingSession, UUID> {
    Optional<CodingSession> findByStudentIdAndLessonId(UUID studentId, UUID lessonId);
}
