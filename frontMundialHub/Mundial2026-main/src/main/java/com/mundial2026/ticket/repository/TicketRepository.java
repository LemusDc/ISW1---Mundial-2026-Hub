package com.mundial2026.ticket.repository;

import com.mundial2026.ticket.model.Ticket;
import org.springframework.data.r2dbc.repository.Modifying;
import org.springframework.data.r2dbc.repository.Query;
import org.springframework.data.r2dbc.repository.R2dbcRepository;
import org.springframework.stereotype.Repository;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

import java.time.LocalDateTime;

@Repository
public interface TicketRepository extends R2dbcRepository<Ticket, Long> {

    Flux<Ticket> findByUserId(Long userId);

    Flux<Ticket> findByUserIdAndStatus(Long userId, Ticket.TicketStatus status);

    @Query("SELECT COUNT(*) FROM tickets WHERE user_id = :userId AND status = 'PAID' AND DATE(created_at) = CURDATE()")
    Mono<Integer> countPurchasesTodayByUser(Long userId);

    @Modifying
    @Query("UPDATE tickets SET status = 'EXPIRED' WHERE status = 'RESERVED' AND reservation_expires_at < :now")
    Mono<Integer> expireOldReservations(LocalDateTime now);

    Mono<Ticket> findByCorrelationId(String correlationId);
}