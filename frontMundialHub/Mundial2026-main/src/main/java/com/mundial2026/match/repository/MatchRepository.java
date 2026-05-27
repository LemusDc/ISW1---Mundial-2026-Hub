package com.mundial2026.match.repository;

import com.mundial2026.match.model.Match;
import org.springframework.data.r2dbc.repository.Query;
import org.springframework.data.r2dbc.repository.R2dbcRepository;
import org.springframework.stereotype.Repository;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

import java.time.LocalDateTime;

@Repository
public interface MatchRepository extends R2dbcRepository<Match, Long> {

    Flux<Match> findAllByOrderByMatchDateAsc();

    Flux<Match> findByStatusOrderByMatchDateAsc(String status);

    @Query("SELECT * FROM matches WHERE match_date BETWEEN :from AND :to ORDER BY match_date ASC")
    Flux<Match> findByDateRange(LocalDateTime from, LocalDateTime to);

    @Query("SELECT * FROM matches WHERE (home_team = :team OR away_team = :team) ORDER BY match_date ASC")
    Flux<Match> findByTeam(String team);

    @Query("SELECT * FROM matches WHERE city = :city ORDER BY match_date ASC")
    Flux<Match> findByCity(String city);

    Mono<Match> findByExternalId(String externalId);

    @Query("SELECT * FROM matches WHERE match_date >= :now AND status = 'SCHEDULED' ORDER BY match_date ASC LIMIT :limit")
    Flux<Match> findUpcomingMatches(LocalDateTime now, int limit);
}