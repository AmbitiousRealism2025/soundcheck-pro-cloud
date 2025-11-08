# Pull Request

## Description

<!-- Provide a clear and concise description of your changes -->

---

## Type of Change

<!-- Check all that apply -->

- [ ] Bug fix (non-breaking change that fixes an issue)
- [ ] New feature (non-breaking change that adds functionality)
- [ ] Breaking change (fix or feature that would cause existing functionality to not work as expected)
- [ ] Documentation update
- [ ] Refactoring (no functional changes)
- [ ] Performance improvement
- [ ] Test coverage improvement
- [ ] CI/CD or tooling change

---

## Related Issues

<!-- Link to related issues using "Fixes #123" or "Closes #123" -->

Fixes #

---

## Changes Made

<!-- List the specific changes made in this PR -->

- Change 1
- Change 2
- Change 3

---

## Testing Checklist

<!-- Ensure all applicable items are checked before requesting review -->

### Code Quality

- [ ] My code follows the project's style guidelines (ESLint passes)
- [ ] TypeScript compiles without errors (`npm run typecheck`)
- [ ] Build succeeds (`npm run build`)
- [ ] I have performed a self-review of my own code
- [ ] I have commented my code in hard-to-understand areas
- [ ] No console.log or debugging code left in

### Testing

- [ ] I have added tests that prove my fix/feature works
- [ ] New and existing unit tests pass (`npm run test`)
- [ ] New and existing E2E tests pass (`npm run test:e2e`)
- [ ] I have tested on multiple browsers (Chrome, Firefox, Safari)
- [ ] I have tested on mobile devices (iOS/Android)
- [ ] I have tested offline functionality (if applicable)

### Documentation

- [ ] I have updated the README (if applicable)
- [ ] I have updated ARCHITECTURE.md (if applicable)
- [ ] I have updated TECH_DEBT.md (if resolving debt)
- [ ] I have added/updated JSDoc comments for new functions
- [ ] I have added/updated Storybook stories for UI components

### Accessibility

- [ ] All interactive elements have proper ARIA labels
- [ ] Focus indicators are visible
- [ ] Keyboard navigation works correctly
- [ ] Color contrast meets WCAG AA standards (if UI change)
- [ ] Screen reader tested (if UI change)

### Performance

- [ ] Bundle size impact is acceptable (<10kb increase)
- [ ] Lighthouse scores remain ≥90 (if UI change)
- [ ] No performance regressions observed

---

## Screenshots

<!-- If your changes affect the UI, include before/after screenshots -->

### Before

<!-- Screenshot before changes -->

### After

<!-- Screenshot after changes -->

---

## Database Changes

<!-- If applicable, describe any schema changes or migrations -->

- [ ] This PR includes database schema changes
- [ ] Migration script provided
- [ ] Rollback plan documented

---

## Breaking Changes

<!-- If this is a breaking change, describe what breaks and migration path -->

---

## Deployment Notes

<!-- Any special deployment considerations or environment variable changes -->

---

## Reviewer Notes

<!-- Any specific areas you want reviewers to focus on -->

---

## Checklist for Reviewers

- [ ] Code follows project conventions and best practices
- [ ] Changes are properly tested
- [ ] Documentation is updated
- [ ] No obvious performance or security issues
- [ ] Accessibility standards are met
- [ ] Changes align with project architecture

---

## Additional Context

<!-- Any other information that would be helpful for reviewers -->
