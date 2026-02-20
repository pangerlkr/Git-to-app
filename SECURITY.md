# Security Policy

## Supported Versions

| Version | Supported          |
| ------- | ------------------ |
| latest  | ✅ Yes             |

## Reporting a Vulnerability

If you discover a security vulnerability, please **do not** open a public GitHub issue.

Instead, please report it by emailing the maintainers or opening a private security advisory on GitHub.

We will respond within 72 hours and provide a fix as quickly as possible.

## Security Considerations

- **GitHub Token**: Never commit your `GITHUB_TOKEN` to the repository. Store it in `.env.local` or as a GitHub Actions secret.
- **Expo Token**: Same applies to `EXPO_TOKEN` — keep it in environment variables only.
- **Database**: The SQLite database (`data/builds.db`) contains build records. Do not expose the `data/` directory publicly.
- **Rate Limiting**: Without a `GITHUB_TOKEN`, the GitHub API rate limit is 60 requests/hour. Provide a token for production use.

## Environment Variables

Never commit `.env.local` to version control. The `.gitignore` already excludes it.

Required secrets for production:
- `GITHUB_TOKEN` — GitHub Personal Access Token
- `EXPO_TOKEN` — Expo Access Token
- `EXPO_APP_SLUG` — Your Expo app slug
- `EXPO_ACCOUNT_NAME` — Your Expo account name
