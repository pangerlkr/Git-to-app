'use client';

import { useState } from 'react';
import RepoForm from '@/components/RepoForm';
import BuildHistory from '@/components/BuildHistory';

export default function Home() {
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  function handleBuildStart(_buildId: string) {
    setRefreshTrigger(n => n + 1);
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50">
      <header className="bg-white border-b border-gray-100 shadow-sm">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-indigo-600 rounded-xl flex items-center justify-center text-white font-bold text-lg">
              G
            </div>
            <div>
              <div className="font-bold text-gray-900 leading-tight">Git-to-App</div>
              <div className="text-xs text-gray-500">Build mobile apps from GitHub</div>
            </div>
          </div>
          <nav className="flex items-center gap-6 text-sm text-gray-600">
            <a
              href="https://github.com/pangerlkr/Git-to-app"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-gray-900 transition"
            >
              GitHub
            </a>
            <a href="#how-it-works" className="hover:text-gray-900 transition">
              How It Works
            </a>
            <a href="#screenshots" className="hover:text-gray-900 transition">
              Screenshots
            </a>
          </nav>
        </div>
      </header>

      <section className="max-w-6xl mx-auto px-6 py-16 text-center">
        <div className="inline-flex items-center gap-2 bg-indigo-100 text-indigo-700 rounded-full px-4 py-1 text-sm font-medium mb-6">
          🚀 Now supporting React Native, Expo, Flutter & Android
        </div>
        <h1 className="text-5xl font-extrabold text-gray-900 mb-4 leading-tight">
          Turn Any GitHub Repo Into a<br />
          <span className="text-indigo-600">Production Mobile App</span>
        </h1>
        <p className="text-xl text-gray-500 max-w-2xl mx-auto mb-12">
          Paste a GitHub repository URL, choose your platforms, and get production-ready
          Android APK and iOS IPA files — no local build tools required.
        </p>

        <RepoForm onBuildStart={handleBuildStart} />
      </section>

      <section id="how-it-works" className="bg-white py-16">
        <div className="max-w-6xl mx-auto px-6">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">How It Works</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {[
              {
                step: '1',
                icon: '🔗',
                title: 'Paste Repo URL',
                desc: 'Enter any public GitHub repository URL that contains a mobile app project.',
              },
              {
                step: '2',
                icon: '🔍',
                title: 'Auto-Detection',
                desc: 'We analyze the repo to detect the framework: Expo, React Native, Flutter, or Native Android.',
              },
              {
                step: '3',
                icon: '⚙️',
                title: 'Cloud Build',
                desc: 'A cloud build is triggered using Expo EAS or GitHub Actions. No local setup needed.',
              },
              {
                step: '4',
                icon: '📦',
                title: 'Download',
                desc: 'Download your production-ready APK or IPA file and submit to app stores.',
              },
            ].map(item => (
              <div key={item.step} className="text-center">
                <div className="w-14 h-14 bg-indigo-50 rounded-2xl flex items-center justify-center text-2xl mx-auto mb-4">
                  {item.icon}
                </div>
                <div className="font-semibold text-gray-900 mb-2">{item.title}</div>
                <div className="text-sm text-gray-500">{item.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16">
        <div className="max-w-6xl mx-auto px-6">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">Supported Frameworks</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { icon: '⚛️', name: 'Expo', desc: 'Managed & bare workflow', color: 'border-indigo-200 bg-indigo-50' },
              { icon: '⚛️', name: 'React Native', desc: 'Bare React Native apps', color: 'border-blue-200 bg-blue-50' },
              { icon: '🐦', name: 'Flutter', desc: 'Dart-based mobile apps', color: 'border-cyan-200 bg-cyan-50' },
              { icon: '🤖', name: 'Native Android', desc: 'Gradle-based projects', color: 'border-green-200 bg-green-50' },
            ].map(fw => (
              <div key={fw.name} className={`rounded-xl border ${fw.color} p-5 text-center`}>
                <div className="text-3xl mb-2">{fw.icon}</div>
                <div className="font-semibold text-gray-900">{fw.name}</div>
                <div className="text-xs text-gray-500 mt-1">{fw.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="screenshots" className="bg-white py-16">
        <div className="max-w-6xl mx-auto px-6">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-4">App Preview</h2>
          <p className="text-gray-500 text-center mb-12">
            Screenshots and previews of your built applications will appear here.
          </p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[1, 2, 3, 4].map(i => (
              <div
                key={i}
                className="aspect-[9/16] bg-gradient-to-b from-indigo-100 to-purple-100 rounded-2xl flex items-center justify-center text-gray-400 text-sm border border-gray-200"
              >
                <div className="text-center">
                  <div className="text-4xl mb-2">📱</div>
                  <div className="text-xs">App preview {i}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16">
        <div className="max-w-6xl mx-auto px-6">
          <BuildHistory refreshTrigger={refreshTrigger} />
        </div>
      </section>

      <footer className="bg-gray-900 text-gray-400 py-12">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
            <div>
              <div className="font-bold text-white mb-3">Git-to-App</div>
              <div className="text-sm">
                Build production-ready Android and iOS apps directly from GitHub repositories.
              </div>
            </div>
            <div>
              <div className="font-semibold text-white mb-3">Resources</div>
              <ul className="text-sm space-y-2">
                <li>
                  <a href="https://docs.expo.dev/eas/" target="_blank" rel="noopener noreferrer" className="hover:text-white transition">
                    Expo EAS Docs
                  </a>
                </li>
                <li>
                  <a href="https://flutter.dev" target="_blank" rel="noopener noreferrer" className="hover:text-white transition">
                    Flutter Docs
                  </a>
                </li>
                <li>
                  <a href="https://reactnative.dev" target="_blank" rel="noopener noreferrer" className="hover:text-white transition">
                    React Native Docs
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <div className="font-semibold text-white mb-3">Project</div>
              <ul className="text-sm space-y-2">
                <li>
                  <a href="https://github.com/pangerlkr/Git-to-app" target="_blank" rel="noopener noreferrer" className="hover:text-white transition">
                    GitHub Repository
                  </a>
                </li>
                <li>
                  <a href="https://github.com/pangerlkr/Git-to-app/blob/main/CONTRIBUTING.md" target="_blank" rel="noopener noreferrer" className="hover:text-white transition">
                    Contributing
                  </a>
                </li>
                <li>
                  <a href="https://github.com/pangerlkr/Git-to-app/blob/main/SECURITY.md" target="_blank" rel="noopener noreferrer" className="hover:text-white transition">
                    Security
                  </a>
                </li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 pt-6 text-sm text-center">
            © {new Date().getFullYear()} Git-to-App. Open source under MIT License.
          </div>
        </div>
      </footer>
    </div>
  );
}
