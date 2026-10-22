package com.querify.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public class QueryAnalyzeRequest {

    @NotBlank(message = "Natural language question cannot be empty")
    @Size(max = 1000, message = "Question is too long (maximum 1000 characters)")
    private String question;

    private String sessionId;

    public QueryAnalyzeRequest() {
    }

    public QueryAnalyzeRequest(String question, String sessionId) {
        this.question = question;
        this.sessionId = sessionId;
    }

    public String getQuestion() {
        return question;
    }

    public void setQuestion(String question) {
        this.question = question;
    }

    public String getSessionId() {
        return sessionId;
    }

    public void setSessionId(String sessionId) {
        this.sessionId = sessionId;
    }
}
