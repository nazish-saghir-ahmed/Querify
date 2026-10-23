/**
 * Vercel Serverless Function: GET /api/database/schema (ESM)
 */

import { SCHEMA, sendJson, handleCors, maybeProxyToBackend } from '../_utils.js';

export default async function handler(req, res) {
  if (handleCors(req, res)) return;

  const proxied = await maybeProxyToBackend(req, res, '/api/database/schema');
  if (proxied) return;

  return sendJson(res, 200, SCHEMA);
}
