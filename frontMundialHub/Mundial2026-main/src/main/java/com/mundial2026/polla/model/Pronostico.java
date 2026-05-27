package com.mundial2026.polla.model;

import lombok.*;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.Id;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.relational.core.mapping.Column;
import org.springframework.data.relational.core.mapping.Table;

import java.time.LocalDateTime;

@Data @Builder @NoArgsConstructor @AllArgsConstructor
@Table("pronosticos")
public class Pronostico {
    @Id private Long id;
    @Column("polla_id") private Long pollaId;
    @Column("user_id") private Long userId;
    @Column("match_id") private Long matchId;
    @Column("predicted_home_score") private int predictedHomeScore;
    @Column("predicted_away_score") private int predictedAwayScore;
    @Column("is_locked") @Builder.Default private boolean locked = false;
    @Column("points_earned") @Builder.Default private Integer pointsEarned = 0;
    @Column("calculated") @Builder.Default private boolean calculated = false;
    @CreatedDate @Column("created_at") private LocalDateTime createdAt;
    @LastModifiedDate @Column("updated_at") private LocalDateTime updatedAt;
}