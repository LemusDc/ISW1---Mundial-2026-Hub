package com.mundial2026.polla.controller;

import com.mundial2026.auth.security.JwtService;
import com.mundial2026.polla.dto.PollaDtos;
import com.mundial2026.polla.service.PollaService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

@RestController
@RequestMapping("/pollas")
@RequiredArgsConstructor
public class PollaController {

    private final PollaService pollaService;
    private final JwtService jwtService;

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public Mono<PollaDtos.PollaResponse> create(
            @RequestHeader("Authorization") String authHeader,
            @Valid @RequestBody PollaDtos.CreatePollaRequest request) {
        Long userId = jwtService.extractUserId(authHeader.substring(7));
        return pollaService.createPolla(userId, request);
    }

    @PostMapping("/join/{inviteCode}")
    public Mono<PollaDtos.PollaResponse> join(
            @RequestHeader("Authorization") String authHeader,
            @PathVariable String inviteCode) {
        Long userId = jwtService.extractUserId(authHeader.substring(7));
        return pollaService.joinPolla(userId, inviteCode);
    }

    @PostMapping("/pronostico")
    public Mono<PollaDtos.PronosticoResponse> savePronostico(
            @RequestHeader("Authorization") String authHeader,
            @Valid @RequestBody PollaDtos.SavePronosticoRequest request) {
        Long userId = jwtService.extractUserId(authHeader.substring(7));
        return pollaService.savePronostico(userId, request);
    }

    @GetMapping("/{pollaId}/ranking")
    public Flux<PollaDtos.RankingEntry> getRanking(@PathVariable Long pollaId) {
        return pollaService.getRanking(pollaId);
    }

    @PostMapping("/{matchId}/calculate-scores")
    public Mono<Void> calculateScores(@PathVariable Long matchId) {
        return pollaService.calculateScores(matchId);
    }
}