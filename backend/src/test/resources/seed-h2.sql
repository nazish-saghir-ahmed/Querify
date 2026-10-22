-- H2 Test Data

INSERT INTO companies (company_id, company_name, industry, country, founded_year, company_type, headquarters_city) VALUES
(1, 'OpenAI', 'Generative AI', 'USA', 2015, 'Private AI Lab', 'San Francisco'),
(2, 'Anthropic', 'AI Safety & Foundation Models', 'USA', 2021, 'Private AI Lab', 'San Francisco'),
(3, 'Google DeepMind', 'AI Research & Frontier Models', 'UK', 2010, 'Enterprise Subsidiary', 'London'),
(4, 'NVIDIA', 'Semiconductors & AI Hardware', 'USA', 1993, 'Public Corporation', 'Santa Clara'),
(5, 'Microsoft AI', 'Cloud & Enterprise AI', 'USA', 1975, 'Public Corporation', 'Redmond');

INSERT INTO ai_models (model_id, company_id, model_name, model_category, release_year, parameter_count_billions, performance_score) VALUES
(1, 1, 'GPT-4o', 'Multimodal', 2024, 200.00, 92.80),
(2, 2, 'Claude 3.5 Sonnet', 'Reasoning', 2024, 175.00, 93.40),
(3, 3, 'Gemini 1.5 Pro', 'Multimodal', 2024, 220.00, 93.10),
(4, 4, 'Nemotron-4 340B', 'LLM', 2024, 340.00, 89.20),
(5, 5, 'Phi-3 Medium', 'Small Language Model', 2024, 14.00, 84.60);

INSERT INTO financial_performance (performance_id, company_id, fiscal_year, revenue_millions, profit_millions, operating_cost_millions, revenue_growth_percent) VALUES
(1, 1, 2024, 3700.00, -1200.00, 4900.00, 131.25),
(2, 2, 2024, 1000.00, -850.00, 1850.00, 233.33),
(3, 3, 2024, 3100.00, 580.00, 2520.00, 58.97),
(4, 4, 2024, 122000.00, 68000.00, 54000.00, 100.25),
(5, 5, 2024, 38500.00, 14200.00, 24300.00, 43.66);

INSERT INTO ai_investments (investment_id, company_id, investment_year, investment_amount_millions, investment_category, estimated_return_percent) VALUES
(1, 1, 2024, 3200.00, 'Compute Infrastructure', 45.00),
(2, 4, 2024, 9800.00, 'AI Chips & Hardware', 140.00),
(3, 5, 2024, 14500.00, 'Data Centers & Cloud AI', 48.00);

INSERT INTO research_projects (project_id, company_id, project_name, research_area, budget_millions, project_status, start_date) VALUES
(1, 1, 'Project Strawberry / Reasoning Core', 'Mathematical Reasoning', 650.00, 'Active', '2023-08-01'),
(2, 4, 'Blackwell Architecture R&D', 'Hardware & Interconnects', 1800.00, 'Completed', '2022-03-01');

INSERT INTO market_performance (market_id, company_id, fiscal_year, market_share_percent, customer_growth_percent, performance_index) VALUES
(1, 1, 2024, 32.00, 95.00, 96.00),
(2, 4, 2024, 84.00, 110.00, 99.50);
