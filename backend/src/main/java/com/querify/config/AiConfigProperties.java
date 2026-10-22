package com.querify.config;

import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.context.annotation.Configuration;

/**
 * Configuration properties mapped from application.properties / environment variables.
 * Controls external AI provider settings and fallback behavior.
 */
@Configuration
@ConfigurationProperties(prefix = "ai")
public class AiConfigProperties {

    /**
     * AI Provider name: "gemini", "groq", or "demo".
     */
    private String provider = "gemini";

    /**
     * Secret API key for external AI provider.
     */
    private String apiKey = "";

    /**
     * Specific AI model name (e.g., gemini-1.5-flash).
     */
    private String model = "gemini-1.5-flash";

    /**
     * Operational mode: "live" (uses external API) or "demo" (deterministic offline rule engine).
     */
    private String mode = "demo";

    public String getProvider() {
        return provider;
    }

    public void setProvider(String provider) {
        this.provider = provider;
    }

    public String getApiKey() {
        return apiKey;
    }

    public void setApiKey(String apiKey) {
        this.apiKey = apiKey;
    }

    public String getModel() {
        return model;
    }

    public void setModel(String model) {
        this.model = model;
    }

    public String getMode() {
        return mode;
    }

    public void setMode(String mode) {
        this.mode = mode;
    }

    public boolean isDemoMode() {
        return "demo".equalsIgnoreCase(mode) || apiKey == null || apiKey.trim().isEmpty();
    }
}
