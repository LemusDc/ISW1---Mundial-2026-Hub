package com.mundial2026.auth.security;

import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpHeaders;
import org.springframework.security.authentication.ReactiveAuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.ReactiveUserDetailsService;
import org.springframework.security.web.server.authentication.AuthenticationWebFilter;
import org.springframework.security.web.server.authentication.ServerAuthenticationConverter;
import reactor.core.publisher.Mono;

@Slf4j
public class JwtAuthenticationFilter extends AuthenticationWebFilter {

    private final JwtService jwtService;
    private final ReactiveUserDetailsService userDetailsService;

    public JwtAuthenticationFilter(JwtService jwtService,
                                    ReactiveUserDetailsService userDetailsService) {
        super(buildAuthManager());
        this.jwtService = jwtService;
        this.userDetailsService = userDetailsService;
        this.setServerAuthenticationConverter(converter());
    }

    private static ReactiveAuthenticationManager buildAuthManager() {
        return authentication -> Mono.just(authentication);
    }

    private ServerAuthenticationConverter converter() {
        return exchange -> {
            String authHeader = exchange.getRequest()
                    .getHeaders()
                    .getFirst(HttpHeaders.AUTHORIZATION);

            if (authHeader == null || !authHeader.startsWith("Bearer ")) {
                return Mono.empty();
            }

            String jwt = authHeader.substring(7);

            try {
                String username = jwtService.extractUsername(jwt);
                if (username == null) return Mono.empty();

                return userDetailsService.findByUsername(username)
                        .filter(userDetails -> jwtService.isTokenValid(jwt, userDetails))
                        .map(userDetails -> {
                            log.debug("Usuario autenticado: {}", username);
                            return (org.springframework.security.core.Authentication)
                                    new UsernamePasswordAuthenticationToken(
                                            userDetails,
                                            null,
                                            userDetails.getAuthorities());
                        });
            } catch (Exception e) {
                log.warn("Error procesando JWT: {}", e.getMessage());
                return Mono.empty();
            }
        };
    }
}