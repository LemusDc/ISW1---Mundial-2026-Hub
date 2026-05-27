package com.mundial2026.shared.config;

import lombok.Data;
import org.springframework.boot.context.properties.ConfigurationProperties;

@Data
@ConfigurationProperties(prefix = "app")
public class AppProperties {

    private Jwt jwt = new Jwt();
    private Cors cors = new Cors();
    private Ticket ticket = new Ticket();
    private Album album = new Album();

    @Data
    public static class Jwt {
        private String secret;
        private long expirationMs;
        private long refreshExpirationMs;
    }

    @Data
    public static class Cors {
        private String allowedOrigins;
        private String allowedMethods;
        private long maxAge;
    }

    @Data
    public static class Ticket {
        private int ttlMinutes;
        private int maxPerUserPerDay;
    }

    @Data
    public static class Album {
        private int stickersPerPack;
        private int maxTradesPerDay;
    }
}