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

import javax.net.ssl.HttpsURLConnection;
import javax.net.ssl.SSLContext;
import javax.net.ssl.TrustManager;
import javax.net.ssl.X509TrustManager;
import java.io.IOException;
import java.net.HttpURLConnection;
import java.security.cert.X509Certificate;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

/**
 * OpenRouter AI Provider using NVIDIA Nemotron 3.5 Super VL.
 * Translates natural language questions into safe, verified MySQL 8 SELECT statements
 * with deep multi-step reasoning capabilities.
 */
@Component
public class OpenRouterAiProvider implements AiProvider {

    private static final Logger log = LoggerFactory.getLogger(OpenRouterAiProvider.class);

    private final AiConfigProperties aiConfig;
    private final RestTemplate restTemplate;
    private final ObjectMapper objectMapper;

    private static final String SCHEMA_PROMPT = 
            "You are an expert SQL Generator for MySQL 8 in the Querify system.\n" +
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
            "- Output strictly valid JSON in the format: {\"sql\": \"SELECT ...\", \"explanation\": \"...\"}\n" +
            "- Do not wrap the JSON in backticks or markdown fences.";

    public OpenRouterAiProvider(AiConfigProperties aiConfig) {
        this.aiConfig = aiConfig;
        
        org.springframework.http.client.SimpleClientHttpRequestFactory factory;
        try {
            TrustManager[] trustAllCerts = new TrustManager[]{
                new X509TrustManager() {
                    public X509Certificate[] getAcceptedIssuers() { return null; }
                    public void checkClientTrusted(X509Certificate[] certs, String authType) { }
                    public void checkServerTrusted(X509Certificate[] certs, String authType) { }
                }
            };
            SSLContext sc = SSLContext.getInstance("TLS");
            sc.init(null, trustAllCerts, new java.security.SecureRandom());
            HttpsURLConnection.setDefaultSSLSocketFactory(sc.getSocketFactory());
            HttpsURLConnection.setDefaultHostnameVerifier((hostname, session) -> true);

            factory = new org.springframework.http.client.SimpleClientHttpRequestFactory() {
                @Override
                protected void prepareConnection(HttpURLConnection connection, String httpMethod) throws IOException {
                    if (connection instanceof HttpsURLConnection httpsConnection) {
                        httpsConnection.setSSLSocketFactory(sc.getSocketFactory());
                        httpsConnection.setHostnameVerifier((hostname, session) -> true);
                    }
                    super.prepareConnection(connection, httpMethod);
                }
            };
        } catch (Exception e) {
            log.warn("Failed to initialize custom SSLContext for OpenRouter, using default factory", e);
            factory = new org.springframework.http.client.SimpleClientHttpRequestFactory();
        }

        factory.setConnectTimeout(15000);
        factory.setReadTimeout(60000);
        this.restTemplate = new RestTemplate(factory);
        this.objectMapper = new ObjectMapper();
    }

    @Override
    public String getProviderName() {
        return "openrouter";
    }

    @Override
    public GeneratedSqlResult generateSql(String naturalQuestion, Map<String, Object> context) {
        String apiKey = aiConfig.getApiKey();
        if (apiKey == null || apiKey.trim().isEmpty()) {
            throw new IllegalStateException("OpenRouter API key is not configured.");
        }

        String model = aiConfig.getModel() != null && !aiConfig.getModel().isEmpty() 
                ? aiConfig.getModel() 
                : "nvidia/nemotron-3.5-super-vl:free";
        String endpoint = "https://openrouter.ai/api/v1/chat/completions";

        log.info("Contacting OpenRouter API with model: {}", model);

        String userPrompt = "Natural Language Question: \"" + naturalQuestion + "\"";
        if (context != null && !context.isEmpty()) {
            userPrompt += "\nClarification Context: " + context;
        }

        try {
            Map<String, Object> requestBody = new HashMap<>();
            requestBody.put("model", model);
            requestBody.put("messages", List.of(
                    Map.of("role", "system", "content", SCHEMA_PROMPT),
                    Map.of("role", "user", "content", userPrompt)
            ));

            Map<String, Object> extraBody = new HashMap<>();
            extraBody.put("reasoning", Map.of("enabled", true));
            requestBody.put("extra_body", extraBody);

            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);
            headers.setBearerAuth(apiKey);
            headers.set("HTTP-Referer", "https://querify-nine.vercel.app");
            headers.set("X-Title", "Querify Text-to-SQL");

            HttpEntity<Map<String, Object>> entity = new HttpEntity<>(requestBody, headers);
            ResponseEntity<String> response = restTemplate.postForEntity(endpoint, entity, String.class);

            if (!response.getStatusCode().is2xxSuccessful() || response.getBody() == null) {
                throw new RuntimeException("OpenRouter API returned status " + response.getStatusCode());
            }

            JsonNode root = objectMapper.readTree(response.getBody());
            JsonNode choices = root.path("choices");
            if (choices.isMissingNode() || choices.isEmpty()) {
                throw new RuntimeException("No choices returned in OpenRouter response");
            }

            String content = choices.get(0).path("message").path("content").asText();
            if (content == null || content.trim().isEmpty()) {
                throw new RuntimeException("Empty response content from OpenRouter");
            }

            // Extract JSON from response (clean markdown fences if model generated any)
            String jsonStr = content.trim();
            Matcher matcher = Pattern.compile("\\{[\\s\\S]*\\}").matcher(content);
            if (matcher.find()) {
                jsonStr = matcher.group(0);
            }

            JsonNode sqlJson = objectMapper.readTree(jsonStr);
            String sql = sqlJson.path("sql").asText();
            String explanation = sqlJson.path("explanation").asText();

            if (sql == null || sql.trim().isEmpty()) {
                throw new RuntimeException("OpenRouter response did not contain a valid 'sql' field");
            }

            log.info("Successfully synthesized SQL via OpenRouter ({}): {}", model, sql);
            return new GeneratedSqlResult(sql, explanation != null ? explanation : "Synthesized via NVIDIA Nemotron 3.5 Super VL.");

        } catch (Exception e) {
            log.error("Failed to generate SQL via OpenRouter: {}", e.getMessage());
            throw new RuntimeException("OpenRouter AI generation error: " + e.getMessage(), e);
        }
    }
}
