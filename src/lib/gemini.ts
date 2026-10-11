import { GoogleGenAI } from '@google/genai';

export const GROOVEYY_SYSTEM_INSTRUCTION = `You are Grooveyy, a world-class, passionate, encouraging, and knowledgeable AI Performing Arts Companion and Coach.
You specialize EXCLUSIVELY in performing arts:
1. Dance and choreography (contemporary, ballet, hip-hop, jazz, tap, ballroom, modern, cultural dance, improvisation, alignment, balance, turns/pirouettes, musicality)
2. Singing and vocal techniques (vocal pedagogy, breath support, subglottic pressure, resonance, registration/mix, belt, falsetto/head voice, range extension, pitch accuracy, patter singing, diction/articulation)
3. Music and musical performance (composition, sight-reading, ear training, rhythm, phrasing, dynamics, interpretation, accompaniment, transposition)
4. Theater and acting (Stanislavski, Meisner, Uta Hagen, Michael Chekhov, scene study, monologue prep, character objectives, beats, tactics, subtext, vocal projection, emotional recall/availability)
5. Stage performance and audition preparation (callbacks, cold reading, 16/32-bar audition cuts, slate delivery, stage fright management, blocking, audition etiquette, self-tapes)
6. Rehearsal techniques and performance improvement (practice logs, metronome patter drills, muscle memory pacing, recovery, ensemble coordination)

TONE & PERSONALITY:
- Knowledgeable, empathetic, encouraging, artistic, and creatively inspiring.
- Natural, mature, supportive, and professional tone — never patronizing, clinical, or overly childish.
- Structure responses with clean, readable, theatrical-workbook formatting: use clear headings, concise tactile cues, action verbs, bullet points, or step-by-step drills.
- Adapt your technical depth dynamically based on whether the artist is a beginner, intermediate, or advanced/audition performer.
- When an artistic request is vague, ask an insightful clarifying question (e.g., character arc, musical tempo, vocal range, or dance style).
- Always include actionable cues (e.g., "Tactile Cue", "Action Verb", "Practice Cadence").
- If a musical piece or patter is discussed, suggest tempo (BPM) or metronome drills where helpful.

CRITICAL SAFETY & INJURY-PREVENTION RULES:
- Vocal Safety: For singing and vocal work, emphasize proper hydration, gentle semi-occluded vocal tract (SOVT) exercises (lip trills, straw phonation), gradual warm-ups, and vocal rest. Explicitly instruct users NEVER to push through vocal strain, raspy fatigue, or throat pain.
- Dance & Movement Safety: Emphasize proper alignment, warm-up of major joints and core, safe stretching, and proper landing mechanics. Instruct performers to stop if they feel sharp pain or joint distress.

STRICT BOUNDARY:
- Grooveyy is exclusively for performing arts. If a user asks questions entirely unrelated to performing arts (e.g. coding general software, math homework, politics, cooking, etc.), respond politely and warmly redirect them back to dance, vocal training, stage acting, music, or auditions.`;

import fs from 'fs';
import path from 'path';

function sanitizeApiKey(key: string): string {
  if (!key) return '';
  return key
    .trim()
    .replace(/^Bearer\s+/i, '')
    .replace(/^["']|["']$/g, '')
    .trim();
}

/**
 * Resolves the Gemini API key with strict local development precedence:
 * 1. Project-root `.env.local` (local developer override, preventing stale OS env variables from breaking local dev)
 * 2. `process.env.GEMINI_API_KEY` (sanitized environment variable)
 * 3. Project-root `.env` (fallback)
 * 4. `process.env.GOOGLE_API_KEY` (fallback if GEMINI_API_KEY is not defined)
 *
 * Automatically strips quotes, accidental 'Bearer ' prefixes, and whitespace.
 */
export function getGeminiApiKey(): string {
  const cwd = process.cwd();

  // 1. Check .env.local in project root
  const envLocalPath = path.resolve(cwd, '.env.local');
  if (fs.existsSync(envLocalPath)) {
    try {
      const content = fs.readFileSync(envLocalPath, 'utf8');
      const match = content.match(/^\s*GEMINI_API_KEY\s*=\s*([^\r\n#]+)/m);
      if (match) {
        const cleaned = sanitizeApiKey(match[1]);
        if (cleaned) {
          process.env.GEMINI_API_KEY = cleaned;
          return cleaned;
        }
      }
    } catch {
      // Ignore read errors
    }
  }

  // 2. Check process.env.GEMINI_API_KEY
  if (process.env.GEMINI_API_KEY) {
    const cleaned = sanitizeApiKey(process.env.GEMINI_API_KEY);
    if (cleaned) {
      process.env.GEMINI_API_KEY = cleaned;
      return cleaned;
    }
  }

  // 3. Check .env in project root
  const envPath = path.resolve(cwd, '.env');
  if (fs.existsSync(envPath)) {
    try {
      const content = fs.readFileSync(envPath, 'utf8');
      const match = content.match(/^\s*GEMINI_API_KEY\s*=\s*([^\r\n#]+)/m);
      if (match) {
        const cleaned = sanitizeApiKey(match[1]);
        if (cleaned) {
          process.env.GEMINI_API_KEY = cleaned;
          return cleaned;
        }
      }
    } catch {
      // Ignore read errors
    }
  }

  // 4. Fallback to GOOGLE_API_KEY if explicitly set and GEMINI_API_KEY is absent
  if (process.env.GOOGLE_API_KEY) {
    const cleaned = sanitizeApiKey(process.env.GOOGLE_API_KEY);
    if (cleaned) {
      return cleaned;
    }
  }

  return '';
}

let aiClient: GoogleGenAI | null = null;
let activeApiKey: string | null = null;

export const PRIMARY_MODEL = process.env.GEMINI_MODEL || 'gemini-3.8-flash';

// Verified model fallback chain.
// - gemini-3.7-flash / gemini-3.5-flash: same Flash-3.x quota pool as the primary
//   (they 429 together when the daily free-tier quota is exhausted).
// - gemini-3.1-flash-lite: a distinct, lighter model that succeeds even while the
//   primary Flash-3.x quota is exhausted, so it is the effective rescue path.
export const FALLBACK_MODELS = [
  'gemini-3.1-flash-lite',
  'gemini-3.5-flash',
  'gemini-3-flash-preview',
];

export function getGeminiClient(): GoogleGenAI {
  const apiKey = getGeminiApiKey();

  if (!apiKey) {
    throw new Error(
      'GEMINI_API_KEY is not configured on the server. Please set it in .env.local in the project root.'
    );
  }

  // Check for conflicting GOOGLE_API_KEY without exposing secret values in logs
  if (process.env.GOOGLE_API_KEY && process.env.GOOGLE_API_KEY !== apiKey) {
    console.warn(
      '[GrooveyAI] Notice: Both GOOGLE_API_KEY and GEMINI_API_KEY are detected. Using GEMINI_API_KEY for the Gemini Developer API.'
    );
  }

  if (!aiClient || activeApiKey !== apiKey) {
    aiClient = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    });
    activeApiKey = apiKey;
  }
  return aiClient;
}

/**
 * Extracts an HTTP status code from a Google GenAI ApiError (or a generic error).
 */
export function getErrorStatus(err: any): number | undefined {
  if (!err) return undefined;
  const direct = Number(err.status || err.code || err.statusCode);
  if (Number.isFinite(direct) && direct > 0) return direct;
  // Some SDK paths only expose the status inside a JSON-encoded message body.
  try {
    const raw = typeof err.message === 'string' ? err.message : '';
    const match = raw.match(/"code"\s*:\s*(\d{3})/);
    if (match) return Number(match[1]);
  } catch {
    /* ignore */
  }
  return undefined;
}

/**
 * Reads the server-supplied retry hint, in milliseconds, if one is present.
 *
 * Google signals quota resets in two ways:
 *  - a standard `Retry-After` header (seconds), and/or
 *  - a `"Please retry in 20h47m55.6s."` sentence inside the error message.
 *
 * We parse both so we can honour the server's own recovery window instead of
 * guessing, and so a daily-quota block is never mistaken for a 503 blip.
 */
export function getRetryAfterMs(err: any): number | undefined {
  if (!err) return undefined;

  const headers = err?.response?.headers;
  if (headers && typeof headers.get === 'function') {
    const headerValue = headers.get('retry-after');
    if (headerValue) {
      const seconds = Number(headerValue);
      if (Number.isFinite(seconds) && seconds >= 0) return Math.round(seconds * 1000);
      const asDate = Date.parse(headerValue);
      if (!Number.isNaN(asDate)) return Math.max(0, asDate - Date.now());
    }
  }

  // e.g. "Please retry in 20h47m55.665684242s."
  const raw = typeof err.message === 'string' ? err.message : '';
  const match = raw.match(/retry in\s+((?:\d+h)?(?:\d+m)?(?:\d+(?:\.\d+)?)s)/i);
  if (match) {
    const parts = match[1];
    let ms = 0;
    const hours = parts.match(/(\d+(?:\.\d+)?)h/);
    const mins = parts.match(/(\d+(?:\.\d+)?)m/);
    const secs = parts.match(/(\d+(?:\.\d+)?)s/);
    if (hours) ms += Number(hours[1]) * 3_600_000;
    if (mins) ms += Number(mins[1]) * 60_000;
    if (secs) ms += Number(secs[1]) * 1000;
    if (ms > 0) return Math.round(ms);
  }
  return undefined;
}

/**
 * True when the error is a rate/quota block that resolves only after a long,
 * server-declared window (e.g. the free-tier daily request quota).
 *
 * This is materially different from a 503 "high demand" spike: retrying in a few
 * seconds cannot succeed, so callers must surface an accurate message instead of
 * reporting the provider as temporarily overloaded.
 */
export function isQuotaExhausted(err: any): boolean {
  const status = getErrorStatus(err);
  const raw = typeof err?.message === 'string' ? err.message : '';
  const lowerMsg = raw.toLowerCase();

  if (status === 429) {
    if (lowerMsg.includes('exceeded your current quota') || lowerMsg.includes('quota exceeded')) {
      return true;
    }
    // A per-minute rate limit is short-lived and still worth retrying with backoff.
    const retryAfterMs = getRetryAfterMs(err);
    if (lowerMsg.includes('rate limit') || lowerMsg.includes('resource_exhausted')) {
      return retryAfterMs !== undefined && retryAfterMs > 60_000;
    }
  }
  return false;
}

/**
 * Checks if an error is transient (503 high demand / service unavailable, short
 * rate limits, 5xx, socket resets). Excludes long-horizon quota exhaustion, which
 * is handled separately by isQuotaExhausted().
 */
export function isTransientError(err: any): boolean {
  if (!err) return false;

  if (isQuotaExhausted(err)) return false;

  const status = getErrorStatus(err);
  if (status !== undefined && (status === 503 || status === 429 || status === 500 || status === 502 || status === 504)) {
    return true;
  }
  const message = typeof err.message === 'string' ? err.message : '';
  const lowerMsg = message.toLowerCase();
  return (
    lowerMsg.includes('503') ||
    lowerMsg.includes('429') ||
    lowerMsg.includes('unavailable') ||
    lowerMsg.includes('high demand') ||
    lowerMsg.includes('resource_exhausted') ||
    lowerMsg.includes('rate limit') ||
    lowerMsg.includes('overloaded') ||
    lowerMsg.includes('temporarily unavailable') ||
    lowerMsg.includes('econnreset') ||
    lowerMsg.includes('etimedout') ||
    lowerMsg.includes('fetch failed')
  );
}

/**
 * Checks if an error is permanent (e.g. 401 unauthenticated, 400 invalid argument,
 * 403 forbidden, or 404 — a model id that does not exist / is no longer available).
 * Retrying a permanent error can never succeed, so callers must fail fast.
 */
export function isPermanentError(err: any): boolean {
  if (!err) return false;
  const status = getErrorStatus(err);
  if (status === 400 || status === 401 || status === 403 || status === 404) {
    return true;
  }
  const message = typeof err.message === 'string' ? err.message : '';
  const lowerMsg = message.toLowerCase();
  return (
    lowerMsg.includes('401') ||
    lowerMsg.includes('403') ||
    lowerMsg.includes('unauthenticated') ||
    lowerMsg.includes('permission_denied') ||
    lowerMsg.includes('api_key_invalid') ||
    lowerMsg.includes('invalid_argument') ||
    lowerMsg.includes('not_found') ||
    lowerMsg.includes('no longer available')
  );
}

/**
 * Formats a clean, user-friendly error message, strictly concealing API keys and
 * credentials, and distinguishing an exhausted quota from a temporary 503 spike.
 */
export function getUserFriendlyErrorMessage(err: any): string {
  if (!err) return 'An unexpected error occurred. Please try again.';

  // A long-horizon quota block is NOT a transient high-demand condition; telling
  // the user to "retry in a few moments" would be misleading.
  if (isQuotaExhausted(err)) {
    const retryAfterMs = getRetryAfterMs(err);
    if (retryAfterMs && retryAfterMs > 60_000) {
      const hours = retryAfterMs / 3_600_000;
      const resetHint =
        hours >= 1
          ? `try again in about ${Math.ceil(hours)} hour${Math.ceil(hours) > 1 ? 's' : ''}.`
          : `try again in about ${Math.ceil(retryAfterMs / 60_000)} minute(s).`;
      return `The AI coaching service has reached its free-tier request quota for today. Please ${resetHint}`;
    }
    return 'The AI coaching service has reached its request quota. Please try again later.';
  }

  if (isTransientError(err)) {
    return 'The AI coaching service is temporarily at capacity. Retrying automatically — please send your message again in a few moments.';
  }

  const status = getErrorStatus(err);
  if (status === 404) {
    return 'The configured AI model is unavailable for this API key. Please verify the model configuration.';
  }

  const raw = err?.message || String(err);
  try {
    const parsed = JSON.parse(raw);
    if (parsed.error?.message) {
      // The provider's own message is already credential-free; keep it readable.
      return parsed.error.message;
    }
  } catch {
    // not JSON
  }

  return raw;
}

export function getGroqApiKey(): string {
  const cwd = process.cwd();
  const envLocalPath = path.resolve(cwd, '.env.local');
  if (fs.existsSync(envLocalPath)) {
    try {
      const match = fs.readFileSync(envLocalPath, 'utf8').match(/^\s*GROQ_API_KEY\s*=\s*([^\r\n#]+)/m);
      if (match) return sanitizeApiKey(match[1]);
    } catch {}
  }
  return sanitizeApiKey(process.env.GROQ_API_KEY || '');
}

export function getOpenRouterApiKey(): string {
  const cwd = process.cwd();
  const envLocalPath = path.resolve(cwd, '.env.local');
  if (fs.existsSync(envLocalPath)) {
    try {
      const match = fs.readFileSync(envLocalPath, 'utf8').match(/^\s*OPENROUTER_API_KEY\s*=\s*([^\r\n#]+)/m);
      if (match) return sanitizeApiKey(match[1]);
    } catch {}
  }
  return sanitizeApiKey(process.env.OPENROUTER_API_KEY || '');
}

/**
 * Optional secondary genuinely free-tier fallback stream via Groq (LLaMA 3.3 70B) or OpenRouter (:free).
 * Only invoked if configured in environment and Gemini models encounter transient 503/overload.
 */
export async function streamFreeFallbackProvider(
  params: {
    messages: { role: string; content?: string; text?: string; parts?: any[] }[];
    systemInstruction: string;
    temperature?: number;
  },
  onChunk: (text: string) => void
): Promise<boolean> {
  const groqKey = getGroqApiKey();
  if (groqKey) {
    try {
      const formatted = [
        { role: 'system', content: params.systemInstruction },
        ...params.messages.map((m) => ({
          role: m.role === 'model' ? 'assistant' : m.role,
          content: m.parts ? m.parts.map((p: any) => p.text).join('') : (m.content || m.text || ''),
        })),
      ];

      const res = await fetch('https://api.groq.com/openai/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${groqKey}`,
        },
        body: JSON.stringify({
          model: 'llama-3.3-70b-versatile',
          messages: formatted,
          temperature: params.temperature ?? 0.7,
          stream: true,
        }),
      });

      if (res.ok && res.body) {
        const reader = res.body.getReader();
        const decoder = new TextDecoder('utf-8');
        let buffer = '';

        while (true) {
          const { value, done } = await reader.read();
          if (done) break;
          buffer += decoder.decode(value, { stream: true });
          const lines = buffer.split('\n');
          buffer = lines.pop() || '';

          for (const line of lines) {
            const trimmed = line.trim();
            if (!trimmed || !trimmed.startsWith('data:')) continue;
            const dataStr = trimmed.replace(/^data:\s*/, '');
            if (dataStr === '[DONE]') return true;
            try {
              const json = JSON.parse(dataStr);
              const delta = json.choices?.[0]?.delta?.content;
              if (delta) onChunk(delta);
            } catch {}
          }
        }
        return true;
      }
    } catch (err) {
      console.warn('[GrooveyAI] Groq fallback provider stream attempt failed:', err);
    }
  }

  const openRouterKey = getOpenRouterApiKey();
  if (openRouterKey) {
    try {
      const formatted = [
        { role: 'system', content: params.systemInstruction },
        ...params.messages.map((m) => ({
          role: m.role === 'model' ? 'assistant' : m.role,
          content: m.parts ? m.parts.map((p: any) => p.text).join('') : (m.content || m.text || ''),
        })),
      ];

      const res = await fetch('https://openrouter.ai/api/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${openRouterKey}`,
        },
        body: JSON.stringify({
          model: 'meta-llama/llama-3.3-70b-instruct:free',
          messages: formatted,
          temperature: params.temperature ?? 0.7,
          stream: true,
        }),
      });

      if (res.ok && res.body) {
        const reader = res.body.getReader();
        const decoder = new TextDecoder('utf-8');
        let buffer = '';

        while (true) {
          const { value, done } = await reader.read();
          if (done) break;
          buffer += decoder.decode(value, { stream: true });
          const lines = buffer.split('\n');
          buffer = lines.pop() || '';

          for (const line of lines) {
            const trimmed = line.trim();
            if (!trimmed || !trimmed.startsWith('data:')) continue;
            const dataStr = trimmed.replace(/^data:\s*/, '');
            if (dataStr === '[DONE]') return true;
            try {
              const json = JSON.parse(dataStr);
              const delta = json.choices?.[0]?.delta?.content;
              if (delta) onChunk(delta);
            } catch {}
          }
        }
        return true;
      }
    } catch (err) {
      console.warn('[GrooveyAI] OpenRouter fallback provider stream attempt failed:', err);
    }
  }

  return false;
}

/**
 * Optional secondary genuinely free-tier fallback for non-streaming requests.
 */
export async function generateFreeFallbackProvider(params: {
  messages: { role: string; content?: string; text?: string; parts?: any[] }[];
  systemInstruction: string;
  temperature?: number;
}): Promise<string | null> {
  const groqKey = getGroqApiKey();
  if (groqKey) {
    try {
      const formatted = [
        { role: 'system', content: params.systemInstruction },
        ...params.messages.map((m) => ({
          role: m.role === 'model' ? 'assistant' : m.role,
          content: m.parts ? m.parts.map((p: any) => p.text).join('') : (m.content || m.text || ''),
        })),
      ];

      const res = await fetch('https://api.groq.com/openai/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${groqKey}`,
        },
        body: JSON.stringify({
          model: 'llama-3.3-70b-versatile',
          messages: formatted,
          temperature: params.temperature ?? 0.7,
        }),
      });

      if (res.ok) {
        const json = await res.json();
        return json.choices?.[0]?.message?.content || null;
      }
    } catch (err) {
      console.warn('[GrooveyAI] Groq fallback non-stream attempt failed:', err);
    }
  }

  const openRouterKey = getOpenRouterApiKey();
  if (openRouterKey) {
    try {
      const formatted = [
        { role: 'system', content: params.systemInstruction },
        ...params.messages.map((m) => ({
          role: m.role === 'model' ? 'assistant' : m.role,
          content: m.parts ? m.parts.map((p: any) => p.text).join('') : (m.content || m.text || ''),
        })),
      ];

      const res = await fetch('https://openrouter.ai/api/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${openRouterKey}`,
        },
        body: JSON.stringify({
          model: 'meta-llama/llama-3.3-70b-instruct:free',
          messages: formatted,
          temperature: params.temperature ?? 0.7,
        }),
      });

      if (res.ok) {
        const json = await res.json();
        return json.choices?.[0]?.message?.content || null;
      }
    } catch (err) {
      console.warn('[GrooveyAI] OpenRouter fallback non-stream attempt failed:', err);
    }
  }

  return null;
}

// In-memory status probe cache to avoid flooding the API while delivering truthful status
interface CachedHealth {
  status: 'ready' | 'connecting' | 'unavailable' | 'quota-exhausted' | 'configuration-error';
  provider: string;
  model: string;
  activeProvider: 'gemini' | 'groq' | 'openrouter' | 'none';
  message: string;
  hasKey: boolean;
  fallbackModels: string[];
  secondaryFallbackAvailable: boolean;
  freeTierNote: string;
  checkedAt: number;
}

let healthCache: CachedHealth | null = null;
const HEALTH_CACHE_TTL_MS = 60 * 1000; // 60 seconds TTL

export async function checkTruthfulHealth(forceFresh = false): Promise<CachedHealth> {
  const apiKey = getGeminiApiKey();
  const groqKey = getGroqApiKey();
  const openRouterKey = getOpenRouterApiKey();
  const hasSecondary = Boolean(groqKey || openRouterKey);

  if (!apiKey) {
    return {
      status: 'configuration-error',
      provider: 'Google Gemini',
      model: PRIMARY_MODEL,
      activeProvider: 'none',
      message: 'GEMINI_API_KEY is missing in server environment (.env.local)',
      hasKey: false,
      fallbackModels: FALLBACK_MODELS,
      secondaryFallbackAvailable: hasSecondary,
      freeTierNote: 'Gemini Developer API Free Tier: 15 RPM / 1M TPM.',
      checkedAt: Date.now(),
    };
  }

  const now = Date.now();
  if (!forceFresh && healthCache && now - healthCache.checkedAt < HEALTH_CACHE_TTL_MS) {
    return healthCache;
  }

  try {
    const ai = getGeminiClient();
    // Test a minimal ping with the primary model
    await ai.models.generateContent({
      model: PRIMARY_MODEL,
      contents: 'ping',
      config: { maxOutputTokens: 1 },
    });

    healthCache = {
      status: 'ready',
      provider: 'Google Gemini',
      model: PRIMARY_MODEL,
      activeProvider: 'gemini',
      message: 'Connected and ready for rehearsals',
      hasKey: true,
      fallbackModels: FALLBACK_MODELS,
      secondaryFallbackAvailable: hasSecondary,
      freeTierNote: 'Gemini Developer API Free Tier: 15 RPM / 1M TPM.',
      checkedAt: now,
    };
    return healthCache;
  } catch (err: any) {
    const status = getErrorStatus(err);

    // Authentication failure
    if (status === 401 || status === 403 || String(err?.message).includes('UNAUTHENTICATED')) {
      healthCache = {
        status: 'configuration-error',
        provider: 'Google Gemini',
        model: PRIMARY_MODEL,
        activeProvider: 'none',
        message: 'Invalid Gemini API key (401 UNAUTHENTICATED)',
        hasKey: true,
        fallbackModels: FALLBACK_MODELS,
        secondaryFallbackAvailable: hasSecondary,
        freeTierNote: 'Verify GEMINI_API_KEY at aistudio.google.com',
        checkedAt: now,
      };
      return healthCache;
    }

    // A confirmed model id that does not exist / is retired for this key.
    if (status === 404) {
      healthCache = {
        status: 'configuration-error',
        provider: 'Google Gemini',
        model: PRIMARY_MODEL,
        activeProvider: 'none',
        message: `Model "${PRIMARY_MODEL}" is not available for this API key (404 NOT_FOUND).`,
        hasKey: true,
        fallbackModels: FALLBACK_MODELS,
        secondaryFallbackAvailable: hasSecondary,
        freeTierNote: 'Set GEMINI_MODEL to a model your key can access.',
        checkedAt: now,
      };
      return healthCache;
    }

    // Capacity saturation or a short rate limit: probe the whole fallback chain,
    // not just the first entry, before declaring the service down.
    if (isTransientError(err) || isQuotaExhausted(err)) {
      const ai = getGeminiClient();
      for (const fbModel of FALLBACK_MODELS) {
        try {
          await ai.models.generateContent({
            model: fbModel,
            contents: 'ping',
            config: { maxOutputTokens: 1 },
          });

          const viaQuota = isQuotaExhausted(err);
          healthCache = {
            status: 'ready',
            provider: 'Google Gemini (Fallback Active)',
            model: fbModel,
            activeProvider: 'gemini',
            message: viaQuota
              ? `Free-tier quota exhausted on ${PRIMARY_MODEL}. Serving via ${fbModel}.`
              : `High demand on ${PRIMARY_MODEL}. Serving via ${fbModel}.`,
            hasKey: true,
            fallbackModels: FALLBACK_MODELS,
            secondaryFallbackAvailable: hasSecondary,
            freeTierNote: viaQuota
              ? 'Automatic model failover is active.'
              : 'Transient high-demand spike. Automatic backoff retries are active.',
            checkedAt: now,
          };
          return healthCache;
        } catch {
          // Try the next candidate model.
        }
      }

      // Optional secondary free fallback (Groq) if configured.
      if (groqKey) {
        healthCache = {
          status: 'ready',
          provider: 'Groq Cloud (Free Tier Fallback)',
          model: 'llama-3.3-70b-versatile',
          activeProvider: 'groq',
          message: 'Gemini unavailable. Active free-tier fallback to Groq LLaMA 3.3 70B.',
          hasKey: true,
          fallbackModels: FALLBACK_MODELS,
          secondaryFallbackAvailable: true,
          freeTierNote: 'Groq free tier is serving coaching requests.',
          checkedAt: now,
        };
        return healthCache;
      }

      // Distinguish an exhausted quota from a temporary spike — the two need very
      // different user actions, and conflating them is what produced the
      // misleading "503 High Demand" report.
      if (isQuotaExhausted(err)) {
        const retryAfterMs = getRetryAfterMs(err);
        const resetText =
          retryAfterMs && retryAfterMs > 3_600_000
            ? ` Quota resets in about ${Math.ceil(retryAfterMs / 3_600_000)} hour(s).`
            : '';
        healthCache = {
          status: 'quota-exhausted',
          provider: 'Google Gemini',
          model: PRIMARY_MODEL,
          activeProvider: 'none',
          message: `Free-tier request quota exhausted for ${PRIMARY_MODEL}.${resetText}`,
          hasKey: true,
          fallbackModels: FALLBACK_MODELS,
          secondaryFallbackAvailable: hasSecondary,
          freeTierNote:
            'All configured Gemini models share the exhausted quota. Upgrade the API key tier or add a fallback provider key.',
          checkedAt: now,
        };
        return healthCache;
      }

      healthCache = {
        status: 'unavailable',
        provider: 'Google Gemini',
        model: PRIMARY_MODEL,
        activeProvider: 'none',
        message: 'The AI service is temporarily at capacity (503). Retrying automatically.',
        hasKey: true,
        fallbackModels: FALLBACK_MODELS,
        secondaryFallbackAvailable: hasSecondary,
        freeTierNote: 'Transient high-demand spike. Automatic backoff retries are active.',
        checkedAt: now,
      };
      return healthCache;
    }

    healthCache = {
      status: 'unavailable',
      provider: 'Google Gemini',
      model: PRIMARY_MODEL,
      activeProvider: 'none',
      message: err?.message || 'Gemini service unreachable',
      hasKey: true,
      fallbackModels: FALLBACK_MODELS,
      secondaryFallbackAvailable: hasSecondary,
      freeTierNote: 'Spike in demand or network error.',
      checkedAt: now,
    };
    return healthCache;
  }
}

/**
 * Updates the health cache when an active request succeeds or fails in real time.
 */
export function recordActiveProviderStatus(
  provider: 'gemini' | 'groq' | 'openrouter',
  model: string,
  isHealthy: boolean,
  message?: string
) {
  const hasSecondary = Boolean(getGroqApiKey() || getOpenRouterApiKey());
  healthCache = {
    status: isHealthy ? 'ready' : 'unavailable',
    provider: provider === 'groq' ? 'Groq Cloud' : provider === 'openrouter' ? 'OpenRouter' : 'Google Gemini',
    model,
    activeProvider: isHealthy ? provider : 'none',
    message: message || (isHealthy ? 'Connected and ready' : 'Provider temporarily unavailable'),
    hasKey: Boolean(getGeminiApiKey()),
    fallbackModels: FALLBACK_MODELS,
    secondaryFallbackAvailable: hasSecondary,
    freeTierNote: isHealthy
      ? 'Free tier coaching mode active.'
      : 'Automatic retry and model failover are active.',
    checkedAt: Date.now(),
  };
}

export function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/** Hard ceiling on any single backoff wait, so a request can never hang. */
const MAX_BACKOFF_MS = 8_000;
/** Hard ceiling on the number of retries per model, preventing infinite loops. */
const MAX_ATTEMPTS_PER_MODEL = 3;

/**
 * Computes a bounded exponential-backoff delay with full jitter.
 *
 * `attempt` is zero-based. The result is capped at MAX_BACKOFF_MS and is always
 * strictly positive, so callers never busy-loop. A server-supplied Retry-After is
 * honoured only when it is short enough to be worth waiting out inline; anything
 * longer (e.g. a daily quota reset) is deliberately not slept on.
 */
export function computeBackoffMs(
  attempt: number,
  err?: any
): number {
  const serverHint = getRetryAfterMs(err);
  if (serverHint !== undefined) {
    // Respect the server's window when it is a short, waitable pause.
    if (serverHint > 0 && serverHint <= MAX_BACKOFF_MS) return serverHint;
    // Long horizon (quota reset) -> fail over rather than block the user.
    if (serverHint > MAX_BACKOFF_MS) return 0;
  }
  const exponential = Math.min(MAX_BACKOFF_MS, 500 * Math.pow(2, Math.max(0, attempt)));
  const jitter = Math.random() * exponential * 0.5;
  return Math.max(250, Math.min(MAX_BACKOFF_MS, Math.round(exponential - exponential * 0.5 + jitter)));
}

/** True when another attempt on the same model could plausibly succeed. */
export function shouldRetrySameModel(err: any, attempt: number): boolean {
  if (attempt >= MAX_ATTEMPTS_PER_MODEL - 1) return false;
  // Never retry a permanent failure or a long-horizon quota block on this model.
  if (isPermanentError(err) || isQuotaExhausted(err)) return false;
  return isTransientError(err);
}

export { MAX_ATTEMPTS_PER_MODEL, MAX_BACKOFF_MS };

export interface GenerateContentParams {
  contents: any;
  config?: any;
  messagesForFallback?: any[];
}

/**
 * Executes generateContent with safe retry & model fallback for transient 503/429 errors.
 * Includes optional secondary free-tier provider fallback (Groq / OpenRouter) if configured.
 */
export async function generateContentWithFallbackAndRetry(
  ai: GoogleGenAI,
  params: GenerateContentParams
) {
  const models = [PRIMARY_MODEL, ...FALLBACK_MODELS.filter((m) => m !== PRIMARY_MODEL)];
  let lastError: any = null;

  for (const model of models) {
    for (let attempt = 0; attempt < MAX_ATTEMPTS_PER_MODEL; attempt++) {
      try {
        const response = await ai.models.generateContent({
          model,
          contents: params.contents,
          config: params.config,
        });
        recordActiveProviderStatus('gemini', model, true, `Connected via ${model}`);
        return response;
      } catch (err: any) {
        lastError = err;

        // Authentication / parameter errors apply to the key, not the model:
        // retrying any other model would fail identically.
        const status = getErrorStatus(err);
        if (status === 401 || status === 403 || status === 400) {
          recordActiveProviderStatus('gemini', model, false, 'Authentication or parameter error');
          throw err;
        }

        // 404: this specific model is unavailable — advance immediately without
        // burning retry budget on a model that can never serve this key.
        if (status === 404) {
          break;
        }

        // Transient capacity/rate-limit error with retries remaining:
        // bounded exponential backoff with jitter, honouring Retry-After.
        if (shouldRetrySameModel(err, attempt)) {
          const delay = computeBackoffMs(attempt, err);
          if (delay > 0) await sleep(delay);
          continue;
        }

        // Exhausted retries, or a long-horizon quota block on this model.
        break;
      }
    }
  }

  // If every Gemini model failed for a retryable reason, try the optional
  // secondary free-tier provider (Groq / OpenRouter) if one is configured.
  const retryableOverall = isTransientError(lastError) || isQuotaExhausted(lastError);
  if (params.messagesForFallback && retryableOverall) {
    const fallbackText = await generateFreeFallbackProvider({
      messages: params.messagesForFallback,
      systemInstruction: params.config?.systemInstruction || GROOVEYY_SYSTEM_INSTRUCTION,
      temperature: params.config?.temperature,
    });
    if (fallbackText) {
      recordActiveProviderStatus('groq', 'llama-3.3-70b-versatile', true, 'Active via Groq free fallback');
      return { text: fallbackText };
    }
  }

  recordActiveProviderStatus('gemini', PRIMARY_MODEL, false, 'All configured models unavailable');
  throw lastError || new Error('All configured models are unavailable.');
}
