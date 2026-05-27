package com.mundial2026.album.model;

import lombok.*;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.Id;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.relational.core.mapping.Column;
import org.springframework.data.relational.core.mapping.Table;

import java.time.LocalDateTime;

@Data @Builder @NoArgsConstructor @AllArgsConstructor
@Table("sticker_trades")
public class StickerTrade {
    @Id private Long id;
    @Column("from_user_id") private Long fromUserId;
    @Column("to_user_id") private Long toUserId;
    @Column("offered_sticker_id") private Long offeredStickerId;
    @Column("requested_sticker_id") private Long requestedStickerId;
    @Column("status") @Builder.Default private TradeStatus status = TradeStatus.PENDING;
    @Column("correlation_id") private String correlationId;
    @CreatedDate @Column("created_at") private LocalDateTime createdAt;
    @LastModifiedDate @Column("updated_at") private LocalDateTime updatedAt;

    public enum TradeStatus { PENDING, ACCEPTED, REJECTED, CANCELLED, EXPIRED }
}