/**
 * Vercel Serverless Function: GET /api/database/schema
 * Exposes detailed schema metadata, primary/foreign keys, and column definitions.
 */

const { SCHEMA, sendJson, handleCors, maybeProxyToBackend } = require('../_utils');

module.exports = async function handler(req, res) {
  if (handleCors(req, res)) return;

  const proxied = await maybeProxyToBackend(req, res, '/api/database/schema');
  if (proxied) return;

  return sendJson(res, 200, SCHEMA);
};
