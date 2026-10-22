package com.querify.controller;

import com.querify.ai.AiService;
import com.querify.dto.HealthResponse;
import org.springframework.http.ResponseEntity;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.lang.management.ManagementFactory;
import java.sql.Connection;

/**
 * Health & Diagnostics Controller.
 * Verifies live database connectivity, detects database product name,
 * and reports AI engine operation status.
 */
@RestController
@RequestMapping("/api/health")
public class HealthController {

    private final JdbcTemplate jdbcTemplate;
    private final AiService aiService;

    public HealthController(JdbcTemplate jdbcTemplate, AiService aiService) {
        this.jdbcTemplate = jdbcTemplate;
        this.aiService = aiService;
    }

    @GetMapping
    public ResponseEntity<HealthResponse> getHealth() {
        boolean dbConnected = false;
        String dbEngine = "Unknown";

        try (Connection conn = jdbcTemplate.getDataSource() != null ? jdbcTemplate.getDataSource().getConnection() : null) {
            if (conn != null && !conn.isClosed()) {
                dbConnected = true;
                if (com.querify.config.DataSourceConfig.isUsingFallback()) {
                    dbEngine = "Embedded Engine (In-Memory MySQL Mode) - Fully Seeded";
                } else {
                    dbEngine = "MySQL 8 (" + conn.getMetaData().getDatabaseProductVersion() + ")";
                }
            }
        } catch (Exception e) {
            dbConnected = false;
            dbEngine = "Disconnected (" + e.getMessage() + ")";
        }

        long uptimeSeconds = ManagementFactory.getRuntimeMXBean().getUptime() / 1000;

        HealthResponse response = new HealthResponse(
                dbConnected ? "UP" : "DEGRADED",
                dbConnected,
                dbEngine,
                aiService.getActiveProvider(),
                aiService.getActiveMode(),
                uptimeSeconds
        );

        return ResponseEntity.ok(response);
    }
}
