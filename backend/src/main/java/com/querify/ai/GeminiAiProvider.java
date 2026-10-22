package com.querify.ai;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.querify.config.AiConfigProperties;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestTemplate;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * Live Google Gemini AI Provider.
 * Communicates with the Gemini REST API to translate natural language into SQL.
 * Instructs the model using strict schema definitions, constraints, and JSON response mode.
 */
@Component
public class GeminiAiProvider implements AiProvider {

    private static final Logger log = LoggerFactory.getLogger(GeminiAiProvider.class);

    private final AiConfigProperties aiConfig;
    private final RestTemplate restTemplate;
    private final ObjectMapper objectMapper;

    private static final String SCHEMA_PROMPT = 
            "You are an expert SQL Generator for MySQL 8.\n" +
            "Generate ONLY read-only MySQL SELECT queries based on the user's natural language question.\n\n" +
            "DATABASE SCHEMA:\n" +
            "1. companies (company_id PK, company_name UNIQUE, industry, country, founded_year, company_type, headquarters_city)\n" +
            "2. ai_models (model_id PK, company_id FK, model_name, model_category, release_year, parameter_count_billions, performance_score 0-100)\n" +
            "3. financial_performance (performance_id PK, company_id FK, fiscal_year, revenue_millions, profit_millions, operating_cost_millions, revenue_growth_percent)\n" +
            "4. ai_investments (investment_id PK, company_id FK, investment_year, investment_amount_millions, investment_category, estimated_return_percent)\n" +
            "5. research_projects (project_id PK, company_id FK, project_name, research_area, budget_millions, project_status, start_date)\n" +
            "6. market_performance (market_id PK, company_id FK, fiscal_year, market_share_percent, customer_growth_percent, performance_index 0-100)\n\n" +
            "STRICT RULES:\n" +
            "- Only return valid MySQL SELECT statements. Never produce INSERT, UPDATE, DELETE, DROP, ALTER, TRUNCATE, or CREATE.\n" +
            "- Only query the 6 allowed domain tables above.\n" +
            "- Use proper JOIN syntax on company_id.\n" +
            "- All monetary values are in millions USD.\n" +
            "- Always include a sensible LIMIT (e.g., LIMIT 10) unless computing a single row aggregation.\n" +
            "- Output strictly valid JSON in the format: {\"sql\": \"...\", \"explanation\": \"...\"}\n" +
            "- Do not wrap the JSON in backticks.";

    public GeminiAiProvider(AiConfigProperties aiConfig) {
        this.aiConfig = aiConfig;
        this.restTemplate = new RestTemplate();
        this.objectMapper = new ObjectMapper();
    }

    @Override
    public String getProviderName() {
        return "gemini";
    }

    @Override
    public GeneratedSqlResult generateSql(String naturalQuestion, Map<String, Object> context) {
        String apiKey = aiConfig.getApiKey();
        if (apiKey == null || apiKey.trim().isEmpty()) {
            throw new IllegalStateException("Gemini API key is not configured.");
        }

        String model = aiConfig.getModel() != null && !aiConfig.getModel().isEmpty() ? aiConfig.getModel() : "gemini-1.5-flash";
        String endpoint = "https://generativelanguage.googleapis.com/v1beta/models/" + model + ":generateContent?key=" + apiKey;

        log.info("Contacting Gemini API with model: {}", model);

        String userPrompt = "Natural Language Question: \"" + naturalQuestion + "\"";
        if (context != null && !context.isEmpty()) {
            userPrompt += "\nClarification Context: " + context;
        }

        try {
            Map<String, Object> requestBody = new HashMap<>();
            
            // System instruction
            Map<String, Object> systemPart = Map.of("text", SCHEMA_PROMPT);
            requestBody.put("system_instruction", Map.of("parts", List.of(systemPart)));

            // User message
            Map<String, Object> userPart = Map.of("text", userPrompt);
            requestBody.put("contents", List.of(Map.of("role", "user", "parts", List.of(userPart))));

            // Generation config
            Map<String, Object> genConfig = new HashMap<>();
            genConfig.put("temperature", 0.1);
            genConfig.put("responseMimeType", "application/json");
            requestBody.put("generationConfig", genConfig);

            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);

            HttpEntity<Map<String, Object>> entity = new HttpEntity<>(requestBody, headers);
            ResponseEntity<String> response = restTemplate.postForEntity(endpoint, entity, String.class);

            if (response.getStatusCode().is2xxSuccessful() && response.getBody() != null) {
                JsonNode root = objectMapper.readTree(response.getBody());
                JsonNode candidateText = root.path("candidates").path(0).path("content").path("parts").path(0).path("text");
                if (!candidateText.isMissingNode()) {
                    String jsonText = candidateText.asText().trim();
                    // Clean possible markdown ```json ... ```
                    if (jsonText.startsWith("```")) {
                        jsonText = jsonText.replaceAll("^```(?:json)?\\s*", "").replaceAll("\\s*```$", "").trim();
                    }
                    JsonNode resultObj = objectMapper.readTree(jsonText);
                    String sql = resultObj.path("sql").asText();
                    String explanation = resultObj.path("explanation").asText();
                    return new GeneratedSqlResult(sql, explanation);
                }
            }
            throw new RuntimeException("Unexpected response structure from Gemini API");

        } catch (Exception e) {
            log.error("Gemini API request failed: {}", e.getMessage());
            throw new RuntimeException("Gemini API call failed: " + e.getMessage(), e);
        }
    }
}
