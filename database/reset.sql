-- =============================================================================
-- Querify Database Reset Script
-- Drops all existing tables and re-executes clean schema creation.
-- =============================================================================

USE querify_db;

SET FOREIGN_KEY_CHECKS = 0;

DROP TABLE IF EXISTS query_history;
DROP TABLE IF EXISTS market_performance;
DROP TABLE IF EXISTS research_projects;
DROP TABLE IF EXISTS ai_investments;
DROP TABLE IF EXISTS financial_performance;
DROP TABLE IF EXISTS ai_models;
DROP TABLE IF EXISTS companies;

SET FOREIGN_KEY_CHECKS = 1;

-- Notice: After running reset.sql, execute schema.sql and seed.sql to restore full state.
