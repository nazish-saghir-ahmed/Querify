/**
 * Querify API Client Service
 * Encapsulates all REST communication with the Spring Boot backend.
 */

const API_BASE = (import.meta.env.VITE_API_URL 
  ? import.meta.env.VITE_API_URL.replace(/\/+$/, '') 
  : '') + '/api';

async function request(endpoint, options = {}) {
  const config = {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    ...options,
  };

  try {
    const res = await fetch(`${API_BASE}${endpoint}`, config);
    const data = await res.json().catch(() => ({}));

    if (!res.ok) {
      const errorMsg = data.message || data.error || `HTTP ${res.status}: ${res.statusText}`;
      const error = new Error(errorMsg);
      error.status = res.status;
      error.details = data;
      throw error;
    }

    return data;
  } catch (err) {
    console.error(`API request error on [${endpoint}]:`, err);
    throw err;
  }
}

export const queryApi = {
  // Stage 1 & 2: Analyze question and check for ambiguity
  analyze: (question, sessionId = null) =>
    request('/query/analyze', {
      method: 'POST',
      body: JSON.stringify({ question, sessionId }),
    }),

  // Stage 3 & 4: Submit clarification selection
  clarify: (sessionId, selectedOptionId, customInput = null) =>
    request('/query/clarify', {
      method: 'POST',
      body: JSON.stringify({ sessionId, selectedOptionId, customInput }),
    }),

  // Direct SQL execution
  execute: (sql, naturalQuery = '', explanation = '') =>
    request('/query/execute', {
      method: 'POST',
      body: JSON.stringify({ sql, naturalQuery, explanation }),
    }),
};

export const databaseApi = {
  getSchema: () => request('/database/schema'),
  getTables: () => request('/database/tables'),
  getTableSample: (tableName) => request(`/database/tables/${tableName}/sample`),
};

export const historyApi = {
  getAll: () => request('/history'),
  deleteById: (id) => request(`/history/${id}`, { method: 'DELETE' }),
  clearAll: () => request('/history', { method: 'DELETE' }),
};

export const healthApi = {
  check: () => request('/health'),
};
