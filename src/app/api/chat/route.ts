import { NextRequest, NextResponse } from 'next/server';
import {
  getGeminiClient,
  getGeminiApiKey,
  GROOVEYY_SYSTEM_INSTRUCTION,
  generateContentWithFallbackAndRetry,
  getUserFriendlyErrorMessage,
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
        { error: 'GEMINI_API_KEY is not configured on the server. Please set it in .env.local.' },
        { status: 500 }
      );
    }

    const ai = getGeminiClient();

    let contextualSystemInstruction = GROOVEYY_SYSTEM_INSTRUCTION;
    if (discipline && discipline !== 'General') {
      contextualSystemInstruction += `\nCURRENT SESSION DISCIPLINE: ${discipline}.`;
    }
    if (level && level !== 'All') {
      contextualSystemInstruction += `\nARTIST PROFICIENCY LEVEL: ${level}.`;
    }

    const contextWindow = messages.slice(-16);
    const contents = contextWindow.map((msg: { role: string; content?: string; text?: string }) => ({
      role: msg.role === 'user' ? 'user' : 'model',
      parts: [{ text: msg.content || msg.text || '' }],
    }));

    const response = await generateContentWithFallbackAndRetry(ai, {
      contents,
      config: {
        systemInstruction: contextualSystemInstruction,
        temperature: 0.7,
      },
    });

    return NextResponse.json({ text: response.text || '' });
  } catch (err: any) {
    console.error('Gemini generate error:', err);
    return NextResponse.json({ error: getUserFriendlyErrorMessage(err) }, { status: 500 });
  }
}
