package com.mundial2026.auth.service;

import com.mundial2026.auth.model.User;
import com.mundial2026.auth.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.ReactiveUserDetailsService;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import reactor.core.publisher.Mono;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ReactiveUserDetailsServiceImpl implements ReactiveUserDetailsService {

    private final UserRepository userRepository;

    @Override
    public Mono<UserDetails> findByUsername(String email) {
        return userRepository.findByEmail(email)
                .switchIfEmpty(Mono.error(
                        new UsernameNotFoundException("Usuario no encontrado: " + email)))
                .map(user -> org.springframework.security.core.userdetails.User.builder()
                        .username(user.getEmail())
                        .password(user.getPasswordHash())
                        .authorities(List.of(
                                new SimpleGrantedAuthority("ROLE_" + user.getRole().name())))
                        .accountExpired(false)
                        .accountLocked(user.isAccountLocked())
                        .credentialsExpired(false)
                        .disabled(user.getStatus() == User.UserStatus.SUSPENDED)
                        .build());
    }
}