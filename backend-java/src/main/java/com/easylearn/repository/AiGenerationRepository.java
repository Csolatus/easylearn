package com.easylearn.repository;

import com.easylearn.entity.AiGeneration;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.UUID;

public interface AiGenerationRepository extends JpaRepository<AiGeneration, UUID> {
    List<AiGeneration> findByConversationIdAndOutputIsNotNullOrderByCreatedAtAsc(UUID conversationId);
    List<AiGeneration> findByConversationIdOrderByCreatedAtAsc(UUID conversationId);
}
