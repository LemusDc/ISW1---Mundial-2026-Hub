package com.mundial2026.auth.dto;

import com.mundial2026.auth.model.User;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

import java.time.LocalDateTime;

public class AuthDtos {

    public record RegisterRequest(
            @NotBlank(message = "El email es obligatorio")
            @Email(message = "Email inválido")
            String email,

            @NotBlank(message = "El username es obligatorio")
            @Size(min = 3, max = 30, message = "Username entre 3 y 30 caracteres")
            String username,

            @NotBlank(message = "La contraseña es obligatoria")
            @Size(min = 8, message = "Mínimo 8 caracteres")
            String password,

            @NotBlank(message = "El nombre completo es obligatorio")
            String fullName
    ) {}

    public record LoginRequest(
            @NotBlank(message = "El email es obligatorio")
            @Email(message = "Email inválido")
            String email,

            @NotBlank(message = "La contraseña es obligatoria")
            String password
    ) {}

    public record RefreshTokenRequest(
            @NotBlank(message = "El refresh token es obligatorio")
            String refreshToken
    ) {}

    public record ChangePasswordRequest(
            @NotBlank(message = "La contraseña actual es obligatoria")
            String currentPassword,

            @NotBlank(message = "La nueva contraseña es obligatoria")
            @Size(min = 8, message = "Mínimo 8 caracteres")
            String newPassword
    ) {}

    public record AuthResponse(
            String accessToken,
            String refreshToken,
            String tokenType,
            long expiresIn,
            UserResponse user
    ) {
        public static AuthResponse of(String accessToken, String refreshToken,
                                      long expiresIn, UserResponse user) {
            return new AuthResponse(accessToken, refreshToken, "Bearer", expiresIn, user);
        }
    }

    public record UserResponse(
            Long id,
            String email,
            String username,
            String fullName,
            User.UserRole role,
            User.UserStatus status,
            boolean emailVerified,
            LocalDateTime lastLoginAt,
            LocalDateTime createdAt
    ) {
        public static UserResponse from(User user) {
            return new UserResponse(
                    user.getId(),
                    user.getEmail(),
                    user.getUsername(),
                    user.getFullName(),
                    user.getRole(),
                    user.getStatus(),
                    user.isEmailVerified(),
                    user.getLastLoginAt(),
                    user.getCreatedAt());
        }
    }

    public record MessageResponse(String message) {}
}