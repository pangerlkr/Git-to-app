# Git-to-App

Transform any GitHub repository into a production-ready Android and iOS mobile application. Just paste the repo URL and build.

## 📋 Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Supported Frameworks & App Types](#supported-frameworks--app-types)
- [Quick Start](#quick-start)
- [Setup](#setup)
- [Usage Examples](#usage-examples)
- [Example Projects & Templates](#example-projects--templates)
- [Architecture](#architecture)
- [Tech Stack](#tech-stack)
- [Running Tests](#running-tests)
- [Contributing](#contributing)
- [Maintenance & Support](#maintenance--support)
- [License](#license)

## Overview

Git-to-App is a powerful web application that automates the process of building mobile applications from GitHub repositories. It intelligently detects the project framework, generates appropriate build configurations, and provides both cloud-based and self-hosted build options.

### Key Capabilities

| Feature | Description |
|---------|-------------|
| **Auto Framework Detection** | Automatically identifies project type (Expo, React Native, Flutter, Native Android/iOS) |
| **Multiple Build Methods** | Supports Expo EAS builds and GitHub Actions workflows |
| **Artifact Management** | Download APK/IPA files directly from the platform |
| **Build Tracking** | SQLite-backed history of all builds with status tracking |
| **Demo Mode** | Test functionality without Expo credentials using simulated builds |
| **External Repository Support** | Build apps from any public GitHub repository |

## Features

### Core Features

- 🔍 **Intelligent Auto-detection** — Analyzes repository structure to detect Expo, React Native, Flutter, and Native Android/iOS projects
- ⚙️ **Flexible Cloud Builds** — Triggers Expo EAS builds with configurable profiles (development, preview, production)
- 🚀 **GitHub Actions Integration** — Generates ready-to-use workflow files for self-hosted builds
- 📦 **Direct Artifact Download** — Download APK and IPA files directly from the build results
- 🗄️ **Build History Tracking** — SQLite database stores complete build records with status and metadata
- 🎭 **Demo Mode** — Works without Expo credentials using simulated builds for testing
- 🔄 **Multi-platform Support** — Build for Android, iOS, or both simultaneously
- 📊 **Real-time Status Updates** — Monitor build progress with automatic status polling

### Build Profiles

| Profile | Purpose | Use Case |
|---------|---------|----------|
| **Development** | Debug builds with development settings | Local testing and development |
| **Preview** | Pre-release builds for testing | QA testing and internal reviews |
| **Production** | Optimized release builds | App store deployment |

## Supported Frameworks & App Types

Git-to-App supports a wide range of mobile application frameworks and project types:

### Framework Detection Matrix

| Framework | Detection Method | Platforms | Build Method |
|-----------|------------------|-----------|--------------|
| **Expo** | `app.config.ts/js` or `expo` in dependencies | Android, iOS | EAS Build API |
| **React Native** | `react-native` dependency + `app.json` | Android, iOS | GitHub Actions |
| **Flutter** | `pubspec.yaml` file | Android, iOS | GitHub Actions |
| **Native Android** | `android/build.gradle` file | Android | GitHub Actions |
| **Native iOS** | iOS project structure | iOS | GitHub Actions |

### Supported App Types

Git-to-App can build the following types of mobile applications:

#### 1. Expo Applications
- Managed Expo apps
- Bare workflow Expo apps
- Apps with custom native modules
- EAS Build-compatible projects

#### 2. React Native Applications
- Standard React Native apps
- Apps with custom native code
- Capacitor + React Native projects
- Ionic + React Native projects

#### 3. Flutter Applications
- Standard Flutter apps
- Flutter apps with custom plugins
- Multi-platform Flutter projects

#### 4. Native Android Applications
- Pure Android (Java/Kotlin) apps
- Android apps with Gradle build system
- Apps with custom build configurations
- Capacitor Android projects
- Cordova Android projects

#### 5. Native iOS Applications
- Pure iOS (Swift/Objective-C) apps
- CocoaPods-based projects
- Xcode workspace projects

### External Repository Workflows

Git-to-App includes specialized GitHub Actions workflows for building apps from external repositories:

| Workflow | Framework | Platform | Trigger |
|----------|-----------|----------|---------|
| `build-apk.yaml` | Native Android | Android | workflow_dispatch |
| `build-flutter-apk.yaml` | Flutter | Android | workflow_dispatch |
| `build-react-native-apk.yaml` | React Native | Android | workflow_dispatch |
| `build-ios-app.yaml` | Native iOS | iOS | workflow_dispatch |
| `build-flutter-ios-app.yaml` | Flutter | iOS | workflow_dispatch |
| `build-react-native-ios-app.yaml` | React Native | iOS | workflow_dispatch |

## Quick Start

### Prerequisites

- Node.js 20+
- npm or yarn

### Installation

```bash
# Clone the repository
git clone https://github.com/pangerlkr/Git-to-app.git
cd Git-to-app

# Install dependencies
npm install

# Run development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Building for Production

```bash
# Build the application
npm run build

# Start production server
npm start
```

## Setup

### Environment Variables

For full environment variable configuration including Expo EAS credentials, GitHub tokens, and production deployment settings, see [docs/SETUP.md](docs/SETUP.md).

#### Quick Configuration

Create a `.env.local` file:

```bash
# Optional: GitHub API token for higher rate limits
GITHUB_TOKEN=your_github_token

# Optional: Expo EAS Build credentials
EXPO_TOKEN=your_expo_token
EXPO_ACCOUNT_NAME=your_account
EXPO_APP_SLUG=your_app_slug
```

## Usage Examples

### Example 1: Building an Expo App

```bash
# Repository URL
https://github.com/expo/examples

# Select Platform: Both (Android + iOS)
# Select Profile: Preview
# Click "Build App"
```

### Example 2: Building a Flutter App

```bash
# Repository URL
https://github.com/flutter/samples

# The system auto-detects Flutter
# Generates GitHub Actions workflow
# Download and commit the workflow to build
```

### Example 3: Using Workflow Dispatch

You can trigger external repository builds directly via GitHub Actions:

```bash
# Navigate to Actions tab in your fork
# Select "Build Android APK"
# Click "Run workflow"
# Enter repository URL and options
# Download artifact when complete
```

### Example Projects & Templates

Git-to-App includes example projects demonstrating the expected build configurations:

| Example | Description | Location |
|---------|-------------|----------|
| **Android Gradle** | Complete native Android project with Gradle 8.x build files | [`examples/android/`](examples/android/) |

These examples serve as:
- 📚 **Reference documentation** for required build configurations
- 🧪 **Testing resources** for validating framework detection
- 📝 **Templates** for creating compatible projects

See the [examples directory](examples/) for complete documentation and usage instructions.

## Architecture

### System Components

```
┌─────────────────────────────────────────────────────────────┐
│                         Next.js App                         │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐       │
│  │   Frontend   │  │  API Routes  │  │   Database   │       │
│  │  (React UI)  │─▶│  (REST API)  │─▶│   (SQLite)   │       │
│  └──────────────┘  └──────────────┘  └──────────────┘       │ 
│                            │                                │
│                            ▼                                │
│                    ┌──────────────┐                         │
│                    │    Builder   │                         │
│                    │    Service   │                         │
│                    └──────────────┘                         │
│                            │                                │
│              ┌─────────────┴─────────────┐                  │
│              ▼                           ▼                  │
│    ┌──────────────────┐       ┌──────────────────┐          │
│    │  GitHub Actions  │       │  Expo EAS Build  │          │
│    │    Workflows     │       │       API        │          │
│    └──────────────────┘       └──────────────────┘          │
└─────────────────────────────────────────────────────────────┘
```

### Core Libraries

| Library | Purpose | Location |
|---------|---------|----------|
| `lib/github.ts` | Repository analysis and framework detection | GitHub REST API integration |
| `lib/builder.ts` | Build orchestration and workflow generation | Expo EAS & GitHub Actions |
| `lib/db.ts` | Build record persistence | SQLite with better-sqlite3 |
| `lib/types.ts` | TypeScript type definitions | Shared interfaces |

## Tech Stack

### Frontend & Backend

| Technology | Version | Purpose |
|------------|---------|---------|
| **Next.js** | 16.1.6 | React framework with App Router |
| **React** | 19.2.3 | UI library |
| **TypeScript** | 5.x | Type-safe JavaScript |
| **Tailwind CSS** | 4.x | Utility-first CSS framework |

### Data & APIs

| Technology | Purpose |
|------------|---------|
| **SQLite** (better-sqlite3) | Local database for build records |
| **GitHub REST API** | Repository analysis and metadata |
| **Expo EAS Build API** | Cloud build service integration |

### Development Tools

| Tool | Purpose |
|------|---------|
| **Jest** | Testing framework |
| **ESLint** | Code linting |
| **PostCSS** | CSS processing |

## Running Tests

```bash
# Run all tests
npm test

# Run tests in watch mode
npm test -- --watch

# Run tests with coverage
npm test -- --coverage
```

### Test Coverage

The repository includes tests for:
- ✅ Database operations (`__tests__/db.test.ts`)
- ✅ Build service logic (`__tests__/builder.test.ts`)
- ✅ GitHub API integration (`__tests__/github.test.ts`)

## Contributing

We welcome contributions! Please see [CONTRIBUTING.md](CONTRIBUTING.md) for details on:
- Code of conduct
- Development workflow
- Pull request process
- Coding standards

### Development Workflow

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Make your changes
4. Run tests (`npm test`)
5. Commit your changes (`git commit -m 'Add amazing feature'`)
6. Push to the branch (`git push origin feature/amazing-feature`)
7. Open a Pull Request

## Maintenance & Support

### Authors & Maintainers

| Role | Contributor | GitHub |
|------|-------------|--------|
| **Original Author & Maintainer** | Pangerkumzuk Longkumer | [@pangerlkr](https://github.com/pangerlkr) |
| **AI Contributor** | Claude (Anthropic) | [@Claude](https://github.com/apps/anthropic-code-agent) |
| **AI Contributor** | GitHub Copilot (SWE Agent) | [@copilot-swe-agent](https://github.com/apps/copilot-swe-agent) |
| **AI Contributor** | GitHub Copilot (CLI) | [@github-copilot-cli](https://github.com/apps/github-copilot-cli) |

### Project Status

- **Status**: Active Development
- **Latest Version**: 1.0.0
- **Last Updated**: 2026-02-23

### Getting Help

- 📖 **Documentation**: Check [docs/](docs/) folder for detailed guides
- 🐛 **Bug Reports**: Open an issue on [GitHub Issues](https://github.com/pangerlkr/Git-to-app/issues)
- 💬 **Discussions**: Use [GitHub Discussions](https://github.com/pangerlkr/Git-to-app/discussions) for questions
- 🔒 **Security**: See [SECURITY.md](SECURITY.md) for security policies

### Roadmap

Future enhancements planned:

- [ ] Support for additional frameworks (Xamarin, Ionic, Cordova standalone)
- [ ] Build queue management for multiple concurrent builds
- [ ] Webhook integration for automatic builds on push
- [ ] Build artifact caching and optimization
- [ ] Advanced build configuration options
- [ ] Integration with app stores for automated deployment

## License

This project is licensed under the **MIT License** — see the [LICENSE](LICENSE) file for full details.

```
MIT License

Copyright (c) 2026 Pangerkumzuk Longkumer

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction...
```

---

**Made with ❤️ by [@pangerlkr](https://github.com/pangerlkr) and [contributors](https://github.com/pangerlkr/Git-to-app/graphs/contributors)**

> ⭐ **If Git-to-App saved you time, please [star this repo](https://github.com/pangerlkr/Git-to-app/stargazers)** — it really helps! 🚀
