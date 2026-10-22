package com.querify.sql;

import com.querify.exception.SqlSecurityException;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.*;

class SqlValidatorTest {

    private SqlValidator validator;

    @BeforeEach
    void setUp() {
        validator = new SqlValidator();
    }

    @Test
    @DisplayName("Should permit valid SELECT with JOIN and ORDER BY")
    void shouldPermitValidSelect() {
        String sql = "SELECT c.company_name, f.revenue_millions FROM companies c " +
                "JOIN financial_performance f ON c.company_id = f.company_id " +
                "WHERE f.fiscal_year = 2024 ORDER BY f.revenue_millions DESC LIMIT 10;";
        
        String sanitized = validator.validateAndSanitize(sql);
        assertNotNull(sanitized);
        assertTrue(sanitized.toUpperCase().startsWith("SELECT"));
    }

    @Test
    @DisplayName("Should append safe LIMIT if query lacks LIMIT clause")
    void shouldAppendLimitWhenMissing() {
        String sql = "SELECT company_name, industry FROM companies WHERE country = 'USA'";
        String sanitized = validator.validateAndSanitize(sql);
        
        assertTrue(sanitized.toUpperCase().contains("LIMIT"));
    }

    @Test
    @DisplayName("Should reject destructive DROP TABLE statement")
    void shouldRejectDropTable() {
        String sql = "DROP TABLE companies;";
        assertThrows(SqlSecurityException.class, () -> validator.validateAndSanitize(sql));
    }

    @Test
    @DisplayName("Should reject destructive DELETE statement")
    void shouldRejectDelete() {
        String sql = "DELETE FROM companies WHERE company_id = 1;";
        assertThrows(SqlSecurityException.class, () -> validator.validateAndSanitize(sql));
    }

    @Test
    @DisplayName("Should reject INSERT statement")
    void shouldRejectInsert() {
        String sql = "INSERT INTO companies (company_name) VALUES ('HackerAI');";
        assertThrows(SqlSecurityException.class, () -> validator.validateAndSanitize(sql));
    }

    @Test
    @DisplayName("Should reject UPDATE statement")
    void shouldRejectUpdate() {
        String sql = "UPDATE companies SET company_name = 'Compromised' WHERE company_id = 1;";
        assertThrows(SqlSecurityException.class, () -> validator.validateAndSanitize(sql));
    }

    @Test
    @DisplayName("Should reject multiple SQL statements (SQL injection attempt)")
    void shouldRejectMultipleStatements() {
        String sql = "SELECT * FROM companies; DROP TABLE ai_models;";
        assertThrows(SqlSecurityException.class, () -> validator.validateAndSanitize(sql));
    }

    @Test
    @DisplayName("Should reject access to system catalog tables like information_schema")
    void shouldRejectSystemTables() {
        String sql = "SELECT table_name FROM information_schema.tables WHERE table_schema = 'querify_db';";
        assertThrows(SqlSecurityException.class, () -> validator.validateAndSanitize(sql));
    }

    @Test
    @DisplayName("Should reject access to unauthorized tables")
    void shouldRejectUnauthorizedTables() {
        String sql = "SELECT * FROM user_passwords;";
        assertThrows(SqlSecurityException.class, () -> validator.validateAndSanitize(sql));
    }
}
