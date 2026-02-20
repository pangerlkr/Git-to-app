# Setup Guide

## Prerequisites

- Node.js 18+
- npm or yarn

## Installation

```bash
git clone https://github.com/pangerlkr/Git-to-app.git
cd Git-to-app
npm install
```

## Environment Variables

Create a `.env.local` file in the project root:

```env
# GitHub API token (optional but recommended to avoid rate limits)
GITHUB_TOKEN=ghp_your_token_here

# Expo EAS Build (optional - without these, demo mode is used)
EXPO_TOKEN=your_expo_token
EXPO_APP_SLUG=your-app-slug
EXPO_ACCOUNT_NAME=your-expo-account

# Database path (optional - defaults to ./data/builds.db)
DB_PATH=./data/builds.db
```

## Running Locally

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Building for Production

```bash
npm run build
npm start
```

## Demo Mode

If `EXPO_TOKEN`, `EXPO_APP_SLUG`, and `EXPO_ACCOUNT_NAME` are not set, the app runs in **demo mode**:
- Builds are simulated (transition to success after 5 seconds)
- Artifact URLs point to demo placeholders
- GitHub analysis still works (subject to API rate limits)

## Running Tests

```bash
npm test
```

## Supported Frameworks

| Framework | Detection Method |
|-----------|-----------------|
| Expo | `app.config.ts/js` or `expo` in `package.json` |
| React Native | `react-native` in `package.json` |
| Flutter | `pubspec.yaml` present |
| Native Android | `android/build.gradle` present |
