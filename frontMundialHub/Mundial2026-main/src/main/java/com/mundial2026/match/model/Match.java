package com.mundial2026.match.model;

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
@Table("matches")
public class Match {

    @Id
    private Long id;

    @Column("external_id")
    private String externalId;

    @Column("home_team")
    private String homeTeam;

    @Column("away_team")
    private String awayTeam;

    @Column("stadium")
    private String stadium;

    @Column("city")
    private String city;

    @Column("country")
    private String country;

    @Column("match_date")
    private LocalDateTime matchDate;

    // Cambiados de ENUM a String para evitar problemas de conversión R2DBC
    @Column("phase")
    private String phase;

    @Column("status")
    private String status;

    @Column("home_score")
    private Integer homeScore;

    @Column("away_score")
    private Integer awayScore;

    @Column("available_tickets")
    private int availableTickets;

    @Column("total_capacity")
    private int totalCapacity;

    @Column("data_confirmed")
    private boolean dataConfirmed;

    @CreatedDate
    @Column("created_at")
    private LocalDateTime createdAt;

    @LastModifiedDate
    @Column("updated_at")
    private LocalDateTime updatedAt;
}