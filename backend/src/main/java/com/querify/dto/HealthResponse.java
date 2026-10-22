package com.querify.dto;

public class HealthResponse {

    private String status;
    private boolean databaseConnected;
    private String databaseEngine;
    private String aiProvider;
    private String aiMode;
    private long uptimeSeconds;

    public HealthResponse() {
    }

    public HealthResponse(String status, boolean databaseConnected, String databaseEngine, String aiProvider, String aiMode, long uptimeSeconds) {
        this.status = status;
        this.databaseConnected = databaseConnected;
        this.databaseEngine = databaseEngine;
        this.aiProvider = aiProvider;
        this.aiMode = aiMode;
        this.uptimeSeconds = uptimeSeconds;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public boolean isDatabaseConnected() {
        return databaseConnected;
    }

    public void setDatabaseConnected(boolean databaseConnected) {
        this.databaseConnected = databaseConnected;
    }

    public String getDatabaseEngine() {
        return databaseEngine;
    }

    public void setDatabaseEngine(String databaseEngine) {
        this.databaseEngine = databaseEngine;
    }

    public String getAiProvider() {
        return aiProvider;
    }

    public void setAiProvider(String aiProvider) {
        this.aiProvider = aiProvider;
    }

    public String getAiMode() {
        return aiMode;
    }

    public void setAiMode(String aiMode) {
        this.aiMode = aiMode;
    }

    public long getUptimeSeconds() {
        return uptimeSeconds;
    }

    public void setUptimeSeconds(long uptimeSeconds) {
        this.uptimeSeconds = uptimeSeconds;
    }
}
