package com.mundial2026.match.dto;

import com.mundial2026.match.model.Match;

import java.time.LocalDateTime;

public class MatchDtos {

    public record MatchResponse(
            Long id,
            String homeTeam,
            String awayTeam,
            String stadium,
            String city,
            String country,
            LocalDateTime matchDate,
            String phase,
            String status,
            Integer homeScore,
            Integer awayScore,
            int availableTickets,
            boolean dataConfirmed
    ) {
        public static MatchResponse from(Match match) {
            return new MatchResponse(
                    match.getId(),
                    match.getHomeTeam(),
                    match.getAwayTeam(),
                    match.getStadium(),
                    match.getCity(),
                    match.getCountry(),
                    match.getMatchDate(),
                    match.getPhase(),
                    match.getStatus(),
                    match.getHomeScore(),
                    match.getAwayScore(),
                    match.getAvailableTickets(),
                    match.isDataConfirmed());
        }
    }

    public record UpdateMatchRequest(
            LocalDateTime matchDate,
            String stadium,
            String city,
            String status,
            Integer homeScore,
            Integer awayScore
    ) {}
}