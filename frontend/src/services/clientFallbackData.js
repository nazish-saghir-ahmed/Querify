/**
 * Client-Side Demo Engine Fallback Data
 * 
 * Provides an instantaneous, resilient cloud catalog fallback
 * so that reviewers and visitors can test the Clarification Engine,
 * run SQL queries, inspect tables, and view charts without needing a deployed backend.
 */

export const FALLBACK_TABLES = [
  { name: 'companies', rowCount: 20 },
  { name: 'ai_models', rowCount: 21 },
  { name: 'financial_performance', rowCount: 56 },
  { name: 'ai_investments', rowCount: 30 },
  { name: 'research_projects', rowCount: 20 },
  { name: 'market_performance', rowCount: 34 },
];

export const FALLBACK_SCHEMA = [
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
      { name: 'performance_score', type: 'DECIMAL(5,2)', nullable: false, primaryKey: false, foreignKey: false, comment: 'Synthetic standardized benchmark score (0-100)' },
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
      { name: 'market_share_percent', type: 'DECIMAL(5,2)', nullable: false, primaryKey: false, foreignKey: false, comment: 'Estimated global/sector market share percentage (%)' },
      { name: 'customer_growth_percent', type: 'DECIMAL(6,2)', nullable: false, primaryKey: false, foreignKey: false, comment: 'Customer/active user percentage growth (%)' },
      { name: 'performance_index', type: 'DECIMAL(5,2)', nullable: false, primaryKey: false, foreignKey: false, comment: 'Composite health and agility score (0-100)' },
    ],
  },
];

export const SAMPLE_COMPANIES = [
  { company_id: 1, company_name: 'OpenAI', industry: 'Generative AI & LLMs', country: 'USA', founded_year: 2015, company_type: 'Private AI Lab', headquarters_city: 'San Francisco' },
  { company_id: 2, company_name: 'Anthropic', industry: 'AI Safety & Research', country: 'USA', founded_year: 2021, company_type: 'Public Benefit Corp', headquarters_city: 'San Francisco' },
  { company_id: 3, company_name: 'Google DeepMind', industry: 'Frontier AI & Science', country: 'United Kingdom', founded_year: 2010, company_type: 'Subsidiary', headquarters_city: 'London' },
  { company_id: 4, company_name: 'NVIDIA', industry: 'AI Hardware & Acceleration', country: 'USA', founded_year: 1993, company_type: 'Public (NVDA)', headquarters_city: 'Santa Clara' },
  { company_id: 5, company_name: 'Microsoft AI', industry: 'Enterprise Cloud & Copilots', country: 'USA', founded_year: 1975, company_type: 'Public (MSFT)', headquarters_city: 'Redmond' },
  { company_id: 6, company_name: 'Meta AI', industry: 'Open Source AI & Research', country: 'USA', founded_year: 2004, company_type: 'Public (META)', headquarters_city: 'Menlo Park' },
  { company_id: 7, company_name: 'Mistral AI', industry: 'Open Weights Foundation Models', country: 'France', founded_year: 2023, company_type: 'Private Startup', headquarters_city: 'Paris' },
  { company_id: 8, company_name: 'Cohere', industry: 'Enterprise NLP & Embeddings', country: 'Canada', founded_year: 2019, company_type: 'Private Startup', headquarters_city: 'Toronto' },
];

export const SAMPLE_MODELS = [
  { model_id: 1, company_id: 1, company_name: 'OpenAI', model_name: 'GPT-4o', model_category: 'Multimodal', release_year: 2024, parameter_count_billions: 200.0, performance_score: 92.8 },
  { model_id: 2, company_id: 1, company_name: 'OpenAI', model_name: 'GPT-4 Turbo', model_category: 'LLM', release_year: 2023, parameter_count_billions: 180.0, performance_score: 90.1 },
  { model_id: 4, company_id: 2, company_name: 'Anthropic', model_name: 'Claude 3.5 Sonnet', model_category: 'Reasoning', release_year: 2024, parameter_count_billions: 175.0, performance_score: 93.4 },
  { model_id: 5, company_id: 2, company_name: 'Anthropic', model_name: 'Claude 3 Opus', model_category: 'LLM', release_year: 2024, parameter_count_billions: 250.0, performance_score: 91.5 },
  { model_id: 6, company_id: 3, company_name: 'Google DeepMind', model_name: 'Gemini 1.5 Pro', model_category: 'Multimodal', release_year: 2024, parameter_count_billions: 220.0, performance_score: 93.1 },
  { model_id: 7, company_id: 3, company_name: 'Google DeepMind', model_name: 'AlphaFold 3', model_category: 'Scientific AI', release_year: 2024, parameter_count_billions: 15.0, performance_score: 97.5 },
  { model_id: 12, company_id: 6, company_name: 'Meta AI', model_name: 'Llama 3.1 405B', model_category: 'LLM', release_year: 2024, parameter_count_billions: 405.0, performance_score: 92.4 },
  { model_id: 20, company_id: 19, company_name: 'Midjourney', model_name: 'Midjourney v6', model_category: 'Computer Vision', release_year: 2024, parameter_count_billions: 25.0, performance_score: 94.3 },
];

export const SAMPLE_FINANCIALS = [
  { performance_id: 10, company_id: 4, company_name: 'NVIDIA', fiscal_year: 2024, revenue_millions: 122000.0, profit_millions: 68000.0, operating_cost_millions: 54000.0, revenue_growth_percent: 100.25 },
  { performance_id: 13, company_id: 5, company_name: 'Microsoft AI', fiscal_year: 2024, revenue_millions: 38500.0, profit_millions: 14200.0, operating_cost_millions: 24300.0, revenue_growth_percent: 43.66 },
  { performance_id: 40, company_id: 15, company_name: 'Amazon AWS AI', fiscal_year: 2024, revenue_millions: 31000.0, profit_millions: 10800.0, operating_cost_millions: 20200.0, revenue_growth_percent: 47.62 },
  { performance_id: 16, company_id: 6, company_name: 'Meta AI', fiscal_year: 2024, revenue_millions: 24500.0, profit_millions: 6900.0, operating_cost_millions: 17600.0, revenue_growth_percent: 51.23 },
  { performance_id: 43, company_id: 16, company_name: 'Apple ML', fiscal_year: 2024, revenue_millions: 19800.0, profit_millions: 7200.0, operating_cost_millions: 12600.0, revenue_growth_percent: 46.67 },
  { performance_id: 55, company_id: 20, company_name: 'Scale AI', fiscal_year: 2024, revenue_millions: 8900.0, profit_millions: 1450.0, operating_cost_millions: 7450.0, revenue_growth_percent: 17.11 },
  { performance_id: 3, company_id: 1, company_name: 'OpenAI', fiscal_year: 2024, revenue_millions: 3700.0, profit_millions: -1200.0, operating_cost_millions: 4900.0, revenue_growth_percent: 131.25 },
  { performance_id: 9, company_id: 3, company_name: 'Google DeepMind', fiscal_year: 2024, revenue_millions: 3100.0, profit_millions: 580.0, operating_cost_millions: 2520.0, revenue_growth_percent: 58.97 },
];

export const SAMPLE_INVESTMENTS = [
  { investment_id: 1, company_id: 1, company_name: 'OpenAI', investment_year: 2024, investment_amount_millions: 10000.0, investment_category: 'Compute Infrastructure & Clusters', estimated_return_percent: 45.0 },
  { investment_id: 2, company_id: 2, company_name: 'Anthropic', investment_year: 2024, investment_amount_millions: 4000.0, investment_category: 'AI Safety Research & Scaling', estimated_return_percent: 38.5 },
  { investment_id: 3, company_id: 4, company_name: 'NVIDIA', investment_year: 2024, investment_amount_millions: 15000.0, investment_category: 'Next-Gen GPU Architecture (Blackwell)', estimated_return_percent: 85.0 },
  { investment_id: 4, company_id: 5, company_name: 'Microsoft AI', investment_year: 2024, investment_amount_millions: 12000.0, investment_category: 'Cloud AI Datacenters', estimated_return_percent: 52.0 },
];

export const SAMPLE_PROJECTS = [
  { project_id: 1, company_id: 1, company_name: 'OpenAI', project_name: 'Project Strawberry / Orion', research_area: 'Reasoning & Self-Correction', budget_millions: 150.0, project_status: 'Active', start_date: '2024-01-15' },
  { project_id: 2, company_id: 2, company_name: 'Anthropic', project_name: 'Constitutional AI Scaling', research_area: 'AI Safety & Alignment', budget_millions: 90.0, project_status: 'Active', start_date: '2023-08-01' },
  { project_id: 3, company_id: 3, company_name: 'Google DeepMind', project_name: 'AlphaFold Next', research_area: 'Scientific Discovery & Biology', budget_millions: 200.0, project_status: 'Active', start_date: '2022-06-10' },
  { project_id: 4, company_id: 4, company_name: 'NVIDIA', project_name: 'Project GR00T', research_area: 'Humanoid Robotics Foundation Model', budget_millions: 120.0, project_status: 'Active', start_date: '2024-03-01' },
];

export const SAMPLE_MARKET = [
  { market_id: 1, company_id: 4, company_name: 'NVIDIA', fiscal_year: 2024, market_share_percent: 82.5, customer_growth_percent: 110.0, performance_index: 96.5 },
  { market_id: 2, company_id: 1, company_name: 'OpenAI', fiscal_year: 2024, market_share_percent: 42.0, customer_growth_percent: 140.0, performance_index: 91.0 },
  { market_id: 3, company_id: 5, company_name: 'Microsoft AI', fiscal_year: 2024, market_share_percent: 34.0, customer_growth_percent: 65.0, performance_index: 88.0 },
  { market_id: 4, company_id: 2, company_name: 'Anthropic', fiscal_year: 2024, market_share_percent: 18.5, customer_growth_percent: 210.0, performance_index: 89.5 },
];

export function getFallbackTableSample(tableName) {
  const clean = (tableName || '').toLowerCase();
  let rows = SAMPLE_COMPANIES;
  if (clean.includes('model')) rows = SAMPLE_MODELS;
  else if (clean.includes('financial')) rows = SAMPLE_FINANCIALS;
  else if (clean.includes('investment')) rows = SAMPLE_INVESTMENTS;
  else if (clean.includes('project')) rows = SAMPLE_PROJECTS;
  else if (clean.includes('market')) rows = SAMPLE_MARKET;

  const columns = rows.length > 0 ? Object.keys(rows[0]) : [];
  return {
    tableName: clean,
    columns,
    rows,
    rowCount: rows.length,
    executionTimeMs: 8,
  };
}

/**
 * Determines whether an incoming query relates to the 6 schema tables.
 */
export function isDomainRelevant(text) {
  if (!text || !text.trim()) return false;
  const lower = text.toLowerCase().trim();

  // Obvious off-topic keywords
  const offTopicKeywords = [
    'weather', 'recipe', 'cook', 'baking', 'bake', 'joke', 'song', 'movie', 'film',
    'president', 'capital of', 'flight', 'airline', 'car', 'automobile',
    'hotel', 'game', 'sport', 'football', 'soccer', 'cricket', 'baseball',
    'salary', 'employee', 'doctor', 'hospital', 'school', 'university',
    'poem', 'story', 'planet', 'history of', 'how are you', 'who are you',
    'what is your name', 'translate', 'dress', 'shoe', 'food', 'restaurant',
    'travel', 'vacation', 'dog', 'cat', 'pet', 'animal'
  ];

  if (offTopicKeywords.some(kw => lower.includes(kw))) {
    return false;
  }

  // Domain table & entity keywords
  const domainKeywords = [
    'company', 'companies', 'firm', 'enterprise', 'startup', 'model',
    'parameter', 'benchmark', 'score', 'revenue', 'profit', 'cost',
    'margin', 'growth', 'invest', 'funding', 'roi', 'valuation',
    'project', 'research', 'budget', 'market', 'share', 'customer',
    'nvidia', 'openai', 'microsoft', 'google', 'deepmind', 'anthropic',
    'meta', 'apple', 'amazon', 'ibm', 'baidu', 'databricks',
    'cohere', 'mistral', 'gpt', 'claude', 'llama', 'gemini',
    'country', 'headquarter', 'city', 'founded', 'fiscal', 'financial',
    'ai', 'artificial intelligence', 'performance', 'capital', 'tech',
    'corporation', 'money', 'earnings', 'operating', 'index'
  ];

  return domainKeywords.some(kw => lower.includes(kw));
}

/**
 * Simulates the Clarification Engine locally when no backend server is reached.
 */
export function handleFallbackAnalyze(question) {
  const lower = (question || '').toLowerCase().trim();

  // Check if query is completely outside database domain scope
  if (!isDomainRelevant(question)) {
    return {
      status: 'NO_DATA_AVAILABLE',
      sessionId: 'session-no-data',
      originalQuestion: question,
      clarification: null,
      generatedSql: null,
      explanation: 'No relevant data available for this query in the database. The database catalog contains records for AI companies, AI models, financial performance, research projects, market metrics, and AI investments.',
      data: null,
    };
  }

  // If user is explicitly querying models or performance score, do NOT treat as company ambiguity
  const isModelScoreQuery = lower.includes('score') || (lower.includes('model') && (lower.includes('performance') || lower.includes('benchmark') || lower.includes('param')));

  // Ambiguity Check 1: "best performing", "top companies" (for general corporate performance)
  if (!isModelScoreQuery && (lower.includes('best') || lower.includes('top company') || lower.includes('top companies') || lower.includes('company performance') || (lower.includes('performance') && !lower.includes('model')))) {
    return {
      status: 'CLARIFICATION_NEEDED',
      sessionId: 'client-session-' + Date.now(),
      originalQuestion: question,
      clarification: {
        questionId: 'clarify_best_performing',
        prompt: 'What metric would you like to use to evaluate company performance?',
        context: 'The term "best performing" can refer to top-line gross revenue, net profitability, year-over-year revenue growth, or AI investment return.',
        options: [
          { id: 'opt_highest_rev', label: 'Highest Revenue', description: 'Rank companies by their 2024 annual revenue (USD Millions)', value: 'highest_revenue' },
          { id: 'opt_highest_profit', label: 'Highest Net Profit', description: 'Rank companies by their net profitability after operating costs', value: 'highest_profit' },
          { id: 'opt_highest_growth', label: 'Highest Revenue Growth Rate', description: 'Rank companies by year-over-year revenue percentage growth (%)', value: 'highest_revenue_growth' },
          { id: 'opt_highest_roi', label: 'Highest AI Investment Return', description: 'Rank companies by estimated ROI on AI compute & infrastructure', value: 'highest_investment_roi' },
        ],
      },
      generatedSql: null,
      explanation: null,
      data: null,
    };
  }

  // Ambiguity Check 2: "money"
  if (lower.includes('money') || lower.includes('earn') || lower.includes('made')) {
    return {
      status: 'CLARIFICATION_NEEDED',
      sessionId: 'client-session-' + Date.now(),
      originalQuestion: question,
      clarification: {
        questionId: 'clarify_money',
        prompt: 'By "money", would you like to measure total Revenue or net Profit?',
        context: 'Top-line sales (revenue) differs significantly from bottom-line earnings (profit) in the AI industry.',
        options: [
          { id: 'opt_highest_rev', label: 'Total Annual Revenue', description: 'Total gross sales generated in fiscal 2024 (USD Millions)', value: 'highest_revenue' },
          { id: 'opt_highest_profit', label: 'Net Profit', description: 'Bottom-line profit after operating and R&D costs (USD Millions)', value: 'highest_profit' },
        ],
      },
      generatedSql: null,
      explanation: null,
      data: null,
    };
  }

  // Ambiguity Check 3: "models" without metric
  if (lower.includes('model') && !lower.includes('score') && !lower.includes('parameter') && !lower.includes('category')) {
    return {
      status: 'CLARIFICATION_NEEDED',
      sessionId: 'client-session-' + Date.now(),
      originalQuestion: question,
      clarification: {
        questionId: 'clarify_models',
        prompt: 'How would you like to rank the AI models?',
        context: 'Models can be compared by benchmark evaluation score, parameter scale, or release year.',
        options: [
          { id: 'opt_model_score', label: 'Benchmark Performance Score', description: 'Rank by standardized AI evaluation score (0-100)', value: 'benchmark_score' },
          { id: 'opt_model_params', label: 'Parameter Count (Billions)', description: 'Rank by total parameter count (size)', value: 'parameter_count' },
        ],
      },
      generatedSql: null,
      explanation: null,
      data: null,
    };
  }

  // Ambiguity Check 4: "fast" or "growth"
  if (lower.includes('growing') || lower.includes('fast') || lower.includes('growth')) {
    return buildResolvedResponse(question, 'highest_revenue_growth');
  }

  // Ambiguity Check 5: "profit"
  if (lower.includes('profit')) {
    return buildResolvedResponse(question, 'highest_profit');
  }

  // Table-specific direct queries in client demo mode
  if (lower.includes('project') || lower.includes('research') || lower.includes('robot') || lower.includes('budget')) {
    return buildProjectsResponse(question);
  }

  if (lower.includes('invest') || lower.includes('funding') || lower.includes('capital') || lower.includes('roi')) {
    return buildInvestmentsResponse(question);
  }

  if (lower.includes('market') || lower.includes('share') || lower.includes('index')) {
    return buildMarketResponse(question);
  }

  if (lower.includes('model') || lower.includes('parameter') || lower.includes('llm') || lower.includes('gpt') || lower.includes('claude') || lower.includes('llama')) {
    return buildResolvedResponse(question, 'model_score');
  }

  if (lower.includes('company') && (lower.includes('country') || lower.includes('city') || lower.includes('hq') || lower.includes('founded') || lower.includes('type') || lower.includes('startup') || lower.includes('usa'))) {
    return buildCompaniesResponse(question);
  }

  // Direct financial queries
  return buildResolvedResponse(question, 'highest_revenue');
}

function buildProjectsResponse(question) {
  const sql = "SELECT p.project_name, c.company_name, p.research_area, p.budget_millions, p.project_status FROM research_projects p JOIN companies c ON p.company_id = c.company_id ORDER BY p.budget_millions DESC LIMIT 10;";
  return {
    status: 'SQL_GENERATED',
    sessionId: 'session-demo',
    originalQuestion: question,
    clarification: null,
    generatedSql: sql,
    explanation: 'Lists frontier research initiatives and robotics projects ranked by allocated budget in USD Millions.',
    data: {
      status: 'SUCCESS',
      columns: ['project_name', 'company_name', 'research_area', 'budget_millions', 'project_status'],
      rows: [...SAMPLE_PROJECTS],
      rowCount: SAMPLE_PROJECTS.length,
      executionTimeMs: 12,
      sql,
      explanation: 'Lists frontier research initiatives and robotics projects ranked by allocated budget in USD Millions.',
      chartSuggestion: {
        type: 'bar',
        title: 'Project Budget (USD Millions)',
        xAxis: 'project_name',
        yAxis: 'budget_millions',
        xaxis: 'project_name',
        yaxis: 'budget_millions',
      },
    },
  };
}

function buildInvestmentsResponse(question) {
  const sql = "SELECT i.investment_year, c.company_name, i.investment_category, i.investment_amount_millions, i.estimated_return_percent FROM ai_investments i JOIN companies c ON i.company_id = c.company_id ORDER BY i.investment_amount_millions DESC LIMIT 10;";
  return {
    status: 'SQL_GENERATED',
    sessionId: 'session-demo',
    originalQuestion: question,
    clarification: null,
    generatedSql: sql,
    explanation: 'Ranks capital investments in AI compute clusters, chip development, and safety by deployed capital in USD Millions.',
    data: {
      status: 'SUCCESS',
      columns: ['investment_year', 'company_name', 'investment_category', 'investment_amount_millions', 'estimated_return_percent'],
      rows: [...SAMPLE_INVESTMENTS],
      rowCount: SAMPLE_INVESTMENTS.length,
      executionTimeMs: 10,
      sql,
      explanation: 'Ranks capital investments in AI compute clusters, chip development, and safety by deployed capital in USD Millions.',
      chartSuggestion: {
        type: 'bar',
        title: 'Capital Deployed (USD Millions)',
        xAxis: 'company_name',
        yAxis: 'investment_amount_millions',
        xaxis: 'company_name',
        yaxis: 'investment_amount_millions',
      },
    },
  };
}

function buildMarketResponse(question) {
  const sql = "SELECT c.company_name, m.fiscal_year, m.market_share_percent, m.customer_growth_percent, m.performance_index FROM market_performance m JOIN companies c ON m.company_id = c.company_id WHERE m.fiscal_year = 2024 ORDER BY m.market_share_percent DESC LIMIT 10;";
  return {
    status: 'SQL_GENERATED',
    sessionId: 'session-demo',
    originalQuestion: question,
    clarification: null,
    generatedSql: sql,
    explanation: 'Evaluates market share dominance, customer adoption growth, and composite health indexes for fiscal 2024.',
    data: {
      status: 'SUCCESS',
      columns: ['company_name', 'fiscal_year', 'market_share_percent', 'customer_growth_percent', 'performance_index'],
      rows: [...SAMPLE_MARKET],
      rowCount: SAMPLE_MARKET.length,
      executionTimeMs: 11,
      sql,
      explanation: 'Evaluates market share dominance, customer adoption growth, and composite health indexes for fiscal 2024.',
      chartSuggestion: {
        type: 'bar',
        title: 'Market Share (%)',
        xAxis: 'company_name',
        yAxis: 'market_share_percent',
        xaxis: 'company_name',
        yaxis: 'market_share_percent',
      },
    },
  };
}

function buildCompaniesResponse(question) {
  const sql = "SELECT company_name, industry, country, headquarters_city, founded_year, company_type FROM companies ORDER BY founded_year ASC LIMIT 15;";
  return {
    status: 'SQL_GENERATED',
    sessionId: 'session-demo',
    originalQuestion: question,
    clarification: null,
    generatedSql: sql,
    explanation: 'Lists enterprise AI corporations and frontier research laboratories with headquarters and corporate structure.',
    data: {
      status: 'SUCCESS',
      columns: ['company_name', 'industry', 'country', 'headquarters_city', 'founded_year', 'company_type'],
      rows: [...SAMPLE_COMPANIES],
      rowCount: SAMPLE_COMPANIES.length,
      executionTimeMs: 9,
      sql,
      explanation: 'Lists enterprise AI corporations and frontier research laboratories with headquarters and corporate structure.',
      chartSuggestion: null,
    },
  };
}

export function handleFallbackClarify(sessionId, selectedOptionId) {
  let metric = 'highest_revenue';
  if (selectedOptionId === 'opt_highest_profit' || selectedOptionId === 'highest_profit') metric = 'highest_profit';
  if (selectedOptionId === 'opt_highest_growth' || selectedOptionId === 'highest_revenue_growth') metric = 'highest_revenue_growth';
  if (selectedOptionId === 'opt_highest_roi' || selectedOptionId === 'highest_investment_roi') metric = 'highest_investment_roi';
  if (selectedOptionId === 'opt_model_score' || selectedOptionId === 'benchmark_score') metric = 'model_score';
  if (selectedOptionId === 'opt_model_params' || selectedOptionId === 'parameter_count') metric = 'model_params';

  return buildResolvedResponse('Show me the best performing AI companies', metric);
}

function buildResolvedResponse(question, metric) {
  const lowerQ = (question || '').toLowerCase();
  if (metric === 'model_score' || metric === 'model_params') {
    const isScore = metric === 'model_score';
    const isAbove90 = lowerQ.includes('90') || lowerQ.includes('above 90');

    let sql = isScore
      ? (isAbove90
          ? 'SELECT model_name, company_name, model_category, performance_score FROM ai_models WHERE performance_score > 90 ORDER BY performance_score DESC;'
          : 'SELECT m.model_name, c.company_name, m.model_category, m.performance_score FROM ai_models m JOIN companies c ON m.company_id = c.company_id ORDER BY m.performance_score DESC LIMIT 10;')
      : 'SELECT m.model_name, c.company_name, m.parameter_count_billions, m.release_year FROM ai_models m JOIN companies c ON m.company_id = c.company_id WHERE m.parameter_count_billions IS NOT NULL ORDER BY m.parameter_count_billions DESC LIMIT 10;';

    let rows = [...SAMPLE_MODELS];
    if (isScore) {
      if (isAbove90) {
        rows = rows.filter(r => r.performance_score > 90);
      }
      rows.sort((a, b) => b.performance_score - a.performance_score);
    } else {
      rows.sort((a, b) => b.parameter_count_billions - a.parameter_count_billions);
    }

    const explanation = isScore
      ? (isAbove90 ? 'Filters and ranks frontier AI models with a benchmark evaluation score strictly above 90.' : 'Ranks AI models by standardized evaluation score.')
      : 'Ranks AI models by total parameter count in billions.';

    return {
      status: 'SQL_GENERATED',
      sessionId: 'session-demo',
      originalQuestion: question,
      clarification: null,
      generatedSql: sql,
      explanation,
      data: {
        status: 'SUCCESS',
        columns: isScore ? ['model_name', 'company_name', 'model_category', 'performance_score'] : ['model_name', 'company_name', 'parameter_count_billions', 'release_year'],
        rows,
        rowCount: rows.length,
        executionTimeMs: 14,
        sql,
        explanation,
        chartSuggestion: {
          type: 'bar',
          title: isScore ? 'Performance score by Model name' : 'Parameter count by Model name',
          xAxis: 'model_name',
          yAxis: isScore ? 'performance_score' : 'parameter_count_billions',
          xaxis: 'model_name',
          yaxis: isScore ? 'performance_score' : 'parameter_count_billions',
        },
      },
    };
  }

  // Default financial metrics
  const isProfit = metric === 'highest_profit';
  const isGrowth = metric === 'highest_revenue_growth';

  const orderCol = isProfit ? 'f.profit_millions' : isGrowth ? 'f.revenue_growth_percent' : 'f.revenue_millions';
  const sql = `SELECT c.company_name, f.revenue_millions, f.profit_millions, f.revenue_growth_percent FROM companies c JOIN financial_performance f ON c.company_id = f.company_id WHERE f.fiscal_year = 2024 ORDER BY ${orderCol} DESC LIMIT 10;`;

  let rows = [...SAMPLE_FINANCIALS];
  if (isProfit) rows.sort((a, b) => b.profit_millions - a.profit_millions);
  else if (isGrowth) rows.sort((a, b) => b.revenue_growth_percent - a.revenue_growth_percent);
  else rows.sort((a, b) => b.revenue_millions - a.revenue_millions);

  return {
    status: 'SQL_GENERATED',
    sessionId: 'session-demo',
    originalQuestion: question,
    clarification: null,
    generatedSql: sql,
    explanation: isProfit ? 'Ranks AI companies by total net profit in fiscal year 2024.' : isGrowth ? 'Ranks AI companies by YoY revenue growth percentage in 2024.' : 'Ranks AI companies by total 2024 annual revenue in millions USD.',
    data: {
      status: 'SUCCESS',
      columns: ['company_name', 'revenue_millions', 'profit_millions', 'revenue_growth_percent'],
      rows,
      rowCount: rows.length,
      executionTimeMs: 16,
      sql,
      explanation: isProfit ? 'Ranks AI companies by total net profit in fiscal year 2024.' : isGrowth ? 'Ranks AI companies by YoY revenue growth percentage in 2024.' : 'Ranks AI companies by total 2024 annual revenue in millions USD.',
      chartSuggestion: {
        type: 'bar',
        title: isProfit ? 'Profit millions by Company name' : isGrowth ? 'Revenue growth percent by Company name' : 'Revenue millions by Company name',
        xAxis: 'company_name',
        yAxis: isProfit ? 'profit_millions' : isGrowth ? 'revenue_growth_percent' : 'revenue_millions',
        xaxis: 'company_name',
        yaxis: isProfit ? 'profit_millions' : isGrowth ? 'revenue_growth_percent' : 'revenue_millions',
      },
    },
  };
}
