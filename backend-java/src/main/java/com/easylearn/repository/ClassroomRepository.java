package com.easylearn.repository;

import com.easylearn.entity.Classroom;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface ClassroomRepository extends JpaRepository<Classroom, UUID> {
    List<Classroom> findBySchoolId(UUID schoolId);
    List<Classroom> findBySchoolIdAndIsArchivedFalse(UUID schoolId);
    Optional<Classroom> findByInviteCode(String inviteCode);
}
