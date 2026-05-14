package com.easylearn.entity;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "classrooms")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Classroom {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(name = "school_id")
    private UUID schoolId;

    @Column(nullable = false)
    private String name;

    // Généré côté Java pour correspondre au DEFAULT encode(gen_random_bytes(16), 'hex') de PG
    @Column(name = "invite_code", nullable = false, unique = true, length = 32)
    private String inviteCode;

    @Column(name = "is_archived")
    @Builder.Default
    private Boolean isArchived = false;

    @CreationTimestamp
    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @PrePersist
    private void prePersist() {
        if (inviteCode == null) {
            inviteCode = UUID.randomUUID().toString().replace("-", "");
        }
    }
}
