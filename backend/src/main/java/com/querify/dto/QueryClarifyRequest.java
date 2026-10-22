package com.querify.dto;

import jakarta.validation.constraints.NotBlank;

public class QueryClarifyRequest {

    @NotBlank(message = "Session ID is required for clarification")
    private String sessionId;

    @NotBlank(message = "Selected option ID or value is required")
    private String selectedOptionId;

    private String customInput;

    public QueryClarifyRequest() {
    }

    public QueryClarifyRequest(String sessionId, String selectedOptionId, String customInput) {
        this.sessionId = sessionId;
        this.selectedOptionId = selectedOptionId;
        this.customInput = customInput;
    }

    public String getSessionId() {
        return sessionId;
    }

    public void setSessionId(String sessionId) {
        this.sessionId = sessionId;
    }

    public String getSelectedOptionId() {
        return selectedOptionId;
    }

    public void setSelectedOptionId(String selectedOptionId) {
        this.selectedOptionId = selectedOptionId;
    }

    public String getCustomInput() {
        return customInput;
    }

    public void setCustomInput(String customInput) {
        this.customInput = customInput;
    }
}
