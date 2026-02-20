# Git-to-App

Transform any GitHub repository into a production-ready Android and iOS mobile application. Just paste the repo URL and build.

## Features

- 🔍 **Auto-detection** — Detects Expo, React Native, Flutter, and Native Android projects
- ⚙️ **Cloud builds** — Triggers Expo EAS builds or generates GitHub Actions workflows
- 📦 **Artifact download** — Download APK / IPA files directly
- 🗄️ **Build history** — SQLite-backed build record tracking
- 🎭 **Demo mode** — Works without Expo credentials (simulated builds)

## Quick Start

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Setup

See [docs/SETUP.md](docs/SETUP.md) for full environment variable configuration and production deployment instructions.

## Running Tests

```bash
npm test
```

## Tech Stack

- **Next.js 16** App Router + TypeScript + Tailwind CSS
- **SQLite** via better-sqlite3
- **GitHub REST API** for repository analysis
- **Expo EAS Build API** for cloud builds
- **Jest** for testing

## License

MIT
