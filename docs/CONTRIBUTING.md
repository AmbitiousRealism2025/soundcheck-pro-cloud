# Contributing to SoundCheck Pro

Thank you for your interest in contributing to SoundCheck Pro! This document provides guidelines and instructions for contributing to the project.

## Code of Conduct

By participating in this project, you agree to maintain a respectful and inclusive environment. We expect all contributors to:

- Be respectful and considerate of others
- Welcome newcomers and help them get started
- Focus on constructive feedback
- Respect differing viewpoints and experiences

## How to Contribute

### Reporting Bugs

Before creating a bug report, please check existing issues to avoid duplicates.

**When filing a bug report, include:**

- Clear, descriptive title
- Steps to reproduce the issue
- Expected behavior
- Actual behavior
- Screenshots (if applicable)
- Browser and OS version
- Console errors (if any)

### Suggesting Features

We welcome feature suggestions! Please create an issue with:

- Clear description of the feature
- Use case and motivation
- Possible implementation approach (optional)
- Screenshots or mockups (if applicable)

### Pull Requests

1. **Fork the Repository**
   ```bash
   git clone https://github.com/your-username/soundcheck-pro-cloud.git
   cd soundcheck-pro-cloud
   ```

2. **Create a Branch**
   ```bash
   git checkout -b feature/your-feature-name
   # or
   git checkout -b fix/your-bug-fix
   ```

3. **Install Dependencies**
   ```bash
   npm install
   ```

4. **Make Your Changes**
   - Write clear, concise code
   - Follow the existing code style
   - Add tests for new features
   - Update documentation as needed

5. **Test Your Changes**
   ```bash
   npm run lint         # Check linting
   npm run typecheck    # Check TypeScript
   npm run test         # Run unit tests
   npm run test:e2e     # Run E2E tests (optional but recommended)
   npm run build        # Ensure build succeeds
   ```

6. **Commit Your Changes**

   Use conventional commit messages:
   ```bash
   git commit -m "feat: add new feature"
   git commit -m "fix: resolve bug in component"
   git commit -m "docs: update README"
   git commit -m "test: add tests for feature"
   git commit -m "refactor: improve code structure"
   git commit -m "style: format code"
   git commit -m "chore: update dependencies"
   ```

7. **Push to Your Fork**
   ```bash
   git push origin feature/your-feature-name
   ```

8. **Open a Pull Request**
   - Go to the original repository
   - Click "New Pull Request"
   - Select your branch
   - Fill out the PR template
   - Submit for review

## Development Guidelines

### Code Style

- **TypeScript**: Use TypeScript for all new code. Avoid `any` types.
- **Components**: Use functional components with hooks
- **Imports**: Use `@/` path alias for imports
- **Formatting**: Code is automatically formatted with Prettier on commit

### Component Guidelines

```typescript
// ✅ Good
export function MyComponent({ prop1, prop2 }: MyComponentProps) {
  // Component logic
  return <div>...</div>
}

// ❌ Avoid
export default function MyComponent(props: any) {
  // Component logic
}
```

### State Management

- Use Zustand for global state
- Keep local state in components when appropriate
- All database operations go through Zustand actions
- Follow existing slice patterns in `src/store/slices/`

### Testing

- Write unit tests for utilities and components
- Place tests next to the files they test
- Use descriptive test names
- Aim for meaningful coverage, not just high percentages

```typescript
// Example test
describe('MyComponent', () => {
  it('should render with props', () => {
    render(<MyComponent title="Test" />)
    expect(screen.getByText('Test')).toBeInTheDocument()
  })
})
```

### Accessibility

- Ensure all interactive elements are keyboard accessible
- Use semantic HTML
- Add ARIA labels where needed
- Test with keyboard navigation
- Maintain color contrast ratios

### Performance

- Lazy load routes and heavy components
- Use React.memo for expensive components
- Optimize images and assets
- Monitor bundle size

## Project Structure

```
src/
├── app/routes/          # Page components
├── components/
│   ├── ui/              # Reusable UI components
│   ├── dashboard/       # Dashboard-specific
│   ├── rehearsals/      # Rehearsal-specific
│   └── gigs/            # Gig-specific
├── db/                  # Database schema and migrations
├── store/
│   ├── slices/          # State management slices
│   └── hooks.ts         # Custom state hooks
├── schemas/             # Zod validation schemas
├── hooks/               # Custom React hooks
├── layouts/             # App shell layouts
├── styles/              # Global styles and tokens
├── utils/               # Pure utility functions
└── types.ts             # TypeScript type definitions
```

## Commit Messages

We use [Conventional Commits](https://www.conventionalcommits.org/):

- `feat:` New feature
- `fix:` Bug fix
- `docs:` Documentation changes
- `style:` Code style changes (formatting, etc.)
- `refactor:` Code refactoring
- `test:` Adding or updating tests
- `chore:` Maintenance tasks
- `perf:` Performance improvements

## Review Process

1. **Automated Checks**: CI runs linting, type checking, and tests
2. **Code Review**: Maintainers review code for quality and consistency
3. **Feedback**: Address any requested changes
4. **Approval**: Once approved, PR will be merged
5. **Deployment**: Changes are deployed automatically (if applicable)

## Getting Help

- **Questions**: Open a [GitHub Discussion](https://github.com/AmbitiousRealism2025/soundcheck-pro-cloud/discussions)
- **Issues**: Check [existing issues](https://github.com/AmbitiousRealism2025/soundcheck-pro-cloud/issues)
- **Documentation**: See [docs/](../docs/) folder

## License

By contributing, you agree that your contributions will be licensed under the MIT License.

---

Thank you for contributing to SoundCheck Pro! 🎸
