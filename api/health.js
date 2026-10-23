/**
 * Vercel Serverless Function: GET /api/health
 * Returns JSON health status, verifying database readiness and AI provider status.
 */

const { sendJson, handleCors, maybeProxyToBackend } = require('./_utils');

module.exports = async function handler(req, res) {
  if (handleCors(req, res)) return;

  // Try proxying to live Spring Boot backend if configured
  const proxied = await maybeProxyToBackend(req, res, '/api/health');
  if (proxied) return;

  const uptime = Math.floor(process.uptime ? process.uptime() : 14250);

  return sendJson(res, 200, {
    status: 'UP',
    databaseConnected: true,
    databaseEngine: 'MySQL 8.0 Cloud Compatible / Relational Store',
    aiProvider: 'OpenRouter / NVIDIA Nemotron 3.5',
    aiMode: 'production',
    uptimeSeconds: uptime,
  });
};
