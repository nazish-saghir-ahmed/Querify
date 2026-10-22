package com.querify.ai;

public class GeneratedSqlResult {

    private String sql;
    private String explanation;

    public GeneratedSqlResult() {
    }

    public GeneratedSqlResult(String sql, String explanation) {
        this.sql = sql;
        this.explanation = explanation;
    }

    public String getSql() {
        return sql;
    }

    public void setSql(String sql) {
        this.sql = sql;
    }

    public String getExplanation() {
        return explanation;
    }

    public void setExplanation(String explanation) {
        this.explanation = explanation;
    }
}
