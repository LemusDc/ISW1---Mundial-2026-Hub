package com.mundial2026.match.controller;

import com.mundial2026.match.dto.MatchDtos;
import com.mundial2026.match.repository.MatchRepository;
import com.mundial2026.match.service.MatchService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

import java.time.LocalDateTime;

@Slf4j
@RestController
@RequestMapping("/matches")
@RequiredArgsConstructor
public class MatchController {

    private final MatchService matchService;
    private final MatchRepository matchRepository;

    @GetMapping("/test")
    public Mono<String> test() {
        return matchRepository.count()
                .map(count -> "Total partidos en BD: " + count)
                .onErrorResume(e -> Mono.just("ERROR: " + e.getMessage()));
    }

    @GetMapping
    public Flux<MatchDtos.MatchResponse> getAllMatches() {
        return matchService.getAllMatches()
                .doOnNext(m -> log.debug("Match encontrado: {}", m.homeTeam()))
                .doOnComplete(() -> log.debug("Consulta matches completada"))
                .doOnError(e -> log.error("Error consultando matches: {}", e.getMessage()));
    }

    @GetMapping("/{id}")
    public Mono<MatchDtos.MatchResponse> getMatchById(@PathVariable Long id) {
        return matchService.getMatchById(id);
    }

    @GetMapping("/upcoming")
    public Flux<MatchDtos.MatchResponse> getUpcomingMatches(
            @RequestParam(defaultValue = "10") int limit) {
        return matchService.getUpcomingMatches(limit);
    }

    @GetMapping("/team/{team}")
    public Flux<MatchDtos.MatchResponse> getMatchesByTeam(@PathVariable String team) {
        return matchService.getMatchesByTeam(team);
    }

    @GetMapping("/city/{city}")
    public Flux<MatchDtos.MatchResponse> getMatchesByCity(@PathVariable String city) {
        return matchService.getMatchesByCity(city);
    }

    @GetMapping("/range")
    public Flux<MatchDtos.MatchResponse> getMatchesByDateRange(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime from,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime to) {
        return matchService.getMatchesByDateRange(from, to);
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAnyRole('OPERATOR', 'ADMIN')")
    public Mono<MatchDtos.MatchResponse> updateMatch(
            @PathVariable Long id,
            @RequestBody MatchDtos.UpdateMatchRequest request) {
        return matchService.updateMatch(id, request);
    }
}