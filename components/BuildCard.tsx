'use client';

import { useEffect, useState } from 'react';
import { BuildRecord, BuildStatus } from '@/lib/types';

interface Props {
  buildId: string;
  onDelete?: (id: string) => void;
}

const STATUS_COLORS: Record<BuildStatus, string> = {
  queued: 'bg-yellow-100 text-yellow-800',
  building: 'bg-blue-100 text-blue-800',
  success: 'bg-green-100 text-green-800',
  failed: 'bg-red-100 text-red-800',
  cancelled: 'bg-gray-100 text-gray-800',
};

const STATUS_ICONS: Record<BuildStatus, string> = {
  queued: '⏳',
  building: '🔨',
  success: '✅',
  failed: '❌',
  cancelled: '🚫',
};

export default function BuildCard({ buildId, onDelete }: Props) {
  const [build, setBuild] = useState<BuildRecord | null>(null);

  useEffect(() => {
    fetchBuild();
    const interval = setInterval(fetchBuild, 5000);
    return () => clearInterval(interval);
  }, [buildId]);

  async function fetchBuild() {
    try {
      const res = await fetch(`/api/builds/${buildId}`);
      if (res.ok) setBuild(await res.json());
    } catch {
      // ignore
    }
  }

  async function handleDelete() {
    if (!confirm('Delete this build record?')) return;
    await fetch(`/api/builds/${buildId}`, { method: 'DELETE' });
    onDelete?.(buildId);
  }

  async function handleDownloadWorkflow() {
    window.open(`/api/builds/${buildId}/workflow`, '_blank');
  }

  if (!build) {
    return (
      <div className="bg-white rounded-xl shadow p-5 animate-pulse">
        <div className="h-4 bg-gray-200 rounded w-3/4 mb-3" />
        <div className="h-3 bg-gray-100 rounded w-1/2" />
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow p-5 hover:shadow-md transition">
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1 min-w-0">
          <div className="font-semibold text-gray-900 truncate">{build.repoName}</div>
          <div className="text-xs text-gray-500 mt-0.5 truncate">{build.repoUrl}</div>
        </div>
        <div className="flex items-center gap-2 ml-3 shrink-0">
          <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${STATUS_COLORS[build.status]}`}>
            {STATUS_ICONS[build.status]} {build.status}
          </span>
        </div>
      </div>

      <div className="flex flex-wrap gap-2 text-xs text-gray-500 mb-4">
        <span className="bg-gray-100 rounded px-2 py-0.5">📦 {build.framework}</span>
        <span className="bg-gray-100 rounded px-2 py-0.5">
          {build.platform === 'both' ? '📱 Both' : build.platform === 'android' ? '🤖 Android' : '🍎 iOS'}
        </span>
        <span className="bg-gray-100 rounded px-2 py-0.5 capitalize">{build.profile}</span>
        <span className="bg-gray-100 rounded px-2 py-0.5">
          {new Date(build.createdAt).toLocaleDateString()}
        </span>
      </div>

      {build.errorMessage && (
        <div className="mb-3 text-xs text-red-600 bg-red-50 rounded p-2">{build.errorMessage}</div>
      )}

      {build.status === 'success' && (
        <div className="flex flex-wrap gap-2 mb-3">
          {build.androidArtifactUrl && (
            <a
              href={build.androidArtifactUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs bg-green-600 hover:bg-green-700 text-white px-3 py-1.5 rounded-lg transition"
            >
              ⬇️ Download APK
            </a>
          )}
          {build.iosArtifactUrl && (
            <a
              href={build.iosArtifactUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs bg-blue-600 hover:bg-blue-700 text-white px-3 py-1.5 rounded-lg transition"
            >
              ⬇️ Download IPA
            </a>
          )}
        </div>
      )}

      <div className="flex gap-2">
        <button
          onClick={handleDownloadWorkflow}
          className="text-xs text-indigo-600 hover:text-indigo-800 border border-indigo-200 hover:border-indigo-400 px-3 py-1.5 rounded-lg transition"
        >
          📄 GitHub Actions Workflow
        </button>
        <button
          onClick={handleDelete}
          className="text-xs text-red-500 hover:text-red-700 border border-red-200 hover:border-red-400 px-3 py-1.5 rounded-lg transition ml-auto"
        >
          🗑️ Delete
        </button>
      </div>
    </div>
  );
}
