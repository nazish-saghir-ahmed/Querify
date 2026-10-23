/**
 * Client-Side Demo Engine Fallback Data
 * 
 * Provides an instantaneous, zero-backend fallback for Vercel deployments
 * so that anyone visiting the site can test the Clarification Engine,
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
      { name: 'fiscal_year', type: 'INT', nullable: false, primaryKey: false, foreignKey: false, comment: 'Reporting fiscal year (2022-2024)' },
      { name: 'revenue_millions', type: 'DECIMAL(12,2)', nullable: false, primaryKey: false, foreignKey: false, comment: 'Gross revenue in millions USD' },
      { name: 'profit_millions', type: 'DECIMAL(12,2)', nullable: false, primaryKey: false, foreignKey: false, comment: 'Net profit after taxes in millions USD' },
      { name: 'operating_cost_millions', type: 'DECIMAL(12,2)', nullable: false, primaryKey: false, foreignKey: false, comment: 'Operational & compute expenses in millions USD' },
      { name: 'revenue_growth_percent', type: 'DECIMAL(6,2)', nullable: false, primaryKey: false, foreignKey: false, comment: 'Year-over-year revenue percentage growth' },
    ],
  },
  {
    tableName: 'ai_investments',
    description: 'Capital investments allocated to AI compute clusters, research, and chips.',
    foreignKeys: ['FOREIGN KEY (company_id) REFERENCES companies(company_id)'],
    columns: [
      { name: 'investment_id', type: 'INT', nullable: false, primaryKey: true, foreignKey: false, comment: 'Unique investment primary key' },
      { name: 'company_id', type: 'INT', nullable: false, primaryKey: false, foreignKey: true, comment: 'Foreign key to companies.company_id' },
      { name: 'investment_year', type: 'INT', nullable: false, primaryKey: false, foreignKey: false, comment: 'Year of capital deployment' },
      { name: 'investment_amount_millions', type: 'DECIMAL(12,2)', nullable: false, primaryKey: false, foreignKey: false, comment: 'Capital amount deployed in millions USD' },
      { name: 'investment_category', type: 'VARCHAR(100)', nullable: false, primaryKey: false, foreignKey: false, comment: 'Compute Infrastructure, Chips, AI Safety' },
      { name: 'estimated_return_percent', type: 'DECIMAL(6,2)', nullable: false, primaryKey: false, foreignKey: false, comment: 'Projected ROI percentage' },
    ],
  },
  {
    tableName: 'research_projects',
    description: 'Specialized frontier R&D initiatives, robotics, and scientific explorations.',
    foreignKeys: ['FOREIGN KEY (company_id) REFERENCES companies(company_id)'],
    columns: [
      { name: 'project_id', type: 'INT', nullable: false, primaryKey: true, foreignKey: false, comment: 'Unique project primary key' },
      { name: 'company_id', type: 'INT', nullable: false, primaryKey: false, foreignKey: true, comment: 'Foreign key to companies.company_id' },
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
      { name: 'fiscal_year', type: 'INT', nullable: false, primaryKey: false, foreignKey: false, comment: 'Fiscal year evaluated' },
      { name: 'market_share_percent', type: 'DECIMAL(5,2)', nullable: false, primaryKey: false, foreignKey: false, comment: 'Estimated global/sector market share percentage' },
      { name: 'customer_growth_percent', type: 'DECIMAL(6,2)', nullable: false, primaryKey: false, foreignKey: false, comment: 'Customer/active user percentage growth' },
      { name: 'performance_index', type: 'DECIMAL(5,2)', nullable: false, primaryKey: false, foreignKey: false, comment: 'Composite health and agility score (0-100)' },
    ],
  },
];

export const SAMPLE_COMPANIES = [
  { company_id: 1, company_name: 'OpenAI', industry: 'Generative AI', country: 'USA', founded_year: 2015, company_type: 'Private AI Lab', headquarters_city: 'San Francisco' },
  { company_id: 2, company_name: 'Anthropic', industry: 'AI Safety & Foundation Models', country: 'USA', founded_year: 2021, company_type: 'Private AI Lab', headquarters_city: 'San Francisco' },
  { company_id: 3, company_name: 'Google DeepMind', industry: 'AI Research & Frontier Models', country: 'UK', founded_year: 2010, company_type: 'Enterprise Subsidiary', headquarters_city: 'London' },
  { company_id: 4, company_name: 'NVIDIA', industry: 'Semiconductors & AI Hardware', country: 'USA', founded_year: 1993, company_type: 'Public Corporation', headquarters_city: 'Santa Clara' },
  { company_id: 5, company_name: 'Microsoft AI', industry: 'Cloud & Enterprise AI', country: 'USA', founded_year: 1975, company_type: 'Public Corporation', headquarters_city: 'Redmond' },
  { company_id: 6, company_name: 'Meta AI', industry: 'Open Source AI & Social Tech', country: 'USA', founded_year: 2004, company_type: 'Public Corporation', headquarters_city: 'Menlo Park' },
  { company_id: 7, company_name: 'Mistral AI', industry: 'Open Weights Foundation Models', country: 'France', founded_year: 2023, company_type: 'Private Startup', headquarters_city: 'Paris' },
  { company_id: 8, company_name: 'Cohere', industry: 'Enterprise NLP & Embeddings', country: 'Canada', founded_year: 2019, company_type: 'Private Startup', headquarters_city: 'Toronto' },
];

export const SAMPLE_MODELS = [
  { model_id: 1, company_id: 1, model_name: 'GPT-4o', model_category: 'Multimodal', release_year: 2024, parameter_count_billions: 200.0, performance_score: 92.8 },
  { model_id: 2, company_id: 1, model_name: 'GPT-4 Turbo', model_category: 'LLM', release_year: 2023, parameter_count_billions: 180.0, performance_score: 90.1 },
  { model_id: 4, company_id: 2, model_name: 'Claude 3.5 Sonnet', model_category: 'Reasoning', release_year: 2024, parameter_count_billions: 175.0, performance_score: 93.4 },
  { model_id: 5, company_id: 2, model_name: 'Claude 3 Opus', model_category: 'LLM', release_year: 2024, parameter_count_billions: 250.0, performance_score: 91.5 },
  { model_id: 6, company_id: 3, model_name: 'Gemini 1.5 Pro', model_category: 'Multimodal', release_year: 2024, parameter_count_billions: 220.0, performance_score: 93.1 },
  { model_id: 7, company_id: 3, model_name: 'AlphaFold 3', model_category: 'Scientific AI', release_year: 2024, parameter_count_billions: 15.0, performance_score: 97.5 },
  { model_id: 12, company_id: 6, model_name: 'Llama 3.1 405B', model_category: 'LLM', release_year: 2024, parameter_count_billions: 405.0, performance_score: 92.4 },
  { model_id: 20, company_id: 19, model_name: 'Midjourney v6', model_category: 'Computer Vision', release_year: 2024, parameter_count_billions: 25.0, performance_score: 94.3 },
];

export const SAMPLE_FINANCIALS = [
  { performance_id: 10, company_id: 4, fiscal_year: 2024, revenue_millions: 122000.0, profit_millions: 68000.0, operating_cost_millions: 54000.0, revenue_growth_percent: 100.25 },
  { performance_id: 13, company_id: 5, fiscal_year: 2024, revenue_millions: 38500.0, profit_millions: 14200.0, operating_cost_millions: 24300.0, revenue_growth_percent: 43.66 },
  { performance_id: 40, company_id: 15, fiscal_year: 2024, revenue_millions: 31000.0, profit_millions: 10800.0, operating_cost_millions: 20200.0, revenue_growth_percent: 47.62 },
  { performance_id: 16, company_id: 6, fiscal_year: 2024, revenue_millions: 24500.0, profit_millions: 6900.0, operating_cost_millions: 17600.0, revenue_growth_percent: 51.23 },
  { performance_id: 43, company_id: 16, fiscal_year: 2024, revenue_millions: 19800.0, profit_millions: 7200.0, operating_cost_millions: 12600.0, revenue_growth_percent: 46.67 },
  { performance_id: 55, company_id: 20, fiscal_year: 2024, revenue_millions: 8900.0, profit_millions: 1450.0, operating_cost_millions: 7450.0, revenue_growth_percent: 17.11 },
  { performance_id: 3, company_id: 1, fiscal_year: 2024, revenue_millions: 3700.0, profit_millions: -1200.0, operating_cost_millions: 4900.0, revenue_growth_percent: 131.25 },
  { performance_id: 9, company_id: 3, fiscal_year: 2024, revenue_millions: 3100.0, profit_millions: 580.0, operating_cost_millions: 2520.0, revenue_growth_percent: 58.97 },
];

export const SAMPLE_INVESTMENTS = [
  { investment_id: 1, company_id: 1, investment_year: 2024, investment_amount_millions: 10000.0, investment_category: 'Compute Infrastructure & Clusters', estimated_return_percent: 45.0 },
  { investment_id: 2, company_id: 2, investment_year: 2024, investment_amount_millions: 4000.0, investment_category: 'AI Safety Research & Scaling', estimated_return_percent: 38.5 },
  { investment_id: 3, company_id: 4, investment_year: 2024, investment_amount_millions: 15000.0, investment_category: 'Next-Gen GPU Architecture (Blackwell)', estimated_return_percent: 85.0 },
  { investment_id: 4, company_id: 5, investment_year: 2024, investment_amount_millions: 12000.0, investment_category: 'Cloud AI Datacenters', estimated_return_percent: 52.0 },
];

export const SAMPLE_PROJECTS = [
  { project_id: 1, company_id: 1, project_name: 'Project Strawberry / Orion', research_area: 'Reasoning & Self-Correction', budget_millions: 150.0, project_status: 'Active', start_date: '2024-01-15' },
  { project_id: 2, company_id: 2, project_name: 'Constitutional AI Scaling', research_area: 'AI Safety & Alignment', budget_millions: 90.0, project_status: 'Active', start_date: '2023-08-01' },
  { project_id: 3, company_id: 3, project_name: 'AlphaFold Next', research_area: 'Scientific Discovery & Biology', budget_millions: 200.0, project_status: 'Active', start_date: '2022-06-10' },
  { project_id: 4, company_id: 4, project_name: 'Project GR00T', research_area: 'Humanoid Robotics Foundation Model', budget_millions: 120.0, project_status: 'Active', start_date: '2024-03-01' },
];

export const SAMPLE_MARKET = [
  { market_id: 1, company_id: 4, fiscal_year: 2024, market_share_percent: 82.5, customer_growth_percent: 110.0, performance_index: 96.5 },
  { market_id: 2, company_id: 1, fiscal_year: 2024, market_share_percent: 42.0, customer_growth_percent: 140.0, performance_index: 91.0 },
  { market_id: 3, company_id: 5, fiscal_year: 2024, market_share_percent: 34.0, customer_growth_percent: 65.0, performance_index: 88.0 },
  { market_id: 4, company_id: 2, fiscal_year: 2024, market_share_percent: 18.5, customer_growth_percent: 210.0, performance_index: 89.5 },
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
 * Simulates the Clarification Engine locally when no backend server is reached.
 */
export function handleFallbackAnalyze(question) {
  const lower = (question || '').toLowerCase().trim();

  // Ambiguity Check 1: "best performing", "top companies"
  if (lower.includes('best') || lower.includes('top company') || lower.includes('top companies') || lower.includes('performance')) {
    return {
      status: 'CLARIFICATION_NEEDED',
      sessionId: 'client-session-' + Date.now(),
      originalQuestion: question,
      clarification: {
        questionId: 'clarify_best_performing',
        prompt: 'What would you like to use to measure company performance?',
        context: 'The term "best performing" can refer to several different business and financial metrics in the database.',
        options: [
          { id: 'opt_highest_rev', label: 'Highest Revenue', description: 'Rank companies by their 2024 annual revenue (USD Millions)', value: 'highest_revenue' },
          { id: 'opt_highest_profit', label: 'Highest Net Profit', description: 'Rank companies by their net profitability in fiscal 2024', value: 'highest_profit' },
          { id: 'opt_highest_growth', label: 'Highest Revenue Growth Rate', description: 'Rank companies by year-over-year revenue growth percentage', value: 'highest_revenue_growth' },
          { id: 'opt_highest_roi', label: 'Highest AI Investment Return', description: 'Rank companies by estimated ROI on their AI initiatives', value: 'highest_investment_roi' },
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
          { id: 'opt_highest_rev', label: 'Total Annual Revenue', description: 'Total gross sales generated in fiscal 2024', value: 'highest_revenue' },
          { id: 'opt_highest_profit', label: 'Net Profit', description: 'Bottom-line profit after operating and R&D costs', value: 'highest_profit' },
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

  // Direct queries: generate direct response
  return buildResolvedResponse(question, 'highest_revenue');
}

export function handleFallbackClarify(sessionId, selectedOptionId) {
  let metric = 'highest_revenue';
  if (selectedOptionId === 'opt_highest_profit') metric = 'highest_profit';
  if (selectedOptionId === 'opt_highest_growth') metric = 'highest_revenue_growth';
  if (selectedOptionId === 'opt_highest_roi') metric = 'highest_investment_roi';
  if (selectedOptionId === 'opt_model_score') metric = 'model_score';
  if (selectedOptionId === 'opt_model_params') metric = 'model_params';

  return buildResolvedResponse('Show me the best performing AI companies', metric);
}

function buildResolvedResponse(question, metric) {
  const companyLookup = {
    1: 'OpenAI',
    2: 'Anthropic',
    3: 'Google DeepMind',
    4: 'NVIDIA',
    5: 'Microsoft AI',
    6: 'Meta AI',
    7: 'Mistral AI',
    8: 'Cohere',
    15: 'Amazon AWS AI',
    16: 'Apple ML',
    19: 'Midjourney',
    20: 'Scale AI',
  };

  if (metric === 'model_score' || metric === 'model_params') {
    const isScore = metric === 'model_score';
    const sql = isScore
      ? 'SELECT m.model_name, c.company_name, m.model_category, m.performance_score FROM ai_models m JOIN companies c ON m.company_id = c.company_id ORDER BY m.performance_score DESC LIMIT 10;'
      : 'SELECT m.model_name, c.company_name, m.parameter_count_billions, m.release_year FROM ai_models m JOIN companies c ON m.company_id = c.company_id WHERE m.parameter_count_billions IS NOT NULL ORDER BY m.parameter_count_billions DESC LIMIT 10;';

    const rows = isScore
      ? SAMPLE_MODELS.map(m => ({ model_name: m.model_name, company_name: companyLookup[m.company_id] || 'AI Lab', model_category: m.model_category, performance_score: m.performance_score }))
      : SAMPLE_MODELS.map(m => ({ model_name: m.model_name, company_name: companyLookup[m.company_id] || 'AI Lab', parameter_count_billions: m.parameter_count_billions, release_year: m.release_year }));

    return {
      status: 'SQL_GENERATED',
      sessionId: 'session-demo',
      originalQuestion: question,
      clarification: null,
      generatedSql: sql,
      explanation: isScore ? 'Ranks AI models by standardized evaluation score.' : 'Ranks AI models by total parameter count in billions.',
      data: {
        status: 'SUCCESS',
        columns: isScore ? ['model_name', 'company_name', 'model_category', 'performance_score'] : ['model_name', 'company_name', 'parameter_count_billions', 'release_year'],
        rows,
        rowCount: rows.length,
        executionTimeMs: 14,
        sql,
        explanation: isScore ? 'Ranks AI models by standardized evaluation score.' : 'Ranks AI models by total parameter count in billions.',
        chartSuggestion: {
          type: 'bar',
          title: isScore ? 'Performance score by Model name' : 'Parameter count by Model name',
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

  let rows = SAMPLE_FINANCIALS.map(f => ({
    company_name: companyLookup[f.company_id] || `AI Enterprise #${f.company_id}`,
    revenue_millions: f.revenue_millions,
    profit_millions: f.profit_millions,
    revenue_growth_percent: f.revenue_growth_percent,
  }));
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
        xaxis: 'company_name',
        yaxis: isProfit ? 'profit_millions' : isGrowth ? 'revenue_growth_percent' : 'revenue_millions',
      },
    },
  };
}
