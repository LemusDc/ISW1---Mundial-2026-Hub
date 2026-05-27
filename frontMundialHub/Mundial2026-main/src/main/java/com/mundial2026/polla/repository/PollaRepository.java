package com.mundial2026.polla.repository;

import com.mundial2026.polla.model.Polla;
import org.springframework.data.r2dbc.repository.R2dbcRepository;
import org.springframework.stereotype.Repository;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

@Repository
public interface PollaRepository extends R2dbcRepository<Polla, Long> {
    Mono<Polla> findByInviteCode(String inviteCode);
    Flux<Polla> findByCreatedByUserId(Long userId);
}