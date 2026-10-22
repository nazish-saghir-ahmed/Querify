package com.querify.model;

import jakarta.persistence.*;
import java.io.Serializable;
import java.time.LocalDateTime;

@Entity
@Table(name = "query_history")
public class QueryHistory implements Serializable {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "natural_query", nullable = false, columnDefinition = "TEXT")
    private String naturalQuery;

    @Column(name = "generated_sql", nullable = false, columnDefinition = "TEXT")
    private String generatedSql;

    @Column(name = "status", nullable = false, length = 30)
    private String status;

    @Column(name = "explanation", columnDefinition = "TEXT")
    private String explanation;

    @Column(name = "rows_returned")
    private Integer rowsReturned = 0;

    @Column(name = "execution_time_ms")
    private Long executionTimeMs = 0L;

    @Column(name = "clarification_details", columnDefinition = "TEXT")
    private String clarificationDetails;

    @Column(name = "created_at", insertable = false, updatable = false)
    private LocalDateTime createdAt;

    public QueryHistory() {
    }

    public QueryHistory(String naturalQuery, String generatedSql, String status, String explanation, Integer rowsReturned, Long executionTimeMs) {
        this.naturalQuery = naturalQuery;
        this.generatedSql = generatedSql;
        this.status = status;
        this.explanation = explanation;
        this.rowsReturned = rowsReturned;
        this.executionTimeMs = executionTimeMs;
    }

    @PrePersist
    public void onPrePersist() {
        if (this.createdAt == null) {
            this.createdAt = LocalDateTime.now();
        }
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getNaturalQuery() {
        return naturalQuery;
    }

    public void setNaturalQuery(String naturalQuery) {
        this.naturalQuery = naturalQuery;
    }

    public String getGeneratedSql() {
        return generatedSql;
    }

    public void setGeneratedSql(String generatedSql) {
        this.generatedSql = generatedSql;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public String getExplanation() {
        return explanation;
    }

    public void setExplanation(String explanation) {
        this.explanation = explanation;
    }

    public Integer getRowsReturned() {
        return rowsReturned;
    }

    public void setRowsReturned(Integer rowsReturned) {
        this.rowsReturned = rowsReturned;
    }

    public Long getExecutionTimeMs() {
        return executionTimeMs;
    }

    public void setExecutionTimeMs(Long executionTimeMs) {
        this.executionTimeMs = executionTimeMs;
    }

    public String getClarificationDetails() {
        return clarificationDetails;
    }

    public void setClarificationDetails(String clarificationDetails) {
        this.clarificationDetails = clarificationDetails;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }
}
