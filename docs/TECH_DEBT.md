# SoundCheck Pro - Technical Debt Registry

**Last Updated**: 2025-11-08
**Status**: Phase 0 Complete

---

## Overview

This document tracks known technical debt, gaps, and areas for improvement in the SoundCheck Pro codebase. Items are prioritized by impact and effort, with clear ownership and resolution plans.

---

## Priority Legend

- 🔴 **Critical** - Blocks functionality or causes bugs, must fix ASAP
- 🟡 **High** - Significant impact on UX or maintainability, address soon
- 🟢 **Medium** - Nice to have, schedule when convenient
- ⚪ **Low** - Minor improvements, address opportunistically

---

## Status Legend

- 📋 **Logged** - Identified but not yet planned
- 📅 **Planned** - Scheduled for specific phase
- 🏗️ **In Progress** - Currently being addressed
- ✅ **Resolved** - Fixed/implemented
- ❌ **Wont Fix** - Decided not to address

---

## Current Technical Debt

### 1. State Management

#### 1.1 Monolithic Store Structure
- **Priority**: 🟡 High
- **Status**: 📅 Planned (Phase 2)
- **Issue**: Single flat Zustand store becomes hard to maintain as app grows
- **Impact**:
  - Difficult to test individual domains
  - All state updates trigger all subscribers
  - No clear separation of concerns
- **Proposed Solution**:
  - Refactor into modular slices (rehearsalsSlice, gigsSlice, uiSlice, settingsSlice)
  - Implement selectors for derived state
  - Use shallow equality checks to prevent unnecessary re-renders
- **Effort**: Medium (1-2 days)
- **Related**: Phase 2.1 in coding plan

#### 1.2 No Optimistic Updates
- **Priority**: 🟢 Medium
- **Status**: 📅 Planned (Phase 2)
- **Issue**: State updates wait for IndexedDB write to complete
- **Impact**:
  - Perceived lag on slower devices
  - UI freezes during large operations
- **Proposed Solution**:
  - Update state immediately (optimistic)
  - Rollback on IndexedDB error
  - Show toast notification on failure
- **Effort**: Small (1 day)
- **Related**: Phase 2.1 in coding plan

#### 1.3 No State Persistence for UI
- **Priority**: 🟢 Medium
- **Status**: 📅 Planned (Phase 2)
- **Issue**: UI state (sidebar open, theme, etc.) resets on page reload
- **Impact**:
  - Poor UX - users have to reconfigure UI each session
- **Proposed Solution**:
  - Use Zustand persist middleware
  - Store UI state in localStorage
  - Restore on app load
- **Effort**: Small (0.5 day)
- **Related**: Phase 2.1 in coding plan

---

### 2. Database Layer

#### 2.1 Limited Schema v1
- **Priority**: 🟡 High
- **Status**: 📅 Planned (Phase 2)
- **Issue**: Current schema lacks features outlined in PLAN.md
  - No rehearsal templates
  - No attachments table
  - No mileage logs
  - No compensation tracking
  - No status fields
- **Impact**:
  - Missing core features
  - Need migration to add later
- **Proposed Solution**:
  - Implement Dexie v2 schema migration
  - Add new tables and fields
  - Provide migration path from v1
  - Create backup before migration
- **Effort**: Medium (2-3 days)
- **Related**: Phase 2.2 in coding plan

#### 2.2 No Backup/Restore
- **Priority**: 🟡 High
- **Status**: ✅ Resolved (Phase 0)
- **Issue**: ~~No way to backup or restore user data~~
- **Impact**: ~~Risk of data loss, no migration path~~
- **Resolution**:
  - Created backup/restore utilities in `src/db/seed.ts`
  - Export to JSON implemented
  - Import from JSON implemented
  - Accessible via DevTools component
- **Resolved On**: 2025-11-08

#### 2.3 No Data Validation on Import
- **Priority**: 🟡 High
- **Status**: 📋 Logged
- **Issue**: Import function doesn't validate data structure or types
- **Impact**:
  - Importing corrupted/invalid data could break app
  - No error recovery
- **Proposed Solution**:
  - Use Zod schemas to validate imported data
  - Show detailed error messages
  - Provide option to skip invalid records
- **Effort**: Small (1 day)

---

### 3. Component Architecture

#### 3.1 No Shared Layout/Shell
- **Priority**: 🟡 High
- **Status**: 📅 Planned (Phase 1)
- **Issue**: No consistent app layout with navigation
- **Impact**:
  - Each route implements its own layout
  - Inconsistent UX
  - Duplication of navigation code
- **Proposed Solution**:
  - Create AppLayout component with sidebar, header, content area
  - Use React Router Outlet for nested routes
  - Implement responsive navigation (desktop sidebar, mobile bottom nav)
- **Effort**: Medium (2-3 days)
- **Related**: Phase 1.1 in coding plan

#### 3.2 Incomplete UI Component Library
- **Priority**: 🟡 High
- **Status**: 📅 Planned (Phase 1)
- **Issue**: Only basic Button and Input components exist
  - No Modal, Card, Toast, Select, etc.
  - No consistent styling patterns
- **Impact**:
  - Building features requires creating components from scratch
  - Inconsistent design across app
- **Proposed Solution**:
  - Build comprehensive component library in Phase 1.3
  - Create Storybook stories for documentation
  - Implement accessibility features
- **Effort**: Large (5-7 days)
- **Related**: Phase 1.3 in coding plan

#### 3.3 No Error Boundaries
- **Priority**: 🟡 High
- **Status**: 📅 Planned (Phase 2)
- **Issue**: Unhandled React errors crash entire app
- **Impact**:
  - Poor UX - white screen of death
  - No error recovery
  - Hard to debug production issues
- **Proposed Solution**:
  - Add error boundary components
  - Provide fallback UI with "Reset" button
  - Log errors for debugging
  - Future: send to error tracking service
- **Effort**: Small (1 day)
- **Related**: Phase 2.4 in coding plan

---

### 4. Forms & Validation

#### 4.1 No Form Validation Implementation
- **Priority**: 🟡 High
- **Status**: 📅 Planned (Phase 3)
- **Issue**: React Hook Form and Zod are installed but not used
- **Impact**:
  - Forms accept invalid data
  - Poor UX - no inline error messages
  - Database could contain bad data
- **Proposed Solution**:
  - Create Zod schemas for all entities (rehearsal, gig, task)
  - Integrate with React Hook Form
  - Show inline validation errors
  - Prevent submission of invalid data
- **Effort**: Medium (2-3 days)
- **Related**: Phase 3.4 in coding plan

---

### 5. Routing & Navigation

#### 5.1 No Code Splitting
- **Priority**: 🟢 Medium
- **Status**: 📅 Planned (Phase 5)
- **Issue**: All routes bundled together, large initial bundle
- **Impact**:
  - Slower initial load
  - Loading unused code upfront
- **Proposed Solution**:
  - Use React.lazy() for route components
  - Add Suspense boundaries with loading states
  - Implement preloading on hover for faster navigation
- **Effort**: Small (1 day)
- **Related**: Phase 5.2 in coding plan

---

### 6. Testing

#### 6.1 Zero Test Coverage
- **Priority**: 🟡 High
- **Status**: ✅ Resolved (Phase 0 - Infrastructure Only)
- **Issue**: ~~No unit tests, component tests, or E2E tests~~
- **Impact**:
  - High risk of regressions
  - Difficult to refactor with confidence
  - No automated QA
- **Partial Resolution**:
  - Vitest and Playwright configured in Phase 0
  - Test infrastructure ready
  - **Still needed**: Actual test implementation (Phase 5)
- **Proposed Solution**:
  - Write unit tests for utilities and store actions
  - Write component tests for UI library
  - Write E2E tests for critical flows
  - Set up CI to run tests on every PR
- **Effort**: Large (5-7 days)
- **Related**: Phase 5.1 in coding plan

---

### 7. Performance

#### 7.1 No List Virtualization
- **Priority**: 🟢 Medium
- **Status**: 📅 Planned (Phase 5)
- **Issue**: Long lists (100+ rehearsals/gigs) render all items at once
- **Impact**:
  - Slow rendering on large datasets
  - Janky scrolling
- **Proposed Solution**:
  - Implement virtualization with react-virtual or similar
  - Only render visible items
  - Maintain scroll position
- **Effort**: Small (1 day)
- **Related**: Phase 5.2 in coding plan

#### 7.2 No Memoization Strategy
- **Priority**: 🟢 Medium
- **Status**: 📋 Logged
- **Issue**: Components re-render unnecessarily
- **Impact**:
  - Wasted CPU cycles
  - Potential jank on slower devices
- **Proposed Solution**:
  - Use React.memo for expensive components
  - Use useMemo for expensive computations
  - Use useCallback for stable function references
  - Profile with React DevTools to identify issues
- **Effort**: Medium (ongoing, optimize as needed)

---

### 8. Accessibility

#### 8.1 No ARIA Labels on Interactive Elements
- **Priority**: 🟡 High
- **Status**: 📅 Planned (Phase 4)
- **Issue**: Buttons, links, and inputs missing proper labels
- **Impact**:
  - Inaccessible to screen reader users
  - Poor keyboard navigation experience
- **Proposed Solution**:
  - Audit all components for ARIA labels
  - Add aria-label, aria-describedby where needed
  - Test with screen reader (NVDA, VoiceOver)
  - Run Lighthouse accessibility checks
- **Effort**: Medium (2-3 days)
- **Related**: Phase 4.5 in coding plan

#### 8.2 No Focus Management
- **Priority**: 🟡 High
- **Status**: 📅 Planned (Phase 1 & 4)
- **Issue**: Modals don't trap focus, no focus indicators
- **Impact**:
  - Keyboard users can tab outside modals
  - Hard to see what's focused
- **Proposed Solution**:
  - Implement focus trap in Modal component
  - Add visible focus indicators (ring)
  - Restore focus to trigger element on close
- **Effort**: Small (1 day)
- **Related**: Phase 1.3 and 4.5 in coding plan

---

### 9. PWA & Offline

#### 9.1 Basic Service Worker Only
- **Priority**: 🟢 Medium
- **Status**: 📅 Planned (Phase 2)
- **Issue**: Current service worker only caches static assets
  - No runtime caching strategies
  - No background sync
  - No offline fallback page
- **Impact**:
  - Limited offline functionality
  - No sync queue for failed operations (when cloud sync added)
- **Proposed Solution**:
  - Enhance Workbox config in vite.config.ts
  - Add runtime caching for images/external resources
  - Implement background sync for future cloud backup
  - Create offline fallback page
- **Effort**: Medium (2 days)
- **Related**: Phase 2.3 in coding plan

#### 9.2 No Update Notification
- **Priority**: 🟢 Medium
- **Status**: 📅 Planned (Phase 2)
- **Issue**: Users don't know when app update is available
- **Impact**:
  - Users run outdated versions
  - Bug fixes don't reach users quickly
- **Proposed Solution**:
  - Create UpdateNotification component
  - Show banner when new version detected
  - Provide "Update Now" button
  - Auto-reload after update
- **Effort**: Small (0.5 day)
- **Related**: Phase 2.3 in coding plan

---

### 10. Developer Experience

#### 10.1 No API Documentation
- **Priority**: 🟢 Medium
- **Status**: ✅ Resolved (Phase 0)
- **Issue**: ~~No documentation for components, utilities, or store~~
- **Resolution**:
  - ARCHITECTURE.md created with comprehensive overview
  - CLAUDE.md provides development guidelines
  - Code comments added to key functions
  - **Still needed**: JSDoc comments on all public APIs (low priority)
- **Resolved On**: 2025-11-08

#### 10.2 No Component Documentation
- **Priority**: 🟢 Medium
- **Status**: 📅 Planned (Phase 1)
- **Issue**: No visual documentation of UI components
- **Impact**:
  - Hard to discover available components
  - Difficult to understand component APIs
- **Proposed Solution**:
  - Set up Storybook
  - Create stories for all UI components
  - Document props and usage examples
  - Add accessibility tests in stories
- **Effort**: Medium (2-3 days)
- **Related**: Phase 1.4 in coding plan

---

### 11. Security

#### 11.1 No Input Sanitization
- **Priority**: 🟡 High
- **Status**: 📅 Planned (Phase 3)
- **Issue**: User inputs not sanitized before display
- **Impact**:
  - Potential XSS vulnerabilities
  - Especially risky when rendering notes/attachments
- **Proposed Solution**:
  - Sanitize HTML in note fields
  - Validate file uploads (type, size)
  - Use React's built-in XSS protection (don't use dangerouslySetInnerHTML)
  - Add Content Security Policy headers
- **Effort**: Small (1 day)
- **Related**: Phase 3 implementation

---

### 12. Internationalization

#### 12.1 Hardcoded Strings
- **Priority**: ⚪ Low
- **Status**: 📅 Planned (Phase 4)
- **Issue**: All UI strings hardcoded in English
- **Impact**:
  - Not accessible to non-English speakers
  - Hard to translate later
- **Proposed Solution**:
  - Set up react-i18next
  - Extract all strings to translation files
  - Provide at least English locale
  - Future: add Spanish, French, etc.
- **Effort**: Large (5-7 days)
- **Related**: Phase 4.6 in coding plan

---

## Resolved Debt

### ✅ Development Tooling
- **Resolved**: Phase 0 (2025-11-08)
- **What**: Set up ESLint, Husky, lint-staged, CI/CD
- **Impact**: Improved code quality, automated checks

### ✅ Testing Infrastructure
- **Resolved**: Phase 0 (2025-11-08)
- **What**: Configured Vitest and Playwright
- **Impact**: Ready for test implementation

### ✅ Seed Data Utilities
- **Resolved**: Phase 0 (2025-11-08)
- **What**: Created database seeding and DevTools component
- **Impact**: Faster development iteration

---

## Metrics

### Current Debt Level
- **Critical**: 0 items
- **High**: 11 items
- **Medium**: 9 items
- **Low**: 1 item
- **Total**: 21 items

### Debt Trend
- **Phase 0**: +3 resolved, +0 new
- **Target for Phase 1**: Resolve 5 high-priority items
- **Target for Phase 2**: Resolve 6 high-priority items

---

## How to Use This Document

### For Developers
1. Check this document before starting new work
2. Add debt items as you discover them
3. Update status when working on related features
4. Link to issues/PRs when addressing debt

### For Planning
1. Review before each phase to prioritize debt
2. Allocate time in sprints for debt reduction
3. Track metrics to ensure debt doesn't grow unchecked

### For Code Reviews
1. Check if PR introduces new debt
2. Require debt items to be logged if introduced
3. Celebrate when debt is resolved

---

## Appendix: Debt Prevention Strategies

1. **Write tests** - Catch regressions early
2. **Document as you go** - Don't defer documentation
3. **Refactor incrementally** - Don't let technical debt accumulate
4. **Code reviews** - Catch issues before they merge
5. **Performance budgets** - Monitor bundle size and Lighthouse scores
6. **Accessibility audits** - Run automated checks in CI

---

**Document Owner**: Cloud Agents
**Review Frequency**: After each phase completion
**Last Review**: 2025-11-08
