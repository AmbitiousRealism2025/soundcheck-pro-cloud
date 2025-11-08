# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added
- Phase 5: Stabilization & Launch Prep
  - Comprehensive unit tests for UI components (Button, Input, Modal)
  - Comprehensive unit tests for utility functions (dates, id, analytics)
  - End-to-end tests for critical user flows (rehearsals, gigs, navigation)
  - Enhanced README with badges, features list, and documentation links
  - CONTRIBUTING.md with development guidelines
  - CHANGELOG.md for tracking changes
  - Test setup with portal root support for Modal components

## [0.1.0] - 2025-11-08

### Added

#### Phase 0: Discovery & Setup
- CI/CD pipeline with GitHub Actions
- ESLint configuration with TypeScript and React rules
- Husky pre-commit hooks with lint-staged
- Vitest unit testing infrastructure
- Playwright E2E testing infrastructure
- Database seeding utilities
- DevTools component for development
- Architecture documentation
- Technical debt registry
- GitHub issue and PR templates

#### Phase 1: Foundation & Design System
- Responsive app layout with collapsible sidebar
- Desktop and mobile navigation
- Comprehensive component library (17+ components)
- Design system tokens (colors, spacing, typography, shadows)
- Portal component for modals and toasts
- Toast notification system with context provider
- Modal, Sheet, Card, Badge, Chip components
- Input, Textarea, Checkbox, Switch, Select components
- Skeleton loaders and loading states
- Animations and transitions throughout

#### Phase 2: State & Data Hardening
- Modular Zustand store architecture with slices
- rehearsalsSlice, gigsSlice, uiSlice, settingsSlice
- Dexie v2 schema with migrations
- New tables: rehearsalTemplates, mileageLogs
- Enhanced types for all domain entities
- Backup and restore utilities
- Sync queue for offline operations
- Online/offline status tracking
- SyncIndicator, OfflineBanner, UpdateNotification components
- Error boundaries and Suspense fallbacks
- Route-level code splitting

#### Phase 3: Core Feature Revamp
- Dashboard with widgets and quick stats
- UpcomingEventsWidget showing next 7 days
- OpenTasksWidget for tracking outstanding items
- EarningsWidget with monthly summaries
- TravelWidget for upcoming gig travel
- QuickActions for rapid task access
- Enhanced RehearsalsList with filtering and grouping
- Kanban board with drag-and-drop task management
- TaskCard, TaskDetailModal for task editing
- NotesSection and AttachmentsList
- PracticeTimer with countdown, stopwatch, metronome
- Enhanced GigsList with stylized cards
- GigCard with gradient backgrounds
- GigDetail mission pack layout
- GigTimeline for visualizing event schedule
- TravelWidget with maps and directions
- CompensationTracker for payment management
- MileageCalculator for expense tracking
- Form validation with React Hook Form + Zod
- Zod schemas for all domain entities

#### Phase 4: Cross-Cutting Enhancements
- Command Palette (Cmd+K) with fuzzy search
- Global keyboard shortcuts
- NotificationsPanel with smart alerts
- NotificationBadge with unread count
- Settings page overhaul with tabs
- ProfileSection, PreferencesSection, DataManagementSection, AboutSection
- ThemeToggle component
- Analytics dashboard with insights
- RehearsalStatsChart for completion trends
- EarningsTrendChart for income visualization
- MileageLedger for expense tracking
- Analytics utilities for data processing

### Changed
- Migrated from flat Zustand store to modular slices
- Upgraded Dexie schema from v1 to v2
- Enhanced all route components with new features
- Improved TypeScript types across the board
- Updated Tailwind configuration with custom animations
- Enhanced PWA configuration with runtime caching

### Fixed
- TypeScript compilation errors in existing routes
- JSX syntax errors
- Python-like syntax in Settings component
- Gig compensation object structure
- Sample data for Dexie v2 schema compatibility

### Performance
- Implemented route-level code splitting
- Added lazy loading for all routes
- Optimized re-renders with Zustand selectors
- Enhanced PWA caching strategies

### Security
- Input validation with Zod schemas
- Error handling throughout application
- Secure offline data storage

## [0.0.1] - Initial Setup

### Added
- Initial project setup with Vite + React + TypeScript
- Tailwind CSS configuration
- Basic routing with React Router
- Zustand state management
- Dexie for IndexedDB
- Basic UI components
- PWA configuration with vite-plugin-pwa

---

## Version Numbering

We follow [Semantic Versioning](https://semver.org/):
- **MAJOR**: Incompatible API changes
- **MINOR**: Backwards-compatible functionality additions
- **PATCH**: Backwards-compatible bug fixes

## Categories

- **Added**: New features
- **Changed**: Changes to existing functionality
- **Deprecated**: Soon-to-be removed features
- **Removed**: Removed features
- **Fixed**: Bug fixes
- **Security**: Security improvements
