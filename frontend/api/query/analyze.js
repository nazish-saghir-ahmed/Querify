/**
 * Vercel Serverless Function: POST /api/query/analyze (ESM)
 */

import {
  sendJson,
  handleCors,
  parseBody,
  maybeProxyToBackend,
  detectAmbiguity,
  executeSqlLocally,
} from '../_utils.js';

export default async function handler(req, res) {
  if (handleCors(req, res)) return;

  if (req.method !== 'POST') {
    return sendJson(res, 405, { error: 'Method Not Allowed' });
  }

  const proxied = await maybeProxyToBackend(req, res, '/api/query/analyze');
  if (proxied) return;

  const body = await parseBody(req);
  const question = (body.question || '').trim();
  const sessionId = body.sessionId || `session-${Date.now()}`;

  if (!question) {
    return sendJson(res, 400, { error: 'Query question cannot be empty.' });
  }

  const ambiguity = detectAmbiguity(question);
  if (ambiguity.isAmbiguous) {
    return sendJson(res, 200, {
      status: 'CLARIFICATION_NEEDED',
      sessionId,
      originalQuestion: question,
      clarification: {
        questionId: ambiguity.questionId,
        prompt: ambiguity.prompt,
        context: ambiguity.context,
        options: ambiguity.options,
      },
      generatedSql: null,
      explanation: null,
      data: null,
    });
  }

  const lower = question.toLowerCase();
  let sql = 'SELECT c.company_name, f.revenue_millions, f.profit_millions, f.revenue_growth_percent FROM companies c JOIN financial_performance f ON c.company_id = f.company_id WHERE f.fiscal_year = 2024 ORDER BY f.revenue_millions DESC LIMIT 10;';

  if (lower.includes('profit')) {
    sql = 'SELECT c.company_name, f.profit_millions, f.revenue_millions, f.revenue_growth_percent FROM companies c JOIN financial_performance f ON c.company_id = f.company_id WHERE f.fiscal_year = 2024 ORDER BY f.profit_millions DESC LIMIT 10;';
  } else if (lower.includes('growth') || lower.includes('fast')) {
    sql = 'SELECT c.company_name, f.revenue_growth_percent, f.revenue_millions, f.profit_millions FROM companies c JOIN financial_performance f ON c.company_id = f.company_id WHERE f.fiscal_year = 2024 ORDER BY f.revenue_growth_percent DESC LIMIT 10;';
  } else if (lower.includes('model') || lower.includes('score')) {
    if (lower.includes('90') || lower.includes('above 90')) {
      sql = 'SELECT model_name, company_name, model_category, performance_score FROM ai_models WHERE performance_score > 90 ORDER BY performance_score DESC;';
    } else {
      sql = 'SELECT m.model_name, c.company_name, m.model_category, m.performance_score FROM ai_models m JOIN companies c ON m.company_id = c.company_id ORDER BY m.performance_score DESC LIMIT 10;';
    }
  } else if (lower.includes('investment') || lower.includes('capital')) {
    sql = 'SELECT c.company_name, i.investment_amount_millions, i.investment_category, i.estimated_return_percent FROM companies c JOIN ai_investments i ON c.company_id = i.company_id WHERE i.investment_year = 2024 ORDER BY i.investment_amount_millions DESC LIMIT 10;';
  } else if (lower.includes('project') || lower.includes('budget') || lower.includes('research')) {
    sql = 'SELECT p.project_name, c.company_name, p.research_area, p.budget_millions, p.project_status FROM research_projects p JOIN companies c ON p.company_id = c.company_id ORDER BY p.budget_millions DESC LIMIT 10;';
  } else if (lower.includes('market') || lower.includes('share')) {
    sql = 'SELECT c.company_name, m.market_share_percent, m.customer_growth_percent, m.performance_index FROM companies c JOIN market_performance m ON c.company_id = m.company_id WHERE m.fiscal_year = 2024 ORDER BY m.market_share_percent DESC LIMIT 10;';
  }

  const execution = executeSqlLocally(sql, question);

  return sendJson(res, 200, {
    status: 'SQL_GENERATED',
    sessionId,
    originalQuestion: question,
    clarification: null,
    generatedSql: execution.data.sql,
    explanation: 'Synthesized deterministic SQL query based on semantic intent and domain schema.',
    data: execution.data,
  });
}
