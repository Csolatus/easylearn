package com.easylearn.repository;

import com.easylearn.entity.School;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.UUID;

public interface SchoolRepository extends JpaRepository<School, UUID> {
    List<School> findByIsActiveTrue();
}
