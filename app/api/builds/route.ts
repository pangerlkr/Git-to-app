import { NextRequest, NextResponse } from 'next/server';
import { v4 as uuidv4 } from 'uuid';
import { createBuild, getAllBuilds } from '@/lib/db';
import { analyzeRepo, parseRepoUrl } from '@/lib/github';
import { triggerEasBuild } from '@/lib/builder';
import { BuildRecord, CreateBuildRequest } from '@/lib/types';

export async function GET() {
  try {
    const builds = getAllBuilds();
    return NextResponse.json(builds);
  } catch (error) {
    return NextResponse.json(
      { error: `Failed to fetch builds: ${error instanceof Error ? error.message : 'Unknown error'}` },
      { status: 500 },
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body: CreateBuildRequest = await request.json();
    const { repoUrl, platform, profile } = body;

    if (!repoUrl || !platform || !profile) {
      return NextResponse.json(
        { error: 'repoUrl, platform, and profile are required' },
        { status: 400 },
      );
    }

    const parsed = parseRepoUrl(repoUrl);
    if (!parsed) {
      return NextResponse.json(
        { error: 'Invalid GitHub repository URL' },
        { status: 400 },
      );
    }

    const analysis = await analyzeRepo(repoUrl);
    if (!analysis.isValid) {
      return NextResponse.json(
        { error: analysis.errorMessage || 'Invalid repository' },
        { status: 400 },
      );
    }

    const now = new Date().toISOString();
    const build: BuildRecord = {
      id: uuidv4(),
      repoUrl,
      repoName: analysis.name,
      framework: analysis.framework,
      platform,
      profile,
      status: 'queued',
      createdAt: now,
      updatedAt: now,
    };

    createBuild(build);

    triggerEasBuild(build.id, repoUrl, platform, profile).catch(console.error);

    return NextResponse.json(build, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: `Failed to create build: ${error instanceof Error ? error.message : 'Unknown error'}` },
      { status: 500 },
    );
  }
}
