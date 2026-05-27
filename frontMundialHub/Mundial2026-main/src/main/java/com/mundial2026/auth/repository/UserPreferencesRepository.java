package com.mundial2026.auth.repository;

import com.mundial2026.auth.model.UserPreferences;
import org.springframework.data.r2dbc.repository.R2dbcRepository;
import org.springframework.stereotype.Repository;
import reactor.core.publisher.Mono;

@Repository
public interface UserPreferencesRepository extends R2dbcRepository<UserPreferences, Long> {
    Mono<UserPreferences> findByUserId(Long userId);
    Mono<Void> deleteByUserId(Long userId);
}