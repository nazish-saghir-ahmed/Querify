package com.querify.sql;

import com.querify.dto.ChartSuggestionDto;
import com.querify.dto.QueryResultDto;
import com.querify.exception.SqlExecutionException;
import com.querify.model.QueryHistory;
import com.querify.repository.QueryHistoryRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.sql.ResultSetMetaData;
import java.util.*;

/**
 * Service responsible for executing validated SQL queries safely,
 * collecting runtime performance metrics, deducing intelligent chart visualizations,
 * and saving audit history records.
 */
@Service
public class SqlExecutionService {

    private static final Logger log = LoggerFactory.getLogger(SqlExecutionService.class);

    private final JdbcTemplate jdbcTemplate;
    private final SqlValidator sqlValidator;
    private final QueryHistoryRepository queryHistoryRepository;

    @Value("${querify.query.timeout-seconds:5}")
    private int queryTimeoutSeconds = 5;

    public SqlExecutionService(JdbcTemplate jdbcTemplate, SqlValidator sqlValidator, QueryHistoryRepository queryHistoryRepository) {
        this.jdbcTemplate = jdbcTemplate;
        this.sqlValidator = sqlValidator;
        this.queryHistoryRepository = queryHistoryRepository;
    }

    /**
     * Executes the given SQL after validation, returns structured result with chart hints.
     */
    public QueryResultDto executeQuery(String rawSql, String naturalQuery, String explanation) {
        // 1. Structural security validation & sanitization
        String safeSql = sqlValidator.validateAndSanitize(rawSql);
        log.info("Executing safe SQL: {}", safeSql);

        long startTime = System.currentTimeMillis();
        List<String> columnNames = new ArrayList<>();
        List<Map<String, Object>> rows = new ArrayList<>();

        try {
            jdbcTemplate.setQueryTimeout(queryTimeoutSeconds);
            jdbcTemplate.query(safeSql, rs -> {
                ResultSetMetaData metaData = rs.getMetaData();
                int colCount = metaData.getColumnCount();

                if (columnNames.isEmpty()) {
                    for (int i = 1; i <= colCount; i++) {
                        String colLabel = metaData.getColumnLabel(i);
                        columnNames.add(colLabel != null && !colLabel.isEmpty() ? colLabel : metaData.getColumnName(i));
                    }
                }

                Map<String, Object> row = new LinkedHashMap<>();
                for (int i = 1; i <= colCount; i++) {
                    String col = columnNames.get(i - 1);
                    Object val = rs.getObject(i);
                    row.put(col, val);
                }
                rows.add(row);
            });

            long executionTimeMs = System.currentTimeMillis() - startTime;
            ChartSuggestionDto chartSuggestion = deduceChartSuggestion(columnNames, rows);

            // Persist to history
            saveHistory(naturalQuery != null ? naturalQuery : "Manual SQL Execution", safeSql, "SUCCESS", explanation, rows.size(), executionTimeMs);

            return QueryResultDto.success(columnNames, rows, executionTimeMs, safeSql, explanation, chartSuggestion);

        } catch (Exception e) {
            long executionTimeMs = System.currentTimeMillis() - startTime;
            log.error("Failed to execute SQL query '{}': {}", safeSql, e.getMessage());
            saveHistory(naturalQuery != null ? naturalQuery : "Manual SQL Execution", safeSql, "FAILED", e.getMessage(), 0, executionTimeMs);
            throw new SqlExecutionException("Database execution failed: " + e.getMessage(), e);
        }
    }

    /**
     * Inspects column names, row patterns, and data types to recommend an optimal chart type.
     */
    private ChartSuggestionDto deduceChartSuggestion(List<String> columns, List<Map<String, Object>> rows) {
        if (columns == null || columns.size() < 2 || rows == null || rows.isEmpty()) {
            return new ChartSuggestionDto("table", null, null, "Query Results");
        }

        String xColumn = null;
        String yColumn = null;

        // Find candidate for X-axis (dimension/entity/temporal)
        for (String col : columns) {
            String lower = col.toLowerCase(Locale.ROOT);
            if (lower.contains("name") || lower.contains("company") || lower.contains("model") || 
                lower.contains("category") || lower.contains("year") || lower.contains("area") || lower.contains("status")) {
                xColumn = col;
                break;
            }
        }
        if (xColumn == null) {
            xColumn = columns.get(0);
        }

        // Find candidate for Y-axis (metric/numeric)
        for (String col : columns) {
            if (!col.equalsIgnoreCase(xColumn)) {
                String lower = col.toLowerCase(Locale.ROOT);
                if (lower.contains("revenue") || lower.contains("profit") || lower.contains("score") || 
                    lower.contains("amount") || lower.contains("budget") || lower.contains("share") || 
                    lower.contains("growth") || lower.contains("cost") || lower.contains("percent") ||
                    lower.contains("count") || lower.contains("total") || lower.contains("avg")) {
                    yColumn = col;
                    break;
                }
            }
        }
        if (yColumn == null) {
            yColumn = columns.get(1);
        }

        // Determine chart type: line if time/year based; pie if market share / allocation; otherwise bar
        String chartType = "bar";
        String xLower = xColumn.toLowerCase(Locale.ROOT);
        String yLower = yColumn.toLowerCase(Locale.ROOT);

        if (xLower.contains("year") || xLower.contains("date")) {
            chartType = "line";
        } else if ((yLower.contains("share") || yLower.contains("percent") || yLower.contains("pie")) && rows.size() <= 8) {
            chartType = "pie";
        }

        String title = formatTitle(yColumn) + " by " + formatTitle(xColumn);
        return new ChartSuggestionDto(chartType, xColumn, yColumn, title);
    }

    private String formatTitle(String col) {
        if (col == null) return "";
        return col.replace("_", " ").substring(0, 1).toUpperCase(Locale.ROOT) + col.replace("_", " ").substring(1);
    }

    private void saveHistory(String naturalQuery, String sql, String status, String explanation, int rows, long timeMs) {
        try {
            QueryHistory history = new QueryHistory(naturalQuery, sql, status, explanation, rows, timeMs);
            queryHistoryRepository.save(history);
        } catch (Exception e) {
            log.warn("Could not save query history record: {}", e.getMessage());
        }
    }
}
