package com.querify.exception;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;

@RestControllerAdvice
public class GlobalExceptionHandler {

    private static final Logger log = LoggerFactory.getLogger(GlobalExceptionHandler.class);

    @ExceptionHandler(SqlSecurityException.class)
    public ResponseEntity<Map<String, Object>> handleSqlSecurity(SqlSecurityException ex) {
        log.warn("SQL Security violation blocked: {}", ex.getMessage());
        Map<String, Object> body = new HashMap<>();
        body.put("status", "SECURITY_VIOLATION");
        body.put("error", "Query Security Violation");
        body.put("message", ex.getMessage());
        body.put("timestamp", LocalDateTime.now());
        return ResponseEntity.status(HttpStatus.FORBIDDEN).body(body);
    }

    @ExceptionHandler(SqlExecutionException.class)
    public ResponseEntity<Map<String, Object>> handleSqlExecution(SqlExecutionException ex) {
        log.error("SQL Execution error: {}", ex.getMessage());
        Map<String, Object> body = new HashMap<>();
        body.put("status", "EXECUTION_ERROR");
        body.put("error", "Database Execution Error");
        body.put("message", ex.getMessage());
        body.put("timestamp", LocalDateTime.now());
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(body);
    }

    @ExceptionHandler(ClarificationException.class)
    public ResponseEntity<Map<String, Object>> handleClarification(ClarificationException ex) {
        log.warn("Clarification error: {}", ex.getMessage());
        Map<String, Object> body = new HashMap<>();
        body.put("status", "CLARIFICATION_ERROR");
        body.put("error", "Clarification Workflow Error");
        body.put("message", ex.getMessage());
        body.put("timestamp", LocalDateTime.now());
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(body);
    }

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<Map<String, Object>> handleValidation(MethodArgumentNotValidException ex) {
        Map<String, String> errors = new HashMap<>();
        for (FieldError fieldError : ex.getBindingResult().getFieldErrors()) {
            errors.put(fieldError.getField(), fieldError.getDefaultMessage());
        }
        Map<String, Object> body = new HashMap<>();
        body.put("status", "VALIDATION_FAILED");
        body.put("error", "Validation Failed");
        body.put("validationErrors", errors);
        body.put("timestamp", LocalDateTime.now());
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(body);
    }

    @ExceptionHandler(Exception.class)
    public ResponseEntity<Map<String, Object>> handleGeneric(Exception ex) {
        log.error("Unhandled server exception: ", ex);
        Map<String, Object> body = new HashMap<>();
        body.put("status", "SERVER_ERROR");
        body.put("error", "Internal Server Error");
        body.put("message", ex.getMessage() != null ? ex.getMessage() : "An unexpected server error occurred");
        body.put("timestamp", LocalDateTime.now());
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(body);
    }
}
