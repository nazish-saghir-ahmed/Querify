/**
 * Querify Cloud Serverless Data Catalog & Schema Definitions
 * Provides relational schema and domain data for the 6 AI analytics tables.
 */

const TABLES = [
  { name: 'companies', rowCount: 15 },
  { name: 'ai_models', rowCount: 16 },
  { name: 'financial_performance', rowCount: 18 },
  { name: 'ai_investments', rowCount: 15 },
  { name: 'research_projects', rowCount: 12 },
  { name: 'market_performance', rowCount: 15 },
];

const SCHEMA = [
  {
    tableName: 'companies',
    description: 'Stores AI enterprises, frontier research labs, and technology corporations.',
    foreignKeys: [],
    columns: [
      { name: 'company_id', type: 'INT', nullable: false, primaryKey: true, foreignKey: false, comment: 'Unique company primary key' },
      { name: 'company_name', type: 'VARCHAR(100)', nullable: false, primaryKey: false, foreignKey: false, comment: 'Official company or laboratory name' },
      { name: 'industry', type: 'VARCHAR(100)', nullable: false, primaryKey: false, foreignKey: false, comment: 'Primary market sector or tech specialization' },
      { name: 'country', type: 'VARCHAR(50)', nullable: false, primaryKey: false, foreignKey: false, comment: 'Country of legal incorporation' },
      { name: 'founded_year', type: 'INT', nullable: false, primaryKey: false, foreignKey: false, comment: 'Year established' },
      { name: 'company_type', type: 'VARCHAR(50)', nullable: false, primaryKey: false, foreignKey: false, comment: 'Public, Private AI Lab, Enterprise Tech' },
      { name: 'headquarters_city', type: 'VARCHAR(100)', nullable: false, primaryKey: false, foreignKey: false, comment: 'Primary HQ city' },
    ],
  },
  {
    tableName: 'ai_models',
    description: 'Catalog of prominent artificial intelligence models and benchmark evaluations.',
    foreignKeys: ['FOREIGN KEY (company_id) REFERENCES companies(company_id)'],
    columns: [
      { name: 'model_id', type: 'INT', nullable: false, primaryKey: true, foreignKey: false, comment: 'Unique model primary key' },
      { name: 'company_id', type: 'INT', nullable: false, primaryKey: false, foreignKey: true, comment: 'Foreign key to companies.company_id' },
      { name: 'company_name', type: 'VARCHAR(100)', nullable: false, primaryKey: false, foreignKey: false, comment: 'Associated AI laboratory or enterprise' },
      { name: 'model_name', type: 'VARCHAR(100)', nullable: false, primaryKey: false, foreignKey: false, comment: 'Name of AI model/system' },
      { name: 'model_category', type: 'VARCHAR(50)', nullable: false, primaryKey: false, foreignKey: false, comment: 'LLM, Multimodal, Vision, Reasoning' },
      { name: 'release_year', type: 'INT', nullable: false, primaryKey: false, foreignKey: false, comment: 'Official public launch year' },
      { name: 'parameter_count_billions', type: 'DECIMAL(10,2)', nullable: true, primaryKey: false, foreignKey: false, comment: 'Total model parameter size in billions' },
      { name: 'performance_score', type: 'DECIMAL(5,2)', nullable: false, primaryKey: false, foreignKey: false, comment: 'Standardized benchmark score (0-100)' },
    ],
  },
  {
    tableName: 'financial_performance',
    description: 'Annual balance sheet, top-line revenue, and net profit records (Millions USD).',
    foreignKeys: ['FOREIGN KEY (company_id) REFERENCES companies(company_id)'],
    columns: [
      { name: 'performance_id', type: 'INT', nullable: false, primaryKey: true, foreignKey: false, comment: 'Unique record primary key' },
      { name: 'company_id', type: 'INT', nullable: false, primaryKey: false, foreignKey: true, comment: 'Foreign key to companies.company_id' },
      { name: 'company_name', type: 'VARCHAR(100)', nullable: false, primaryKey: false, foreignKey: false, comment: 'Associated AI enterprise' },
      { name: 'fiscal_year', type: 'INT', nullable: false, primaryKey: false, foreignKey: false, comment: 'Reporting fiscal year (2022-2024)' },
      { name: 'revenue_millions', type: 'DECIMAL(12,2)', nullable: false, primaryKey: false, foreignKey: false, comment: 'Gross revenue in millions USD' },
      { name: 'profit_millions', type: 'DECIMAL(12,2)', nullable: false, primaryKey: false, foreignKey: false, comment: 'Net profit after taxes in millions USD' },
      { name: 'operating_cost_millions', type: 'DECIMAL(12,2)', nullable: false, primaryKey: false, foreignKey: false, comment: 'Operational & compute expenses in millions USD' },
      { name: 'revenue_growth_percent', type: 'DECIMAL(6,2)', nullable: false, primaryKey: false, foreignKey: false, comment: 'Year-over-year revenue percentage growth (%)' },
    ],
  },
  {
    tableName: 'ai_investments',
    description: 'Capital investments allocated to AI compute clusters, research, and chips.',
    foreignKeys: ['FOREIGN KEY (company_id) REFERENCES companies(company_id)'],
    columns: [
      { name: 'investment_id', type: 'INT', nullable: false, primaryKey: true, foreignKey: false, comment: 'Unique investment primary key' },
      { name: 'company_id', type: 'INT', nullable: false, primaryKey: false, foreignKey: true, comment: 'Foreign key to companies.company_id' },
      { name: 'company_name', type: 'VARCHAR(100)', nullable: false, primaryKey: false, foreignKey: false, comment: 'Investing enterprise' },
      { name: 'investment_year', type: 'INT', nullable: false, primaryKey: false, foreignKey: false, comment: 'Year of capital deployment' },
      { name: 'investment_amount_millions', type: 'DECIMAL(12,2)', nullable: false, primaryKey: false, foreignKey: false, comment: 'Capital amount deployed in millions USD' },
      { name: 'investment_category', type: 'VARCHAR(100)', nullable: false, primaryKey: false, foreignKey: false, comment: 'Compute Infrastructure, Chips, AI Safety' },
      { name: 'estimated_return_percent', type: 'DECIMAL(6,2)', nullable: false, primaryKey: false, foreignKey: false, comment: 'Projected ROI percentage (%)' },
    ],
  },
  {
    tableName: 'research_projects',
    description: 'Specialized frontier R&D initiatives, robotics, and scientific explorations.',
    foreignKeys: ['FOREIGN KEY (company_id) REFERENCES companies(company_id)'],
    columns: [
      { name: 'project_id', type: 'INT', nullable: false, primaryKey: true, foreignKey: false, comment: 'Unique project primary key' },
      { name: 'company_id', type: 'INT', nullable: false, primaryKey: false, foreignKey: true, comment: 'Foreign key to companies.company_id' },
      { name: 'company_name', type: 'VARCHAR(100)', nullable: false, primaryKey: false, foreignKey: false, comment: 'Sponsoring enterprise' },
      { name: 'project_name', type: 'VARCHAR(150)', nullable: false, primaryKey: false, foreignKey: false, comment: 'Internal project or code name' },
      { name: 'research_area', type: 'VARCHAR(100)', nullable: false, primaryKey: false, foreignKey: false, comment: 'Robotics, Reasoning, Drug Discovery, Safety' },
      { name: 'budget_millions', type: 'DECIMAL(10,2)', nullable: false, primaryKey: false, foreignKey: false, comment: 'Allocated project budget in millions USD' },
      { name: 'project_status', type: 'VARCHAR(50)', nullable: false, primaryKey: false, foreignKey: false, comment: 'Active, Completed, Testing' },
      { name: 'start_date', type: 'DATE', nullable: false, primaryKey: false, foreignKey: false, comment: 'Formal project inception date' },
    ],
  },
  {
    tableName: 'market_performance',
    description: 'Market dominance, adoption velocity, and composite health indexes.',
    foreignKeys: ['FOREIGN KEY (company_id) REFERENCES companies(company_id)'],
    columns: [
      { name: 'market_id', type: 'INT', nullable: false, primaryKey: true, foreignKey: false, comment: 'Unique market metric primary key' },
      { name: 'company_id', type: 'INT', nullable: false, primaryKey: false, foreignKey: true, comment: 'Foreign key to companies.company_id' },
      { name: 'company_name', type: 'VARCHAR(100)', nullable: false, primaryKey: false, foreignKey: false, comment: 'Enterprise entity' },
      { name: 'fiscal_year', type: 'INT', nullable: false, primaryKey: false, foreignKey: false, comment: 'Fiscal year evaluated' },
      { name: 'market_share_percent', type: 'DECIMAL(5,2)', nullable: false, primaryKey: false, foreignKey: false, comment: 'Estimated sector market share percentage (%)' },
      { name: 'customer_growth_percent', type: 'DECIMAL(6,2)', nullable: false, primaryKey: false, foreignKey: false, comment: 'Customer/active user percentage growth (%)' },
      { name: 'performance_index', type: 'DECIMAL(5,2)', nullable: false, primaryKey: false, foreignKey: false, comment: 'Composite health and agility score (0-100)' },
    ],
  },
];

const COMPANIES = [
  { company_id: 1, company_name: 'OpenAI', industry: 'Generative AI & LLMs', country: 'USA', founded_year: 2015, company_type: 'Private AI Lab', headquarters_city: 'San Francisco' },
  { company_id: 2, company_name: 'Anthropic', industry: 'AI Safety & Research', country: 'USA', founded_year: 2021, company_type: 'Public Benefit Corp', headquarters_city: 'San Francisco' },
  { company_id: 3, company_name: 'Google DeepMind', industry: 'Frontier AI & Science', country: 'United Kingdom', founded_year: 2010, company_type: 'Subsidiary', headquarters_city: 'London' },
  { company_id: 4, company_name: 'NVIDIA', industry: 'AI Hardware & Acceleration', country: 'USA', founded_year: 1993, company_type: 'Public (NVDA)', headquarters_city: 'Santa Clara' },
  { company_id: 5, company_name: 'Microsoft AI', industry: 'Enterprise Cloud & Copilots', country: 'USA', founded_year: 1975, company_type: 'Public (MSFT)', headquarters_city: 'Redmond' },
  { company_id: 6, company_name: 'Meta AI', industry: 'Open Source AI & Research', country: 'USA', founded_year: 2004, company_type: 'Public (META)', headquarters_city: 'Menlo Park' },
  { company_id: 7, company_name: 'Mistral AI', industry: 'Open Weights Foundation Models', country: 'France', founded_year: 2023, company_type: 'Private Startup', headquarters_city: 'Paris' },
  { company_id: 8, company_name: 'Cohere', industry: 'Enterprise NLP & Embeddings', country: 'Canada', founded_year: 2019, company_type: 'Private Startup', headquarters_city: 'Toronto' },
  { company_id: 9, company_name: 'Amazon AWS AI', industry: 'Cloud Infrastructure & Bedrock', country: 'USA', founded_year: 1994, company_type: 'Public (AMZN)', headquarters_city: 'Seattle' },
  { company_id: 10, company_name: 'Apple ML', industry: 'On-Device Foundation Models', country: 'USA', founded_year: 1976, company_type: 'Public (AAPL)', headquarters_city: 'Cupertino' },
  { company_id: 11, company_name: 'Databricks', industry: 'Data Intelligence & Lakehouse', country: 'USA', founded_year: 2013, company_type: 'Private Startup', headquarters_city: 'San Francisco' },
  { company_id: 12, company_name: 'Scale AI', industry: 'Data Annotation & Evaluation', country: 'USA', founded_year: 2016, company_type: 'Private Startup', headquarters_city: 'San Francisco' },
  { company_id: 13, company_name: 'Hugging Face', industry: 'Open Source Community & Hub', country: 'USA', founded_year: 2016, company_type: 'Private Startup', headquarters_city: 'New York' },
  { company_id: 14, company_name: 'Perplexity AI', industry: 'Conversational Search & Answer Engine', country: 'USA', founded_year: 2022, company_type: 'Private Startup', headquarters_city: 'San Francisco' },
  { company_id: 15, company_name: 'xAI', industry: 'Frontier LLMs & Reasoning', country: 'USA', founded_year: 2023, company_type: 'Private Startup', headquarters_city: 'Palo Alto' },
];

const AI_MODELS = [
  { model_id: 1, company_id: 1, company_name: 'OpenAI', model_name: 'GPT-4o', model_category: 'Multimodal', release_year: 2024, parameter_count_billions: 200.0, performance_score: 93.2 },
  { model_id: 2, company_id: 1, company_name: 'OpenAI', model_name: 'o1 Reasoning', model_category: 'Reasoning', release_year: 2024, parameter_count_billions: 120.0, performance_score: 96.8 },
  { model_id: 3, company_id: 2, company_name: 'Anthropic', model_name: 'Claude 3.5 Sonnet', model_category: 'Reasoning', release_year: 2024, parameter_count_billions: 175.0, performance_score: 94.6 },
  { model_id: 4, company_id: 2, company_name: 'Anthropic', model_name: 'Claude 3 Opus', model_category: 'LLM', release_year: 2024, parameter_count_billions: 250.0, performance_score: 91.5 },
  { model_id: 5, company_id: 3, company_name: 'Google DeepMind', model_name: 'Gemini 1.5 Pro', model_category: 'Multimodal', release_year: 2024, parameter_count_billions: 220.0, performance_score: 93.5 },
  { model_id: 6, company_id: 3, company_name: 'Google DeepMind', model_name: 'AlphaFold 3', model_category: 'Scientific AI', release_year: 2024, parameter_count_billions: 15.0, performance_score: 98.1 },
  { model_id: 7, company_id: 4, company_name: 'NVIDIA', model_name: 'Nemotron-3.5 1B', model_category: 'Embeddings & Reasoning', release_year: 2024, parameter_count_billions: 1.0, performance_score: 89.4 },
  { model_id: 8, company_id: 4, company_name: 'NVIDIA', model_name: 'Nemotron-4 340B', model_category: 'Synthetic Data & LLM', release_year: 2024, parameter_count_billions: 340.0, performance_score: 92.1 },
  { model_id: 9, company_id: 6, company_name: 'Meta AI', model_name: 'Llama 3.1 405B', model_category: 'Open Foundation LLM', release_year: 2024, parameter_count_billions: 405.0, performance_score: 93.8 },
  { model_id: 10, company_id: 6, company_name: 'Meta AI', model_name: 'Llama 3.1 70B', model_category: 'Open Foundation LLM', release_year: 2024, parameter_count_billions: 70.0, performance_score: 88.5 },
  { model_id: 11, company_id: 7, company_name: 'Mistral AI', model_name: 'Mistral Large 2', model_category: 'LLM', release_year: 2024, parameter_count_billions: 123.0, performance_score: 90.7 },
  { model_id: 12, company_id: 8, company_name: 'Cohere', model_name: 'Command R+', model_category: 'Enterprise RAG', release_year: 2024, parameter_count_billions: 104.0, performance_score: 88.9 },
  { model_id: 13, company_id: 10, company_name: 'Apple ML', model_name: 'Apple Foundation 3B', model_category: 'On-Device SLM', release_year: 2024, parameter_count_billions: 3.0, performance_score: 85.2 },
  { model_id: 14, company_id: 14, company_name: 'Perplexity AI', model_name: 'Sonar Pro', model_category: 'Search & Reasoning', release_year: 2024, parameter_count_billions: 70.0, performance_score: 91.2 },
  { model_id: 15, company_id: 15, company_name: 'xAI', model_name: 'Grok-2', model_category: 'Multimodal & Reasoning', release_year: 2024, parameter_count_billions: 300.0, performance_score: 92.9 },
  { model_id: 16, company_id: 5, company_name: 'Microsoft AI', model_name: 'Phi-3.5 Medium', model_category: 'Small Language Model', release_year: 2024, parameter_count_billions: 14.0, performance_score: 87.8 },
];

const FINANCIAL_PERFORMANCE = [
  { performance_id: 1, company_id: 4, company_name: 'NVIDIA', fiscal_year: 2024, revenue_millions: 122000.0, profit_millions: 68000.0, operating_cost_millions: 54000.0, revenue_growth_percent: 100.25 },
  { performance_id: 2, company_id: 5, company_name: 'Microsoft AI', fiscal_year: 2024, revenue_millions: 38500.0, profit_millions: 14200.0, operating_cost_millions: 24300.0, revenue_growth_percent: 43.66 },
  { performance_id: 3, company_id: 9, company_name: 'Amazon AWS AI', fiscal_year: 2024, revenue_millions: 31000.0, profit_millions: 10800.0, operating_cost_millions: 20200.0, revenue_growth_percent: 47.62 },
  { performance_id: 4, company_id: 6, company_name: 'Meta AI', fiscal_year: 2024, revenue_millions: 24500.0, profit_millions: 6900.0, operating_cost_millions: 17600.0, revenue_growth_percent: 51.23 },
  { performance_id: 5, company_id: 10, company_name: 'Apple ML', fiscal_year: 2024, revenue_millions: 19800.0, profit_millions: 7200.0, operating_cost_millions: 12600.0, revenue_growth_percent: 46.67 },
  { performance_id: 6, company_id: 12, company_name: 'Scale AI', fiscal_year: 2024, revenue_millions: 8900.0, profit_millions: 1450.0, operating_cost_millions: 7450.0, revenue_growth_percent: 17.11 },
  { performance_id: 7, company_id: 11, company_name: 'Databricks', fiscal_year: 2024, revenue_millions: 2400.0, profit_millions: 320.0, operating_cost_millions: 2080.0, revenue_growth_percent: 60.00 },
  { performance_id: 8, company_id: 1, company_name: 'OpenAI', fiscal_year: 2024, revenue_millions: 3700.0, profit_millions: -1200.0, operating_cost_millions: 4900.0, revenue_growth_percent: 131.25 },
  { performance_id: 9, company_id: 3, company_name: 'Google DeepMind', fiscal_year: 2024, revenue_millions: 3100.0, profit_millions: 580.0, operating_cost_millions: 2520.0, revenue_growth_percent: 58.97 },
  { performance_id: 10, company_id: 2, company_name: 'Anthropic', fiscal_year: 2024, revenue_millions: 850.0, profit_millions: -450.0, operating_cost_millions: 1300.0, revenue_growth_percent: 183.33 },
  { performance_id: 11, company_id: 15, company_name: 'xAI', fiscal_year: 2024, revenue_millions: 350.0, profit_millions: -600.0, operating_cost_millions: 950.0, revenue_growth_percent: 250.00 },
  { performance_id: 12, company_id: 14, company_name: 'Perplexity AI', fiscal_year: 2024, revenue_millions: 50.0, profit_millions: 8.0, operating_cost_millions: 42.0, revenue_growth_percent: 400.00 },
  { performance_id: 13, company_id: 7, company_name: 'Mistral AI', fiscal_year: 2024, revenue_millions: 45.0, profit_millions: -25.0, operating_cost_millions: 70.0, revenue_growth_percent: 350.00 },
  { performance_id: 14, company_id: 8, company_name: 'Cohere', fiscal_year: 2024, revenue_millions: 40.0, profit_millions: -18.0, operating_cost_millions: 58.0, revenue_growth_percent: 122.22 },
  { performance_id: 15, company_id: 13, company_name: 'Hugging Face', fiscal_year: 2024, revenue_millions: 35.0, profit_millions: 4.5, operating_cost_millions: 30.5, revenue_growth_percent: 75.00 },
  { performance_id: 16, company_id: 4, company_name: 'NVIDIA', fiscal_year: 2023, revenue_millions: 60922.0, profit_millions: 29760.0, operating_cost_millions: 31162.0, revenue_growth_percent: 125.85 },
  { performance_id: 17, company_id: 5, company_name: 'Microsoft AI', fiscal_year: 2023, revenue_millions: 26800.0, profit_millions: 10100.0, operating_cost_millions: 16700.0, revenue_growth_percent: 32.10 },
  { performance_id: 18, company_id: 1, company_name: 'OpenAI', fiscal_year: 2023, revenue_millions: 1600.0, profit_millions: -900.0, operating_cost_millions: 2500.0, revenue_growth_percent: 700.00 },
];

const AI_INVESTMENTS = [
  { investment_id: 1, company_id: 1, company_name: 'OpenAI', investment_year: 2024, investment_amount_millions: 10000.0, investment_category: 'Compute Infrastructure & Clusters', estimated_return_percent: 45.0 },
  { investment_id: 2, company_id: 2, company_name: 'Anthropic', investment_year: 2024, investment_amount_millions: 4000.0, investment_category: 'AI Safety Research & Scaling', estimated_return_percent: 38.5 },
  { investment_id: 3, company_id: 4, company_name: 'NVIDIA', investment_year: 2024, investment_amount_millions: 15000.0, investment_category: 'Next-Gen GPU Architecture (Blackwell)', estimated_return_percent: 85.0 },
  { investment_id: 4, company_id: 5, company_name: 'Microsoft AI', investment_year: 2024, investment_amount_millions: 12000.0, investment_category: 'Cloud AI Datacenters & Copilots', estimated_return_percent: 52.0 },
  { investment_id: 5, company_id: 6, company_name: 'Meta AI', investment_year: 2024, investment_amount_millions: 9500.0, investment_category: 'Open Source Model Training Clusters', estimated_return_percent: 41.0 },
  { investment_id: 6, company_id: 9, company_name: 'Amazon AWS AI', investment_year: 2024, investment_amount_millions: 8000.0, investment_category: 'Custom Silicon (Trainium & Inferentia)', estimated_return_percent: 48.0 },
  { investment_id: 7, company_id: 15, company_name: 'xAI', investment_year: 2024, investment_amount_millions: 6000.0, investment_category: 'Colossus 100k H100 Supercluster', estimated_return_percent: 55.0 },
  { investment_id: 8, company_id: 3, company_name: 'Google DeepMind', investment_year: 2024, investment_amount_millions: 11000.0, investment_category: 'TPU v5p & Quantum AI Infrastructure', estimated_return_percent: 62.0 },
  { investment_id: 9, company_id: 7, company_name: 'Mistral AI', investment_year: 2024, investment_amount_millions: 650.0, investment_category: 'European Cloud GPU Infrastructure', estimated_return_percent: 35.0 },
  { investment_id: 10, company_id: 11, company_name: 'Databricks', investment_year: 2024, investment_amount_millions: 1200.0, investment_category: 'Enterprise Generative AI Lakehouse', estimated_return_percent: 44.0 },
  { investment_id: 11, company_id: 8, company_name: 'Cohere', investment_year: 2024, investment_amount_millions: 500.0, investment_category: 'Multilingual Foundation Models', estimated_return_percent: 33.0 },
  { investment_id: 12, company_id: 14, company_name: 'Perplexity AI', investment_year: 2024, investment_amount_millions: 250.0, investment_category: 'Real-time Indexing & Neural Search', estimated_return_percent: 70.0 },
  { investment_id: 13, company_id: 12, company_name: 'Scale AI', investment_year: 2024, investment_amount_millions: 1000.0, investment_category: 'RLHF & Defense Synthetic Datasets', estimated_return_percent: 49.0 },
  { investment_id: 14, company_id: 10, company_name: 'Apple ML', investment_year: 2024, investment_amount_millions: 5000.0, investment_category: 'Private Cloud Compute & Apple Intelligence', estimated_return_percent: 42.0 },
  { investment_id: 15, company_id: 13, company_name: 'Hugging Face', investment_year: 2024, investment_amount_millions: 235.0, investment_category: 'Decentralized Open Weights Compute', estimated_return_percent: 36.0 },
];

const RESEARCH_PROJECTS = [
  { project_id: 1, company_id: 1, company_name: 'OpenAI', project_name: 'Project Strawberry / Orion', research_area: 'Reasoning & Self-Correction', budget_millions: 150.0, project_status: 'Active', start_date: '2024-01-15' },
  { project_id: 2, company_id: 2, company_name: 'Anthropic', project_name: 'Constitutional AI Scaling', research_area: 'AI Safety & Alignment', budget_millions: 90.0, project_status: 'Active', start_date: '2023-08-01' },
  { project_id: 3, company_id: 3, company_name: 'Google DeepMind', project_name: 'AlphaFold Next', research_area: 'Scientific Discovery & Biology', budget_millions: 200.0, project_status: 'Active', start_date: '2022-06-10' },
  { project_id: 4, company_id: 4, company_name: 'NVIDIA', project_name: 'Project GR00T', research_area: 'Humanoid Robotics Foundation Model', budget_millions: 120.0, project_status: 'Active', start_date: '2024-03-01' },
  { project_id: 5, company_id: 6, company_name: 'Meta AI', project_name: 'Fair Synthetic Audio & Video', research_area: 'Generative Multimodal Media', budget_millions: 80.0, project_status: 'Active', start_date: '2023-11-20' },
  { project_id: 6, company_id: 15, company_name: 'xAI', project_name: 'Truth-Seeking Universal Reasoner', research_area: 'Frontier Mathematical Proofs', budget_millions: 110.0, project_status: 'Active', start_date: '2024-02-01' },
  { project_id: 7, company_id: 3, company_name: 'Google DeepMind', project_name: 'Project Astra', research_area: 'Universal Real-Time Multimodal Assistant', budget_millions: 175.0, project_status: 'Active', start_date: '2024-04-12' },
  { project_id: 8, company_id: 5, company_name: 'Microsoft AI', project_name: 'Autogen Multi-Agent Framework', research_area: 'Autonomous Agent Orchestration', budget_millions: 65.0, project_status: 'Active', start_date: '2023-09-15' },
  { project_id: 9, company_id: 10, company_name: 'Apple ML', project_name: 'On-Device Quantized Transformers', research_area: 'Edge Efficiency & Low Power Neural Engines', budget_millions: 95.0, project_status: 'Active', start_date: '2023-05-18' },
  { project_id: 10, company_id: 12, company_name: 'Scale AI', project_name: 'SEAL Frontier Benchmarking', research_area: 'Model Capability & Red-Teaming', budget_millions: 45.0, project_status: 'Active', start_date: '2024-01-10' },
  { project_id: 11, company_id: 7, company_name: 'Mistral AI', project_name: 'Codestral & Specialized Reasoning', research_area: 'Code Synthesis & Execution', budget_millions: 40.0, project_status: 'Active', start_date: '2024-05-01' },
  { project_id: 12, company_id: 14, company_name: 'Perplexity AI', project_name: 'Neural Citations & Fact Verification', research_area: 'Hallucination Mitigation', budget_millions: 35.0, project_status: 'Active', start_date: '2024-03-15' },
];

const MARKET_PERFORMANCE = [
  { market_id: 1, company_id: 4, company_name: 'NVIDIA', fiscal_year: 2024, market_share_percent: 82.5, customer_growth_percent: 110.0, performance_index: 96.5 },
  { market_id: 2, company_id: 1, company_name: 'OpenAI', fiscal_year: 2024, market_share_percent: 42.0, customer_growth_percent: 140.0, performance_index: 91.0 },
  { market_id: 3, company_id: 5, company_name: 'Microsoft AI', fiscal_year: 2024, market_share_percent: 34.0, customer_growth_percent: 65.0, performance_index: 88.0 },
  { market_id: 4, company_id: 2, company_name: 'Anthropic', fiscal_year: 2024, market_share_percent: 18.5, customer_growth_percent: 210.0, performance_index: 89.5 },
  { market_id: 5, company_id: 6, company_name: 'Meta AI', fiscal_year: 2024, market_share_percent: 28.0, customer_growth_percent: 95.0, performance_index: 86.5 },
  { market_id: 6, company_id: 3, company_name: 'Google DeepMind', fiscal_year: 2024, market_share_percent: 25.0, customer_growth_percent: 80.0, performance_index: 89.0 },
  { market_id: 7, company_id: 9, company_name: 'Amazon AWS AI', fiscal_year: 2024, market_share_percent: 29.5, customer_growth_percent: 72.0, performance_index: 87.5 },
  { market_id: 8, company_id: 15, company_name: 'xAI', fiscal_year: 2024, market_share_percent: 9.0, customer_growth_percent: 320.0, performance_index: 85.0 },
  { market_id: 9, company_id: 14, company_name: 'Perplexity AI', fiscal_year: 2024, market_share_percent: 7.5, customer_growth_percent: 350.0, performance_index: 86.0 },
  { market_id: 10, company_id: 11, company_name: 'Databricks', fiscal_year: 2024, market_share_percent: 14.0, customer_growth_percent: 68.0, performance_index: 84.5 },
  { market_id: 11, company_id: 12, company_name: 'Scale AI', fiscal_year: 2024, market_share_percent: 22.0, customer_growth_percent: 85.0, performance_index: 88.0 },
  { market_id: 12, company_id: 7, company_name: 'Mistral AI', fiscal_year: 2024, market_share_percent: 6.5, customer_growth_percent: 280.0, performance_index: 83.5 },
  { market_id: 13, company_id: 8, company_name: 'Cohere', fiscal_year: 2024, market_share_percent: 5.5, customer_growth_percent: 90.0, performance_index: 81.0 },
  { market_id: 14, company_id: 10, company_name: 'Apple ML', fiscal_year: 2024, market_share_percent: 19.0, customer_growth_percent: 50.0, performance_index: 85.5 },
  { market_id: 15, company_id: 13, company_name: 'Hugging Face', fiscal_year: 2024, market_share_percent: 31.0, customer_growth_percent: 120.0, performance_index: 90.5 },
];

function getTableSample(tableName) {
  const clean = (tableName || '').toLowerCase().trim();
  let rows = COMPANIES;
  if (clean.includes('model')) rows = AI_MODELS;
  else if (clean.includes('financial')) rows = FINANCIAL_PERFORMANCE;
  else if (clean.includes('investment')) rows = AI_INVESTMENTS;
  else if (clean.includes('project')) rows = RESEARCH_PROJECTS;
  else if (clean.includes('market')) rows = MARKET_PERFORMANCE;

  const columns = rows.length > 0 ? Object.keys(rows[0]) : [];
  return {
    tableName: clean,
    columns,
    rows,
    rowCount: rows.length,
    executionTimeMs: 10,
  };
}

module.exports = {
  TABLES,
  SCHEMA,
  COMPANIES,
  AI_MODELS,
  FINANCIAL_PERFORMANCE,
  AI_INVESTMENTS,
  RESEARCH_PROJECTS,
  MARKET_PERFORMANCE,
  getTableSample,
};
