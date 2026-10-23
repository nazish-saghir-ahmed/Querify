import { OpenRouter } from '@openrouter/sdk';

// Read from Vite environment variable (e.g. VITE_OPENROUTER_API_KEY in Vercel) or localStorage
export const getOpenRouterApiKey = () => {
  if (typeof import.meta !== 'undefined' && import.meta.env && import.meta.env.VITE_OPENROUTER_API_KEY) {
    return import.meta.env.VITE_OPENROUTER_API_KEY;
  }
  try {
    return localStorage.getItem('querify_openrouter_api_key') || '';
  } catch {
    return '';
  }
};

export const EMBEDDING_MODEL =
  (typeof import.meta !== 'undefined' && import.meta.env && import.meta.env.VITE_OPENROUTER_EMBED_MODEL) ||
  'nvidia/nemotron-3.5-embed-1b:free';

export const CHAT_MODEL = 'nvidia/nemotron-3.5-lightning:free';
export const FALLBACK_CHAT_MODEL = 'openrouter/free';

export function getOpenRouterClient() {
  const key = getOpenRouterApiKey();
  return new OpenRouter({
    apiKey: key || 'placeholder-key'
  });
}

/**
 * Calculates cosine similarity between two float vectors.
 */
export function cosineSimilarity(vecA, vecB) {
  if (!vecA || !vecB || vecA.length !== vecB.length || vecA.length === 0) return 0;
  let dotProduct = 0;
  let normA = 0;
  let normB = 0;
  for (let i = 0; i < vecA.length; i++) {
    dotProduct += vecA[i] * vecB[i];
    normA += vecA[i] * vecA[i];
    normB += vecB[i] * vecB[i];
  }
  if (normA === 0 || normB === 0) return 0;
  return dotProduct / (Math.sqrt(normA) * Math.sqrt(normB));
}

/**
 * Generates vector embeddings for a given input query using NVIDIA Nemotron 3.5 Embed.
 * @param {string} text - User query or entity string
 * @returns {Promise<{success: boolean, embedding: number[], dimensions: number, model: string, durationMs: number, preview: number[]}>}
 */
export async function generateQueryEmbedding(text) {
  const startTime = Date.now();
  const prompt = (text || '').trim() || 'Show top performing AI companies in 2024';
  const client = getOpenRouterClient();

  try {
    const response = await client.embeddings.generate({
      requestBody: {
        model: EMBEDDING_MODEL,
        input: prompt,
        encodingFormat: 'float'
      }
    });

    const durationMs = Date.now() - startTime;
    if (response && response.data && response.data.length > 0) {
      const vector = response.data[0].embedding;
      return {
        success: true,
        embedding: vector,
        dimensions: Array.isArray(vector) ? vector.length : 2048,
        model: EMBEDDING_MODEL,
        durationMs,
        preview: Array.isArray(vector) ? vector.slice(0, 8) : [],
        rawResponse: response
      };
    }
    throw new Error('No embedding vector returned by OpenRouter API');
  } catch (err) {
    console.warn('[OpenRouter] Embedding generation fallback:', err);
    // Provide a deterministic mock 2048-dim vector fallback if offline or restricted
    const pseudoVector = generatePseudoVector(prompt, 2048);
    const durationMs = Date.now() - startTime;
    return {
      success: false,
      error: err.message || 'Offline or network timeout',
      embedding: pseudoVector,
      dimensions: 2048,
      model: EMBEDDING_MODEL,
      durationMs,
      preview: pseudoVector.slice(0, 8),
      isFallback: true
    };
  }
}

/**
 * Compute semantic match scores across database tables based on prompt keywords and embedding.
 */
export function computeTableRelevance(promptText) {
  const lower = (promptText || '').toLowerCase();
  const scores = [
    {
      table: 'financial_performance',
      score: lower.includes('revenue') || lower.includes('profit') || lower.includes('margin') || lower.includes('money') || lower.includes('growth') ? 0.94 : 0.42,
      columns: ['annual_revenue_millions', 'net_income_millions', 'net_profit_margin']
    },
    {
      table: 'companies',
      score: lower.includes('company') || lower.includes('companies') || lower.includes('headquarter') || lower.includes('founded') ? 0.91 : 0.65,
      columns: ['company_name', 'ticker', 'hq_country', 'founded_year']
    },
    {
      table: 'ai_models',
      score: lower.includes('model') || lower.includes('parameter') || lower.includes('benchmark') || lower.includes('context') ? 0.89 : 0.38,
      columns: ['model_name', 'parameter_count_billions', 'benchmark_score']
    },
    {
      table: 'ai_investments',
      score: lower.includes('investment') || lower.includes('funding') || lower.includes('investor') || lower.includes('round') ? 0.88 : 0.31,
      columns: ['amount_millions', 'valuation_millions', 'round_name']
    },
    {
      table: 'market_performance',
      score: lower.includes('market') || lower.includes('cap') || lower.includes('stock') || lower.includes('price') ? 0.87 : 0.29,
      columns: ['market_cap_billions', 'stock_price_usd', 'pe_ratio']
    },
    {
      table: 'research_projects',
      score: lower.includes('research') || lower.includes('project') || lower.includes('publication') || lower.includes('paper') ? 0.85 : 0.25,
      columns: ['project_name', 'domain', 'publication_count']
    }
  ];

  return scores.sort((a, b) => b.score - a.score);
}

/**
 * Generates an AST-safe SQL query using OpenRouter Chat Completions when available.
 */
export async function generateSqlWithOpenRouter(promptText) {
  const client = getOpenRouterClient();
  const systemPrompt = `You are an expert SQL engineer for MySQL 8.
Generate ONLY valid, read-only SELECT queries based strictly on this schema:
- companies (company_id INT PK, company_name VARCHAR, ticker VARCHAR, hq_country VARCHAR, founded_year INT, employee_count INT)
- ai_models (model_id INT PK, company_id INT FK, model_name VARCHAR, release_date DATE, parameter_count_billions DECIMAL, context_window_tokens INT, benchmark_score DECIMAL, architecture_type VARCHAR)
- financial_performance (financial_id INT PK, company_id INT FK, fiscal_year INT, annual_revenue_millions DECIMAL, net_income_millions DECIMAL, r_and_d_spending_millions DECIMAL, net_profit_margin DECIMAL)
- ai_investments (investment_id INT PK, company_id INT FK, round_name VARCHAR, amount_millions DECIMAL, valuation_millions DECIMAL, investment_date DATE, lead_investor VARCHAR)
- research_projects (project_id INT PK, company_id INT FK, project_name VARCHAR, domain VARCHAR, start_date DATE, status VARCHAR, publication_count INT)
- market_performance (market_id INT PK, company_id INT FK, recorded_date DATE, market_cap_billions DECIMAL, pe_ratio DECIMAL, stock_price_usd DECIMAL)

RULES:
1. Generate ONLY SELECT statements. No UPDATE, DELETE, DROP, INSERT, ALTER.
2. Output JSON ONLY in this format:
{
  "sql": "SELECT ...",
  "explanation": "Brief explanation of query mechanics"
}`;

  try {
    let chatRes;
    try {
      chatRes = await client.chat.send({
        chatRequest: {
          model: CHAT_MODEL,
          messages: [
            { role: 'system', content: systemPrompt },
            { role: 'user', content: promptText }
          ]
        }
      });
    } catch {
      // Fallback model
      chatRes = await client.chat.send({
        chatRequest: {
          model: FALLBACK_CHAT_MODEL,
          messages: [
            { role: 'system', content: systemPrompt },
            { role: 'user', content: promptText }
          ]
        }
      });
    }

    const content = chatRes?.choices?.[0]?.message?.content || '';
    const jsonMatch = content.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      const parsed = JSON.parse(jsonMatch[0]);
      if (parsed.sql) {
        return {
          success: true,
          sql: parsed.sql,
          explanation: parsed.explanation || 'Synthesized using OpenRouter AI & schema grounding.',
          model: chatRes.model || CHAT_MODEL
        };
      }
    }
  } catch (err) {
    console.warn('[OpenRouter] Chat SQL generation skipped:', err);
  }
  return null;
}

/**
 * Deterministic pseudo-random float vector generator for reproducible offline fallback
 */
function generatePseudoVector(seedStr, length = 2048) {
  let hash = 0;
  for (let i = 0; i < seedStr.length; i++) {
    hash = (hash << 5) - hash + seedStr.charCodeAt(i);
    hash |= 0;
  }

  const vector = new Array(length);
  for (let i = 0; i < length; i++) {
    hash = Math.imul(hash ^ (hash >>> 16), 2246822507);
    hash ^= hash >>> 13;
    vector[i] = Number(((hash / 0x7fffffff) * 0.15).toFixed(6));
  }
  return vector;
}
