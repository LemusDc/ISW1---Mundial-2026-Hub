package com.mundial2026.auth.model;

import lombok.*;
import org.springframework.data.annotation.Id;
import org.springframework.data.relational.core.mapping.Column;
import org.springframework.data.relational.core.mapping.Table;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Table("user_preferences")
public class UserPreferences {

    @Id
    private Long id;

    @Column("user_id")
    private Long userId;

    @Column("favorite_teams")
    private String favoriteTeams;

    @Column("favorite_cities")
    private String favoriteCities;

    @Column("favorite_stadiums")
    private String favoriteStadiums;

    @Column("notification_channel")
    @Builder.Default
    private NotificationChannel notificationChannel = NotificationChannel.EMAIL;

    @Column("timezone")
    @Builder.Default
    private String timezone = "UTC";

    @Column("match_reminders_enabled")
    @Builder.Default
    private boolean matchRemindersEnabled = true;

    @Column("reminder_minutes_before")
    @Builder.Default
    private int reminderMinutesBefore = 60;

    public enum NotificationChannel {
        EMAIL, PUSH, BOTH
    }
}