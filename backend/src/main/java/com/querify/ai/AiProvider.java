package com.querify.ai;

import java.util.Map;

/**
 * Common abstraction for Text-to-SQL generation providers.
 * Allows swapping between Gemini, Groq, OpenAI, or local deterministic engines.
 */
public interface AiProvider {

    /**
     * Translates a natural language question (and any clarified context) into safe, executable SQL.
     */
    GeneratedSqlResult generateSql(String naturalQuestion, Map<String, Object> context);

    /**
     * Provider identifier (e.g. "gemini", "demo").
     */
    String getProviderName();
}
