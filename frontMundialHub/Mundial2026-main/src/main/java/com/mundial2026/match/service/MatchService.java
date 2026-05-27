package com.mundial2026.match.service;

import com.mundial2026.match.dto.MatchDtos;
import com.mundial2026.match.repository.MatchRepository;
import com.mundial2026.shared.exception.ResourceNotFoundException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

import java.time.LocalDateTime;

@Slf4j
@Service
@RequiredArgsConstructor
public class MatchService {

    private final MatchRepository matchRepository;

    public Flux<MatchDtos.MatchResponse> getAllMatches() {
        return matchRepository.findAllByOrderByMatchDateAsc()
                .map(MatchDtos.MatchResponse::from);
    }

    public Mono<MatchDtos.MatchResponse> getMatchById(Long id) {
        return matchRepository.findById(id)
                .switchIfEmpty(Mono.error(new ResourceNotFoundException("Match", id)))
                .map(MatchDtos.MatchResponse::from);
    }

    public Flux<MatchDtos.MatchResponse> getUpcomingMatches(int limit) {
        return matchRepository.findUpcomingMatches(LocalDateTime.now(), limit)
                .map(MatchDtos.MatchResponse::from);
    }

    public Flux<MatchDtos.MatchResponse> getMatchesByTeam(String team) {
        return matchRepository.findByTeam(team)
                .map(MatchDtos.MatchResponse::from);
    }

    public Flux<MatchDtos.MatchResponse> getMatchesByCity(String city) {
        return matchRepository.findByCity(city)
                .map(MatchDtos.MatchResponse::from);
    }

    public Flux<MatchDtos.MatchResponse> getMatchesByDateRange(LocalDateTime from,
                                                                LocalDateTime to) {
        return matchRepository.findByDateRange(from, to)
                .map(MatchDtos.MatchResponse::from);
    }

    public Mono<MatchDtos.MatchResponse> updateMatch(Long id,
                                                      MatchDtos.UpdateMatchRequest request) {
        return matchRepository.findById(id)
                .switchIfEmpty(Mono.error(new ResourceNotFoundException("Match", id)))
                .flatMap(match -> {
                    if (request.matchDate() != null) match.setMatchDate(request.matchDate());
                    if (request.stadium() != null) match.setStadium(request.stadium());
                    if (request.city() != null) match.setCity(request.city());
                    if (request.status() != null) match.setStatus(request.status());
                    if (request.homeScore() != null) match.setHomeScore(request.homeScore());
                    if (request.awayScore() != null) match.setAwayScore(request.awayScore());
                    match.setDataConfirmed(true);
                    return matchRepository.save(match);
                })
                .map(MatchDtos.MatchResponse::from)
                .doOnSuccess(m -> log.info("Partido actualizado: {}", id));
    }
}