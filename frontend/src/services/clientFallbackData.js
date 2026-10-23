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
    columns: [
      { columnName: 'company_id', dataType: 'INT', isNullable: 'NO', columnKey: 'PRI', defaultValue: null },
      { columnName: 'company_name', dataType: 'VARCHAR(100)', isNullable: 'NO', columnKey: 'UNI', defaultValue: null },
      { columnName: 'industry', dataType: 'VARCHAR(100)', isNullable: 'NO', columnKey: '', defaultValue: null },
      { columnName: 'country', dataType: 'VARCHAR(50)', isNullable: 'NO', columnKey: '', defaultValue: null },
      { columnName: 'founded_year', dataType: 'INT', isNullable: 'NO', columnKey: '', defaultValue: null },
      { columnName: 'company_type', dataType: 'VARCHAR(50)', isNullable: 'NO', columnKey: '', defaultValue: null },
      { columnName: 'headquarters_city', dataType: 'VARCHAR(100)', isNullable: 'NO', columnKey: '', defaultValue: null },
    ],
  },
  {
    tableName: 'ai_models',
    columns: [
      { columnName: 'model_id', dataType: 'INT', isNullable: 'NO', columnKey: 'PRI', defaultValue: null },
      { columnName: 'company_id', dataType: 'INT', isNullable: 'NO', columnKey: 'MUL', defaultValue: null },
      { columnName: 'model_name', dataType: 'VARCHAR(100)', isNullable: 'NO', columnKey: '', defaultValue: null },
      { columnName: 'model_category', dataType: 'VARCHAR(50)', isNullable: 'NO', columnKey: '', defaultValue: null },
      { columnName: 'release_year', dataType: 'INT', isNullable: 'NO', columnKey: '', defaultValue: null },
      { columnName: 'parameter_count_billions', dataType: 'DECIMAL(10,2)', isNullable: 'YES', columnKey: '', defaultValue: null },
      { columnName: 'performance_score', dataType: 'DECIMAL(5,2)', isNullable: 'NO', columnKey: '', defaultValue: null },
    ],
  },
  {
    tableName: 'financial_performance',
    columns: [
      { columnName: 'performance_id', dataType: 'INT', isNullable: 'NO', columnKey: 'PRI', defaultValue: null },
      { columnName: 'company_id', dataType: 'INT', isNullable: 'NO', columnKey: 'MUL', defaultValue: null },
      { columnName: 'fiscal_year', dataType: 'INT', isNullable: 'NO', columnKey: '', defaultValue: null },
      { columnName: 'revenue_millions', dataType: 'DECIMAL(12,2)', isNullable: 'NO', columnKey: '', defaultValue: null },
      { columnName: 'profit_millions', dataType: 'DECIMAL(12,2)', isNullable: 'NO', columnKey: '', defaultValue: null },
      { columnName: 'operating_cost_millions', dataType: 'DECIMAL(12,2)', isNullable: 'NO', columnKey: '', defaultValue: null },
      { columnName: 'revenue_growth_percent', dataType: 'DECIMAL(6,2)', isNullable: 'NO', columnKey: '', defaultValue: null },
    ],
  },
  {
    tableName: 'ai_investments',
    columns: [
      { columnName: 'investment_id', dataType: 'INT', isNullable: 'NO', columnKey: 'PRI', defaultValue: null },
      { columnName: 'company_id', dataType: 'INT', isNullable: 'NO', columnKey: 'MUL', defaultValue: null },
      { columnName: 'investment_year', dataType: 'INT', isNullable: 'NO', columnKey: '', defaultValue: null },
      { columnName: 'investment_amount_millions', dataType: 'DECIMAL(12,2)', isNullable: 'NO', columnKey: '', defaultValue: null },
      { columnName: 'investment_category', dataType: 'VARCHAR(100)', isNullable: 'NO', columnKey: '', defaultValue: null },
      { columnName: 'estimated_return_percent', dataType: 'DECIMAL(6,2)', isNullable: 'NO', columnKey: '', defaultValue: null },
    ],
  },
  {
    tableName: 'research_projects',
    columns: [
      { columnName: 'project_id', dataType: 'INT', isNullable: 'NO', columnKey: 'PRI', defaultValue: null },
      { columnName: 'company_id', dataType: 'INT', isNullable: 'NO', columnKey: 'MUL', defaultValue: null },
      { columnName: 'project_name', dataType: 'VARCHAR(150)', isNullable: 'NO', columnKey: '', defaultValue: null },
      { columnName: 'research_area', dataType: 'VARCHAR(100)', isNullable: 'NO', columnKey: '', defaultValue: null },
      { columnName: 'budget_millions', dataType: 'DECIMAL(10,2)', isNullable: 'NO', columnKey: '', defaultValue: null },
      { columnName: 'project_status', dataType: 'VARCHAR(50)', isNullable: 'NO', columnKey: '', defaultValue: null },
      { columnName: 'start_date', dataType: 'DATE', isNullable: 'NO', columnKey: '', defaultValue: null },
    ],
  },
  {
    tableName: 'market_performance',
    columns: [
      { columnName: 'market_id', dataType: 'INT', isNullable: 'NO', columnKey: 'PRI', defaultValue: null },
      { columnName: 'company_id', dataType: 'INT', isNullable: 'NO', columnKey: 'MUL', defaultValue: null },
      { columnName: 'fiscal_year', dataType: 'INT', isNullable: 'NO', columnKey: '', defaultValue: null },
      { columnName: 'market_share_percent', dataType: 'DECIMAL(5,2)', isNullable: 'NO', columnKey: '', defaultValue: null },
      { columnName: 'customer_growth_percent', dataType: 'DECIMAL(6,2)', isNullable: 'NO', columnKey: '', defaultValue: null },
      { columnName: 'performance_index', dataType: 'DECIMAL(5,2)', isNullable: 'NO', columnKey: '', defaultValue: null },
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
  { model_id: 1, model_name: 'GPT-4o', company_name: 'OpenAI', model_category: 'Multimodal', release_year: 2024, parameter_count_billions: 200.0, performance_score: 92.8 },
  { model_id: 4, model_name: 'Claude 3.5 Sonnet', company_name: 'Anthropic', model_category: 'Reasoning', release_year: 2024, parameter_count_billions: 175.0, performance_score: 93.4 },
  { model_id: 6, model_name: 'Gemini 1.5 Pro', company_name: 'Google DeepMind', model_category: 'Multimodal', release_year: 2024, parameter_count_billions: 220.0, performance_score: 93.1 },
  { model_id: 7, model_name: 'AlphaFold 3', company_name: 'Google DeepMind', model_category: 'Scientific AI', release_year: 2024, parameter_count_billions: 15.0, performance_score: 97.5 },
  { model_id: 12, model_name: 'Llama 3.1 405B', company_name: 'Meta AI', model_category: 'LLM', release_year: 2024, parameter_count_billions: 405.0, performance_score: 92.4 },
  { model_id: 20, model_name: 'Midjourney v6', company_name: 'Midjourney', model_category: 'Computer Vision', release_year: 2024, parameter_count_billions: 25.0, performance_score: 94.3 },
];

export const SAMPLE_FINANCIALS = [
  { company_name: 'NVIDIA', fiscal_year: 2024, revenue_millions: 122000.0, profit_millions: 68000.0, revenue_growth_percent: 100.25 },
  { company_name: 'Microsoft AI', fiscal_year: 2024, revenue_millions: 38500.0, profit_millions: 14200.0, revenue_growth_percent: 43.66 },
  { company_name: 'Amazon AWS AI', fiscal_year: 2024, revenue_millions: 31000.0, profit_millions: 10800.0, revenue_growth_percent: 47.62 },
  { company_name: 'Meta AI', fiscal_year: 2024, revenue_millions: 24500.0, profit_millions: 6900.0, revenue_growth_percent: 51.23 },
  { company_name: 'Apple AI', fiscal_year: 2024, revenue_millions: 19800.0, profit_millions: 7200.0, revenue_growth_percent: 46.67 },
  { company_name: 'IBM Watson', fiscal_year: 2024, revenue_millions: 8900.0, profit_millions: 1450.0, revenue_growth_percent: 17.11 },
  { company_name: 'Baidu AI Lab', fiscal_year: 2024, revenue_millions: 7600.0, profit_millions: 1300.0, revenue_growth_percent: 31.03 },
  { company_name: 'OpenAI', fiscal_year: 2024, revenue_millions: 3700.0, profit_millions: -1200.0, revenue_growth_percent: 131.25 },
  { company_name: 'Google DeepMind', fiscal_year: 2024, revenue_millions: 3100.0, profit_millions: 580.0, revenue_growth_percent: 58.97 },
  { company_name: 'Databricks', fiscal_year: 2024, revenue_millions: 2500.0, profit_millions: 150.0, revenue_growth_percent: 56.25 },
];

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
  if (metric === 'model_score' || metric === 'model_params') {
    const isScore = metric === 'model_score';
    const sql = isScore
      ? 'SELECT m.model_name, c.company_name, m.model_category, m.performance_score FROM ai_models m JOIN companies c ON m.company_id = c.company_id ORDER BY m.performance_score DESC LIMIT 10;'
      : 'SELECT m.model_name, c.company_name, m.parameter_count_billions, m.release_year FROM ai_models m JOIN companies c ON m.company_id = c.company_id WHERE m.parameter_count_billions IS NOT NULL ORDER BY m.parameter_count_billions DESC LIMIT 10;';

    const rows = isScore
      ? SAMPLE_MODELS.map(m => ({ model_name: m.model_name, company_name: m.company_name, model_category: m.model_category, performance_score: m.performance_score }))
      : SAMPLE_MODELS.map(m => ({ model_name: m.model_name, company_name: m.company_name, parameter_count_billions: m.parameter_count_billions, release_year: m.release_year }));

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

  let rows = [...SAMPLE_FINANCIALS];
  if (isProfit) rows.sort((a, b) => b.profit_millions - a.profit_millions);
  if (isGrowth) rows.sort((a, b) => b.revenue_growth_percent - a.revenue_growth_percent);

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
