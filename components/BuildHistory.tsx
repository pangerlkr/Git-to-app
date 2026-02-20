'use client';

import { useEffect, useState } from 'react';
import { BuildRecord } from '@/lib/types';
import BuildCard from './BuildCard';

interface Props {
  refreshTrigger: number;
}

export default function BuildHistory({ refreshTrigger }: Props) {
  const [builds, setBuilds] = useState<BuildRecord[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBuilds();
  }, [refreshTrigger]);

  async function fetchBuilds() {
    try {
      const res = await fetch('/api/builds');
      if (res.ok) {
        const data = await res.json();
        setBuilds(data);
      }
    } finally {
      setLoading(false);
    }
  }

  function handleDelete(id: string) {
    setBuilds(prev => prev.filter(b => b.id !== id));
  }

  if (loading) {
    return <div className="text-center text-gray-400 py-8">Loading build history…</div>;
  }

  if (builds.length === 0) {
    return (
      <div className="text-center text-gray-400 py-12">
        <div className="text-4xl mb-3">📭</div>
        <div>No builds yet. Submit a repository to get started!</div>
      </div>
    );
  }

  return (
    <div>
      <h2 className="text-xl font-semibold text-gray-900 mb-4">Build History</h2>
      <div className="grid gap-4">
        {builds.map(build => (
          <BuildCard key={build.id} buildId={build.id} onDelete={handleDelete} />
        ))}
      </div>
    </div>
  );
}
