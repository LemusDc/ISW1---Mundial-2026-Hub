package com.mundial2026.auth.service;

import com.mundial2026.auth.dto.AuthDtos;
import com.mundial2026.auth.model.User;
import com.mundial2026.auth.model.UserPreferences;
import com.mundial2026.auth.repository.UserPreferencesRepository;
import com.mundial2026.auth.repository.UserRepository;
import com.mundial2026.auth.security.JwtService;
import com.mundial2026.shared.config.AppProperties;
import com.mundial2026.shared.exception.BusinessException;
import com.mundial2026.shared.exception.ResourceNotFoundException;
import com.mundial2026.shared.exception.UnauthorizedException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import reactor.core.publisher.Mono;

import java.time.LocalDateTime;
import java.util.List;

@Slf4j
@Service
@RequiredArgsConstructor
public class AuthService {

    private static final int MAX_FAILED_ATTEMPTS = 5;
    private static final int LOCK_DURATION_MINUTES = 30;

    private final UserRepository userRepository;
    private final UserPreferencesRepository preferencesRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final AppProperties appProperties;
    private final ReactiveUserDetailsServiceImpl userDetailsService;

    @Transactional
    public Mono<AuthDtos.AuthResponse> register(AuthDtos.RegisterRequest request) {
        return userRepository.existsByEmail(request.email())
                .flatMap(emailExists -> {
                    if (emailExists) return Mono.error(
                            new BusinessException("El email ya está registrado"));
                    return userRepository.existsByUsername(request.username());
                })
                .flatMap(usernameExists -> {
                    if (usernameExists) return Mono.error(
                            new BusinessException("El username ya está en uso"));

                    User newUser = User.builder()
                            .email(request.email())
                            .username(request.username())
                            .passwordHash(passwordEncoder.encode(request.password()))
                            .fullName(request.fullName())
                            .role(User.UserRole.AFICIONADO)
                            .status(User.UserStatus.ACTIVE)
                            .emailVerified(true)
                            .build();

                    return userRepository.save(newUser);
                })
                .flatMap(savedUser -> {
                    UserPreferences prefs = UserPreferences.builder()
                            .userId(savedUser.getId())
                            .build();
                    return preferencesRepository.save(prefs).thenReturn(savedUser);
                })
                .map(user -> buildAuthResponse(user))
                .doOnSuccess(r -> log.info("Usuario registrado: {}", request.email()));
    }

    @Transactional
    public Mono<AuthDtos.AuthResponse> login(AuthDtos.LoginRequest request) {
        return userRepository.findByEmail(request.email())
                .switchIfEmpty(Mono.error(new UnauthorizedException("Credenciales inválidas")))
                .flatMap(user -> {
                    if (user.isAccountLocked()) {
                        return Mono.error(new BusinessException(
                                "Cuenta bloqueada temporalmente. Intenta más tarde."));
                    }
                    if (!passwordEncoder.matches(request.password(), user.getPasswordHash())) {
                        return handleFailedLogin(user)
                                .then(Mono.error(new UnauthorizedException("Credenciales inválidas")));
                    }
                    if (user.getStatus() == User.UserStatus.SUSPENDED) {
                        return Mono.error(new BusinessException("Cuenta suspendida"));
                    }
                    return userRepository.resetFailedLoginAttempts(user.getId())
                            .then(userRepository.updateLastLogin(user.getId(), LocalDateTime.now()))
                            .thenReturn(user);
                })
                .map(user -> buildAuthResponse(user))
                .doOnSuccess(r -> log.info("Login exitoso: {}", request.email()));
    }

    public Mono<AuthDtos.AuthResponse> refreshToken(AuthDtos.RefreshTokenRequest request) {
        try {
            String username = jwtService.extractUsername(request.refreshToken());
            return userDetailsService.findByUsername(username)
                    .flatMap(userDetails -> {
                        if (!jwtService.isTokenValid(request.refreshToken(), userDetails)) {
                            return Mono.error(new UnauthorizedException("Refresh token inválido"));
                        }
                        return userRepository.findByEmail(username);
                    })
                    .map(user -> buildAuthResponse(user));
        } catch (Exception e) {
            return Mono.error(new UnauthorizedException("Refresh token inválido"));
        }
    }

    public Mono<AuthDtos.UserResponse> getProfile(Long userId) {
        return userRepository.findById(userId)
                .switchIfEmpty(Mono.error(new ResourceNotFoundException("User", userId)))
                .map(AuthDtos.UserResponse::from);
    }

    @Transactional
    public Mono<AuthDtos.MessageResponse> changePassword(Long userId,
                                                          AuthDtos.ChangePasswordRequest request) {
        return userRepository.findById(userId)
                .switchIfEmpty(Mono.error(new ResourceNotFoundException("User", userId)))
                .flatMap(user -> {
                    if (!passwordEncoder.matches(request.currentPassword(),
                            user.getPasswordHash())) {
                        return Mono.error(new BusinessException("Contraseña actual incorrecta"));
                    }
                    user.setPasswordHash(passwordEncoder.encode(request.newPassword()));
                    return userRepository.save(user);
                })
                .map(u -> new AuthDtos.MessageResponse("Contraseña actualizada exitosamente"));
    }

    private Mono<Void> handleFailedLogin(User user) {
        int newAttempts = user.getFailedLoginAttempts() + 1;
        if (newAttempts >= MAX_FAILED_ATTEMPTS) {
            LocalDateTime lockUntil = LocalDateTime.now().plusMinutes(LOCK_DURATION_MINUTES);
            log.warn("Cuenta bloqueada por intentos fallidos: {}", user.getEmail());
            return userRepository.lockAccount(user.getId(), lockUntil)
                    .then(userRepository.incrementFailedLoginAttempts(user.getId()));
        }
        return userRepository.incrementFailedLoginAttempts(user.getId());
    }

    private AuthDtos.AuthResponse buildAuthResponse(User user) {
        var userDetails = org.springframework.security.core.userdetails.User.builder()
                .username(user.getEmail())
                .password(user.getPasswordHash())
                .authorities(List.of(
                        new org.springframework.security.core.authority.SimpleGrantedAuthority(
                                "ROLE_" + user.getRole().name())))
                .build();

        String accessToken = jwtService.generateToken(userDetails, user.getId(),
                user.getRole().name());
        String refreshToken = jwtService.generateRefreshToken(userDetails);

        return AuthDtos.AuthResponse.of(
                accessToken,
                refreshToken,
                appProperties.getJwt().getExpirationMs() / 1000,
                AuthDtos.UserResponse.from(user));
    }
}