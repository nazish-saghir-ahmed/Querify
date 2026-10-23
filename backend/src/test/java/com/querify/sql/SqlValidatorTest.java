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
    @DisplayName("Should permit valid SELECT with single trailing semicolon")
    void shouldPermitValidSelectWithTrailingSemicolon() {
        String sql = "SELECT c.company_name, f.revenue_millions FROM companies c " +
                "JOIN financial_performance f ON c.company_id = f.company_id " +
                "WHERE f.fiscal_year = 2024 ORDER BY f.revenue_millions DESC LIMIT 10;";
        
        String sanitized = validator.validateAndSanitize(sql);
        assertNotNull(sanitized);
        assertTrue(sanitized.toUpperCase().startsWith("SELECT"));
    }

    @Test
    @DisplayName("Should permit valid SELECT without trailing semicolon and append LIMIT")
    void shouldAppendLimitWhenMissing() {
        String sql = "SELECT company_name, industry FROM companies WHERE country = 'USA'";
        String sanitized = validator.validateAndSanitize(sql);
        
        assertTrue(sanitized.toUpperCase().contains("LIMIT"));
    }

    @Test
    @DisplayName("Should permit semicolon inside string literals without false-positive rejection")
    void shouldPermitSemicolonInsideStringLiteral() {
        String sql = "SELECT company_name, industry FROM companies WHERE company_name = 'Acme; Inc';";
        String sanitized = validator.validateAndSanitize(sql);
        assertNotNull(sanitized);
        assertTrue(sanitized.contains("Acme; Inc"));
    }

    @Test
    @DisplayName("Should permit semicolon inside SQL comments without false-positive rejection")
    void shouldPermitSemicolonInsideComment() {
        String sql = "SELECT company_name FROM companies /* note: check; here */ WHERE country = 'USA';";
        String sanitized = validator.validateAndSanitize(sql);
        assertNotNull(sanitized);
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
    @DisplayName("Should reject multiple SQL statements (statement chaining injection)")
    void shouldRejectMultipleStatements() {
        String sql = "SELECT * FROM companies; DROP TABLE ai_models;";
        assertThrows(SqlSecurityException.class, () -> validator.validateAndSanitize(sql));
    }

    @Test
    @DisplayName("Should reject multi-statement injection even with string literal preceding it")
    void shouldRejectMultiStatementWithQuotes() {
        String sql = "SELECT * FROM companies WHERE company_name = 'OpenAI'; DROP TABLE companies;";
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

    @Test
    @DisplayName("Should reject sleep and benchmark time-based SQL injection constructs")
    void shouldRejectTimeBasedInjection() {
        String sql = "SELECT company_name FROM companies WHERE company_id = 1 AND sleep(5);";
        assertThrows(SqlSecurityException.class, () -> validator.validateAndSanitize(sql));
    }

    @Test
    @DisplayName("Should reject empty or null SQL query")
    void shouldRejectEmptyQuery() {
        assertThrows(SqlSecurityException.class, () -> validator.validateAndSanitize("   "));
        assertThrows(SqlSecurityException.class, () -> validator.validateAndSanitize(null));
    }
}
