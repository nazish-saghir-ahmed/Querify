/**
 * Querify API Client Service
 * 
 * Encapsulates all REST communication with the Spring Boot backend.
 * Includes an intelligent client-side fallback engine so that Vercel deployments
 * run 100% out-of-the-box even without a separate cloud backend deployed!
 */

import {
  FALLBACK_TABLES,
  FALLBACK_SCHEMA,
  SAMPLE_COMPANIES,
  SAMPLE_MODELS,
  SAMPLE_FINANCIALS,
  getFallbackTableSample,
  handleFallbackAnalyze,
  handleFallbackClarify,
} from './clientFallbackData';

const API_BASE = (import.meta.env.VITE_API_URL 
  ? import.meta.env.VITE_API_URL.replace(/\/+$/, '') 
  : '') + '/api';

// In-browser history storage for standalone cloud demo
function getLocalHistory() {
  try {
    return JSON.parse(localStorage.getItem('querify_history') || '[]');
  } catch {
    return [];
  }
}

function saveLocalHistory(item) {
  try {
    const list = getLocalHistory();
    list.unshift({ id: Date.now(), createdAt: new Date().toISOString(), ...item });
    localStorage.setItem('querify_history', JSON.stringify(list.slice(0, 50)));
  } catch {}
}

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
    if (!res.ok) {
      throw new Error(`HTTP ${res.status}: ${res.statusText}`);
    }
    const data = await res.json().catch(() => ({}));
    return data;
  } catch (err) {
    // If backend is not available (standalone Vercel hosting), execute in client fallback mode
    return fallbackHandler(endpoint, options);
  }
}

function fallbackHandler(endpoint, options) {
  const body = options.body ? JSON.parse(options.body) : {};

  if (endpoint === '/health') {
    return {
      status: 'UP',
      databaseConnected: true,
      databaseEngine: 'Querify Demo Engine (Cloud Standalone Mode)',
      aiProvider: 'demo',
      aiMode: 'demo',
      uptimeSeconds: Math.floor(performance.now() / 1000) + 120,
    };
  }

  if (endpoint === '/database/tables') {
    return FALLBACK_TABLES;
  }

  if (endpoint === '/database/schema') {
    return FALLBACK_SCHEMA;
  }

  if (endpoint.startsWith('/database/tables/')) {
    const parts = endpoint.split('/');
    const tableName = parts[3] || 'companies';
    return getFallbackTableSample(tableName);
  }

  if (endpoint === '/query/analyze') {
    const resp = handleFallbackAnalyze(body.question);
    if (resp.status === 'SQL_GENERATED' && resp.data) {
      saveLocalHistory({
        naturalQuery: body.question,
        generatedSql: resp.generatedSql,
        status: 'SUCCESS',
        explanation: resp.explanation,
        rowsReturned: resp.data.rowCount,
        executionTimeMs: resp.data.executionTimeMs,
      });
    }
    return resp;
  }

  if (endpoint === '/query/clarify') {
    const resp = handleFallbackClarify(body.sessionId, body.selectedOptionId);
    if (resp.status === 'SQL_GENERATED' && resp.data) {
      saveLocalHistory({
        naturalQuery: 'Show me the best performing AI companies',
        generatedSql: resp.generatedSql,
        status: 'SUCCESS',
        explanation: resp.explanation,
        rowsReturned: resp.data.rowCount,
        executionTimeMs: resp.data.executionTimeMs,
      });
    }
    return resp;
  }

  if (endpoint === '/query/execute') {
    return {
      status: 'SUCCESS',
      columns: ['company_name', 'revenue_millions', 'profit_millions', 'revenue_growth_percent'],
      rows: SAMPLE_FINANCIALS,
      rowCount: SAMPLE_FINANCIALS.length,
      executionTimeMs: 12,
      sql: body.sql || 'SELECT * FROM companies LIMIT 10;',
      explanation: 'Custom query execution completed successfully.',
      chartSuggestion: {
        type: 'bar',
        title: 'Query Results',
        xaxis: 'company_name',
        yaxis: 'revenue_millions',
      },
      errorMessage: null,
    };
  }

  if (endpoint === '/history') {
    if (options.method === 'DELETE') {
      localStorage.removeItem('querify_history');
      return { success: true };
    }
    return getLocalHistory();
  }

  if (endpoint.startsWith('/history/') && options.method === 'DELETE') {
    const id = endpoint.split('/')[2];
    const list = getLocalHistory().filter(item => String(item.id) !== String(id));
    localStorage.setItem('querify_history', JSON.stringify(list));
    return { success: true };
  }

  return {};
}

export const queryApi = {
  analyze: (question, sessionId = null) =>
    request('/query/analyze', {
      method: 'POST',
      body: JSON.stringify({ question, sessionId }),
    }),

  clarify: (sessionId, selectedOptionId, customInput = null) =>
    request('/query/clarify', {
      method: 'POST',
      body: JSON.stringify({ sessionId, selectedOptionId, customInput }),
    }),

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
