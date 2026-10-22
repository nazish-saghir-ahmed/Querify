package com.querify;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.querify.dto.QueryAnalyzeRequest;
import com.querify.dto.QueryClarifyRequest;
import com.querify.dto.QueryExecuteRequest;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.MvcResult;

import static org.hamcrest.Matchers.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("test")
class QuerifyIntegrationTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @Test
    @DisplayName("GET /api/health should return UP status and database connection")
    void testHealthEndpoint() throws Exception {
        mockMvc.perform(get("/api/health"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.status", is("UP")))
                .andExpect(jsonPath("$.databaseConnected", is(true)))
                .andExpect(jsonPath("$.aiMode", is("demo")));
    }

    @Test
    @DisplayName("GET /api/database/schema should return domain table definitions")
    void testSchemaEndpoint() throws Exception {
        mockMvc.perform(get("/api/database/schema"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$", hasSize(6)))
                .andExpect(jsonPath("$[0].tableName", is("companies")));
    }

    @Test
    @DisplayName("GET /api/database/tables should list tables with row counts")
    void testTablesEndpoint() throws Exception {
        mockMvc.perform(get("/api/database/tables"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$", not(empty())));
    }

    @Test
    @DisplayName("End-to-End: Ambiguous question -> Clarification needed -> User clarifies -> Data returned")
    void testClarificationFlowEndToEnd() throws Exception {
        // Step 1: Send ambiguous question
        QueryAnalyzeRequest analyzeReq = new QueryAnalyzeRequest("Show me the best performing AI companies", null);
        MvcResult analyzeResult = mockMvc.perform(post("/api/query/analyze")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(analyzeReq)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.status", is("CLARIFICATION_NEEDED")))
                .andExpect(jsonPath("$.sessionId", notNullValue()))
                .andExpect(jsonPath("$.clarification.questionId", is("clarify_best_performing")))
                .andReturn();

        String responseBody = analyzeResult.getResponse().getContentAsString();
        String sessionId = objectMapper.readTree(responseBody).path("sessionId").asText();

        // Step 2: User responds to clarification with "opt_highest_rev"
        QueryClarifyRequest clarifyReq = new QueryClarifyRequest(sessionId, "opt_highest_rev", null);
        mockMvc.perform(post("/api/query/clarify")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(clarifyReq)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.status", is("SQL_GENERATED")))
                .andExpect(jsonPath("$.generatedSql", containsString("revenue_millions")))
                .andExpect(jsonPath("$.data.status", is("SUCCESS")))
                .andExpect(jsonPath("$.data.rowCount", greaterThan(0)))
                .andExpect(jsonPath("$.data.rows[0].company_name", notNullValue()));
    }

    @Test
    @DisplayName("End-to-End: Specific question directly generates and executes SQL")
    void testDirectQuestionFlow() throws Exception {
        QueryAnalyzeRequest analyzeReq = new QueryAnalyzeRequest("Which AI companies have the highest revenue?", null);
        mockMvc.perform(post("/api/query/analyze")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(analyzeReq)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.status", is("SQL_GENERATED")))
                .andExpect(jsonPath("$.data.status", is("SUCCESS")))
                .andExpect(jsonPath("$.data.rowCount", greaterThan(0)));
    }

    @Test
    @DisplayName("Security: Malicious SQL execution must be blocked with HTTP 403")
    void testSecurityEnforcement() throws Exception {
        QueryExecuteRequest malicious = new QueryExecuteRequest("DROP TABLE companies;", "Delete tables", "Hacking attempt");
        mockMvc.perform(post("/api/query/execute")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(malicious)))
                .andExpect(status().isForbidden())
                .andExpect(jsonPath("$.status", is("SECURITY_VIOLATION")));
    }
}
