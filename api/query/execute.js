/**
 * Vercel Serverless Function: POST /api/query/execute
 * Validates generated SQL against AST security rules,
 * enforces read-only SELECT constraints, and executes the query.
 */

const {
  sendJson,
  handleCors,
  parseBody,
  maybeProxyToBackend,
  executeSqlLocally,
} = require('../_utils');

module.exports = async function handler(req, res) {
  if (handleCors(req, res)) return;

  if (req.method !== 'POST') {
    return sendJson(res, 405, { error: 'Method Not Allowed' });
  }

  const proxied = await maybeProxyToBackend(req, res, '/api/query/execute');
  if (proxied) return;

  const body = await parseBody(req);
  const sql = (body.sql || '').trim();
  const naturalQuery = body.naturalQuery || '';

  if (!sql) {
    return sendJson(res, 400, {
      status: 400,
      error: 'BadRequestException',
      message: 'SQL parameter cannot be null or empty.',
    });
  }

  const execution = executeSqlLocally(sql, naturalQuery);

  if (!execution.success) {
    return sendJson(res, execution.status || 403, {
      status: execution.status || 403,
      error: 'SqlSecurityException',
      message: execution.error,
    });
  }

  return sendJson(res, 200, execution.data);
};
