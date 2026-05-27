package com.mundial2026;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.context.properties.ConfigurationPropertiesScan;
import org.springframework.scheduling.annotation.EnableScheduling;

@SpringBootApplication
@ConfigurationPropertiesScan
@EnableScheduling
public class Mundial2026HubApplication {

    public static void main(String[] args) {
        SpringApplication.run(Mundial2026HubApplication.class, args);
    }
}