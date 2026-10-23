/**
 * Vercel Serverless Function: GET /api/database/tables/:tableName/sample (ESM)
 */

import { getTableSample, sendJson, handleCors, maybeProxyToBackend } from '../../../_utils.js';

export default async function handler(req, res) {
  if (handleCors(req, res)) return;

  const tableName = req.query?.tableName || req.query?.table || 'companies';

  const proxied = await maybeProxyToBackend(req, res, `/api/database/tables/${tableName}/sample`);
  if (proxied) return;

  const sampleData = getTableSample(tableName);
  return sendJson(res, 200, sampleData);
}
