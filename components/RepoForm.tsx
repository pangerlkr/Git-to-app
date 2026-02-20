'use client';

import { useState } from 'react';
import { RepoAnalysis, Platform, BuildProfile, Framework } from '@/lib/types';

interface Props {
  onBuildStart: (buildId: string) => void;
}

const FRAMEWORK_LABELS: Record<Framework, string> = {
  expo: '⚛️ Expo (React Native)',
  'react-native': '⚛️ React Native',
  flutter: '🐦 Flutter',
  android: '🤖 Native Android',
  unknown: '❓ Unknown',
};

const FRAMEWORK_COLORS: Record<Framework, string> = {
  expo: 'bg-indigo-100 text-indigo-800',
  'react-native': 'bg-blue-100 text-blue-800',
  flutter: 'bg-cyan-100 text-cyan-800',
  android: 'bg-green-100 text-green-800',
  unknown: 'bg-gray-100 text-gray-800',
};

export default function RepoForm({ onBuildStart }: Props) {
  const [repoUrl, setRepoUrl] = useState('');
  const [platform, setPlatform] = useState<Platform>('both');
  const [profile, setProfile] = useState<BuildProfile>('production');
  const [analysis, setAnalysis] = useState<RepoAnalysis | null>(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [building, setBuilding] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleAnalyze() {
    if (!repoUrl.trim()) return;
    setAnalyzing(true);
    setError(null);
    setAnalysis(null);

    try {
      const res = await fetch('/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ repoUrl }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || 'Analysis failed');
        return;
      }
      if (!data.isValid) {
        setError(data.errorMessage || 'Invalid repository');
        return;
      }
      setAnalysis(data);
    } catch {
      setError('Failed to connect to the server. Please try again.');
    } finally {
      setAnalyzing(false);
    }
  }

  async function handleBuild() {
    if (!analysis) return;
    setBuilding(true);
    setError(null);

    try {
      const res = await fetch('/api/builds', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ repoUrl, platform, profile }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || 'Build failed to start');
        return;
      }
      onBuildStart(data.id);
      setRepoUrl('');
      setAnalysis(null);
    } catch {
      setError('Failed to start build. Please try again.');
    } finally {
      setBuilding(false);
    }
  }

  return (
    <div className="bg-white rounded-2xl shadow-lg p-8 max-w-2xl mx-auto">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Build Your Mobile App</h2>

      <div className="mb-5">
        <label className="block text-sm font-medium text-gray-700 mb-1">
          GitHub Repository URL
        </label>
        <div className="flex gap-2">
          <input
            type="url"
            value={repoUrl}
            onChange={e => setRepoUrl(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleAnalyze()}
            placeholder="https://github.com/username/my-app"
            className="flex-1 rounded-lg border border-gray-300 px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
          <button
            onClick={handleAnalyze}
            disabled={!repoUrl.trim() || analyzing}
            className="bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium text-sm px-4 py-2 rounded-lg disabled:opacity-50 transition"
          >
            {analyzing ? 'Analyzing…' : 'Analyze'}
          </button>
        </div>
      </div>

      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700">
          {error}
        </div>
      )}

      {analysis && (
        <div className="mb-5 p-4 bg-gray-50 rounded-xl border border-gray-200">
          <div className="flex items-start justify-between">
            <div>
              <div className="font-semibold text-gray-900">{analysis.name}</div>
              {analysis.description && (
                <div className="text-sm text-gray-500 mt-0.5">{analysis.description}</div>
              )}
              <div className="flex items-center gap-2 mt-2">
                <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${FRAMEWORK_COLORS[analysis.framework]}`}>
                  {FRAMEWORK_LABELS[analysis.framework]}
                </span>
                {analysis.language && (
                  <span className="text-xs text-gray-500">Language: {analysis.language}</span>
                )}
                <span className="text-xs text-gray-500">⭐ {analysis.stars.toLocaleString()}</span>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="mb-5">
        <label className="block text-sm font-medium text-gray-700 mb-2">Target Platform</label>
        <div className="flex gap-3">
          {(['both', 'android', 'ios'] as Platform[]).map(p => (
            <button
              key={p}
              onClick={() => setPlatform(p)}
              className={`flex-1 py-2 px-3 rounded-lg border text-sm font-medium transition ${
                platform === p
                  ? 'border-indigo-500 bg-indigo-50 text-indigo-700'
                  : 'border-gray-200 text-gray-600 hover:border-gray-300'
              }`}
            >
              {p === 'both' ? '📱 Both' : p === 'android' ? '🤖 Android' : '🍎 iOS'}
            </button>
          ))}
        </div>
      </div>

      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">Build Profile</label>
        <div className="flex gap-3">
          {(['development', 'preview', 'production'] as BuildProfile[]).map(p => (
            <button
              key={p}
              onClick={() => setProfile(p)}
              className={`flex-1 py-2 px-3 rounded-lg border text-sm font-medium transition capitalize ${
                profile === p
                  ? 'border-indigo-500 bg-indigo-50 text-indigo-700'
                  : 'border-gray-200 text-gray-600 hover:border-gray-300'
              }`}
            >
              {p}
            </button>
          ))}
        </div>
      </div>

      <button
        onClick={handleBuild}
        disabled={!analysis || building}
        className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 px-6 rounded-xl disabled:opacity-50 transition text-sm"
      >
        {building ? 'Starting Build…' : '🚀 Build App'}
      </button>
    </div>
  );
}
