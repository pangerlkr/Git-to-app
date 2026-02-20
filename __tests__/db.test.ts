import path from 'path';

process.env.DB_PATH = path.join(require('os').tmpdir(), `test-builds-${Date.now()}.db`);

import { createBuild, getBuildById, getAllBuilds, updateBuild, deleteBuild } from '@/lib/db';
import { BuildRecord } from '@/lib/types';

function makeBuild(overrides: Partial<BuildRecord> = {}): BuildRecord {
  const now = new Date().toISOString();
  return {
    id: `test-${Date.now()}-${Math.random()}`,
    repoUrl: 'https://github.com/owner/repo',
    repoName: 'owner/repo',
    framework: 'expo',
    platform: 'both',
    profile: 'production',
    status: 'queued',
    createdAt: now,
    updatedAt: now,
    ...overrides,
  };
}

describe('Database operations', () => {
  it('creates and retrieves a build', () => {
    const build = makeBuild();
    createBuild(build);
    const found = getBuildById(build.id);
    expect(found).toBeDefined();
    expect(found?.id).toBe(build.id);
    expect(found?.repoName).toBe('owner/repo');
  });

  it('returns undefined for non-existent build', () => {
    expect(getBuildById('non-existent-id')).toBeUndefined();
  });

  it('lists all builds', () => {
    const b1 = makeBuild();
    const b2 = makeBuild();
    createBuild(b1);
    createBuild(b2);
    const all = getAllBuilds();
    const ids = all.map(b => b.id);
    expect(ids).toContain(b1.id);
    expect(ids).toContain(b2.id);
  });

  it('updates a build', () => {
    const build = makeBuild();
    createBuild(build);
    updateBuild(build.id, { status: 'success', androidArtifactUrl: 'https://example.com/app.apk' });
    const updated = getBuildById(build.id);
    expect(updated?.status).toBe('success');
    expect(updated?.androidArtifactUrl).toBe('https://example.com/app.apk');
  });

  it('deletes a build', () => {
    const build = makeBuild();
    createBuild(build);
    deleteBuild(build.id);
    expect(getBuildById(build.id)).toBeUndefined();
  });
});
