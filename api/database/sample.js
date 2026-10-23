/**
 * Vercel Serverless Function: GET /api/database/sample
 * Fetches sample rows for a table specified in query param ?table=...
 */

const { getTableSample, sendJson, handleCors, maybeProxyToBackend } = require('../_utils');

module.exports = async function handler(req, res) {
  if (handleCors(req, res)) return;

  const tableName = req.query.table || req.query.tableName || 'companies';

  const proxied = await maybeProxyToBackend(req, res, `/api/database/sample?table=${tableName}`);
  if (proxied) return;

  const sampleData = getTableSample(tableName);
  return sendJson(res, 200, sampleData);
};
