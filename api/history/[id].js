/**
 * Vercel Serverless Function: DELETE /api/history/:id
 * Deletes a single audit log record by ID.
 */

const {
  AUDIT_HISTORY,
  sendJson,
  handleCors,
  maybeProxyToBackend,
} = require('../../_utils');

module.exports = async function handler(req, res) {
  if (handleCors(req, res)) return;

  const id = req.query.id;

  const proxied = await maybeProxyToBackend(req, res, `/api/history/${id}`);
  if (proxied) return;

  const idx = AUDIT_HISTORY.findIndex(item => String(item.id) === String(id));
  if (idx !== -1) {
    AUDIT_HISTORY.splice(idx, 1);
  }

  return sendJson(res, 200, { success: true, id });
};
