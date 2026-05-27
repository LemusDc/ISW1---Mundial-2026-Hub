package com.mundial2026.polla.model;

import lombok.*;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.Id;
import org.springframework.data.relational.core.mapping.Column;
import org.springframework.data.relational.core.mapping.Table;

import java.time.LocalDateTime;

@Data @Builder @NoArgsConstructor @AllArgsConstructor
@Table("polla_members")
public class PollaMember {
    @Id private Long id;
    @Column("polla_id") private Long pollaId;
    @Column("user_id") private Long userId;
    @Column("total_points") @Builder.Default private int totalPoints = 0;
    @Column("rank") @Builder.Default private int rank = 0;
    @CreatedDate @Column("joined_at") private LocalDateTime joinedAt;
}