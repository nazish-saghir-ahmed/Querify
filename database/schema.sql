-- =============================================================================
-- Querify Database Schema
-- Database Name: querify_db
-- Domain: Artificial Intelligence, Business Finance, Investments, and Performance
-- =============================================================================

CREATE DATABASE IF NOT EXISTS querify_db
    CHARACTER SET utf8mb4
    COLLATE utf8mb4_unicode_ci;

USE querify_db;

-- 1. Companies Table
DROP TABLE IF EXISTS market_performance;
DROP TABLE IF EXISTS research_projects;
DROP TABLE IF EXISTS ai_investments;
DROP TABLE IF EXISTS financial_performance;
DROP TABLE IF EXISTS ai_models;
DROP TABLE IF EXISTS query_history;
DROP TABLE IF EXISTS companies;

CREATE TABLE companies (
    company_id INT AUTO_INCREMENT PRIMARY KEY,
    company_name VARCHAR(100) NOT NULL UNIQUE,
    industry VARCHAR(100) NOT NULL,
    country VARCHAR(50) NOT NULL,
    founded_year INT NOT NULL,
    company_type VARCHAR(50) NOT NULL COMMENT 'Public, Private, AI Lab, Enterprise Tech',
    headquarters_city VARCHAR(100) NOT NULL,
    INDEX idx_company_name (company_name),
    INDEX idx_company_country (country),
    INDEX idx_company_type (company_type)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 2. AI Models Table
CREATE TABLE ai_models (
    model_id INT AUTO_INCREMENT PRIMARY KEY,
    company_id INT NOT NULL,
    model_name VARCHAR(100) NOT NULL,
    model_category VARCHAR(50) NOT NULL COMMENT 'LLM, Multimodal, Computer Vision, Audio/Speech, Reasoning',
    release_year INT NOT NULL,
    parameter_count_billions DECIMAL(10, 2) COMMENT 'Model size in billions of parameters',
    performance_score DECIMAL(5, 2) NOT NULL COMMENT 'Synthetic standard benchmark score 0-100',
    CONSTRAINT fk_models_company FOREIGN KEY (company_id) 
        REFERENCES companies (company_id) 
        ON DELETE CASCADE ON UPDATE CASCADE,
    INDEX idx_model_category (model_category),
    INDEX idx_model_score (performance_score),
    INDEX idx_model_release_year (release_year)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 3. Financial Performance Table (Amounts in USD Millions)
CREATE TABLE financial_performance (
    performance_id INT AUTO_INCREMENT PRIMARY KEY,
    company_id INT NOT NULL,
    fiscal_year INT NOT NULL,
    revenue_millions DECIMAL(12, 2) NOT NULL COMMENT 'Annual revenue in millions USD',
    profit_millions DECIMAL(12, 2) NOT NULL COMMENT 'Net profit in millions USD',
    operating_cost_millions DECIMAL(12, 2) NOT NULL COMMENT 'Operating costs in millions USD',
    revenue_growth_percent DECIMAL(6, 2) NOT NULL COMMENT 'Year-over-year revenue growth percentage',
    CONSTRAINT fk_financial_company FOREIGN KEY (company_id) 
        REFERENCES companies (company_id) 
        ON DELETE CASCADE ON UPDATE CASCADE,
    UNIQUE KEY uq_company_year (company_id, fiscal_year),
    INDEX idx_financial_year (fiscal_year),
    INDEX idx_financial_revenue (revenue_millions),
    INDEX idx_financial_profit (profit_millions)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 4. AI Investments Table (Amounts in USD Millions)
CREATE TABLE ai_investments (
    investment_id INT AUTO_INCREMENT PRIMARY KEY,
    company_id INT NOT NULL,
    investment_year INT NOT NULL,
    investment_amount_millions DECIMAL(12, 2) NOT NULL COMMENT 'Capital allocated to AI in millions USD',
    investment_category VARCHAR(100) NOT NULL COMMENT 'Compute Infrastructure, Generative Research, AI Chips, Robotics, Enterprise Tools',
    estimated_return_percent DECIMAL(6, 2) NOT NULL COMMENT 'Projected ROI percentage',
    CONSTRAINT fk_investment_company FOREIGN KEY (company_id) 
        REFERENCES companies (company_id) 
        ON DELETE CASCADE ON UPDATE CASCADE,
    INDEX idx_invest_year (investment_year),
    INDEX idx_invest_amount (investment_amount_millions),
    INDEX idx_invest_category (investment_category)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 5. Research Projects Table
CREATE TABLE research_projects (
    project_id INT AUTO_INCREMENT PRIMARY KEY,
    company_id INT NOT NULL,
    project_name VARCHAR(150) NOT NULL,
    research_area VARCHAR(100) NOT NULL COMMENT 'Robotics, Drug Discovery, Climate Modeling, Quantum AI, Safety',
    budget_millions DECIMAL(10, 2) NOT NULL COMMENT 'Project research budget in millions USD',
    project_status VARCHAR(50) NOT NULL COMMENT 'Active, Completed, Testing, Planning',
    start_date DATE NOT NULL,
    CONSTRAINT fk_research_company FOREIGN KEY (company_id) 
        REFERENCES companies (company_id) 
        ON DELETE CASCADE ON UPDATE CASCADE,
    INDEX idx_project_status (project_status),
    INDEX idx_project_budget (budget_millions),
    INDEX idx_project_area (research_area)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 6. Market Performance Table
CREATE TABLE market_performance (
    market_id INT AUTO_INCREMENT PRIMARY KEY,
    company_id INT NOT NULL,
    fiscal_year INT NOT NULL,
    market_share_percent DECIMAL(5, 2) NOT NULL COMMENT 'Global or sector market share percentage',
    customer_growth_percent DECIMAL(6, 2) NOT NULL COMMENT 'Customer or active user base growth percentage',
    performance_index DECIMAL(5, 2) NOT NULL COMMENT 'Composite score 0-100 evaluating health and agility',
    CONSTRAINT fk_market_company FOREIGN KEY (company_id) 
        REFERENCES companies (company_id) 
        ON DELETE CASCADE ON UPDATE CASCADE,
    UNIQUE KEY uq_market_company_year (company_id, fiscal_year),
    INDEX idx_market_year (fiscal_year),
    INDEX idx_market_share (market_share_percent)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 7. Query History Table (Backend Audit & Re-run Storage)
CREATE TABLE query_history (
    id INT AUTO_INCREMENT PRIMARY KEY,
    natural_query TEXT NOT NULL,
    generated_sql TEXT NOT NULL,
    status VARCHAR(30) NOT NULL DEFAULT 'SUCCESS',
    explanation TEXT,
    rows_returned INT DEFAULT 0,
    execution_time_ms BIGINT DEFAULT 0,
    clarification_details TEXT COMMENT 'Optional JSON storing multi-turn decisions',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_history_created (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
