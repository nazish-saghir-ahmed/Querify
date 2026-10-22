package com.querify.ai;

import com.querify.config.AiConfigProperties;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

import java.util.Map;

/**
 * Orchestrator service for AI-powered Text-to-SQL generation.
 * Handles provider routing (Live Gemini vs Demo Mode) and implements
 * graceful, zero-downtime fallback to Demo Mode if the external API fails or rate-limits.
 */
@Service
public class AiService {

    private static final Logger log = LoggerFactory.getLogger(AiService.class);

    private final AiConfigProperties aiConfig;
    private final GeminiAiProvider geminiAiProvider;
    private final DemoModeAiProvider demoModeAiProvider;

    public AiService(AiConfigProperties aiConfig, GeminiAiProvider geminiAiProvider, DemoModeAiProvider demoModeAiProvider) {
        this.aiConfig = aiConfig;
        this.geminiAiProvider = geminiAiProvider;
        this.demoModeAiProvider = demoModeAiProvider;
    }

    /**
     * Generates SQL from a natural language question.
     * Uses Gemini if in live mode with valid key; otherwise executes via deterministic Demo Mode.
     */
    public GeneratedSqlResult generateSql(String naturalQuestion, Map<String, Object> context) {
        if (!aiConfig.isDemoMode()) {
            try {
                log.info("Dispatching query to Live Gemini provider...");
                return geminiAiProvider.generateSql(naturalQuestion, context);
            } catch (Exception e) {
                log.warn("Live AI generation failed ({}); automatically falling back to deterministic Demo Engine.", e.getMessage());
                GeneratedSqlResult demoResult = demoModeAiProvider.generateSql(naturalQuestion, context);
                String fallbackExplanation = demoResult.getExplanation() + " (Note: Served via Demo Engine due to API fallback).";
                return new GeneratedSqlResult(demoResult.getSql(), fallbackExplanation);
            }
        }

        log.info("Running in Demo Mode: Generating query using local deterministic rules.");
        return demoModeAiProvider.generateSql(naturalQuestion, context);
    }

    public String getActiveMode() {
        return aiConfig.isDemoMode() ? "demo" : "live";
    }

    public String getActiveProvider() {
        return aiConfig.isDemoMode() ? "demo" : aiConfig.getProvider();
    }
}
