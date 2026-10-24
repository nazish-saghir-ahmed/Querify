package com.querify.controller;

import com.querify.ai.AiService;
import com.querify.ai.GeneratedSqlResult;
import com.querify.clarification.ClarificationEngine;
import com.querify.clarification.ClarificationSession;
import com.querify.dto.*;
import com.querify.exception.ClarificationException;
import com.querify.sql.SqlExecutionService;
import jakarta.validation.Valid;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Optional;

/**
 * Primary REST Controller managing the natural language Text-to-SQL pipeline.
 * Handles initial question analysis, ambiguity detection, clarification resolution,
 * out-of-domain detection, and direct SQL execution.
 */
@RestController
@RequestMapping("/api/query")
public class QueryController {

    private static final Logger log = LoggerFactory.getLogger(QueryController.class);

    private final ClarificationEngine clarificationEngine;
    private final AiService aiService;
    private final SqlExecutionService sqlExecutionService;

    public QueryController(ClarificationEngine clarificationEngine, AiService aiService, SqlExecutionService sqlExecutionService) {
        this.clarificationEngine = clarificationEngine;
        this.aiService = aiService;
        this.sqlExecutionService = sqlExecutionService;
    }

    /**
     * Stage 1 & 2: Analyzes user's question, detects ambiguity,
     * and either asks for clarification, reports out-of-domain scope, or returns executed SQL.
     */
    @PostMapping("/analyze")
    public ResponseEntity<QueryAnalyzeResponse> analyzeQuery(@Valid @RequestBody QueryAnalyzeRequest request) {
        String question = request.getQuestion().trim();
        log.info("Received query analyze request: '{}'", question);

        ClarificationSession session = clarificationEngine.getOrCreateSession(request.getSessionId(), question);

        // Check if question contains semantic ambiguity
        Optional<ClarificationQuestion> ambiguityQuestion = clarificationEngine.detectAmbiguity(question, session.getTurnCount());

        if (ambiguityQuestion.isPresent()) {
            ClarificationQuestion clarQuestion = ambiguityQuestion.get();
            session.recordTurn(clarQuestion);
            log.info("Ambiguity identified. Returning clarification prompt: '{}'", clarQuestion.getPrompt());
            return ResponseEntity.ok(QueryAnalyzeResponse.clarificationNeeded(session.getSessionId(), question, clarQuestion));
        }

        // No ambiguity detected: proceed directly to SQL generation
        GeneratedSqlResult aiResult = aiService.generateSql(question, session.getResolvedContext());

        // Check if question is outside database domain scope
        if (aiResult.getSql() == null || aiResult.getSql().trim().isEmpty() || "null".equalsIgnoreCase(aiResult.getSql().trim()) || "NO_DATA".equalsIgnoreCase(aiResult.getSql().trim())) {
            log.info("Query '{}' determined to be out-of-domain. Returning light warning.", question);
            return ResponseEntity.ok(QueryAnalyzeResponse.noDataAvailable(
                    session.getSessionId(),
                    question,
                    aiResult.getExplanation() != null ? aiResult.getExplanation() : "No relevant data available for this query in the database catalog."
            ));
        }

        QueryResultDto queryResult = sqlExecutionService.executeQuery(aiResult.getSql(), question, aiResult.getExplanation());

        return ResponseEntity.ok(QueryAnalyzeResponse.sqlGenerated(
                session.getSessionId(),
                question,
                aiResult.getSql(),
                aiResult.getExplanation(),
                queryResult
        ));
    }

    /**
     * Stage 3 & 4: Receives user's clarification selection,
     * continues processing the original question with clarified context,
     * and returns the final executed SQL result.
     */
    @PostMapping("/clarify")
    public ResponseEntity<QueryAnalyzeResponse> clarifyQuery(@Valid @RequestBody QueryClarifyRequest request) {
        log.info("Received clarification choice for session '{}': option '{}'", request.getSessionId(), request.getSelectedOptionId());

        ClarificationSession session = clarificationEngine.getSession(request.getSessionId());
        if (session == null) {
            throw new ClarificationException("Clarification session expired or not found. Please re-submit your query.");
        }

        // Resolve ambiguity into concrete intent
        String resolvedIntent = clarificationEngine.buildResolvedIntent(
                session, 
                request.getSelectedOptionId(), 
                request.getCustomInput()
        );

        // Generate SQL based on the clarified parameters
        GeneratedSqlResult aiResult = aiService.generateSql(resolvedIntent, session.getResolvedContext());

        if (aiResult.getSql() == null || aiResult.getSql().trim().isEmpty() || "null".equalsIgnoreCase(aiResult.getSql().trim())) {
            return ResponseEntity.ok(QueryAnalyzeResponse.noDataAvailable(
                    session.getSessionId(),
                    session.getOriginalQuestion(),
                    aiResult.getExplanation() != null ? aiResult.getExplanation() : "No relevant data available for this query in the database catalog."
            ));
        }

        QueryResultDto queryResult = sqlExecutionService.executeQuery(aiResult.getSql(), session.getOriginalQuestion(), aiResult.getExplanation());

        return ResponseEntity.ok(QueryAnalyzeResponse.sqlGenerated(
                session.getSessionId(),
                session.getOriginalQuestion(),
                aiResult.getSql(),
                aiResult.getExplanation(),
                queryResult
        ));
    }

    /**
     * Executes an approved SQL query directly.
     */
    @PostMapping("/execute")
    public ResponseEntity<QueryResultDto> executeQuery(@Valid @RequestBody QueryExecuteRequest request) {
        log.info("Direct SQL execution requested: {}", request.getSql());
        QueryResultDto result = sqlExecutionService.executeQuery(
                request.getSql(),
                request.getNaturalQuery(),
                request.getExplanation()
        );
        return ResponseEntity.ok(result);
    }
}
