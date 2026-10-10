import { NextRequest, NextResponse } from 'next/server';
import {
  getGeminiClient,
  getGeminiApiKey,
  generateContentWithFallbackAndRetry,
} from '@/src/lib/gemini';

export async function POST(req: NextRequest) {
  try {
    const { prompt } = await req.json();
    if (!prompt || typeof prompt !== 'string') {
      return NextResponse.json({ error: 'Prompt is required' }, { status: 400 });
    }

    const apiKey = getGeminiApiKey();
    if (!apiKey) {
      return NextResponse.json({ title: prompt.slice(0, 32).trim() });
    }

    const ai = getGeminiClient();
    const response = await generateContentWithFallbackAndRetry(ai, {
      contents: `Generate a concise 3 to 5 word session title for this performing arts coaching request: "${prompt}". Return ONLY the title text, with no quotes or punctuation at the end.`,
      config: {
        maxOutputTokens: 20,
        temperature: 0.4,
      },
    });

    const title = response.text ? response.text.trim().replace(/^["']|["']$/g, '') : prompt.slice(0, 30);
    return NextResponse.json({ title: title || 'Performing Arts Session' });
  } catch (error: any) {
    console.error('Title generation error:', error);
    return NextResponse.json({ title: 'Performing Arts Session' });
  }
}
