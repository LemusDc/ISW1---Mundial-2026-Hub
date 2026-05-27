package com.mundial2026.auth.model;

import lombok.*;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.Id;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.relational.core.mapping.Column;
import org.springframework.data.relational.core.mapping.Table;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Table("users")
public class User {

    @Id
    private Long id;

    @Column("email")
    private String email;

    @Column("username")
    private String username;

    @Column("password_hash")
    private String passwordHash;

    @Column("full_name")
    private String fullName;

    @Column("role")
    @Builder.Default
    private UserRole role = UserRole.AFICIONADO;

    @Column("status")
    @Builder.Default
    private UserStatus status = UserStatus.PENDING_VERIFICATION;

    @Column("email_verified")
    @Builder.Default
    private boolean emailVerified = false;

    @Column("failed_login_attempts")
    @Builder.Default
    private int failedLoginAttempts = 0;

    @Column("locked_until")
    private LocalDateTime lockedUntil;

    @Column("last_login_at")
    private LocalDateTime lastLoginAt;

    @CreatedDate
    @Column("created_at")
    private LocalDateTime createdAt;

    @LastModifiedDate
    @Column("updated_at")
    private LocalDateTime updatedAt;

    public enum UserRole {
        AFICIONADO, OPERATOR, ADMIN, COMPLIANCE, SUPPORT
    }

    public enum UserStatus {
        ACTIVE, PENDING_VERIFICATION, SUSPENDED, BLOCKED
    }

    public boolean isAccountLocked() {
        return lockedUntil != null && lockedUntil.isAfter(LocalDateTime.now());
    }
}