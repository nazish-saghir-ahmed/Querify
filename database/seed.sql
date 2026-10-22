-- =============================================================================
-- Querify Database Sample Dataset
-- Domain: AI Companies, Models, Financials, Investments, Projects, Market Data
-- Purpose: Synthetic educational data designed for analytical NLP queries.
-- All financial amounts in Millions USD.
-- =============================================================================

USE querify_db;

-- Clear previous data in reverse-dependency order
SET FOREIGN_KEY_CHECKS = 0;
TRUNCATE TABLE query_history;
TRUNCATE TABLE market_performance;
TRUNCATE TABLE research_projects;
TRUNCATE TABLE ai_investments;
TRUNCATE TABLE financial_performance;
TRUNCATE TABLE ai_models;
TRUNCATE TABLE companies;
SET FOREIGN_KEY_CHECKS = 1;

-- 1. Insert 20 Diverse AI & Tech Companies
INSERT INTO companies (company_id, company_name, industry, country, founded_year, company_type, headquarters_city) VALUES
(1, 'OpenAI', 'Generative AI', 'USA', 2015, 'Private AI Lab', 'San Francisco'),
(2, 'Anthropic', 'AI Safety & Foundation Models', 'USA', 2021, 'Private AI Lab', 'San Francisco'),
(3, 'Google DeepMind', 'AI Research & Frontier Models', 'UK', 2010, 'Enterprise Subsidiary', 'London'),
(4, 'NVIDIA', 'Semiconductors & AI Hardware', 'USA', 1993, 'Public Corporation', 'Santa Clara'),
(5, 'Microsoft AI', 'Cloud & Enterprise AI', 'USA', 1975, 'Public Corporation', 'Redmond'),
(6, 'Meta AI', 'Open Source AI & Social Tech', 'USA', 2004, 'Public Corporation', 'Menlo Park'),
(7, 'Mistral AI', 'Open Weights Foundation Models', 'France', 2023, 'Private Startup', 'Paris'),
(8, 'Cohere', 'Enterprise NLP & Embeddings', 'Canada', 2019, 'Private Startup', 'Toronto'),
(9, 'Stability AI', 'Visual Generative Models', 'UK', 2020, 'Private Startup', 'London'),
(10, 'Scale AI', 'AI Data Infrastructure', 'USA', 2016, 'Private Enterprise', 'San Francisco'),
(11, 'Databricks', 'Data Intelligence & Analytics', 'USA', 2013, 'Private Enterprise', 'San Francisco'),
(12, 'Perplexity AI', 'AI Search & Retrieval', 'USA', 2022, 'Private Startup', 'San Francisco'),
(13, 'Hugging Face', 'AI Open Platform & Hub', 'USA', 2016, 'Private Startup', 'New York'),
(14, 'Runway ML', 'Generative Video & Media', 'USA', 2018, 'Private Startup', 'New York'),
(15, 'Amazon AWS AI', 'Cloud Compute & Cloud Models', 'USA', 1994, 'Public Corporation', 'Seattle'),
(16, 'Apple AI', 'On-Device AI & Hardware Systems', 'USA', 1976, 'Public Corporation', 'Cupertino'),
(17, 'Baidu AI Lab', 'Autonomous Vehicles & Search AI', 'China', 2000, 'Public Corporation', 'Beijing'),
(18, 'Inflection AI', 'Personal Conversational AI', 'USA', 2022, 'Private Startup', 'Palo Alto'),
(19, 'Midjourney', 'Generative Art & Imaging', 'USA', 2022, 'Private Independent', 'San Francisco'),
(20, 'IBM Watson', 'Enterprise AI & Quantum Hybrid', 'USA', 1911, 'Public Corporation', 'Armonk');

-- 2. Insert AI Models
INSERT INTO ai_models (model_id, company_id, model_name, model_category, release_year, parameter_count_billions, performance_score) VALUES
(1, 1, 'GPT-4o', 'Multimodal', 2024, 200.00, 92.80),
(2, 1, 'GPT-4 Turbo', 'LLM', 2023, 180.00, 90.10),
(3, 1, 'DALL-E 3', 'Computer Vision', 2023, 20.00, 88.50),
(4, 2, 'Claude 3.5 Sonnet', 'Reasoning', 2024, 175.00, 93.40),
(5, 2, 'Claude 3 Opus', 'LLM', 2024, 250.00, 91.50),
(6, 3, 'Gemini 1.5 Pro', 'Multimodal', 2024, 220.00, 93.10),
(7, 3, 'AlphaFold 3', 'Scientific AI', 2024, 15.00, 97.50),
(8, 4, 'Nemotron-4 340B', 'LLM', 2024, 340.00, 89.20),
(9, 4, 'Megatron-Turing NLG', 'LLM', 2022, 530.00, 82.00),
(10, 5, 'Phi-3 Medium', 'Small Language Model', 2024, 14.00, 84.60),
(11, 5, 'Florence-2', 'Computer Vision', 2024, 0.77, 85.30),
(12, 6, 'Llama 3.1 405B', 'LLM', 2024, 405.00, 92.40),
(13, 6, 'Llama 3 70B', 'LLM', 2024, 70.00, 88.70),
(14, 7, 'Mistral Large 2', 'LLM', 2024, 123.00, 89.90),
(15, 7, 'Mixtral 8x22B', 'MoE', 2024, 176.00, 88.10),
(16, 8, 'Command R+', 'Enterprise NLP', 2024, 104.00, 86.80),
(17, 9, 'Stable Diffusion 3', 'Computer Vision', 2024, 8.00, 89.00),
(18, 12, 'Sonar Large', 'Reasoning', 2024, 70.00, 87.40),
(19, 14, 'Gen-3 Alpha', 'Video Generation', 2024, 50.00, 91.20),
(20, 19, 'Midjourney v6', 'Computer Vision', 2024, 25.00, 94.30),
(21, 20, 'Granite 13B', 'Enterprise NLP', 2023, 13.00, 80.50);

-- 3. Insert Financial Performance Across Multiple Fiscal Years (2022, 2023, 2024)
INSERT INTO financial_performance (performance_id, company_id, fiscal_year, revenue_millions, profit_millions, operating_cost_millions, revenue_growth_percent) VALUES
-- OpenAI
(1, 1, 2022, 200.00, -540.00, 740.00, 480.00),
(2, 1, 2023, 1600.00, -950.00, 2550.00, 700.00),
(3, 1, 2024, 3700.00, -1200.00, 4900.00, 131.25),
-- Anthropic
(4, 2, 2022, 35.00, -120.00, 155.00, 250.00),
(5, 2, 2023, 300.00, -600.00, 900.00, 757.14),
(6, 2, 2024, 1000.00, -850.00, 1850.00, 233.33),
-- Google DeepMind (subsidiary figures)
(7, 3, 2022, 1250.00, 180.00, 1070.00, 42.00),
(8, 3, 2023, 1950.00, 310.00, 1640.00, 56.00),
(9, 3, 2024, 3100.00, 580.00, 2520.00, 58.97),
-- NVIDIA
(10, 4, 2022, 26974.00, 4368.00, 22606.00, 0.22),
(11, 4, 2023, 60922.00, 29760.00, 31162.00, 125.85),
(12, 4, 2024, 122000.00, 68000.00, 54000.00, 100.25),
-- Microsoft AI
(13, 5, 2022, 18500.00, 6200.00, 12300.00, 34.00),
(14, 5, 2023, 26800.00, 9100.00, 17700.00, 44.86),
(15, 5, 2024, 38500.00, 14200.00, 24300.00, 43.66),
-- Meta AI
(16, 6, 2022, 11500.00, 2100.00, 9400.00, 15.00),
(17, 6, 2023, 16200.00, 3800.00, 12400.00, 40.87),
(18, 6, 2024, 24500.00, 6900.00, 17600.00, 51.23),
-- Mistral AI
(19, 7, 2023, 12.00, -45.00, 57.00, 100.00),
(20, 7, 2024, 85.00, -70.00, 155.00, 608.33),
-- Cohere
(21, 8, 2022, 15.00, -40.00, 55.00, 110.00),
(22, 8, 2023, 40.00, -75.00, 115.00, 166.67),
(23, 8, 2024, 110.00, -65.00, 175.00, 175.00),
-- Stability AI
(24, 9, 2022, 10.00, -60.00, 70.00, 90.00),
(25, 9, 2023, 35.00, -110.00, 145.00, 250.00),
(26, 9, 2024, 65.00, -80.00, 145.00, 85.71),
-- Scale AI
(27, 10, 2022, 280.00, 25.00, 255.00, 65.00),
(28, 10, 2023, 490.00, 60.00, 430.00, 75.00),
(29, 10, 2024, 820.00, 120.00, 700.00, 67.35),
-- Databricks
(30, 11, 2022, 1000.00, -150.00, 1150.00, 60.00),
(31, 11, 2023, 1600.00, -80.00, 1680.00, 60.00),
(32, 11, 2024, 2500.00, 150.00, 2350.00, 56.25),
-- Perplexity AI
(33, 12, 2023, 10.00, -25.00, 35.00, 100.00),
(34, 12, 2024, 60.00, -35.00, 95.00, 500.00),
-- Hugging Face
(35, 13, 2022, 20.00, -18.00, 38.00, 120.00),
(36, 13, 2023, 45.00, -22.00, 67.00, 125.00),
(37, 13, 2024, 95.00, 5.00, 90.00, 111.11),
-- Runway ML
(38, 14, 2023, 25.00, -30.00, 55.00, 150.00),
(39, 14, 2024, 75.00, -20.00, 95.00, 200.00),
-- Amazon AWS AI
(40, 15, 2022, 14000.00, 4200.00, 9800.00, 28.00),
(41, 15, 2023, 21000.00, 6900.00, 14100.00, 50.00),
(42, 15, 2024, 31000.00, 10800.00, 20200.00, 47.62),
-- Apple AI
(43, 16, 2022, 9200.00, 3100.00, 6100.00, 18.00),
(44, 16, 2023, 13500.00, 4800.00, 8700.00, 46.74),
(45, 16, 2024, 19800.00, 7200.00, 12600.00, 46.67),
-- Baidu AI Lab
(46, 17, 2022, 4500.00, 620.00, 3880.00, 12.00),
(47, 17, 2023, 5800.00, 890.00, 4910.00, 28.89),
(48, 17, 2024, 7600.00, 1300.00, 6300.00, 31.03),
-- Inflection AI
(49, 18, 2023, 8.00, -60.00, 68.00, 100.00),
(50, 18, 2024, 22.00, -85.00, 107.00, 175.00),
-- Midjourney
(51, 19, 2022, 60.00, 20.00, 40.00, 200.00),
(52, 19, 2023, 200.00, 95.00, 105.00, 233.33),
(53, 19, 2024, 420.00, 210.00, 210.00, 110.00),
-- IBM Watson
(54, 20, 2022, 6800.00, 850.00, 5950.00, 8.00),
(55, 20, 2023, 7600.00, 1100.00, 6500.00, 11.76),
(56, 20, 2024, 8900.00, 1450.00, 7450.00, 17.11);

-- 4. Insert AI Investments
INSERT INTO ai_investments (investment_id, company_id, investment_year, investment_amount_millions, investment_category, estimated_return_percent) VALUES
(1, 1, 2023, 1200.00, 'Compute Infrastructure', 35.50),
(2, 1, 2024, 3200.00, 'Compute Infrastructure', 45.00),
(3, 2, 2023, 750.00, 'AI Safety Research', 25.00),
(4, 2, 2024, 1800.00, 'Compute Infrastructure', 32.00),
(5, 3, 2023, 2100.00, 'Generative Research', 42.00),
(6, 3, 2024, 3800.00, 'Quantum AI Hybrid', 50.00),
(7, 4, 2023, 5500.00, 'AI Chips & Hardware', 115.00),
(8, 4, 2024, 9800.00, 'AI Chips & Hardware', 140.00),
(9, 5, 2023, 10000.00, 'Data Centers & Cloud AI', 38.00),
(10, 5, 2024, 14500.00, 'Data Centers & Cloud AI', 48.00),
(11, 6, 2023, 6200.00, 'Open Source Compute', 28.00),
(12, 6, 2024, 10500.00, 'Custom AI Silicon', 35.00),
(13, 7, 2023, 85.00, 'Model Training Cluster', 30.00),
(14, 7, 2024, 450.00, 'Frontier Research', 40.00),
(15, 8, 2023, 120.00, 'Enterprise Integrations', 28.00),
(16, 8, 2024, 310.00, 'Retrieval Augmented AI', 34.00),
(17, 10, 2023, 180.00, 'RLHF Data Pipelines', 45.00),
(18, 10, 2024, 420.00, 'Defense AI Platform', 52.00),
(19, 11, 2023, 800.00, 'Enterprise AI Cloud', 38.00),
(20, 11, 2024, 1400.00, 'MosaicML Integration', 48.00),
(21, 15, 2023, 8500.00, 'Trainium & Inferentia Chips', 42.00),
(22, 15, 2024, 13000.00, 'Global Cloud Clusters', 55.00),
(23, 16, 2023, 3400.00, 'Neural Engine Hardware', 30.00),
(24, 16, 2024, 6200.00, 'Private Cloud Compute', 36.00),
(25, 17, 2023, 1600.00, 'Apollo Autonomous Fleet', 24.00),
(26, 17, 2024, 2400.00, 'Ernie LLM Architecture', 29.00),
(27, 19, 2023, 40.00, 'GPU Cloud Clusters', 75.00),
(28, 19, 2024, 110.00, 'Realtime Video Engine', 85.00),
(29, 20, 2023, 1500.00, 'Enterprise Granite Foundation', 22.00),
(30, 20, 2024, 2200.00, 'Hybrid Cloud AI Governance', 26.00);

-- 5. Insert Research Projects
INSERT INTO research_projects (project_id, company_id, project_name, research_area, budget_millions, project_status, start_date) VALUES
(1, 1, 'Project Strawberry / Reasoning Core', 'Mathematical Reasoning', 650.00, 'Active', '2023-08-01'),
(2, 1, 'Sora World Simulation', 'Video Generative Physics', 420.00, 'Active', '2023-04-15'),
(3, 2, 'Constitutional AI Scaling', 'Safety & Alignment', 280.00, 'Active', '2022-11-10'),
(4, 2, 'Interpretability Microscope', 'Mechanistic Interpretability', 140.00, 'Active', '2023-01-20'),
(5, 3, 'AlphaFold Universal Proteome', 'Scientific AI & Drug Discovery', 520.00, 'Completed', '2021-06-01'),
(6, 3, 'Project Astra Universal Assistant', 'Multimodal Agents', 480.00, 'Active', '2023-09-01'),
(7, 4, 'Blackwell Architecture R&D', 'Hardware & Interconnects', 1800.00, 'Completed', '2022-03-01'),
(8, 4, 'Cosmos World Foundation Models', 'Embodied Physical AI', 620.00, 'Active', '2024-01-15'),
(9, 5, 'BioGPT Clinical Diagnostic AI', 'Healthcare AI', 340.00, 'Active', '2022-07-01'),
(10, 5, '1-Bit LLM Architectures', 'Model Compression & Efficiency', 190.00, 'Testing', '2023-10-10'),
(11, 6, 'Llama Open Science Initiative', 'Open Foundation Models', 850.00, 'Active', '2023-02-01'),
(12, 6, 'Project Aria Smart Glasses AI', 'Augmented Reality Perception', 540.00, 'Testing', '2022-05-12'),
(13, 7, 'Codestral Code Intelligence', 'Software Synthesis', 95.00, 'Completed', '2023-11-01'),
(14, 8, 'Aya Multilingual Inclusion Initiative', 'Multilingual NLP', 75.00, 'Completed', '2023-05-01'),
(15, 10, 'Scale SEAL Safety Benchmarks', 'Automated Model Evaluation', 110.00, 'Active', '2023-12-01'),
(16, 11, 'DBRX Open MoE Engine', 'Data-Centric AI', 220.00, 'Completed', '2023-07-01'),
(17, 14, 'Gen-4 Realtime Interactive Worlds', 'Media Synthetics', 130.00, 'Active', '2024-02-10'),
(18, 15, 'Olympus Frontier Model', 'Cloud Foundation Models', 920.00, 'Testing', '2023-09-15'),
(19, 16, 'Apple Silicon Neural Accelerator', 'Edge AI & Privacy', 1250.00, 'Active', '2022-08-01'),
(20, 17, 'Apollo Robocab Level 4 Autonomy', 'Autonomous Robotics', 780.00, 'Active', '2021-04-01');

-- 6. Insert Market Performance
INSERT INTO market_performance (market_id, company_id, fiscal_year, market_share_percent, customer_growth_percent, performance_index) VALUES
(1, 1, 2023, 28.50, 240.00, 94.50),
(2, 1, 2024, 32.00, 95.00, 96.00),
(3, 2, 2023, 8.20, 310.00, 88.00),
(4, 2, 2024, 14.50, 180.00, 92.50),
(5, 3, 2023, 19.00, 48.00, 93.00),
(6, 3, 2024, 21.50, 65.00, 95.00),
(7, 4, 2023, 78.00, 130.00, 98.00),
(8, 4, 2024, 84.00, 110.00, 99.50),
(9, 5, 2023, 22.00, 55.00, 91.00),
(10, 5, 2024, 24.50, 62.00, 93.50),
(11, 6, 2023, 12.00, 70.00, 89.00),
(12, 6, 2024, 15.00, 85.00, 92.00),
(13, 7, 2023, 2.10, 150.00, 84.00),
(14, 7, 2024, 5.80, 280.00, 88.50),
(15, 8, 2023, 3.50, 90.00, 83.00),
(16, 8, 2024, 4.80, 115.00, 86.00),
(17, 10, 2023, 16.00, 85.00, 87.50),
(18, 10, 2024, 19.20, 75.00, 90.00),
(19, 11, 2023, 14.00, 65.00, 88.00),
(20, 11, 2024, 16.50, 58.00, 91.50),
(21, 12, 2023, 1.50, 450.00, 85.00),
(22, 12, 2024, 4.20, 320.00, 90.50),
(23, 13, 2023, 35.00, 95.00, 92.00),
(24, 13, 2024, 42.00, 80.00, 94.00),
(25, 14, 2023, 18.00, 210.00, 86.00),
(26, 14, 2024, 24.00, 140.00, 89.50),
(27, 15, 2023, 25.00, 40.00, 90.00),
(28, 15, 2024, 26.50, 45.00, 91.50),
(29, 16, 2023, 15.00, 30.00, 88.00),
(30, 16, 2024, 17.00, 45.00, 91.00),
(31, 19, 2023, 45.00, 180.00, 93.00),
(32, 19, 2024, 48.00, 90.00, 94.50),
(33, 20, 2023, 9.50, 22.00, 82.00),
(34, 20, 2024, 10.20, 28.00, 84.50);

-- 7. Insert Initial Sample Query History
INSERT INTO query_history (id, natural_query, generated_sql, status, explanation, rows_returned, execution_time_ms, created_at) VALUES
(1, 'Which AI companies had the highest revenue in 2024?', 
 'SELECT c.company_name, f.revenue_millions, f.profit_millions FROM companies c JOIN financial_performance f ON c.company_id = f.company_id WHERE f.fiscal_year = 2024 ORDER BY f.revenue_millions DESC LIMIT 5;', 
 'SUCCESS', 
 'Retrieved top 5 companies ranked by fiscal year 2024 revenue.', 5, 24, NOW() - INTERVAL 2 HOUR),
(2, 'Show the top performing AI models released in 2024', 
 'SELECT m.model_name, c.company_name, m.model_category, m.performance_score FROM ai_models m JOIN companies c ON m.company_id = c.company_id WHERE m.release_year = 2024 ORDER BY m.performance_score DESC LIMIT 6;', 
 'SUCCESS', 
 'Retrieved AI models with the highest benchmark scores released in 2024.', 6, 19, NOW() - INTERVAL 1 HOUR);
