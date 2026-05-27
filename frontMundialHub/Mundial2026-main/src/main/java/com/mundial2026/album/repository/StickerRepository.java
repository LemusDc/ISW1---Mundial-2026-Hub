package com.mundial2026.album.repository;

import com.mundial2026.album.model.Sticker;
import org.springframework.data.r2dbc.repository.R2dbcRepository;
import org.springframework.stereotype.Repository;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

@Repository
public interface StickerRepository extends R2dbcRepository<Sticker, Long> {
    Flux<Sticker> findByTeam(String team);
    Mono<Sticker> findByCode(String code);
}