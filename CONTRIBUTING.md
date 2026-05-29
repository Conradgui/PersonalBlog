# Contributing

Thank you for your interest in contributing to this project!

## How to Contribute

### Report a Bug

1. Check existing [Issues](../../issues) to avoid duplicates
2. Create a new Issue with:
   - Clear description of the bug
   - Steps to reproduce
   - Expected vs actual behavior
   - Browser and OS information

### Suggest a Feature

1. Create a new [Issue](../../issues/new)
2. Describe the feature and its use case
3. Explain why it would be valuable

### Submit Code

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/your-feature`
3. Make your changes
4. Test locally: `npm run dev`
5. Build check: `npm run build`
6. Commit: `git commit -m "feat: add your feature"`
7. Push: `git push origin feature/your-feature`
8. Open a Pull Request

## Commit Convention

Use [Conventional Commits](https://www.conventionalcommits.org/):

| Type     | When to use              |
| :------- | :----------------------- |
| `feat`   | New feature              |
| `fix`    | Bug fix                  |
| `docs`   | Documentation            |
| `style`  | Code formatting          |
| `refactor` | Code restructuring     |
| `perf`   | Performance improvement  |
| `test`   | Adding tests             |
| `chore`  | Build/tooling changes    |

Examples:

```bash
git commit -m "feat: add blog search functionality"
git commit -m "fix: resolve window drag issue on mobile"
git commit -m "docs: update deployment guide"
```

## Code Style

- 2 spaces for indentation
- Single quotes for strings
- Semicolons required
- PascalCase for components
- camelCase for functions and variables
- One CSS file per component

## Pull Request Checklist

Before submitting:

- [ ] Code follows project conventions
- [ ] Build passes (`npm run build`)
- [ ] No console errors
- [ ] PR description clearly explains the change
- [ ] Related Issue linked (if applicable)

## Questions?

Open an [Issue](../../issues/new) for any questions.
