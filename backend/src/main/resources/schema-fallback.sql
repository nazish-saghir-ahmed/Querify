-- Fallback In-Memory Schema for Querify
-- Automatically loaded if MySQL credentials are not yet configured

CREATE TABLE IF NOT EXISTS companies (
    company_id INT AUTO_INCREMENT PRIMARY KEY,
    company_name VARCHAR(100) NOT NULL UNIQUE,
    industry VARCHAR(100) NOT NULL,
    country VARCHAR(50) NOT NULL,
    founded_year INT NOT NULL,
    company_type VARCHAR(50) NOT NULL,
    headquarters_city VARCHAR(100) NOT NULL
);

CREATE TABLE IF NOT EXISTS ai_models (
    model_id INT AUTO_INCREMENT PRIMARY KEY,
    company_id INT NOT NULL,
    model_name VARCHAR(100) NOT NULL,
    model_category VARCHAR(50) NOT NULL,
    release_year INT NOT NULL,
    parameter_count_billions DECIMAL(10, 2),
    performance_score DECIMAL(5, 2) NOT NULL,
    FOREIGN KEY (company_id) REFERENCES companies (company_id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS financial_performance (
    performance_id INT AUTO_INCREMENT PRIMARY KEY,
    company_id INT NOT NULL,
    fiscal_year INT NOT NULL,
    revenue_millions DECIMAL(12, 2) NOT NULL,
    profit_millions DECIMAL(12, 2) NOT NULL,
    operating_cost_millions DECIMAL(12, 2) NOT NULL,
    revenue_growth_percent DECIMAL(6, 2) NOT NULL,
    FOREIGN KEY (company_id) REFERENCES companies (company_id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS ai_investments (
    investment_id INT AUTO_INCREMENT PRIMARY KEY,
    company_id INT NOT NULL,
    investment_year INT NOT NULL,
    investment_amount_millions DECIMAL(12, 2) NOT NULL,
    investment_category VARCHAR(100) NOT NULL,
    estimated_return_percent DECIMAL(6, 2) NOT NULL,
    FOREIGN KEY (company_id) REFERENCES companies (company_id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS research_projects (
    project_id INT AUTO_INCREMENT PRIMARY KEY,
    company_id INT NOT NULL,
    project_name VARCHAR(150) NOT NULL,
    research_area VARCHAR(100) NOT NULL,
    budget_millions DECIMAL(10, 2) NOT NULL,
    project_status VARCHAR(50) NOT NULL,
    start_date DATE NOT NULL,
    FOREIGN KEY (company_id) REFERENCES companies (company_id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS market_performance (
    market_id INT AUTO_INCREMENT PRIMARY KEY,
    company_id INT NOT NULL,
    fiscal_year INT NOT NULL,
    market_share_percent DECIMAL(5, 2) NOT NULL,
    customer_growth_percent DECIMAL(6, 2) NOT NULL,
    performance_index DECIMAL(5, 2) NOT NULL,
    FOREIGN KEY (company_id) REFERENCES companies (company_id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS query_history (
    id INT AUTO_INCREMENT PRIMARY KEY,
    natural_query VARCHAR(1000) NOT NULL,
    generated_sql VARCHAR(2000) NOT NULL,
    status VARCHAR(30) NOT NULL DEFAULT 'SUCCESS',
    explanation VARCHAR(1000),
    rows_returned INT DEFAULT 0,
    execution_time_ms BIGINT DEFAULT 0,
    clarification_details VARCHAR(2000),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
