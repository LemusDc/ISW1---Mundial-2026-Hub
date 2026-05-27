package com.mundial2026.ticket.model;

import lombok.*;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.Id;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.relational.core.mapping.Column;
import org.springframework.data.relational.core.mapping.Table;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.UUID;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Table("tickets")
public class Ticket {

    @Id
    private Long id;

    @Column("correlation_id")
    @Builder.Default
    private String correlationId = UUID.randomUUID().toString();

    @Column("user_id")
    private Long userId;

    @Column("match_id")
    private Long matchId;

    @Column("status")
    @Builder.Default
    private TicketStatus status = TicketStatus.AVAILABLE;

    @Column("section")
    private String section;

    @Column("seat_number")
    private String seatNumber;

    @Column("price")
    private BigDecimal price;

    @Column("reservation_expires_at")
    private LocalDateTime reservationExpiresAt;

    @Column("payment_transaction_id")
    private String paymentTransactionId;

    @Column("transferred_to_user_id")
    private Long transferredToUserId;

    @Column("transferred_at")
    private LocalDateTime transferredAt;

    @Column("refund_reason")
    private String refundReason;

    @CreatedDate
    @Column("created_at")
    private LocalDateTime createdAt;

    @LastModifiedDate
    @Column("updated_at")
    private LocalDateTime updatedAt;

    public enum TicketStatus {
        AVAILABLE, RESERVED, PAID, TRANSFERRED, REFUNDED, EXPIRED
    }

    public boolean isReservationExpired() {
        return status == TicketStatus.RESERVED
                && reservationExpiresAt != null
                && LocalDateTime.now().isAfter(reservationExpiresAt);
    }
}