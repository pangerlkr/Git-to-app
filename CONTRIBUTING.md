# Contributing to Git-to-App

Thank you for your interest in contributing to Git-to-App!

## Getting Started

1. Fork the repository
2. Clone your fork: `git clone https://github.com/YOUR_USERNAME/Git-to-app.git`
3. Install dependencies: `npm install`
4. Copy environment variables: `cp .env.example .env.local`
5. Start the development server: `npm run dev`

## Development

- **Framework**: Next.js 14 App Router with TypeScript
- **Styling**: Tailwind CSS
- **Database**: SQLite (better-sqlite3)
- **Testing**: Jest

## Running Tests

```bash
npm test
```

## Pull Request Process

1. Create a feature branch from `main`
2. Make your changes with clear, descriptive commits
3. Ensure all tests pass: `npm test`
4. Ensure the build succeeds: `npm run build`
5. Open a pull request with a clear description

## Code Style

- TypeScript strict mode
- Functional React components with hooks
- Async/await for asynchronous operations
- Descriptive variable and function names

## Reporting Issues

Use GitHub Issues to report bugs or request features. Include:
- Steps to reproduce
- Expected vs actual behavior
- Environment details (OS, Node version, etc.)

## License

By contributing, you agree that your contributions will be licensed under the MIT License.
