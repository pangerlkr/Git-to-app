export type Framework = 'expo' | 'react-native' | 'flutter' | 'android' | 'unknown';
export type Platform = 'android' | 'ios' | 'both';
export type BuildStatus = 'queued' | 'building' | 'success' | 'failed' | 'cancelled';
export type BuildProfile = 'development' | 'preview' | 'production';

export interface RepoAnalysis {
  framework: Framework;
  name: string;
  description: string | null;
  stars: number;
  language: string | null;
  hasPackageJson: boolean;
  hasPubspec: boolean;
  hasBuildGradle: boolean;
  hasExpoConfig: boolean;
  hasAppJson: boolean;
  defaultBranch: string;
  isValid: boolean;
  errorMessage?: string;
}

export interface BuildRecord {
  id: string;
  repoUrl: string;
  repoName: string;
  framework: Framework;
  platform: Platform;
  profile: BuildProfile;
  status: BuildStatus;
  androidBuildId?: string;
  iosBuildId?: string;
  androidArtifactUrl?: string;
  iosArtifactUrl?: string;
  logs?: string;
  errorMessage?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateBuildRequest {
  repoUrl: string;
  platform: Platform;
  profile: BuildProfile;
}

export interface EasBuildResponse {
  id: string;
  status: string;
  artifacts?: {
    buildUrl?: string;
  };
  error?: {
    message: string;
  };
}
