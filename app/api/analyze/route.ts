import { NextRequest, NextResponse } from 'next/server';
import { analyzeRepo } from '@/lib/github';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { repoUrl } = body;

    if (!repoUrl || typeof repoUrl !== 'string') {
      return NextResponse.json({ error: 'repoUrl is required' }, { status: 400 });
    }

    const analysis = await analyzeRepo(repoUrl.trim());
    return NextResponse.json(analysis);
  } catch (error) {
    return NextResponse.json(
      { error: `Failed to analyze repository: ${error instanceof Error ? error.message : 'Unknown error'}` },
      { status: 500 },
    );
  }
}
