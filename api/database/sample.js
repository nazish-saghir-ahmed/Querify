/**
 * Vercel Serverless Function: GET /api/database/sample (ESM)
 */

import { getTableSample, sendJson, handleCors, maybeProxyToBackend } from '../_utils.js';

export default async function handler(req, res) {
  if (handleCors(req, res)) return;

  const tableName = req.query?.table || req.query?.tableName || 'companies';

  const proxied = await maybeProxyToBackend(req, res, `/api/database/sample?table=${tableName}`);
  if (proxied) return;

  const sampleData = getTableSample(tableName);
  return sendJson(res, 200, sampleData);
}
