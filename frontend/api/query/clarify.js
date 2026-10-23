/**
 * Vercel Serverless Function: POST /api/query/clarify (ESM)
 */

import {
  sendJson,
  handleCors,
  parseBody,
  maybeProxyToBackend,
  executeSqlLocally,
} from '../_utils.js';

export default async function handler(req, res) {
  if (handleCors(req, res)) return;

  if (req.method !== 'POST') {
    return sendJson(res, 405, { error: 'Method Not Allowed' });
  }

  const proxied = await maybeProxyToBackend(req, res, '/api/query/clarify');
  if (proxied) return;

  const body = await parseBody(req);
  const { sessionId, selectedOptionId, customInput } = body;

  let sql = 'SELECT c.company_name, f.revenue_millions, f.profit_millions, f.revenue_growth_percent FROM companies c JOIN financial_performance f ON c.company_id = f.company_id WHERE f.fiscal_year = 2024 ORDER BY f.revenue_millions DESC LIMIT 10;';
  let explanation = 'Ranks AI companies by gross annual revenue in 2024.';

  if (selectedOptionId === 'opt_highest_profit' || selectedOptionId === 'highest_profit') {
    sql = 'SELECT c.company_name, f.profit_millions, f.revenue_millions, f.revenue_growth_percent FROM companies c JOIN financial_performance f ON c.company_id = f.company_id WHERE f.fiscal_year = 2024 ORDER BY f.profit_millions DESC LIMIT 10;';
    explanation = 'Ranks AI companies by net bottom-line profit in 2024.';
  } else if (selectedOptionId === 'opt_highest_growth' || selectedOptionId === 'highest_revenue_growth') {
    sql = 'SELECT c.company_name, f.revenue_growth_percent, f.revenue_millions, f.profit_millions FROM companies c JOIN financial_performance f ON c.company_id = f.company_id WHERE f.fiscal_year = 2024 ORDER BY f.revenue_growth_percent DESC LIMIT 10;';
    explanation = 'Ranks AI companies by YoY revenue percentage growth in 2024.';
  } else if (selectedOptionId === 'opt_highest_roi' || selectedOptionId === 'highest_investment_roi') {
    sql = 'SELECT c.company_name, i.investment_amount_millions, i.investment_category, i.estimated_return_percent FROM companies c JOIN ai_investments i ON c.company_id = i.company_id WHERE i.investment_year = 2024 ORDER BY i.estimated_return_percent DESC LIMIT 10;';
    explanation = 'Ranks AI companies by estimated ROI on AI compute & infrastructure investments.';
  } else if (selectedOptionId === 'opt_model_score' || selectedOptionId === 'benchmark_score') {
    sql = 'SELECT m.model_name, c.company_name, m.model_category, m.performance_score FROM ai_models m JOIN companies c ON m.company_id = c.company_id ORDER BY m.performance_score DESC LIMIT 10;';
    explanation = 'Ranks AI models by standardized benchmark evaluation score.';
  } else if (selectedOptionId === 'opt_model_params' || selectedOptionId === 'parameter_count') {
    sql = 'SELECT m.model_name, c.company_name, m.parameter_count_billions, m.release_year FROM ai_models m JOIN companies c ON m.company_id = c.company_id WHERE m.parameter_count_billions IS NOT NULL ORDER BY m.parameter_count_billions DESC LIMIT 10;';
    explanation = 'Ranks AI models by total parameter count in billions.';
  }

  const execution = executeSqlLocally(sql, `Clarified selection: ${selectedOptionId}`);

  return sendJson(res, 200, {
    status: 'SQL_GENERATED',
    sessionId: sessionId || `session-${Date.now()}`,
    originalQuestion: customInput || `Clarification selection (${selectedOptionId})`,
    clarification: null,
    generatedSql: execution.data.sql,
    explanation,
    data: execution.data,
  });
}
