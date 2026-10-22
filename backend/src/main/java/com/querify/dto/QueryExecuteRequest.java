package com.querify.dto;

import jakarta.validation.constraints.NotBlank;

public class QueryExecuteRequest {

    @NotBlank(message = "SQL query cannot be blank")
    private String sql;

    private String naturalQuery;
    private String explanation;

    public QueryExecuteRequest() {
    }

    public QueryExecuteRequest(String sql, String naturalQuery, String explanation) {
        this.sql = sql;
        this.naturalQuery = naturalQuery;
        this.explanation = explanation;
    }

    public String getSql() {
        return sql;
    }

    public void setSql(String sql) {
        this.sql = sql;
    }

    public String getNaturalQuery() {
        return naturalQuery;
    }

    public void setNaturalQuery(String naturalQuery) {
        this.naturalQuery = naturalQuery;
    }

    public String getExplanation() {
        return explanation;
    }

    public void setExplanation(String explanation) {
        this.explanation = explanation;
    }
}
