/**
 * Vercel Serverless Function: Catch-All Router /api/* (ESM)
 */

import { sendJson, handleCors, maybeProxyToBackend } from './_utils.js';

export default async function handler(req, res) {
  if (handleCors(req, res)) return;

  const urlPath = req.url || '/api';
  const proxied = await maybeProxyToBackend(req, res, urlPath);
  if (proxied) return;

  return sendJson(res, 200, {
    status: 'UP',
    message: 'Querify Enterprise Serverless API Gateway',
    path: urlPath,
  });
}
