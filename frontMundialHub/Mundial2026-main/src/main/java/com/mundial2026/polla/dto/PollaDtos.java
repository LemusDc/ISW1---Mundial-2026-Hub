package com.mundial2026.polla.dto;

import com.mundial2026.polla.model.Polla;
import com.mundial2026.polla.model.Pronostico;
import jakarta.validation.constraints.*;

import java.time.LocalDateTime;

public class PollaDtos {

    public record CreatePollaRequest(
            @NotBlank(message = "El nombre es obligatorio") String name,
            String description
    ) {}

    public record SavePronosticoRequest(
            @NotNull Long pollaId,
            @NotNull Long matchId,
            @Min(0) @Max(20) int homeScore,
            @Min(0) @Max(20) int awayScore
    ) {}

    public record PollaResponse(
            Long id, String name, String description,
            String inviteCode, Polla.PollaStatus status,
            int pointsWinner, int pointsExactScore,
            LocalDateTime createdAt
    ) {
        public static PollaResponse from(Polla p) {
            return new PollaResponse(p.getId(), p.getName(), p.getDescription(),
                    p.getInviteCode(), p.getStatus(), p.getPointsWinner(),
                    p.getPointsExactScore(), p.getCreatedAt());
        }
    }

    public record PronosticoResponse(
            Long id, Long pollaId, Long matchId,
            int predictedHomeScore, int predictedAwayScore,
            boolean locked, Integer pointsEarned, boolean calculated,
            LocalDateTime createdAt
    ) {
        public static PronosticoResponse from(Pronostico p) {
            return new PronosticoResponse(p.getId(), p.getPollaId(), p.getMatchId(),
                    p.getPredictedHomeScore(), p.getPredictedAwayScore(),
                    p.isLocked(), p.getPointsEarned(), p.isCalculated(), p.getCreatedAt());
        }
    }

    public record RankingEntry(int position, Long userId, String username, int totalPoints) {}
}