package com.mundial2026.polla.repository;

import com.mundial2026.polla.model.Pronostico;
import org.springframework.data.r2dbc.repository.Modifying;
import org.springframework.data.r2dbc.repository.Query;
import org.springframework.data.r2dbc.repository.R2dbcRepository;
import org.springframework.stereotype.Repository;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

@Repository
public interface PronosticoRepository extends R2dbcRepository<Pronostico, Long> {

    Mono<Pronostico> findByPollaIdAndUserIdAndMatchId(Long pollaId, Long userId, Long matchId);

    Flux<Pronostico> findByPollaIdAndUserIdOrderByCreatedAtDesc(Long pollaId, Long userId);

    @Modifying
    @Query("UPDATE pronosticos SET is_locked = true WHERE match_id = :matchId AND is_locked = false")
    Mono<Integer> lockAllForMatch(Long matchId);

    @Query("SELECT * FROM pronosticos WHERE match_id = :matchId AND calculated = false AND is_locked = true")
    Flux<Pronostico> findPendingCalculation(Long matchId);
}