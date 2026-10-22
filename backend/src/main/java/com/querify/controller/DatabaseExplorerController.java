package com.querify.controller;

import com.querify.dto.ColumnSchemaDto;
import com.querify.dto.TableSchemaDto;
import com.querify.exception.SqlSecurityException;
import org.springframework.http.ResponseEntity;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.web.bind.annotation.*;

import java.util.*;

/**
 * Controller exposing real database metadata and live sample rows
 * for the Frontend Database Explorer page.
 */
@RestController
@RequestMapping("/api/database")
public class DatabaseExplorerController {

    private final JdbcTemplate jdbcTemplate;

    private static final Set<String> ALLOWED_TABLES = new HashSet<>(Arrays.asList(
            "companies",
            "ai_models",
            "financial_performance",
            "ai_investments",
            "research_projects",
            "market_performance"
    ));

    public DatabaseExplorerController(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    /**
     * Returns full schema definitions and relationships for the 6 domain tables.
     */
    @GetMapping("/schema")
    public ResponseEntity<List<TableSchemaDto>> getSchema() {
        List<TableSchemaDto> schemaList = new ArrayList<>();

        // 1. companies
        schemaList.add(new TableSchemaDto(
                "companies",
                "Stores AI enterprises, frontier research labs, and technology corporations.",
                Arrays.asList(
                        new ColumnSchemaDto("company_id", "INT", false, true, false, "Unique company primary key"),
                        new ColumnSchemaDto("company_name", "VARCHAR(100)", false, false, false, "Official company or laboratory name"),
                        new ColumnSchemaDto("industry", "VARCHAR(100)", false, false, false, "Primary market sector or tech specialization"),
                        new ColumnSchemaDto("country", "VARCHAR(50)", false, false, false, "Country of legal incorporation"),
                        new ColumnSchemaDto("founded_year", "INT", false, false, false, "Year established"),
                        new ColumnSchemaDto("company_type", "VARCHAR(50)", false, false, false, "Public, Private AI Lab, Enterprise Tech"),
                        new ColumnSchemaDto("headquarters_city", "VARCHAR(100)", false, false, false, "Primary HQ city")
                ),
                Collections.emptyList()
        ));

        // 2. ai_models
        schemaList.add(new TableSchemaDto(
                "ai_models",
                "Catalog of prominent artificial intelligence models and benchmark evaluations.",
                Arrays.asList(
                        new ColumnSchemaDto("model_id", "INT", false, true, false, "Unique model primary key"),
                        new ColumnSchemaDto("company_id", "INT", false, false, true, "Foreign key to companies.company_id"),
                        new ColumnSchemaDto("model_name", "VARCHAR(100)", false, false, false, "Name of AI model/system"),
                        new ColumnSchemaDto("model_category", "VARCHAR(50)", false, false, false, "LLM, Multimodal, Vision, Reasoning"),
                        new ColumnSchemaDto("release_year", "INT", false, false, false, "Official public launch year"),
                        new ColumnSchemaDto("parameter_count_billions", "DECIMAL(10,2)", true, false, false, "Total model parameter size in billions"),
                        new ColumnSchemaDto("performance_score", "DECIMAL(5,2)", false, false, false, "Synthetic standardized benchmark score (0-100)")
                ),
                List.of("FOREIGN KEY (company_id) REFERENCES companies(company_id)")
        ));

        // 3. financial_performance
        schemaList.add(new TableSchemaDto(
                "financial_performance",
                "Annual balance sheet, top-line revenue, and net profit records (Millions USD).",
                Arrays.asList(
                        new ColumnSchemaDto("performance_id", "INT", false, true, false, "Unique record primary key"),
                        new ColumnSchemaDto("company_id", "INT", false, false, true, "Foreign key to companies.company_id"),
                        new ColumnSchemaDto("fiscal_year", "INT", false, false, false, "Reporting fiscal year (2022-2024)"),
                        new ColumnSchemaDto("revenue_millions", "DECIMAL(12,2)", false, false, false, "Gross revenue in millions USD"),
                        new ColumnSchemaDto("profit_millions", "DECIMAL(12,2)", false, false, false, "Net profit after taxes in millions USD"),
                        new ColumnSchemaDto("operating_cost_millions", "DECIMAL(12,2)", false, false, false, "Operational & compute expenses in millions USD"),
                        new ColumnSchemaDto("revenue_growth_percent", "DECIMAL(6,2)", false, false, false, "Year-over-year revenue percentage growth")
                ),
                List.of("FOREIGN KEY (company_id) REFERENCES companies(company_id)")
        ));

        // 4. ai_investments
        schemaList.add(new TableSchemaDto(
                "ai_investments",
                "Capital investments allocated to AI compute clusters, research, and chips.",
                Arrays.asList(
                        new ColumnSchemaDto("investment_id", "INT", false, true, false, "Unique investment primary key"),
                        new ColumnSchemaDto("company_id", "INT", false, false, true, "Foreign key to companies.company_id"),
                        new ColumnSchemaDto("investment_year", "INT", false, false, false, "Year of capital deployment"),
                        new ColumnSchemaDto("investment_amount_millions", "DECIMAL(12,2)", false, false, false, "Capital amount deployed in millions USD"),
                        new ColumnSchemaDto("investment_category", "VARCHAR(100)", false, false, false, "Compute Infrastructure, Chips, AI Safety"),
                        new ColumnSchemaDto("estimated_return_percent", "DECIMAL(6,2)", false, false, false, "Projected ROI percentage")
                ),
                List.of("FOREIGN KEY (company_id) REFERENCES companies(company_id)")
        ));

        // 5. research_projects
        schemaList.add(new TableSchemaDto(
                "research_projects",
                "Specialized frontier R&D initiatives, robotics, and scientific explorations.",
                Arrays.asList(
                        new ColumnSchemaDto("project_id", "INT", false, true, false, "Unique project primary key"),
                        new ColumnSchemaDto("company_id", "INT", false, false, true, "Foreign key to companies.company_id"),
                        new ColumnSchemaDto("project_name", "VARCHAR(150)", false, false, false, "Internal project or code name"),
                        new ColumnSchemaDto("research_area", "VARCHAR(100)", false, false, false, "Robotics, Reasoning, Drug Discovery, Safety"),
                        new ColumnSchemaDto("budget_millions", "DECIMAL(10,2)", false, false, false, "Allocated project budget in millions USD"),
                        new ColumnSchemaDto("project_status", "VARCHAR(50)", false, false, false, "Active, Completed, Testing"),
                        new ColumnSchemaDto("start_date", "DATE", false, false, false, "Formal project inception date")
                ),
                List.of("FOREIGN KEY (company_id) REFERENCES companies(company_id)")
        ));

        // 6. market_performance
        schemaList.add(new TableSchemaDto(
                "market_performance",
                "Market dominance, adoption velocity, and composite health indexes.",
                Arrays.asList(
                        new ColumnSchemaDto("market_id", "INT", false, true, false, "Unique market metric primary key"),
                        new ColumnSchemaDto("company_id", "INT", false, false, true, "Foreign key to companies.company_id"),
                        new ColumnSchemaDto("fiscal_year", "INT", false, false, false, "Fiscal year evaluated"),
                        new ColumnSchemaDto("market_share_percent", "DECIMAL(5,2)", false, false, false, "Estimated global/sector market share percentage"),
                        new ColumnSchemaDto("customer_growth_percent", "DECIMAL(6,2)", false, false, false, "Customer/active user percentage growth"),
                        new ColumnSchemaDto("performance_index", "DECIMAL(5,2)", false, false, false, "Composite health and agility score (0-100)")
                ),
                List.of("FOREIGN KEY (company_id) REFERENCES companies(company_id)")
        ));

        return ResponseEntity.ok(schemaList);
    }

    /**
     * Lists all domain tables and live row counts.
     */
    @GetMapping("/tables")
    public ResponseEntity<List<Map<String, Object>>> getTables() {
        List<Map<String, Object>> result = new ArrayList<>();
        for (String table : ALLOWED_TABLES) {
            Map<String, Object> item = new HashMap<>();
            item.put("name", table);
            try {
                Integer count = jdbcTemplate.queryForObject("SELECT COUNT(*) FROM " + table, Integer.class);
                item.put("rowCount", count != null ? count : 0);
            } catch (Exception e) {
                item.put("rowCount", 0);
            }
            result.add(item);
        }
        return ResponseEntity.ok(result);
    }

    /**
     * Returns top 10 sample records from an approved table.
     */
    @GetMapping("/tables/{tableName}/sample")
    public ResponseEntity<Map<String, Object>> getTableSample(@PathVariable String tableName) {
        String cleanName = tableName.trim().toLowerCase(Locale.ROOT);
        if (!ALLOWED_TABLES.contains(cleanName)) {
            throw new SqlSecurityException("Table '" + tableName + "' is not an approved domain table.");
        }

        List<Map<String, Object>> rows = jdbcTemplate.queryForList("SELECT * FROM " + cleanName + " LIMIT 10");
        List<String> columns = rows.isEmpty() ? Collections.emptyList() : new ArrayList<>(rows.get(0).keySet());

        Map<String, Object> response = new HashMap<>();
        response.put("tableName", cleanName);
        response.put("columns", columns);
        response.put("rows", rows);
        response.put("rowCount", rows.size());

        return ResponseEntity.ok(response);
    }
}
