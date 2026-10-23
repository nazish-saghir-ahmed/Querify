/**
 * Vercel Serverless Function: GET /api/history & DELETE /api/history (ESM)
 */

import {
  AUDIT_HISTORY,
  sendJson,
  handleCors,
  maybeProxyToBackend,
} from './_utils.js';

export default async function handler(req, res) {
  if (handleCors(req, res)) return;

  const proxied = await maybeProxyToBackend(req, res, '/api/history');
  if (proxied) return;

  if (req.method === 'DELETE') {
    AUDIT_HISTORY.length = 0;
    return sendJson(res, 200, { success: true, message: 'History cleared' });
  }

  return sendJson(res, 200, AUDIT_HISTORY);
}
