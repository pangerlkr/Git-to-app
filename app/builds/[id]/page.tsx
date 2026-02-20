import Link from 'next/link';
import BuildCard from '@/components/BuildCard';

interface Props {
  params: Promise<{ id: string }>;
}

export default async function BuildDetailPage({ params }: Props) {
  const { id } = await params;

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50">
      <header className="bg-white border-b border-gray-100 shadow-sm">
        <div className="max-w-3xl mx-auto px-6 py-4 flex items-center gap-4">
          <Link
            href="/"
            className="flex items-center gap-2 text-indigo-600 hover:text-indigo-800 text-sm font-medium transition"
          >
            ← Back
          </Link>
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-indigo-600 rounded-xl flex items-center justify-center text-white font-bold text-lg">
              G
            </div>
            <div>
              <div className="font-bold text-gray-900 leading-tight">Git-to-App</div>
              <div className="text-xs text-gray-500">Build Details</div>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-3xl mx-auto px-6 py-10">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">Build Details</h1>
        <BuildCard buildId={id} />
      </div>
    </div>
  );
}
