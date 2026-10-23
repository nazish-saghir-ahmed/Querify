/**
 * Vercel Serverless Function: GET /api/database/tables
 * Returns catalog of available tables with their respective row counts.
 */

const { TABLES, sendJson, handleCors, maybeProxyToBackend } = require('../_utils');

module.exports = async function handler(req, res) {
  if (handleCors(req, res)) return;

  const proxied = await maybeProxyToBackend(req, res, '/api/database/tables');
  if (proxied) return;

  return sendJson(res, 200, TABLES);
};
