import { RepoAnalysis, Framework } from './types';

const GITHUB_API = 'https://api.github.com';

function getHeaders(): Record<string, string> {
  const headers: Record<string, string> = {
    Accept: 'application/vnd.github.v3+json',
    'User-Agent': 'Git-to-App/1.0',
  };
  if (process.env.GITHUB_TOKEN) {
    headers['Authorization'] = `Bearer ${process.env.GITHUB_TOKEN}`;
  }
  return headers;
}

export function parseRepoUrl(url: string): { owner: string; repo: string } | null {
  try {
    const cleaned = url.trim().replace(/\.git$/, '');
    const match = cleaned.match(/github\.com[/:]([^/]+)\/([^/\s]+)/);
    if (!match) return null;
    return { owner: match[1], repo: match[2] };
  } catch {
    return null;
  }
}

async function fileExists(owner: string, repo: string, filePath: string): Promise<boolean> {
  try {
    const res = await fetch(`${GITHUB_API}/repos/${owner}/${repo}/contents/${filePath}`, {
      headers: getHeaders(),
    });
    return res.ok;
  } catch {
    return false;
  }
}

async function getFileContent(owner: string, repo: string, filePath: string): Promise<string | null> {
  try {
    const res = await fetch(`${GITHUB_API}/repos/${owner}/${repo}/contents/${filePath}`, {
      headers: getHeaders(),
    });
    if (!res.ok) return null;
    const data = await res.json();
    if (data.encoding === 'base64' && data.content) {
      return Buffer.from(data.content, 'base64').toString('utf-8');
    }
    return null;
  } catch {
    return null;
  }
}

function detectFramework(
  hasPackageJson: boolean,
  hasExpoConfig: boolean,
  hasAppJson: boolean,
  hasPubspec: boolean,
  hasBuildGradle: boolean,
  packageJsonContent: string | null,
): Framework {
  if (hasPubspec) return 'flutter';
  if (hasExpoConfig) return 'expo';
  if (hasPackageJson && packageJsonContent) {
    try {
      const pkg = JSON.parse(packageJsonContent);
      const deps = { ...pkg.dependencies, ...pkg.devDependencies };
      if (deps['expo']) return 'expo';
      if (deps['react-native']) return 'react-native';
    } catch {
      // ignore parse errors
    }
  }
  if (hasAppJson && hasPackageJson) return 'react-native';
  if (hasBuildGradle) return 'android';
  return 'unknown';
}

export async function analyzeRepo(repoUrl: string): Promise<RepoAnalysis> {
  const parsed = parseRepoUrl(repoUrl);
  if (!parsed) {
    return {
      framework: 'unknown',
      name: '',
      description: null,
      stars: 0,
      language: null,
      hasPackageJson: false,
      hasPubspec: false,
      hasBuildGradle: false,
      hasExpoConfig: false,
      hasAppJson: false,
      defaultBranch: 'main',
      isValid: false,
      errorMessage: 'Invalid GitHub URL. Please provide a valid GitHub repository URL.',
    };
  }

  const { owner, repo } = parsed;

  try {
    const repoRes = await fetch(`${GITHUB_API}/repos/${owner}/${repo}`, {
      headers: getHeaders(),
    });

    if (!repoRes.ok) {
      const status = repoRes.status;
      return {
        framework: 'unknown',
        name: `${owner}/${repo}`,
        description: null,
        stars: 0,
        language: null,
        hasPackageJson: false,
        hasPubspec: false,
        hasBuildGradle: false,
        hasExpoConfig: false,
        hasAppJson: false,
        defaultBranch: 'main',
        isValid: false,
        errorMessage:
          status === 404
            ? 'Repository not found. Please check the URL.'
            : status === 403
              ? 'Rate limited or access denied. Please provide a GITHUB_TOKEN.'
              : `GitHub API error: ${status}`,
      };
    }

    const repoData = await repoRes.json();

    const [hasPackageJson, hasPubspec, hasBuildGradle, hasExpoConfig, hasAppJson] =
      await Promise.all([
        fileExists(owner, repo, 'package.json'),
        fileExists(owner, repo, 'pubspec.yaml'),
        fileExists(owner, repo, 'android/build.gradle'),
        fileExists(owner, repo, 'app.config.ts').then(r => r || fileExists(owner, repo, 'app.config.js')),
        fileExists(owner, repo, 'app.json'),
      ]);

    const packageJsonContent = hasPackageJson
      ? await getFileContent(owner, repo, 'package.json')
      : null;

    const framework = detectFramework(
      hasPackageJson,
      hasExpoConfig,
      hasAppJson,
      hasPubspec,
      hasBuildGradle,
      packageJsonContent,
    );

    return {
      framework,
      name: repoData.full_name,
      description: repoData.description,
      stars: repoData.stargazers_count,
      language: repoData.language,
      hasPackageJson,
      hasPubspec,
      hasBuildGradle,
      hasExpoConfig,
      hasAppJson,
      defaultBranch: repoData.default_branch || 'main',
      isValid: true,
    };
  } catch (error) {
    return {
      framework: 'unknown',
      name: `${owner}/${repo}`,
      description: null,
      stars: 0,
      language: null,
      hasPackageJson: false,
      hasPubspec: false,
      hasBuildGradle: false,
      hasExpoConfig: false,
      hasAppJson: false,
      defaultBranch: 'main',
      isValid: false,
      errorMessage: `Failed to analyze repository: ${error instanceof Error ? error.message : 'Unknown error'}`,
    };
  }
}
