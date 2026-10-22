package com.querify.dto;

public class QueryAnalyzeResponse {

    /**
     * "CLARIFICATION_NEEDED" or "SQL_GENERATED"
     */
    private String status;

    private String sessionId;
    private String originalQuestion;
    private ClarificationQuestion clarification;

    private String generatedSql;
    private String explanation;
    private QueryResultDto data;

    public QueryAnalyzeResponse() {
    }

    public static QueryAnalyzeResponse clarificationNeeded(String sessionId, String originalQuestion, ClarificationQuestion clarification) {
        QueryAnalyzeResponse resp = new QueryAnalyzeResponse();
        resp.setStatus("CLARIFICATION_NEEDED");
        resp.setSessionId(sessionId);
        resp.setOriginalQuestion(originalQuestion);
        resp.setClarification(clarification);
        return resp;
    }

    public static QueryAnalyzeResponse sqlGenerated(String sessionId, String originalQuestion, String generatedSql, String explanation, QueryResultDto data) {
        QueryAnalyzeResponse resp = new QueryAnalyzeResponse();
        resp.setStatus("SQL_GENERATED");
        resp.setSessionId(sessionId);
        resp.setOriginalQuestion(originalQuestion);
        resp.setGeneratedSql(generatedSql);
        resp.setExplanation(explanation);
        resp.setData(data);
        return resp;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public String getSessionId() {
        return sessionId;
    }

    public void setSessionId(String sessionId) {
        this.sessionId = sessionId;
    }

    public String getOriginalQuestion() {
        return originalQuestion;
    }

    public void setOriginalQuestion(String originalQuestion) {
        this.originalQuestion = originalQuestion;
    }

    public ClarificationQuestion getClarification() {
        return clarification;
    }

    public void setClarification(ClarificationQuestion clarification) {
        this.clarification = clarification;
    }

    public String getGeneratedSql() {
        return generatedSql;
    }

    public void setGeneratedSql(String generatedSql) {
        this.generatedSql = generatedSql;
    }

    public String getExplanation() {
        return explanation;
    }

    public void setExplanation(String explanation) {
        this.explanation = explanation;
    }

    public QueryResultDto getData() {
        return data;
    }

    public void setData(QueryResultDto data) {
        this.data = data;
    }
}
