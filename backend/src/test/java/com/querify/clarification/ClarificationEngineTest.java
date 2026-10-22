package com.querify.clarification;

import com.querify.dto.ClarificationQuestion;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;

class ClarificationEngineTest {

    private ClarificationEngine engine;

    @BeforeEach
    void setUp() {
        engine = new ClarificationEngine();
    }

    @Test
    @DisplayName("Should detect ambiguity on 'best performing AI companies'")
    void shouldDetectAmbiguityOnBestPerforming() {
        Optional<ClarificationQuestion> result = engine.detectAmbiguity("Show me the best performing AI companies", 0);
        assertTrue(result.isPresent());
        ClarificationQuestion question = result.get();
        assertEquals("clarify_best_performing", question.getQuestionId());
        assertTrue(question.getOptions().size() >= 3);
    }

    @Test
    @DisplayName("Should detect ambiguity on 'Which company made the most money?'")
    void shouldDetectAmbiguityOnMostMoney() {
        Optional<ClarificationQuestion> result = engine.detectAmbiguity("Which AI company made the most money?", 0);
        assertTrue(result.isPresent());
        assertEquals("clarify_most_money", result.get().getQuestionId());
    }

    @Test
    @DisplayName("Should detect ambiguity on 'Show the top AI models'")
    void shouldDetectAmbiguityOnTopModels() {
        Optional<ClarificationQuestion> result = engine.detectAmbiguity("Show the top AI models", 0);
        assertTrue(result.isPresent());
        assertEquals("clarify_top_models", result.get().getQuestionId());
    }

    @Test
    @DisplayName("Should NOT detect ambiguity when metric is already specific (e.g. highest revenue)")
    void shouldNotDetectAmbiguityWhenSpecific() {
        Optional<ClarificationQuestion> result = engine.detectAmbiguity("Which AI companies have the highest revenue in 2024?", 0);
        assertFalse(result.isPresent());
    }

    @Test
    @DisplayName("Should resolve clarification option into augmented intent")
    void shouldResolveClarificationOption() {
        ClarificationSession session = engine.getOrCreateSession(null, "Show me the best performing AI companies");
        Optional<ClarificationQuestion> optQuestion = engine.detectAmbiguity("Show me the best performing AI companies", 0);
        session.recordTurn(optQuestion.get());

        String resolved = engine.buildResolvedIntent(session, "opt_highest_rev", null);
        assertNotNull(resolved);
        assertTrue(resolved.contains("Highest Revenue"));
        assertEquals("highest_revenue", session.getResolvedContext().get("selectedMetric"));
    }
}
