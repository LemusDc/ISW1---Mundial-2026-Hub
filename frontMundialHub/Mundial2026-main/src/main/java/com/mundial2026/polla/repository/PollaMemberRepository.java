package com.mundial2026.polla.repository;

import com.mundial2026.polla.model.PollaMember;
import org.springframework.data.r2dbc.repository.Modifying;
import org.springframework.data.r2dbc.repository.Query;
import org.springframework.data.r2dbc.repository.R2dbcRepository;
import org.springframework.stereotype.Repository;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

@Repository
public interface PollaMemberRepository extends R2dbcRepository<PollaMember, Long> {

    Flux<PollaMember> findByPollaIdOrderByTotalPointsDesc(Long pollaId);

    Mono<PollaMember> findByPollaIdAndUserId(Long pollaId, Long userId);

    Mono<Boolean> existsByPollaIdAndUserId(Long pollaId, Long userId);

    @Modifying
    @Query("UPDATE polla_members SET total_points = total_points + :points WHERE polla_id = :pollaId AND user_id = :userId")
    Mono<Void> addPoints(Long pollaId, Long userId, int points);
}