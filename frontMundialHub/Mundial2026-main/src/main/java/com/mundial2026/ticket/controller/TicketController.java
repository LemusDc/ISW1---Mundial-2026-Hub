package com.mundial2026.ticket.controller;

import com.mundial2026.auth.security.JwtService;
import com.mundial2026.ticket.dto.TicketDtos;
import com.mundial2026.ticket.service.TicketService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

@RestController
@RequestMapping("/tickets")
@RequiredArgsConstructor
public class TicketController {

    private final TicketService ticketService;
    private final JwtService jwtService;

    @PostMapping("/reserve")
    @ResponseStatus(HttpStatus.CREATED)
    public Mono<TicketDtos.TicketResponse> reserve(
            @RequestHeader("Authorization") String authHeader,
            @Valid @RequestBody TicketDtos.ReserveTicketRequest request) {
        Long userId = jwtService.extractUserId(authHeader.substring(7));
        return ticketService.reserveTicket(userId, request);
    }

    @PostMapping("/confirm-payment")
    public Mono<TicketDtos.TicketResponse> confirmPayment(
            @RequestHeader("Authorization") String authHeader,
            @Valid @RequestBody TicketDtos.ConfirmPaymentRequest request) {
        Long userId = jwtService.extractUserId(authHeader.substring(7));
        return ticketService.confirmPayment(userId, request);
    }

    @PostMapping("/transfer")
    public Mono<TicketDtos.TicketResponse> transfer(
            @RequestHeader("Authorization") String authHeader,
            @Valid @RequestBody TicketDtos.TransferTicketRequest request) {
        Long userId = jwtService.extractUserId(authHeader.substring(7));
        return ticketService.transferTicket(userId, request);
    }

    @PostMapping("/refund")
    public Mono<TicketDtos.TicketResponse> refund(
            @RequestHeader("Authorization") String authHeader,
            @Valid @RequestBody TicketDtos.RefundRequest request) {
        Long userId = jwtService.extractUserId(authHeader.substring(7));
        return ticketService.requestRefund(userId, request);
    }

    @GetMapping("/my")
    public Flux<TicketDtos.TicketResponse> getMyTickets(
            @RequestHeader("Authorization") String authHeader) {
        Long userId = jwtService.extractUserId(authHeader.substring(7));
        return ticketService.getUserTickets(userId);
    }
}