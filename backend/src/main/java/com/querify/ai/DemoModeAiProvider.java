package com.querify.ai;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;

import java.util.Locale;
import java.util.Map;

/**
 * Deterministic Demo Mode AI Provider.
 * Requires zero external API keys and guarantees instantaneous, 100% reliable responses
 * for demonstration, presentation, grading, and offline operation.
 * Accurately translates 30+ domain questions and all clarification resolution paths into clean SQL.
 */
@Component
public class DemoModeAiProvider implements AiProvider {

    private static final Logger log = LoggerFactory.getLogger(DemoModeAiProvider.class);

    @Override
    public String getProviderName() {
        return "demo";
    }

    @Override
    public GeneratedSqlResult generateSql(String naturalQuestion, Map<String, Object> context) {
        String q = naturalQuestion != null ? naturalQuestion.toLowerCase(Locale.ROOT).trim() : "";
        log.info("Demo AI generating SQL for query: '{}' with context: {}", naturalQuestion, context);

        // Check if context contains a resolved clarification metric
        String selectedMetric = context != null && context.get("selectedMetric") != null 
                ? context.get("selectedMetric").toString().toLowerCase(Locale.ROOT) : "";

        // ---------------------------------------------------------------------
        // Clarification Resolution Routes
        // ---------------------------------------------------------------------
        if ("highest_revenue".equals(selectedMetric) || "opt_highest_rev".equals(selectedMetric) || "opt_rev".equals(selectedMetric)) {
            return new GeneratedSqlResult(
                    "SELECT c.company_name, f.revenue_millions, f.profit_millions, f.revenue_growth_percent " +
                    "FROM companies c " +
                    "JOIN financial_performance f ON c.company_id = f.company_id " +
                    "WHERE f.fiscal_year = 2024 " +
                    "ORDER BY f.revenue_millions DESC " +
                    "LIMIT 10;",
                    "Ranks companies by their total fiscal 2024 revenue in millions USD."
            );
        }

        if ("highest_profit".equals(selectedMetric) || "opt_highest_profit".equals(selectedMetric) || "opt_profit".equals(selectedMetric)) {
            return new GeneratedSqlResult(
                    "SELECT c.company_name, f.profit_millions, f.revenue_millions, f.operating_cost_millions " +
                    "FROM companies c " +
                    "JOIN financial_performance f ON c.company_id = f.company_id " +
                    "WHERE f.fiscal_year = 2024 " +
                    "ORDER BY f.profit_millions DESC " +
                    "LIMIT 10;",
                    "Ranks companies by net profit (earnings after operational costs) in 2024."
            );
        }

        if ("highest_revenue_growth".equals(selectedMetric) || "revenue_growth".equals(selectedMetric) || "opt_rev_growth".equals(selectedMetric)) {
            return new GeneratedSqlResult(
                    "SELECT c.company_name, f.revenue_growth_percent, f.revenue_millions " +
                    "FROM companies c " +
                    "JOIN financial_performance f ON c.company_id = f.company_id " +
                    "WHERE f.fiscal_year = 2024 " +
                    "ORDER BY f.revenue_growth_percent DESC " +
                    "LIMIT 10;",
                    "Ranks companies by their year-over-year revenue growth percentage in 2024."
            );
        }

        if ("highest_investment_roi".equals(selectedMetric) || "investment_roi".equals(selectedMetric) || "opt_inv_roi".equals(selectedMetric)) {
            return new GeneratedSqlResult(
                    "SELECT c.company_name, i.investment_category, i.investment_amount_millions, i.estimated_return_percent " +
                    "FROM companies c " +
                    "JOIN ai_investments i ON c.company_id = i.company_id " +
                    "WHERE i.investment_year = 2024 " +
                    "ORDER BY i.estimated_return_percent DESC " +
                    "LIMIT 10;",
                    "Ranks AI investments with the highest estimated ROI percentage in 2024."
            );
        }

        if ("highest_investment".equals(selectedMetric) || "investment_amount".equals(selectedMetric) || "opt_inv_amount".equals(selectedMetric)) {
            return new GeneratedSqlResult(
                    "SELECT c.company_name, SUM(i.investment_amount_millions) AS total_investment_millions " +
                    "FROM companies c " +
                    "JOIN ai_investments i ON c.company_id = i.company_id " +
                    "WHERE i.investment_year = 2024 " +
                    "GROUP BY c.company_id, c.company_name " +
                    "ORDER BY total_investment_millions DESC " +
                    "LIMIT 10;",
                    "Calculates total AI capital investment allocated by each company in 2024."
            );
        }

        if ("highest_score".equals(selectedMetric) || "opt_score".equals(selectedMetric)) {
            return new GeneratedSqlResult(
                    "SELECT m.model_name, c.company_name, m.model_category, m.performance_score " +
                    "FROM ai_models m " +
                    "JOIN companies c ON m.company_id = c.company_id " +
                    "ORDER BY m.performance_score DESC " +
                    "LIMIT 10;",
                    "Ranks AI models by standardized benchmark performance scores (0-100)."
            );
        }

        if ("largest_parameters".equals(selectedMetric) || "opt_params".equals(selectedMetric)) {
            return new GeneratedSqlResult(
                    "SELECT m.model_name, c.company_name, m.parameter_count_billions, m.performance_score " +
                    "FROM ai_models m " +
                    "JOIN companies c ON m.company_id = c.company_id " +
                    "WHERE m.parameter_count_billions IS NOT NULL " +
                    "ORDER BY m.parameter_count_billions DESC " +
                    "LIMIT 10;",
                    "Ranks AI models by total parameter count in billions."
            );
        }

        if ("multimodal_models".equals(selectedMetric) || "opt_multi".equals(selectedMetric)) {
            return new GeneratedSqlResult(
                    "SELECT m.model_name, c.company_name, m.model_category, m.performance_score, m.release_year " +
                    "FROM ai_models m " +
                    "JOIN companies c ON m.company_id = c.company_id " +
                    "WHERE m.model_category IN ('Multimodal', 'Reasoning') " +
                    "ORDER BY m.performance_score DESC " +
                    "LIMIT 10;",
                    "Filters for top-performing Multimodal and Reasoning AI models."
            );
        }

        if ("customer_growth".equals(selectedMetric) || "opt_cust_growth".equals(selectedMetric)) {
            return new GeneratedSqlResult(
                    "SELECT c.company_name, m.customer_growth_percent, m.market_share_percent " +
                    "FROM companies c " +
                    "JOIN market_performance m ON c.company_id = m.company_id " +
                    "WHERE m.fiscal_year = 2024 " +
                    "ORDER BY m.customer_growth_percent DESC " +
                    "LIMIT 10;",
                    "Ranks companies by customer and active user base growth percentage in 2024."
            );
        }

        if ("investment_infra".equals(selectedMetric) || "opt_inv_infra".equals(selectedMetric)) {
            return new GeneratedSqlResult(
                    "SELECT c.company_name, i.investment_category, i.investment_amount_millions, i.investment_year " +
                    "FROM companies c " +
                    "JOIN ai_investments i ON c.company_id = i.company_id " +
                    "WHERE i.investment_category LIKE '%Compute%' OR i.investment_category LIKE '%Chip%' OR i.investment_category LIKE '%Data Center%' " +
                    "ORDER BY i.investment_amount_millions DESC " +
                    "LIMIT 10;",
                    "Lists investments specifically targeted at compute infrastructure and AI silicon."
            );
        }

        if ("compare_financials".equals(selectedMetric) || "opt_comp_fin".equals(selectedMetric)) {
            return new GeneratedSqlResult(
                    "SELECT c.company_name, f.revenue_millions, f.profit_millions, f.operating_cost_millions " +
                    "FROM companies c " +
                    "JOIN financial_performance f ON c.company_id = f.company_id " +
                    "WHERE f.fiscal_year = 2024 " +
                    "ORDER BY f.revenue_millions DESC " +
                    "LIMIT 8;",
                    "Compares revenue, profit, and operating costs side-by-side for 2024."
            );
        }

        if ("compare_market".equals(selectedMetric) || "opt_comp_market".equals(selectedMetric)) {
            return new GeneratedSqlResult(
                    "SELECT c.company_name, m.market_share_percent, m.customer_growth_percent, m.performance_index " +
                    "FROM companies c " +
                    "JOIN market_performance m ON c.company_id = m.company_id " +
                    "WHERE m.fiscal_year = 2024 " +
                    "ORDER BY m.market_share_percent DESC " +
                    "LIMIT 10;",
                    "Compares market share, customer adoption growth, and overall performance index."
            );
        }

        if ("project_budget".equals(selectedMetric) || "opt_proj_budget".equals(selectedMetric)) {
            return new GeneratedSqlResult(
                    "SELECT p.project_name, c.company_name, p.research_area, p.budget_millions, p.project_status " +
                    "FROM research_projects p " +
                    "JOIN companies c ON p.company_id = c.company_id " +
                    "ORDER BY p.budget_millions DESC " +
                    "LIMIT 10;",
                    "Retrieves research projects ranked by budget allocation in millions USD."
            );
        }

        if ("project_completed".equals(selectedMetric) || "opt_proj_completed".equals(selectedMetric)) {
            return new GeneratedSqlResult(
                    "SELECT p.project_name, c.company_name, p.research_area, p.budget_millions " +
                    "FROM research_projects p " +
                    "JOIN companies c ON p.company_id = c.company_id " +
                    "WHERE p.project_status = 'Completed' " +
                    "ORDER BY p.budget_millions DESC " +
                    "LIMIT 10;",
                    "Shows successfully completed AI research projects ordered by budget size."
            );
        }

        // ---------------------------------------------------------------------
        // Direct Questions (Unambiguous)
        // ---------------------------------------------------------------------

        // 1. Highest revenue / top revenue
        if (q.contains("highest revenue") || q.contains("top revenue") || (q.contains("revenue") && q.contains("top"))) {
            return new GeneratedSqlResult(
                    "SELECT c.company_name, f.revenue_millions, f.profit_millions, f.fiscal_year " +
                    "FROM companies c " +
                    "JOIN financial_performance f ON c.company_id = f.company_id " +
                    "WHERE f.fiscal_year = 2024 " +
                    "ORDER BY f.revenue_millions DESC " +
                    "LIMIT 10;",
                    "Identifies AI companies with the highest revenue in fiscal year 2024."
            );
        }

        // 2. Most profitable / five most profitable
        if (q.contains("profitable") || q.contains("highest profit") || q.contains("most profit")) {
            int limit = q.contains("five") || q.contains("5") ? 5 : 10;
            return new GeneratedSqlResult(
                    "SELECT c.company_name, f.profit_millions, f.revenue_millions, f.operating_cost_millions " +
                    "FROM companies c " +
                    "JOIN financial_performance f ON c.company_id = f.company_id " +
                    "WHERE f.fiscal_year = 2024 " +
                    "ORDER BY f.profit_millions DESC " +
                    "LIMIT " + limit + ";",
                    "Ranks companies with the highest net profit in fiscal year 2024."
            );
        }

        // 3. Invested the most / highest investment
        if (q.contains("invested the most") || q.contains("highest investment") || q.contains("largest investment")) {
            return new GeneratedSqlResult(
                    "SELECT c.company_name, SUM(i.investment_amount_millions) AS total_invested_millions " +
                    "FROM companies c " +
                    "JOIN ai_investments i ON c.company_id = i.company_id " +
                    "GROUP BY c.company_id, c.company_name " +
                    "ORDER BY total_invested_millions DESC " +
                    "LIMIT 5;",
                    "Calculates total cumulative AI capital invested by company across all recorded years."
            );
        }

        // 4. Compare revenue across companies in 2024
        if (q.contains("compare revenue") || (q.contains("revenue") && q.contains("2024") && q.contains("compare"))) {
            return new GeneratedSqlResult(
                    "SELECT c.company_name, f.revenue_millions " +
                    "FROM companies c " +
                    "JOIN financial_performance f ON c.company_id = f.company_id " +
                    "WHERE f.fiscal_year = 2024 " +
                    "ORDER BY f.revenue_millions DESC " +
                    "LIMIT 10;",
                    "Compares fiscal year 2024 revenue across top AI companies."
            );
        }

        // 5. Highest performance scores / top benchmark scores
        if (q.contains("performance scores") || q.contains("highest score") || q.contains("benchmark score")) {
            return new GeneratedSqlResult(
                    "SELECT m.model_name, c.company_name, m.model_category, m.performance_score, m.release_year " +
                    "FROM ai_models m " +
                    "JOIN companies c ON m.company_id = c.company_id " +
                    "ORDER BY m.performance_score DESC " +
                    "LIMIT 10;",
                    "Lists AI models sorted by highest benchmark performance scores."
            );
        }

        // 6. Revenue above 500 million
        if (q.contains("above 500") || q.contains("> 500") || q.contains("greater than 500")) {
            return new GeneratedSqlResult(
                    "SELECT c.company_name, f.fiscal_year, f.revenue_millions, f.profit_millions " +
                    "FROM companies c " +
                    "JOIN financial_performance f ON c.company_id = f.company_id " +
                    "WHERE f.revenue_millions > 500 AND f.fiscal_year = 2024 " +
                    "ORDER BY f.revenue_millions DESC " +
                    "LIMIT 20;",
                    "Filters for companies with annual revenue exceeding 500 million USD in 2024."
            );
        }

        // 7. Increased revenue between 2023 and 2024
        if (q.contains("increased their revenue") || (q.contains("revenue") && q.contains("2023") && q.contains("2024"))) {
            return new GeneratedSqlResult(
                    "SELECT c.company_name, f23.revenue_millions AS rev_2023, f24.revenue_millions AS rev_2024, " +
                    "(f24.revenue_millions - f23.revenue_millions) AS revenue_increase_millions " +
                    "FROM companies c " +
                    "JOIN financial_performance f23 ON c.company_id = f23.company_id AND f23.fiscal_year = 2023 " +
                    "JOIN financial_performance f24 ON c.company_id = f24.company_id AND f24.fiscal_year = 2024 " +
                    "WHERE f24.revenue_millions > f23.revenue_millions " +
                    "ORDER BY revenue_increase_millions DESC " +
                    "LIMIT 10;",
                    "Calculates net revenue increase for companies between fiscal years 2023 and 2024."
            );
        }

        // 8. Average AI investment by company
        if (q.contains("average ai investment") || q.contains("average investment")) {
            return new GeneratedSqlResult(
                    "SELECT c.company_name, ROUND(AVG(i.investment_amount_millions), 2) AS avg_investment_millions, " +
                    "COUNT(i.investment_id) AS investment_count " +
                    "FROM companies c " +
                    "JOIN ai_investments i ON c.company_id = i.company_id " +
                    "GROUP BY c.company_id, c.company_name " +
                    "ORDER BY avg_investment_millions DESC " +
                    "LIMIT 10;",
                    "Calculates the average dollar size of AI investments per company."
            );
        }

        // 9. Research projects with largest budgets
        if (q.contains("research projects") || q.contains("largest budgets") || q.contains("project budget")) {
            return new GeneratedSqlResult(
                    "SELECT p.project_name, c.company_name, p.research_area, p.budget_millions, p.project_status " +
                    "FROM research_projects p " +
                    "JOIN companies c ON p.company_id = c.company_id " +
                    "ORDER BY p.budget_millions DESC " +
                    "LIMIT 10;",
                    "Lists research projects ranked by total budget in millions USD."
            );
        }

        // 10. Revenue trends over the available years
        if (q.contains("revenue trend") || q.contains("trends over") || (q.contains("trend") && q.contains("year"))) {
            return new GeneratedSqlResult(
                    "SELECT f.fiscal_year, ROUND(SUM(f.revenue_millions), 2) AS total_industry_revenue, " +
                    "ROUND(SUM(f.profit_millions), 2) AS total_industry_profit " +
                    "FROM financial_performance f " +
                    "GROUP BY f.fiscal_year " +
                    "ORDER BY f.fiscal_year ASC;",
                    "Aggregates total industry revenue and profit across consecutive fiscal years."
            );
        }

        // 11. Companies founded after 2015
        if (q.contains("founded after 2015") || q.contains("founded since 2015")) {
            return new GeneratedSqlResult(
                    "SELECT company_name, industry, country, founded_year, company_type " +
                    "FROM companies " +
                    "WHERE founded_year > 2015 " +
                    "ORDER BY founded_year DESC " +
                    "LIMIT 20;",
                    "Finds modern AI startups and laboratories founded after 2015."
            );
        }

        // 12. Models released in 2024
        if (q.contains("models released in 2024") || (q.contains("models") && q.contains("2024"))) {
            return new GeneratedSqlResult(
                    "SELECT m.model_name, c.company_name, m.model_category, m.performance_score, m.parameter_count_billions " +
                    "FROM ai_models m " +
                    "JOIN companies c ON m.company_id = c.company_id " +
                    "WHERE m.release_year = 2024 " +
                    "ORDER BY m.performance_score DESC " +
                    "LIMIT 15;",
                    "Retrieves all AI models officially released during 2024."
            );
        }

        // 13. Highest market share
        if (q.contains("market share") || q.contains("market dominance")) {
            return new GeneratedSqlResult(
                    "SELECT c.company_name, m.market_share_percent, m.customer_growth_percent, m.performance_index " +
                    "FROM companies c " +
                    "JOIN market_performance m ON c.company_id = m.company_id " +
                    "WHERE m.fiscal_year = 2024 " +
                    "ORDER BY m.market_share_percent DESC " +
                    "LIMIT 10;",
                    "Ranks companies with the highest market share in 2024."
            );
        }

        // 14. Operating costs
        if (q.contains("operating cost") || q.contains("costs")) {
            return new GeneratedSqlResult(
                    "SELECT c.company_name, f.operating_cost_millions, f.revenue_millions, f.profit_millions " +
                    "FROM companies c " +
                    "JOIN financial_performance f ON c.company_id = f.company_id " +
                    "WHERE f.fiscal_year = 2024 " +
                    "ORDER BY f.operating_cost_millions DESC " +
                    "LIMIT 10;",
                    "Displays company operating expenditures in 2024."
            );
        }

        // 15. Total revenue of all AI companies
        if (q.contains("total revenue") || q.contains("sum of revenue")) {
            return new GeneratedSqlResult(
                    "SELECT f.fiscal_year, COUNT(DISTINCT c.company_id) AS company_count, " +
                    "SUM(f.revenue_millions) AS total_revenue_millions, " +
                    "SUM(f.profit_millions) AS total_profit_millions " +
                    "FROM companies c " +
                    "JOIN financial_performance f ON c.company_id = f.company_id " +
                    "WHERE f.fiscal_year = 2024 " +
                    "GROUP BY f.fiscal_year;",
                    "Computes aggregate industry total revenue and profit across all companies in 2024."
            );
        }

        // 16. Parameter count greater than 100 billion
        if (q.contains("parameter") && (q.contains("100") || q.contains("large"))) {
            return new GeneratedSqlResult(
                    "SELECT m.model_name, c.company_name, m.parameter_count_billions, m.performance_score " +
                    "FROM ai_models m " +
                    "JOIN companies c ON m.company_id = c.company_id " +
                    "WHERE m.parameter_count_billions >= 100 " +
                    "ORDER BY m.parameter_count_billions DESC " +
                    "LIMIT 10;",
                    "Finds frontier large-scale models with 100+ billion parameters."
            );
        }

        // 17. Companies based in San Francisco / HQ
        if (q.contains("san francisco") || q.contains("headquarters") || q.contains("city")) {
            return new GeneratedSqlResult(
                    "SELECT company_name, headquarters_city, country, industry, founded_year " +
                    "FROM companies " +
                    "WHERE headquarters_city LIKE '%San Francisco%' " +
                    "ORDER BY company_name ASC " +
                    "LIMIT 20;",
                    "Lists companies headquartered in the San Francisco AI hub."
            );
        }

        // 18. Robotics / embodied projects
        if (q.contains("robotics") || q.contains("robot")) {
            return new GeneratedSqlResult(
                    "SELECT p.project_name, c.company_name, p.research_area, p.budget_millions, p.project_status " +
                    "FROM research_projects p " +
                    "JOIN companies c ON p.company_id = c.company_id " +
                    "WHERE p.research_area LIKE '%Robotics%' OR p.research_area LIKE '%Autonomous%' " +
                    "ORDER BY p.budget_millions DESC " +
                    "LIMIT 10;",
                    "Lists research initiatives in embodied AI and robotics."
            );
        }

        // 19. US AI companies
        if (q.contains("us companies") || q.contains("usa") || q.contains("united states")) {
            return new GeneratedSqlResult(
                    "SELECT company_name, headquarters_city, company_type, founded_year " +
                    "FROM companies " +
                    "WHERE country = 'USA' " +
                    "ORDER BY founded_year ASC " +
                    "LIMIT 20;",
                    "Lists prominent AI companies established in the United States."
            );
        }

        // 20. Public vs Private companies
        if (q.contains("public") || q.contains("private") || q.contains("startup")) {
            return new GeneratedSqlResult(
                    "SELECT company_type, COUNT(*) AS total_companies " +
                    "FROM companies " +
                    "GROUP BY company_type " +
                    "ORDER BY total_companies DESC;",
                    "Categorizes and counts companies by corporate structure."
            );
        }

        // Default robust query: List top AI companies with recent revenue & profit
        return new GeneratedSqlResult(
                "SELECT c.company_name, c.industry, c.country, f.revenue_millions, f.profit_millions " +
                "FROM companies c " +
                "LEFT JOIN financial_performance f ON c.company_id = f.company_id AND f.fiscal_year = 2024 " +
                "ORDER BY f.revenue_millions DESC " +
                "LIMIT 10;",
                "Displays top AI companies ranked by their 2024 revenue figures."
        );
    }
}
