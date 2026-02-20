import { NextRequest, NextResponse } from 'next/server';
import { getBuildById } from '@/lib/db';
import { generateGitHubActionsWorkflow } from '@/lib/builder';

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

    const workflow = generateGitHubActionsWorkflow(build.framework, build.platform);

    return new NextResponse(workflow, {
      headers: {
        'Content-Type': 'text/plain',
        'Content-Disposition': 'attachment; filename="build-mobile.yml"',
      },
    });
  } catch (error) {
    return NextResponse.json(
      { error: `Failed to generate workflow: ${error instanceof Error ? error.message : 'Unknown error'}` },
      { status: 500 },
    );
  }
}
