package com.mundial2026.auth.controller;

import com.mundial2026.auth.dto.AuthDtos;
import com.mundial2026.auth.security.JwtService;
import com.mundial2026.auth.service.AuthService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;
import reactor.core.publisher.Mono;

@RestController
@RequestMapping("/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;
    private final JwtService jwtService;

    @PostMapping("/register")
    @ResponseStatus(HttpStatus.CREATED)
    public Mono<AuthDtos.AuthResponse> register(
            @Valid @RequestBody AuthDtos.RegisterRequest request) {
        return authService.register(request);
    }

    @PostMapping("/login")
    public Mono<AuthDtos.AuthResponse> login(
            @Valid @RequestBody AuthDtos.LoginRequest request) {
        return authService.login(request);
    }

    @PostMapping("/refresh-token")
    public Mono<AuthDtos.AuthResponse> refreshToken(
            @Valid @RequestBody AuthDtos.RefreshTokenRequest request) {
        return authService.refreshToken(request);
    }

    @GetMapping("/me")
    public Mono<AuthDtos.UserResponse> getProfile(
            @AuthenticationPrincipal UserDetails principal,
            @RequestHeader("Authorization") String authHeader) {
        String token = authHeader.substring(7);
        Long userId = jwtService.extractUserId(token);
        return authService.getProfile(userId);
    }

    @PutMapping("/change-password")
    public Mono<AuthDtos.MessageResponse> changePassword(
            @AuthenticationPrincipal UserDetails principal,
            @RequestHeader("Authorization") String authHeader,
            @Valid @RequestBody AuthDtos.ChangePasswordRequest request) {
        String token = authHeader.substring(7);
        Long userId = jwtService.extractUserId(token);
        return authService.changePassword(userId, request);
    }
}