package com.querify.ai;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

import java.util.Map;

import static org.junit.jupiter.api.Assertions.*;

class DemoModeAiProviderTest {

    private DemoModeAiProvider provider;

    @BeforeEach
    void setUp() {
        provider = new DemoModeAiProvider();
    }

    @Test
    @DisplayName("Should generate revenue query for highest_revenue clarified context")
    void shouldGenerateRevenueQuery() {
        GeneratedSqlResult result = provider.generateSql("Show me the best performing AI companies", Map.of("selectedMetric", "highest_revenue"));
        assertNotNull(result);
        assertTrue(result.getSql().contains("revenue_millions"));
        assertTrue(result.getSql().toUpperCase().contains("ORDER BY"));
    }

    @Test
    @DisplayName("Should generate profit query for highest_profit clarified context")
    void shouldGenerateProfitQuery() {
        GeneratedSqlResult result = provider.generateSql("Show me the best performing AI companies", Map.of("selectedMetric", "highest_profit"));
        assertNotNull(result);
        assertTrue(result.getSql().contains("profit_millions"));
    }

    @Test
    @DisplayName("Should generate benchmark query for top models")
    void shouldGenerateModelScoreQuery() {
        GeneratedSqlResult result = provider.generateSql("Which AI models have the highest performance scores?", Map.of());
        assertNotNull(result);
        assertTrue(result.getSql().contains("performance_score"));
        assertTrue(result.getSql().contains("ai_models"));
    }
}
