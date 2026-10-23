/**
 * Vercel Serverless Function: Catch-All Router /api/*
 * Forwards any unmapped API request to the backend or returns standard JSON.
 */

const { sendJson, handleCors, maybeProxyToBackend } = require('./_utils');

module.exports = async function handler(req, res) {
  if (handleCors(req, res)) return;

  const urlPath = req.url || '/api';
  const proxied = await maybeProxyToBackend(req, res, urlPath);
  if (proxied) return;

  return sendJson(res, 200, {
    status: 'UP',
    message: 'Querify Enterprise Serverless API Gateway',
    path: urlPath,
  });
};
