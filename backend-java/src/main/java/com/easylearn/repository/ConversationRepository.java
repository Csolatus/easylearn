package com.easylearn.repository;

import com.easylearn.entity.Conversation;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.UUID;

public interface ConversationRepository extends JpaRepository<Conversation, UUID> {
    List<Conversation> findByStudentIdOrderByCreatedAtDesc(UUID studentId);
}
