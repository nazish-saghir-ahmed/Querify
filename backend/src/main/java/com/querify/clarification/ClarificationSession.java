package com.querify.clarification;

import com.querify.dto.ClarificationOption;
import com.querify.dto.ClarificationQuestion;

import java.util.HashMap;
import java.util.Map;

/**
 * State container for a multi-turn clarification conversation.
 * Preserves the user's initial question, previous clarification prompts,
 * selected answers, and resolved entity/metric parameters.
 */
public class ClarificationSession {

    private String sessionId;
    private String originalQuestion;
    private int turnCount = 0;
    private ClarificationQuestion pendingQuestion;
    private ClarificationOption selectedOption;
    private Map<String, Object> resolvedContext = new HashMap<>();
    private long lastAccessTime = System.currentTimeMillis();

    public ClarificationSession(String sessionId, String originalQuestion) {
        this.sessionId = sessionId;
        this.originalQuestion = originalQuestion;
    }

    public void recordTurn(ClarificationQuestion question) {
        this.pendingQuestion = question;
        this.turnCount++;
        this.lastAccessTime = System.currentTimeMillis();
    }

    public void resolve(ClarificationOption option, String customInput) {
        this.selectedOption = option;
        if (option != null) {
            this.resolvedContext.put("selectedMetric", option.getValue());
            this.resolvedContext.put("selectedLabel", option.getLabel());
        }
        if (customInput != null && !customInput.trim().isEmpty()) {
            this.resolvedContext.put("customInput", customInput.trim());
        }
        this.lastAccessTime = System.currentTimeMillis();
    }

    public String getSessionId() {
        return sessionId;
    }

    public String getOriginalQuestion() {
        return originalQuestion;
    }

    public int getTurnCount() {
        return turnCount;
    }

    public ClarificationQuestion getPendingQuestion() {
        return pendingQuestion;
    }

    public ClarificationOption getSelectedOption() {
        return selectedOption;
    }

    public Map<String, Object> getResolvedContext() {
        return resolvedContext;
    }

    public long getLastAccessTime() {
        return lastAccessTime;
    }

    public boolean isExpired(long ttlMs) {
        return (System.currentTimeMillis() - lastAccessTime) > ttlMs;
    }
}
