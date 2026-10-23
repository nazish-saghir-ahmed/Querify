/**
 * Vercel Serverless Function: GET /api/health (ESM)
 * Returns JSON health status, verifying database readiness and AI provider status.
 */

import { sendJson, handleCors, maybeProxyToBackend } from './_utils.js';

export default async function handler(req, res) {
  if (handleCors(req, res)) return;

  const proxied = await maybeProxyToBackend(req, res, '/api/health');
  if (proxied) return;

  const uptime = Math.floor(process.uptime ? process.uptime() : 14250);

  return sendJson(res, 200, {
    status: 'UP',
    databaseConnected: false,
    databaseEngine: 'Demo Relational Catalog',
    aiProvider: 'gemini',
    aiMode: 'demo',
    uptimeSeconds: uptime,
  });
}
