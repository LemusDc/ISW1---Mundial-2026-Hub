package com.mundial2026.auth.repository;

import com.mundial2026.auth.model.User;
import org.springframework.data.r2dbc.repository.Modifying;
import org.springframework.data.r2dbc.repository.Query;
import org.springframework.data.r2dbc.repository.R2dbcRepository;
import org.springframework.stereotype.Repository;
import reactor.core.publisher.Mono;

import java.time.LocalDateTime;

@Repository
public interface UserRepository extends R2dbcRepository<User, Long> {

    Mono<User> findByEmail(String email);

    Mono<User> findByUsername(String username);

    Mono<Boolean> existsByEmail(String email);

    Mono<Boolean> existsByUsername(String username);

    @Modifying
    @Query("UPDATE users SET failed_login_attempts = failed_login_attempts + 1 WHERE id = :userId")
    Mono<Void> incrementFailedLoginAttempts(Long userId);

    @Modifying
    @Query("UPDATE users SET failed_login_attempts = 0, locked_until = NULL WHERE id = :userId")
    Mono<Void> resetFailedLoginAttempts(Long userId);

    @Modifying
    @Query("UPDATE users SET locked_until = :lockedUntil WHERE id = :userId")
    Mono<Void> lockAccount(Long userId, LocalDateTime lockedUntil);

    @Modifying
    @Query("UPDATE users SET last_login_at = :lastLoginAt WHERE id = :userId")
    Mono<Void> updateLastLogin(Long userId, LocalDateTime lastLoginAt);

    @Modifying
    @Query("UPDATE users SET email_verified = true, status = 'ACTIVE' WHERE id = :userId")
    Mono<Void> verifyEmail(Long userId);
}