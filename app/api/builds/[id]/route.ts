import { NextRequest, NextResponse } from 'next/server';
import { getBuildById, deleteBuild } from '@/lib/db';

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    const build = getBuildById(id);
    if (!build) {
      return NextResponse.json({ error: 'Build not found' }, { status: 404 });
    }
    return NextResponse.json(build);
  } catch (error) {
    return NextResponse.json(
      { error: `Failed to fetch build: ${error instanceof Error ? error.message : 'Unknown error'}` },
      { status: 500 },
    );
  }
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    const build = getBuildById(id);
    if (!build) {
      return NextResponse.json({ error: 'Build not found' }, { status: 404 });
    }
    deleteBuild(id);
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json(
      { error: `Failed to delete build: ${error instanceof Error ? error.message : 'Unknown error'}` },
      { status: 500 },
    );
  }
}
