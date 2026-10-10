import { NextRequest, NextResponse } from 'next/server';
import { checkTruthfulHealth } from '@/src/lib/gemini';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const forceFresh = searchParams.get('fresh') === 'true';

  const health = await checkTruthfulHealth(forceFresh);
  return NextResponse.json(health);
}
