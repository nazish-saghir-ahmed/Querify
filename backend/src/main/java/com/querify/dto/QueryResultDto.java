package com.querify.dto;

import java.util.List;
import java.util.Map;

public class QueryResultDto {

    private String status; // "SUCCESS" or "ERROR"
    private List<String> columns;
    private List<Map<String, Object>> rows;
    private int rowCount;
    private long executionTimeMs;
    private String sql;
    private String explanation;
    private ChartSuggestionDto chartSuggestion;
    private String errorMessage;

    public QueryResultDto() {
    }

    public static QueryResultDto success(List<String> columns, List<Map<String, Object>> rows, 
                                         long executionTimeMs, String sql, String explanation, 
                                         ChartSuggestionDto chartSuggestion) {
        QueryResultDto dto = new QueryResultDto();
        dto.setStatus("SUCCESS");
        dto.setColumns(columns);
        dto.setRows(rows);
        dto.setRowCount(rows != null ? rows.size() : 0);
        dto.setExecutionTimeMs(executionTimeMs);
        dto.setSql(sql);
        dto.setExplanation(explanation);
        dto.setChartSuggestion(chartSuggestion);
        return dto;
    }

    public static QueryResultDto error(String errorMessage, String sql) {
        QueryResultDto dto = new QueryResultDto();
        dto.setStatus("ERROR");
        dto.setErrorMessage(errorMessage);
        dto.setSql(sql);
        return dto;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public List<String> getColumns() {
        return columns;
    }

    public void setColumns(List<String> columns) {
        this.columns = columns;
    }

    public List<Map<String, Object>> getRows() {
        return rows;
    }

    public void setRows(List<Map<String, Object>> rows) {
        this.rows = rows;
    }

    public int getRowCount() {
        return rowCount;
    }

    public void setRowCount(int rowCount) {
        this.rowCount = rowCount;
    }

    public long getExecutionTimeMs() {
        return executionTimeMs;
    }

    public void setExecutionTimeMs(long executionTimeMs) {
        this.executionTimeMs = executionTimeMs;
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

    public ChartSuggestionDto getChartSuggestion() {
        return chartSuggestion;
    }

    public void setChartSuggestion(ChartSuggestionDto chartSuggestion) {
        this.chartSuggestion = chartSuggestion;
    }

    public String getErrorMessage() {
        return errorMessage;
    }

    public void setErrorMessage(String errorMessage) {
        this.errorMessage = errorMessage;
    }
}
