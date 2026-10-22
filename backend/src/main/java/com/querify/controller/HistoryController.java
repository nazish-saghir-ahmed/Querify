package com.querify.controller;

import com.querify.model.QueryHistory;
import com.querify.repository.QueryHistoryRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

/**
 * Controller for retrieving, inspecting, and managing executed query history.
 */
@RestController
@RequestMapping("/api/history")
public class HistoryController {

    private final QueryHistoryRepository queryHistoryRepository;

    public HistoryController(QueryHistoryRepository queryHistoryRepository) {
        this.queryHistoryRepository = queryHistoryRepository;
    }

    @GetMapping
    public ResponseEntity<List<QueryHistory>> getHistory() {
        return ResponseEntity.ok(queryHistoryRepository.findTop50ByOrderByCreatedAtDesc());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Map<String, Object>> deleteHistory(@PathVariable Long id) {
        if (queryHistoryRepository.existsById(id)) {
            queryHistoryRepository.deleteById(id);
            return ResponseEntity.ok(Map.of("status", "SUCCESS", "message", "Query history record deleted successfully."));
        }
        return ResponseEntity.notFound().build();
    }

    @DeleteMapping
    public ResponseEntity<Map<String, Object>> clearHistory() {
        queryHistoryRepository.deleteAll();
        return ResponseEntity.ok(Map.of("status", "SUCCESS", "message", "Query history cleared."));
    }
}
