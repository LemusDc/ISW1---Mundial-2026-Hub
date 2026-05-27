package com.mundial2026.polla.model;

import lombok.*;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.Id;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.relational.core.mapping.Column;
import org.springframework.data.relational.core.mapping.Table;

import java.time.LocalDateTime;

@Data @Builder @NoArgsConstructor @AllArgsConstructor
@Table("pollas")
public class Polla {
    @Id private Long id;
    @Column("name") private String name;
    @Column("description") private String description;
    @Column("created_by_user_id") private Long createdByUserId;
    @Column("invite_code") private String inviteCode;
    @Column("status") @Builder.Default private PollaStatus status = PollaStatus.ACTIVE;
    @Column("points_winner") @Builder.Default private int pointsWinner = 3;
    @Column("points_exact_score") @Builder.Default private int pointsExactScore = 5;
    @CreatedDate @Column("created_at") private LocalDateTime createdAt;
    @LastModifiedDate @Column("updated_at") private LocalDateTime updatedAt;

    public enum PollaStatus { ACTIVE, FINISHED, CANCELLED }
}