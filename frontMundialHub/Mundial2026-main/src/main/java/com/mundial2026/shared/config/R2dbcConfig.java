package com.mundial2026.shared.config;

import io.asyncer.r2dbc.mysql.MySqlConnectionConfiguration;
import io.asyncer.r2dbc.mysql.MySqlConnectionFactory;
import io.r2dbc.spi.ConnectionFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.data.r2dbc.config.AbstractR2dbcConfiguration;
import org.springframework.data.r2dbc.repository.config.EnableR2dbcRepositories;
import org.springframework.r2dbc.connection.R2dbcTransactionManager;
import org.springframework.transaction.ReactiveTransactionManager;

import java.time.Duration;

@Configuration
@EnableR2dbcRepositories(basePackages = "com.mundial2026")
public class R2dbcConfig extends AbstractR2dbcConfiguration {

    @Value("${spring.r2dbc.username}")
    private String username;

    @Value("${spring.r2dbc.password}")
    private String password;

    @Override
    @Bean
    public ConnectionFactory connectionFactory() {
        MySqlConnectionConfiguration config = MySqlConnectionConfiguration.builder()
                .host("127.0.0.1")  // IP explícita en vez de localhost
                .port(3306)
                .database("mundial2026_db")
                .username(username)
                .password(password)
                .connectTimeout(Duration.ofSeconds(10))
                .tcpKeepAlive(true)
                .build();

        return MySqlConnectionFactory.from(config);
    }

    @Bean
    public ReactiveTransactionManager transactionManager(ConnectionFactory connectionFactory) {
        return new R2dbcTransactionManager(connectionFactory);
    }
}