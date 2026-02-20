import { BuildRecord, BuildStatus, EasBuildResponse, Framework, Platform, BuildProfile } from './types';
import { updateBuild } from './db';

const EAS_API = 'https://api.expo.dev/v2';

function getEasHeaders(): Record<string, string> {
  return {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${process.env.EXPO_TOKEN || ''}`,
  };
}

export async function triggerEasBuild(
  buildId: string,
  repoUrl: string,
  platform: Platform,
  profile: BuildProfile,
): Promise<void> {
  const appSlug = process.env.EXPO_APP_SLUG;
  const accountName = process.env.EXPO_ACCOUNT_NAME;

  if (!process.env.EXPO_TOKEN || !appSlug || !accountName) {
    await simulateBuild(buildId, platform);
    return;
  }

  try {
    const platforms = platform === 'both' ? ['android', 'ios'] : [platform];

    for (const p of platforms) {
      const res = await fetch(`${EAS_API}/builds`, {
        method: 'POST',
        headers: getEasHeaders(),
        body: JSON.stringify({
          appIdentifier: `@${accountName}/${appSlug}`,
          platform: p,
          buildProfile: profile,
          gitCommitHash: 'HEAD',
        }),
      });

      if (!res.ok) {
        const error = await res.text();
        await updateBuild(buildId, {
          status: 'failed',
          errorMessage: `EAS Build API error: ${error}`,
        });
        return;
      }

      const data: EasBuildResponse = await res.json();
      const updates: Partial<BuildRecord> = { status: 'building' };

      if (p === 'android') {
        updates.androidBuildId = data.id;
      } else {
        updates.iosBuildId = data.id;
      }

      await updateBuild(buildId, updates);
    }
  } catch (error) {
    await updateBuild(buildId, {
      status: 'failed',
      errorMessage: `Build trigger failed: ${error instanceof Error ? error.message : 'Unknown error'}`,
    });
  }
}

export async function pollEasBuildStatus(
  buildId: string,
  easBuildId: string,
  platform: 'android' | 'ios',
): Promise<void> {
  if (!process.env.EXPO_TOKEN) {
    return;
  }

  try {
    const res = await fetch(`${EAS_API}/builds/${easBuildId}`, {
      headers: getEasHeaders(),
    });

    if (!res.ok) return;

    const data: EasBuildResponse = await res.json();
    const updates: Partial<BuildRecord> = {};

    if (data.status === 'FINISHED' && data.artifacts?.buildUrl) {
      updates.status = 'success';
      if (platform === 'android') {
        updates.androidArtifactUrl = data.artifacts.buildUrl;
      } else {
        updates.iosArtifactUrl = data.artifacts.buildUrl;
      }
    } else if (data.status === 'ERRORED' || data.status === 'CANCELLED') {
      updates.status = data.status === 'CANCELLED' ? 'cancelled' : 'failed';
      updates.errorMessage = data.error?.message || 'Build failed';
    }

    if (Object.keys(updates).length > 0) {
      await updateBuild(buildId, updates);
    }
  } catch {
    // ignore polling errors
  }
}

export function generateGitHubActionsWorkflow(
  framework: Framework,
  platform: Platform,
): string {
  const androidJob =
    platform === 'android' || platform === 'both'
      ? `
  build-android:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-java@v4
        with:
          java-version: '17'
          distribution: 'temurin'
      - uses: gradle/gradle-build-action@v3
      - name: Build Android APK
        run: |
          cd android
          ./gradlew assembleRelease
      - uses: actions/upload-artifact@v4
        with:
          name: android-apk
          path: android/app/build/outputs/apk/release/*.apk`
      : '';

  const iosJob =
    platform === 'ios' || platform === 'both'
      ? `
  build-ios:
    runs-on: macos-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '20'
      - run: npm ci
      - run: npx pod-install
      - name: Build iOS IPA
        run: |
          xcodebuild -workspace ios/*.xcworkspace \\
            -scheme "Release" \\
            -sdk iphoneos \\
            -configuration Release \\
            archive -archivePath build/app.xcarchive
          xcodebuild -exportArchive \\
            -archivePath build/app.xcarchive \\
            -exportOptionsPlist ios/exportOptions.plist \\
            -exportPath build/
      - uses: actions/upload-artifact@v4
        with:
          name: ios-ipa
          path: build/*.ipa`
      : '';

  const flutterJobs =
    framework === 'flutter'
      ? `
  build-flutter-android:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: subosito/flutter-action@v2
        with:
          flutter-version: 'stable'
          channel: 'stable'
      - run: flutter pub get
      - run: flutter build apk --release
      - uses: actions/upload-artifact@v4
        with:
          name: flutter-android-apk
          path: build/app/outputs/flutter-apk/app-release.apk

  build-flutter-ios:
    runs-on: macos-latest
    steps:
      - uses: actions/checkout@v4
      - uses: subosito/flutter-action@v2
        with:
          flutter-version: 'stable'
      - run: flutter pub get
      - run: flutter build ios --release --no-codesign
      - uses: actions/upload-artifact@v4
        with:
          name: flutter-ios
          path: build/ios/iphoneos/Runner.app`
      : '';

  const jobs = framework === 'flutter' ? flutterJobs : `${androidJob}${iosJob}`;

  return `name: Build Mobile App

on:
  push:
    branches: [ main, master ]
  workflow_dispatch:

jobs:${jobs}
`;
}

async function simulateBuild(
  buildId: string,
  platform: Platform,
): Promise<void> {
  await updateBuild(buildId, { status: 'building' });

  setTimeout(async () => {
    const updates: Partial<BuildRecord> = { status: 'success' };
    if (platform === 'android' || platform === 'both') {
      updates.androidArtifactUrl =
        'https://expo.dev/artifacts/eas/demo-android.apk';
    }
    if (platform === 'ios' || platform === 'both') {
      updates.iosArtifactUrl =
        'https://expo.dev/artifacts/eas/demo-ios.ipa';
    }
    await updateBuild(buildId, updates);
  }, 5000);
}
