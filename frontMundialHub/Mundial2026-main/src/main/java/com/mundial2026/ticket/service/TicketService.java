package com.mundial2026.ticket.service;

import com.mundial2026.auth.repository.UserRepository;
import com.mundial2026.match.repository.MatchRepository;
import com.mundial2026.shared.config.AppProperties;
import com.mundial2026.shared.exception.BusinessException;
import com.mundial2026.shared.exception.ResourceNotFoundException;
import com.mundial2026.ticket.dto.TicketDtos;
import com.mundial2026.ticket.model.Ticket;
import com.mundial2026.ticket.repository.TicketRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Slf4j
@Service
@RequiredArgsConstructor
public class TicketService {

    private final TicketRepository ticketRepository;
    private final MatchRepository matchRepository;
    private final UserRepository userRepository;
    private final AppProperties appProperties;

    @Transactional
    public Mono<TicketDtos.TicketResponse> reserveTicket(Long userId,
                                                          TicketDtos.ReserveTicketRequest request) {
        return ticketRepository.countPurchasesTodayByUser(userId)
                .flatMap(count -> {
                    if (count >= appProperties.getTicket().getMaxPerUserPerDay()) {
                        return Mono.error(new BusinessException(
                                "Límite de " + appProperties.getTicket().getMaxPerUserPerDay()
                                        + " entradas por día alcanzado"));
                    }
                    return matchRepository.findById(request.matchId());
                })
                .switchIfEmpty(Mono.error(new ResourceNotFoundException("Match", request.matchId())))
                .flatMap(match -> {
                    if (match.getAvailableTickets() <= 0) {
                        return Mono.error(new BusinessException("No hay entradas disponibles"));
                    }
                    Ticket ticket = Ticket.builder()
                            .userId(userId)
                            .matchId(request.matchId())
                            .status(Ticket.TicketStatus.RESERVED)
                            .section(request.section())
                            .price(BigDecimal.valueOf(150.00))
                            .reservationExpiresAt(LocalDateTime.now()
                                    .plusMinutes(appProperties.getTicket().getTtlMinutes()))
                            .build();
                    match.setAvailableTickets(match.getAvailableTickets() - 1);
                    return matchRepository.save(match).then(ticketRepository.save(ticket));
                })
                .map(TicketDtos.TicketResponse::from)
                .doOnSuccess(t -> log.info("Entrada reservada - correlationId: {}",
                        t.correlationId()));
    }

    @Transactional
    public Mono<TicketDtos.TicketResponse> confirmPayment(Long userId,
                                                           TicketDtos.ConfirmPaymentRequest request) {
        return ticketRepository.findById(request.ticketId())
                .switchIfEmpty(Mono.error(new ResourceNotFoundException("Ticket", request.ticketId())))
                .flatMap(ticket -> {
                    if (!ticket.getUserId().equals(userId)) {
                        return Mono.error(new BusinessException("No tienes permisos sobre esta entrada"));
                    }
                    if (ticket.getStatus() != Ticket.TicketStatus.RESERVED) {
                        return Mono.error(new BusinessException("La entrada no está RESERVADA"));
                    }
                    if (ticket.isReservationExpired()) {
                        ticket.setStatus(Ticket.TicketStatus.EXPIRED);
                        return ticketRepository.save(ticket)
                                .then(Mono.error(new BusinessException("La reserva ha expirado")));
                    }
                    ticket.setStatus(Ticket.TicketStatus.PAID);
                    ticket.setPaymentTransactionId(request.paymentTransactionId());
                    return ticketRepository.save(ticket);
                })
                .map(TicketDtos.TicketResponse::from);
    }

    @Transactional
    public Mono<TicketDtos.TicketResponse> transferTicket(Long fromUserId,
                                                           TicketDtos.TransferTicketRequest request) {
        return ticketRepository.findById(request.ticketId())
                .switchIfEmpty(Mono.error(new ResourceNotFoundException("Ticket", request.ticketId())))
                .flatMap(ticket -> {
                    if (!ticket.getUserId().equals(fromUserId)) {
                        return Mono.error(new BusinessException("No tienes permisos sobre esta entrada"));
                    }
                    if (ticket.getStatus() != Ticket.TicketStatus.PAID) {
                        return Mono.error(new BusinessException("Solo puedes transferir entradas PAGADAS"));
                    }
                    return userRepository.findByEmail(request.recipientEmail())
                            .switchIfEmpty(Mono.error(
                                    new BusinessException("Usuario destinatario no encontrado")))
                            .flatMap(recipient -> {
                                ticket.setStatus(Ticket.TicketStatus.TRANSFERRED);
                                ticket.setTransferredToUserId(recipient.getId());
                                ticket.setTransferredAt(LocalDateTime.now());
                                return ticketRepository.save(ticket);
                            });
                })
                .map(TicketDtos.TicketResponse::from);
    }

    @Transactional
    public Mono<TicketDtos.TicketResponse> requestRefund(Long userId,
                                                          TicketDtos.RefundRequest request) {
        return ticketRepository.findById(request.ticketId())
                .switchIfEmpty(Mono.error(new ResourceNotFoundException("Ticket", request.ticketId())))
                .flatMap(ticket -> {
                    if (!ticket.getUserId().equals(userId)) {
                        return Mono.error(new BusinessException("No tienes permisos sobre esta entrada"));
                    }
                    if (ticket.getStatus() != Ticket.TicketStatus.PAID) {
                        return Mono.error(new BusinessException("Solo puedes reembolsar entradas PAGADAS"));
                    }
                    ticket.setStatus(Ticket.TicketStatus.REFUNDED);
                    ticket.setRefundReason(request.reason());
                    return ticketRepository.save(ticket);
                })
                .map(TicketDtos.TicketResponse::from);
    }

    public Flux<TicketDtos.TicketResponse> getUserTickets(Long userId) {
        return ticketRepository.findByUserId(userId)
                .map(TicketDtos.TicketResponse::from);
    }

    @Scheduled(fixedDelay = 60000)
    public void expireReservations() {
        ticketRepository.expireOldReservations(LocalDateTime.now())
                .subscribe(count -> {
                    if (count > 0) log.info("Reservas expiradas: {}", count);
                });
    }
}