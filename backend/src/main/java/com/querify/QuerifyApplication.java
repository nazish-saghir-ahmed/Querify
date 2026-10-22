package com.querify;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.context.properties.EnableConfigurationProperties;

/**
 * Querify - AI-Powered Text-to-SQL Clarification Engine
 * 
 * Entry point for the Spring Boot application.
 * Manages database exploration, AI natural language analysis,
 * multi-turn ambiguity clarification, robust SQL validation,
 * and secure database query execution.
 */
@SpringBootApplication
@EnableConfigurationProperties
public class QuerifyApplication {

    public static void main(String[] args) {
        SpringApplication.run(QuerifyApplication.class, args);
    }
}
