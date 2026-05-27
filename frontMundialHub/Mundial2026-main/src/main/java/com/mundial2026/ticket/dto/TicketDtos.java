package com.mundial2026.ticket.dto;

import com.mundial2026.ticket.model.Ticket;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

import java.math.BigDecimal;
import java.time.LocalDateTime;

public class TicketDtos {

    public record ReserveTicketRequest(
            @NotNull(message = "El matchId es obligatorio") Long matchId,
            @NotBlank(message = "La sección es obligatoria") String section
    ) {}

    public record ConfirmPaymentRequest(
            @NotNull(message = "El ticketId es obligatorio") Long ticketId,
            @NotBlank(message = "El ID de transacción es obligatorio") String paymentTransactionId
    ) {}

    public record TransferTicketRequest(
            @NotNull(message = "El ticketId es obligatorio") Long ticketId,
            @NotBlank(message = "El email del destinatario es obligatorio") String recipientEmail
    ) {}

    public record RefundRequest(
            @NotNull(message = "El ticketId es obligatorio") Long ticketId,
            @NotBlank(message = "La razón es obligatoria") String reason
    ) {}

    public record TicketResponse(
            Long id,
            String correlationId,
            Long matchId,
            Ticket.TicketStatus status,
            String section,
            String seatNumber,
            BigDecimal price,
            LocalDateTime reservationExpiresAt,
            String paymentTransactionId,
            LocalDateTime createdAt
    ) {
        public static TicketResponse from(Ticket ticket) {
            return new TicketResponse(
                    ticket.getId(), ticket.getCorrelationId(), ticket.getMatchId(),
                    ticket.getStatus(), ticket.getSection(), ticket.getSeatNumber(),
                    ticket.getPrice(), ticket.getReservationExpiresAt(),
                    ticket.getPaymentTransactionId(), ticket.getCreatedAt());
        }
    }
}