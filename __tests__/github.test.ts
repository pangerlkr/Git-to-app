import { parseRepoUrl } from '@/lib/github';

describe('parseRepoUrl', () => {
  it('parses standard HTTPS URL', () => {
    expect(parseRepoUrl('https://github.com/owner/repo')).toEqual({ owner: 'owner', repo: 'repo' });
  });

  it('parses URL with .git suffix', () => {
    expect(parseRepoUrl('https://github.com/owner/repo.git')).toEqual({ owner: 'owner', repo: 'repo' });
  });

  it('parses SSH URL', () => {
    expect(parseRepoUrl('git@github.com:owner/repo.git')).toEqual({ owner: 'owner', repo: 'repo' });
  });

  it('returns null for non-GitHub URLs', () => {
    expect(parseRepoUrl('https://gitlab.com/owner/repo')).toBeNull();
  });

  it('returns null for empty string', () => {
    expect(parseRepoUrl('')).toBeNull();
  });

  it('returns null for invalid URL', () => {
    expect(parseRepoUrl('not-a-url')).toBeNull();
  });

  it('trims whitespace', () => {
    expect(parseRepoUrl('  https://github.com/owner/repo  ')).toEqual({ owner: 'owner', repo: 'repo' });
  });
});
