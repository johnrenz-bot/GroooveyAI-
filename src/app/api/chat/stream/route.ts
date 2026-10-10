import { NextRequest, NextResponse } from 'next/server';
import {
  getGeminiClient,
  getGeminiApiKey,
  GROOVEYY_SYSTEM_INSTRUCTION,
  PRIMARY_MODEL,
  FALLBACK_MODELS,
  isTransientError,
  isPermanentError,
  getUserFriendlyErrorMessage,
  sleep,
  recordActiveProviderStatus,
  streamFreeFallbackProvider,
} from '@/src/lib/gemini';

export async function POST(req: NextRequest) {
  try {
    const { messages, discipline, level } = await req.json();

    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return NextResponse.json({ error: 'Valid messages array is required' }, { status: 400 });
    }

    const apiKey = getGeminiApiKey();
    if (!apiKey) {
      return NextResponse.json(
        { error: 'GEMINI_API_KEY is not set in the server environment. Please configure it in .env.local.' },
        { status: 500 }
      );
    }

    const ai = getGeminiClient();

    // Build context-specific prompt
    let contextualSystemInstruction = GROOVEYY_SYSTEM_INSTRUCTION;
    if (discipline && discipline !== 'General') {
      contextualSystemInstruction += `\n\nCURRENT SESSION DISCIPLINE FOCUS: ${discipline}. Prioritize coaching frameworks and vocabulary specific to this art form.`;
    }
    if (level && level !== 'All') {
      contextualSystemInstruction += `\nARTIST PROFICIENCY LEVEL: ${level}. Calibrate terminology and complexity appropriately.`;
    }

    // Transform messages format for Google GenAI SDK (last 16 messages)
    const contextWindow = messages.slice(-16);
    const contents = contextWindow.map((msg: { role: string; content?: string; text?: string }) => ({
      role: msg.role === 'user' ? 'user' : 'model',
      parts: [{ text: msg.content || msg.text || '' }],
    }));

    const encoder = new TextEncoder();
    const modelsToTry = [PRIMARY_MODEL, ...FALLBACK_MODELS.filter((m) => m !== PRIMARY_MODEL)];

    const stream = new ReadableStream({
      async start(controller) {
        let chunksSent = 0;
        let lastError: any = null;

        for (const model of modelsToTry) {
          const maxRetries = 2; // 1 initial attempt + 1 retry for transient errors

          for (let attempt = 0; attempt < maxRetries; attempt++) {
            try {
              const responseStream = await ai.models.generateContentStream({
                model,
                contents,
                config: {
                  systemInstruction: contextualSystemInstruction,
                  temperature: 0.7,
                },
              });

              for await (const chunk of responseStream) {
                const text = chunk.text;
                if (text) {
                  chunksSent++;
                  controller.enqueue(encoder.encode(`data: ${JSON.stringify({ text })}\n\n`));
                }
              }

              // Successfully completed streaming
              recordActiveProviderStatus('gemini', model, true);
              controller.enqueue(encoder.encode('data: [DONE]\n\n'));
              controller.close();
              return;
            } catch (err: any) {
              lastError = err;

              // CRITICAL: If chunks have already been sent to the client, do NOT transparently
              // restart or fallback, which would duplicate output in the UI.
              if (chunksSent > 0) {
                console.error(`Stream interrupted after sending ${chunksSent} chunks on ${model}:`, err?.message || err);
                const friendlyMsg = 'The coaching stream was interrupted due to high server demand. Please send a new message to continue.';
                controller.enqueue(encoder.encode(`data: ${JSON.stringify({ error: friendlyMsg })}\n\n`));
                controller.enqueue(encoder.encode('data: [DONE]\n\n'));
                controller.close();
                return;
              }

              // Permanent errors: fail immediately without retry or fallback
              if (isPermanentError(err)) {
                recordActiveProviderStatus('gemini', model, false, 'Authentication error');
                const friendlyMsg = getUserFriendlyErrorMessage(err);
                controller.enqueue(encoder.encode(`data: ${JSON.stringify({ error: friendlyMsg })}\n\n`));
                controller.enqueue(encoder.encode('data: [DONE]\n\n'));
                controller.close();
                return;
              }

              // 404 (model not supported/found): advance immediately to next fallback model
              const status = Number(err?.status || err?.code);
              if (status === 404) {
                break;
              }

              // Transient error with retry attempts remaining: wait exponential backoff with jitter
              if (isTransientError(err) && attempt < maxRetries - 1) {
                const delay = 500 * Math.pow(2, attempt) + Math.random() * 200;
                await sleep(delay);
                continue;
              }

              // Transient error with retries exhausted for this model: break to attempt next model
              if (isTransientError(err)) {
                console.warn(`[GrooveyAI] Model ${model} unavailable (status ${err?.status || 503}). Falling back...`);
                break;
              }

              // Any other error: break to next model
              break;
            }
          }
        }

        // If all Gemini models failed before any chunk was sent, attempt secondary free fallback provider (Groq / OpenRouter) if configured
        if (chunksSent === 0 && isTransientError(lastError)) {
          try {
            const fallbackSucceeded = await streamFreeFallbackProvider(
              {
                messages: contextWindow,
                systemInstruction: contextualSystemInstruction,
                temperature: 0.7,
              },
              (textChunk) => {
                chunksSent++;
                controller.enqueue(encoder.encode(`data: ${JSON.stringify({ text: textChunk })}\n\n`));
              }
            );

            if (fallbackSucceeded && chunksSent > 0) {
              recordActiveProviderStatus('groq', 'llama-3.3-70b-versatile', true, 'Groq free fallback active');
              controller.enqueue(encoder.encode('data: [DONE]\n\n'));
              controller.close();
              return;
            }
          } catch (fbErr) {
            console.error('[GrooveyAI] Secondary free fallback stream also failed:', fbErr);
          }
        }

        // All models and retries failed before any chunk was sent
        recordActiveProviderStatus('gemini', PRIMARY_MODEL, false, 'All models unavailable');
        console.error('All configured models failed in chat stream:', lastError?.message || lastError);
        const finalErrorMessage = getUserFriendlyErrorMessage(lastError);
        controller.enqueue(encoder.encode(`data: ${JSON.stringify({ error: finalErrorMessage })}\n\n`));
        controller.enqueue(encoder.encode('data: [DONE]\n\n'));
        controller.close();
      },
    });

    return new Response(stream, {
      headers: {
        'Content-Type': 'text/event-stream; charset=utf-8',
        'Cache-Control': 'no-cache, no-transform',
        'Connection': 'keep-alive',
      },
    });
  } catch (err: any) {
    console.error('API Stream Handler Error:', err);
    return NextResponse.json({ error: getUserFriendlyErrorMessage(err) }, { status: 500 });
  }
}
