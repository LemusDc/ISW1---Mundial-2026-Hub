package com.mundial2026.polla.service;

import com.mundial2026.match.model.Match;
import com.mundial2026.match.repository.MatchRepository;
import com.mundial2026.polla.dto.PollaDtos;
import com.mundial2026.polla.model.*;
import com.mundial2026.polla.repository.*;
import com.mundial2026.shared.exception.BusinessException;
import com.mundial2026.shared.exception.ResourceNotFoundException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

import java.time.LocalDateTime;
import java.util.UUID;

@Slf4j
@Service
@RequiredArgsConstructor
public class PollaService {

    private static final int MINUTES_BEFORE_LOCK = 15;

    private final PollaRepository pollaRepository;
    private final PronosticoRepository pronosticoRepository;
    private final PollaMemberRepository pollaMemberRepository;
    private final MatchRepository matchRepository;

    @Transactional
    public Mono<PollaDtos.PollaResponse> createPolla(Long userId,
                                                      PollaDtos.CreatePollaRequest request) {
        Polla polla = Polla.builder()
                .name(request.name())
                .description(request.description())
                .createdByUserId(userId)
                .inviteCode(generateInviteCode())
                .build();

        return pollaRepository.save(polla)
                .flatMap(saved -> {
                    PollaMember member = PollaMember.builder()
                            .pollaId(saved.getId()).userId(userId).build();
                    return pollaMemberRepository.save(member).thenReturn(saved);
                })
                .map(PollaDtos.PollaResponse::from);
    }

    @Transactional
    public Mono<PollaDtos.PollaResponse> joinPolla(Long userId, String inviteCode) {
        return pollaRepository.findByInviteCode(inviteCode)
                .switchIfEmpty(Mono.error(
                        new ResourceNotFoundException("Polla no encontrada: " + inviteCode)))
                .flatMap(polla -> {
                    if (polla.getStatus() != Polla.PollaStatus.ACTIVE) {
                        return Mono.error(new BusinessException("Polla no está activa"));
                    }
                    return pollaMemberRepository.existsByPollaIdAndUserId(polla.getId(), userId)
                            .flatMap(exists -> {
                                if (exists) return Mono.error(
                                        new BusinessException("Ya eres miembro de esta polla"));
                                PollaMember member = PollaMember.builder()
                                        .pollaId(polla.getId()).userId(userId).build();
                                return pollaMemberRepository.save(member).thenReturn(polla);
                            });
                })
                .map(PollaDtos.PollaResponse::from);
    }

    @Transactional
    public Mono<PollaDtos.PronosticoResponse> savePronostico(Long userId,
                                                              PollaDtos.SavePronosticoRequest request) {
        return validateMembership(request.pollaId(), userId)
                .then(matchRepository.findById(request.matchId()))
                .switchIfEmpty(Mono.error(new ResourceNotFoundException("Match", request.matchId())))
                .flatMap(match -> {
                    LocalDateTime lockTime = match.getMatchDate().minusMinutes(MINUTES_BEFORE_LOCK);
                    if (LocalDateTime.now().isAfter(lockTime)) {
                        return Mono.error(new BusinessException(
                                "Pronósticos cerrados para este partido"));
                    }
                    return pronosticoRepository
                            .findByPollaIdAndUserIdAndMatchId(request.pollaId(), userId,
                                    request.matchId())
                            .flatMap(existing -> {
                                if (existing.isLocked()) return Mono.error(
                                        new BusinessException("El pronóstico está bloqueado"));
                                existing.setPredictedHomeScore(request.homeScore());
                                existing.setPredictedAwayScore(request.awayScore());
                                return pronosticoRepository.save(existing);
                            })
                            .switchIfEmpty(Mono.defer(() -> {
                                Pronostico nuevo = Pronostico.builder()
                                        .pollaId(request.pollaId()).userId(userId)
                                        .matchId(request.matchId())
                                        .predictedHomeScore(request.homeScore())
                                        .predictedAwayScore(request.awayScore())
                                        .build();
                                return pronosticoRepository.save(nuevo);
                            }));
                })
                .map(PollaDtos.PronosticoResponse::from);
    }

    @Transactional
    public Mono<Void> calculateScores(Long matchId) {
        return matchRepository.findById(matchId)
                .switchIfEmpty(Mono.error(new ResourceNotFoundException("Match", matchId)))
                .flatMap(match -> {
                   if (!"FINISHED".equals(match.getStatus())) {
                        return Mono.error(new BusinessException("El partido no ha terminado"));
                    }
                    int realHome = match.getHomeScore();
                    int realAway = match.getAwayScore();

                    return pronosticoRepository.findPendingCalculation(matchId)
                            .flatMap(p -> {
                                int points = calculatePoints(p, realHome, realAway);
                                p.setPointsEarned(points);
                                p.setCalculated(true);
                                return pronosticoRepository.save(p)
                                        .then(pollaMemberRepository.addPoints(
                                                p.getPollaId(), p.getUserId(), points));
                            })
                            .then();
                });
    }

    public Flux<PollaDtos.RankingEntry> getRanking(Long pollaId) {
        return pollaMemberRepository.findByPollaIdOrderByTotalPointsDesc(pollaId)
                .index()
                .map(tuple -> new PollaDtos.RankingEntry(
                        tuple.getT1().intValue() + 1,
                        tuple.getT2().getUserId(),
                        null,
                        tuple.getT2().getTotalPoints()));
    }

    private int calculatePoints(Pronostico p, int realHome, int realAway) {
        if (p.getPredictedHomeScore() == realHome && p.getPredictedAwayScore() == realAway) {
            return 5;
        }
        int predResult = Integer.compare(p.getPredictedHomeScore(), p.getPredictedAwayScore());
        int realResult = Integer.compare(realHome, realAway);
        return predResult == realResult ? 3 : 0;
    }

    private Mono<Void> validateMembership(Long pollaId, Long userId) {
        return pollaMemberRepository.existsByPollaIdAndUserId(pollaId, userId)
                .flatMap(exists -> exists ? Mono.empty() :
                        Mono.error(new BusinessException("No eres miembro de esta polla")));
    }

    private String generateInviteCode() {
        return UUID.randomUUID().toString().substring(0, 8).toUpperCase();
    }
}