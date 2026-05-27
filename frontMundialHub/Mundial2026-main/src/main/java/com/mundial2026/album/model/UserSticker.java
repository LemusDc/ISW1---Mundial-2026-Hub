package com.mundial2026.album.model;

import lombok.*;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.Id;
import org.springframework.data.relational.core.mapping.Column;
import org.springframework.data.relational.core.mapping.Table;

import java.time.LocalDateTime;

@Data @Builder @NoArgsConstructor @AllArgsConstructor
@Table("user_stickers")
public class UserSticker {
    @Id private Long id;
    @Column("user_id") private Long userId;
    @Column("sticker_id") private Long stickerId;
    @Column("quantity") @Builder.Default private int quantity = 1;
    @Column("is_pasted") @Builder.Default private boolean pasted = false;
    @CreatedDate @Column("obtained_at") private LocalDateTime obtainedAt;
}