I have created the following plan after thorough exploration and analysis of the codebase. Follow the below plan verbatim. Trust the files and references. Do not re-verify what's written in the plan. Explore only when absolutely necessary. First implement all the proposed file changes and then I'll review all the changes together at the end.

### Observations

## Current State Analysis

The SoundCheck Pro project is in an **early foundation stage** with:

**✅ Established:**
- Complete tech stack installed (React 18, Zustand, Dexie, dnd-kit, React Hook Form, Zod, Tailwind, PWA)
- Basic data models (`Task`, `Rehearsal`, `Gig`, `Venue` in `src/types.ts`)
- Minimal Dexie database setup with `rehearsals` and `gigs` tables
- Basic Zustand store with `load()`, `addRehearsal()`, `addGig()` actions
- Route structure exists (Home, RehearsalsList/Detail, GigsList/Detail, Settings)
- Primitive UI components (Button, Input, DateTimeField)
- Utility functions (dates, maps, IDs, ICS export)
- Dark theme design tokens in Tailwind config
- PWA configuration with auto-update

**❌ Missing (per PLAN.md):**
- Shared app layout/shell with navigation
- Modular Zustand slices with selectors and optimistic patterns
- Dexie v2 schema with migrations (templates, attachments, mileage, earnings)
- Form validation implementation (React Hook Form + Zod integration)
- Design system component library (Modal, Card, Toast, Timeline, etc.)
- dnd-kit integration for Kanban boards
- Dashboard with widgets and analytics
- Advanced gig features (timeline, travel, compensation tracking)
- Command palette, notifications, settings overhaul
- Testing infrastructure (Vitest, Playwright)
- Documentation and dev tooling (Storybook/Ladle)

The PLAN.md outlines a **comprehensive 5-phase roadmap** requiring significant implementation across all layers.

### Approach

This plan follows the **5-phase roadmap from PLAN.md**, translating each phase into concrete file-level tasks. The approach is:

1. **Phase 0**: Discovery & setup (dev tooling, seed data, CI skeleton)
2. **Phase 1**: Foundation & design system (app shell, component library, Storybook)
3. **Phase 2**: State, data & offline hardening (Zustand refactor, Dexie v2 migrations, service worker)
4. **Phase 3**: Core feature revamp (Dashboard, Rehearsals with Kanban, Gigs with travel/pay)
5. **Phase 4**: Cross-cutting enhancements (command palette, notifications, settings, analytics)
6. **Phase 5**: Stabilization & launch prep (testing, performance, documentation)

Each phase builds on the previous, maintaining backward compatibility while progressively enhancing functionality.

### Reasoning

I explored the codebase by listing the directory structure, reading PLAN.md for the comprehensive vision, examining package.json for dependencies, and searching through source files to understand current data models, database schema, state management, routing, and UI components. This revealed a project with solid foundations but requiring extensive implementation to match the PLAN.md vision.

## Proposed File Changes

### /Users/ambrealismwork/Desktop/Desktop - Ambitious's Mac Studio/Coding-Projects/soundcheck-pro-cloud/DETAILED_CODING_PLAN.md(NEW)

References: 

- /Users/ambrealismwork/Desktop/Desktop - Ambitious's Mac Studio/Coding-Projects/soundcheck-pro-cloud/PLAN.md
- /Users/ambrealismwork/Desktop/Desktop - Ambitious's Mac Studio/Coding-Projects/soundcheck-pro-cloud/package.json
- /Users/ambrealismwork/Desktop/Desktop - Ambitious's Mac Studio/Coding-Projects/soundcheck-pro-cloud/src/types.ts
- /Users/ambrealismwork/Desktop/Desktop - Ambitious's Mac Studio/Coding-Projects/soundcheck-pro-cloud/src/db/db.ts
- /Users/ambrealismwork/Desktop/Desktop - Ambitious's Mac Studio/Coding-Projects/soundcheck-pro-cloud/src/store/useStore.ts
- /Users/ambrealismwork/Desktop/Desktop - Ambitious's Mac Studio/Coding-Projects/soundcheck-pro-cloud/vite.config.ts
- /Users/ambrealismwork/Desktop/Desktop - Ambitious's Mac Studio/Coding-Projects/soundcheck-pro-cloud/tailwind.config.js

# SoundCheck Pro — Detailed Coding Plan for Cloud Agent

This document provides a comprehensive, phase-by-phase implementation plan based on `PLAN.md`. Each section includes specific file operations, implementation guidance, and integration points.

---

## Phase 0: Discovery & Setup (1 sprint)

### Objectives
- Establish development infrastructure
- Create sample data for rapid iteration
- Set up CI/CD skeleton
- Document technical debt

### File Operations

#### 0.1 Development Tooling Setup

**NEW: `.github/workflows/ci.yml`**
- Set up GitHub Actions workflow for CI
- Configure jobs: lint (ESLint), typecheck (tsc), build (Vite)
- Add Lighthouse CI job for PWA score validation (target ≥90)
- Cache node_modules for faster builds

**NEW: `.husky/pre-commit`**
- Install Husky for git hooks
- Configure pre-commit hook to run lint-staged

**NEW: `.lintstagedrc.json`**
- Configure lint-staged to run ESLint and TypeScript checks on staged files
- Format: `{"*.{ts,tsx}": ["eslint --fix", "tsc --noEmit"]}`

**MODIFY: `package.json`**
- Add scripts: `"lint": "eslint src --ext ts,tsx"`, `"typecheck": "tsc --noEmit"`, `"test": "vitest"`, `"test:e2e": "playwright test"`
- Add devDependencies: `eslint`, `@typescript-eslint/parser`, `@typescript-eslint/eslint-plugin`, `husky`, `lint-staged`, `vitest`, `@testing-library/react`, `@testing-library/jest-dom`, `@playwright/test`

**NEW: `.eslintrc.json`**
- Configure ESLint with TypeScript support
- Enable React hooks rules, accessibility rules (eslint-plugin-jsx-a11y)
- Set up import order rules

**NEW: `vitest.config.ts`**
- Configure Vitest for unit/component testing
- Set up jsdom environment for React component tests
- Configure test file patterns: `**/*.test.{ts,tsx}`

**NEW: `playwright.config.ts`**
- Configure Playwright for E2E testing
- Set up projects for chromium, firefox, webkit
- Configure base URL to localhost:5173

#### 0.2 Sample Data & Seeding

**NEW: `src/db/seed.ts`**
- Create seed data generator function
- Generate 10-15 sample rehearsals with varied dates, tasks, and statuses
- Generate 8-10 sample gigs with venues, call times, pay amounts
- Include edge cases: past events, upcoming events, events without optional fields
- Export `seedDatabase()` function that clears and repopulates IndexedDB

**NEW: `src/dev/DevTools.tsx`**
- Create developer tools component (only rendered in dev mode)
- Add buttons: "Seed Database", "Clear Database", "Export Data", "Import Data"
- Position as floating panel in bottom-right corner
- Use `import.meta.env.DEV` to conditionally render

**MODIFY: `src/main.tsx`**
- Import and render `DevTools` component in development mode
- Wrap app in React.StrictMode if not already

#### 0.3 Documentation & Planning

**NEW: `docs/ARCHITECTURE.md`**
- Document current architecture: React → Zustand → Dexie → IndexedDB flow
- Diagram component hierarchy and data flow
- Explain offline-first strategy and PWA approach
- List key design decisions and trade-offs

**NEW: `docs/TECH_DEBT.md`**
- Log known technical debt items from PLAN.md gaps
- Prioritize items by impact and effort
- Track resolution status

**NEW: `.github/ISSUE_TEMPLATE/feature.md`**
- Create feature request template with sections: User Story, Acceptance Criteria, Design Mockups, Technical Notes

**NEW: `.github/ISSUE_TEMPLATE/bug.md`**
- Create bug report template with sections: Steps to Reproduce, Expected Behavior, Actual Behavior, Environment

**NEW: `.github/PULL_REQUEST_TEMPLATE.md`**
- Create PR template with checklist: Tests added, TypeScript types updated, Accessibility considered, Screenshots attached (for UI changes)

---

## Phase 1: Foundation & Design System (1-2 sprints)

### Objectives
- Build responsive app shell with navigation
- Establish design system with theme tokens
- Create comprehensive component library
- Set up Storybook for visual QA

### File Operations

#### 1.1 App Shell & Layout

**NEW: `src/layouts/AppLayout.tsx`**
- Create main layout component with slots: sidebar, header, content area, overlay portal
- Implement responsive behavior: sidebar collapses to drawer on mobile (<768px)
- Add `<Outlet />` from React Router for nested routes
- Manage sidebar open/closed state with Zustand UI slice
- Include skip-to-content link for accessibility

**NEW: `src/layouts/Sidebar.tsx`**
- Create sidebar navigation component
- Navigation items: Home (dashboard icon), Rehearsals (music icon), Gigs (calendar icon), Settings (gear icon)
- Use `NavLink` from React Router with active state styling
- Show icon + label on desktop, icon-only on collapsed state
- Add user profile section at bottom (placeholder for future)

**NEW: `src/layouts/Header.tsx`**
- Create adaptive header component
- Left: menu toggle button (mobile), breadcrumbs (desktop)
- Right: quick add button, notifications icon (placeholder), theme toggle
- Sticky positioning with backdrop blur effect

**NEW: `src/layouts/MobileNav.tsx`**
- Create bottom navigation bar for mobile (<768px)
- Same navigation items as Sidebar
- Fixed positioning at bottom with safe-area-inset padding
- Hide on desktop

**NEW: `src/components/ui/Portal.tsx`**
- Create portal component for rendering modals/toasts outside main DOM tree
- Use ReactDOM.createPortal to render into `#portal-root`

**MODIFY: `index.html`**
- Add `<div id="portal-root"></div>` after `<div id="root"></div>`

**MODIFY: `src/AppRouter.tsx`**
- Wrap all routes with `AppLayout` component
- Update route structure to use nested routes with `<Outlet />`

#### 1.2 Design System Tokens

**NEW: `src/styles/tokens.css`**
- Define CSS custom properties for design tokens
- Colors: extend Tailwind config with semantic tokens (--color-primary, --color-success, --color-warning, --color-error)
- Spacing scale: --space-xs through --space-3xl
- Typography: --font-heading (Space Grotesk), --font-body (Satoshi or Inter)
- Border radius: --radius-sm, --radius-md, --radius-lg, --radius-full
- Shadows: --shadow-sm, --shadow-md, --shadow-lg, --shadow-glow
- Motion: --duration-fast (150ms), --duration-normal (250ms), --duration-slow (350ms)
- Z-index scale: --z-dropdown, --z-sticky, --z-modal, --z-toast

**MODIFY: `src/styles/globals.css`**
- Import tokens.css
- Add base styles: body font, smooth scrolling, focus-visible styles
- Define utility classes: .card, .input, .btn (base styles)
- Add glassmorphism utilities: .glass (backdrop-blur with semi-transparent background)

**MODIFY: `tailwind.config.js`**
- Extend theme with custom fonts (add @font-face in globals.css or use Google Fonts)
- Add animation utilities: fadeIn, slideIn, scaleIn
- Configure safelist for dynamic classes if needed

#### 1.3 Component Library v1

**MODIFY: `src/components/ui/Button.tsx`**
- Enhance existing Button component
- Add variants: primary, secondary, ghost, danger, success
- Add sizes: sm, md, lg
- Add loading state with spinner icon
- Add disabled state styling
- Use clsx for conditional classes
- Add proper TypeScript types for all props

**MODIFY: `src/components/ui/Input.tsx`**
- Enhance existing Input component
- Add label, error message, helper text props
- Add variants: default, error
- Add left/right icon slots
- Improve focus states with ring effect
- Add proper aria-labels and aria-describedby for accessibility

**NEW: `src/components/ui/Modal.tsx`**
- Create modal component using Portal
- Props: open, onClose, title, children, footer
- Implement focus trap (focus stays within modal when open)
- Close on Escape key, close on backdrop click (optional)
- Animate entrance/exit with CSS transitions
- Add aria-modal, role="dialog", aria-labelledby

**NEW: `src/components/ui/Sheet.tsx`**
- Create slide-out sheet component (mobile-friendly alternative to modal)
- Slides from bottom on mobile, from right on desktop
- Similar API to Modal but with slide animation

**NEW: `src/components/ui/Card.tsx`**
- Create card component with variants: default, elevated, outlined
- Props: title, subtitle, children, footer, onClick (for clickable cards)
- Apply glassmorphism effect for elevated variant
- Add hover state with subtle scale/shadow transition

**NEW: `src/components/ui/Badge.tsx`**
- Create badge component for status indicators
- Variants: default, success, warning, error, info
- Sizes: sm, md, lg
- Optional dot indicator

**NEW: `src/components/ui/Chip.tsx`**
- Create chip component for tags/filters
- Props: label, onRemove (shows X icon), selected state
- Use for task tags, instrument filters, etc.

**NEW: `src/components/ui/Toast.tsx`**
- Create toast notification component
- Variants: success, error, warning, info
- Auto-dismiss after configurable duration (default 5s)
- Render in Portal at top-right corner
- Stack multiple toasts vertically

**NEW: `src/components/ui/ToastProvider.tsx`**
- Create toast context provider
- Export `useToast()` hook with `toast.success()`, `toast.error()`, etc.
- Manage toast queue and auto-dismiss timers

**NEW: `src/components/ui/Spinner.tsx`**
- Create loading spinner component
- Sizes: sm, md, lg
- Use CSS animation for smooth rotation

**NEW: `src/components/ui/Skeleton.tsx`**
- Create skeleton loader component for loading states
- Variants: text, circle, rectangle
- Animate with shimmer effect

**NEW: `src/components/ui/SegmentedControl.tsx`**
- Create segmented control component (iOS-style tab switcher)
- Props: options array, value, onChange
- Animated sliding background indicator
- Use for view toggles (list/grid, day/week/month)

**NEW: `src/components/ui/TimelineItem.tsx`**
- Create timeline item component for gig schedules
- Props: time, title, description, status (upcoming/current/past)
- Visual indicator dot with connecting line
- Highlight current item

**NEW: `src/components/ui/StatBadge.tsx`**
- Create stat display component for dashboard widgets
- Props: label, value, trend (up/down/neutral), icon
- Show trend arrow and percentage change

**NEW: `src/components/ui/Select.tsx`**
- Create custom select dropdown component
- Props: options, value, onChange, placeholder
- Keyboard navigation support (arrow keys, Enter, Escape)
- Search/filter functionality for long lists

**NEW: `src/components/ui/Textarea.tsx`**
- Create textarea component with auto-resize option
- Similar API to Input (label, error, helper text)
- Character count display (optional)

**NEW: `src/components/ui/Checkbox.tsx`**
- Create checkbox component with label
- Indeterminate state support
- Custom checkmark icon

**NEW: `src/components/ui/Radio.tsx`**
- Create radio button component
- Group management with RadioGroup wrapper

**NEW: `src/components/ui/Switch.tsx`**
- Create toggle switch component
- Animated sliding indicator
- Use for settings (notifications on/off, theme toggle)

#### 1.4 Storybook Setup

**NEW: `.storybook/main.ts`**
- Configure Storybook for Vite
- Set up stories glob pattern: `../src/**/*.stories.tsx`
- Add essential addons: @storybook/addon-essentials, @storybook/addon-a11y

**NEW: `.storybook/preview.ts`**
- Import global styles (globals.css, tokens.css)
- Configure dark theme as default
- Set up viewport sizes for responsive testing

**NEW: `src/components/ui/Button.stories.tsx`**
- Create stories for all Button variants and states
- Include interactive controls for props
- Add accessibility tests

**NEW: `src/components/ui/Input.stories.tsx`**
- Create stories for Input component
- Show error state, disabled state, with icons

**NEW: `src/components/ui/Modal.stories.tsx`**
- Create stories for Modal component
- Show different sizes and content types

**NEW: `src/components/ui/Card.stories.tsx`**
- Create stories for Card variants
- Show interactive and static cards

**MODIFY: `package.json`**
- Add scripts: `"storybook": "storybook dev -p 6006"`, `"build-storybook": "storybook build"`
- Add devDependencies: `@storybook/react-vite`, `@storybook/addon-essentials`, `@storybook/addon-a11y`, `storybook`

---

## Phase 2: State, Data & Offline Hardening (1 sprint)

### Objectives
- Refactor Zustand store into modular domain slices
- Migrate Dexie to v2 schema with new tables
- Implement persistence utilities (import/export)
- Enhance service worker for offline reliability

### File Operations

#### 2.1 Zustand Store Refactoring

**NEW: `src/store/slices/rehearsalsSlice.ts`**
- Create rehearsals domain slice
- State: `rehearsals: Rehearsal[]`, `loading: boolean`, `error: string | null`
- Actions: `loadRehearsals()`, `addRehearsal()`, `updateRehearsal()`, `deleteRehearsal()`, `duplicateRehearsal()`
- Implement optimistic updates: update state immediately, rollback on error
- Add selectors: `selectRehearsalById(id)`, `selectUpcomingRehearsals()`, `selectRehearsalsByDateRange(start, end)`

**NEW: `src/store/slices/gigsSlice.ts`**
- Create gigs domain slice
- State: `gigs: Gig[]`, `loading: boolean`, `error: string | null`
- Actions: `loadGigs()`, `addGig()`, `updateGig()`, `deleteGig()`
- Add selectors: `selectGigById(id)`, `selectUpcomingGigs()`, `selectGigsByMonth(year, month)`

**NEW: `src/store/slices/uiSlice.ts`**
- Create UI state slice
- State: `sidebarOpen: boolean`, `commandPaletteOpen: boolean`, `theme: 'auto' | 'light' | 'dark'`, `activeModal: string | null`
- Actions: `toggleSidebar()`, `openCommandPalette()`, `closeCommandPalette()`, `setTheme()`, `openModal()`, `closeModal()`
- Persist theme preference to localStorage

**NEW: `src/store/slices/settingsSlice.ts`**
- Create settings slice
- State: `homeAddress: string`, `preferredTravelMethod: string`, `mileageRate: number`, `currency: string`, `timeFormat: '12h' | '24h'`, `notificationsEnabled: boolean`
- Actions: `updateSettings()`, `resetSettings()`
- Persist to localStorage

**MODIFY: `src/store/useStore.ts`**
- Refactor to combine all slices using Zustand's slice pattern
- Import and merge rehearsalsSlice, gigsSlice, uiSlice, settingsSlice
- Maintain single store instance
- Add middleware: persist (for settings/UI), devtools (for debugging)

**NEW: `src/store/hooks.ts`**
- Create custom hooks for common selector patterns
- `useRehearsals()`, `useGigs()`, `useUpcomingEvents()`, `useSettings()`, `useUI()`
- Optimize re-renders with shallow equality checks

#### 2.2 Dexie v2 Schema Migration

**MODIFY: `src/types.ts`**
- Extend `Rehearsal` interface: add `tasks: Task[]`, `templateId?: string`, `attachments?: Attachment[]`, `notes?: Note[]`
- Extend `Gig` interface: add `venue: Venue`, `compensation: Compensation`, `status: 'pending' | 'confirmed' | 'completed' | 'cancelled'`, `mileage?: number`, `attachments?: Attachment[]`
- Add new interfaces:
  - `RehearsalTemplate`: id, name, description, defaultTasks, createdAt
  - `Attachment`: id, name, url (blob URL or data URI), type, size, uploadedAt
  - `Note`: id, content, createdAt, updatedAt
  - `Compensation`: amount, currency, status ('pending' | 'paid'), paidAt?, method?
  - `MileageLog`: id, gigId, date, origin, destination, distance, rate, amount

**MODIFY: `src/db/db.ts`**
- Update SoundCheckDB class to version 2
- Add new tables: `rehearsalTemplates`, `attachments`, `mileageLogs`
- Update schema:
  - `rehearsals`: add indexes for `date`, `updatedAt`
  - `gigs`: add indexes for `date`, `status`
  - `rehearsalTemplates`: index by `name`
  - `mileageLogs`: index by `gigId`, `date`
- Implement migration from v1 to v2:
  - Use `this.version(2).stores({...})` and `.upgrade()` callback
  - Migrate existing rehearsals: add empty `tasks` array, set `updatedAt` to current timestamp
  - Migrate existing gigs: wrap venue fields into `venue` object, set `status` to 'confirmed'

**NEW: `src/db/migrations.ts`**
- Create migration utilities
- `migrateToV2()`: handle v1 → v2 data transformation
- `rollbackToV1()`: provide rollback capability (export v2 data, clear DB, reimport as v1)
- Export migration history log

**NEW: `src/db/backup.ts`**
- Create backup/restore utilities
- `exportDatabase()`: export all tables to JSON
- `importDatabase(json)`: import JSON data into IndexedDB
- `createBackup()`: save backup to localStorage with timestamp
- `restoreBackup(timestamp)`: restore from localStorage backup

#### 2.3 Offline & Sync Infrastructure

**NEW: `src/service-worker/sync-queue.ts`**
- Create sync queue for offline mutations
- Store pending operations (add/update/delete) in IndexedDB queue table
- Retry failed operations when online
- Implement exponential backoff for retries

**NEW: `src/hooks/useOnlineStatus.ts`**
- Create hook to track online/offline status
- Listen to `online` and `offline` events
- Return `isOnline` boolean

**NEW: `src/hooks/useSyncStatus.ts`**
- Create hook to track sync status
- Return `isSyncing`, `pendingCount`, `lastSyncedAt`
- Trigger sync when coming back online

**NEW: `src/components/SyncIndicator.tsx`**
- Create sync status indicator component
- Show in header: "Synced", "Syncing...", "Offline (X pending)"
- Click to view sync details or force sync

**MODIFY: `vite.config.ts`**
- Enhance VitePWA configuration
- Add runtime caching strategies:
  - NetworkFirst for API calls (future)
  - CacheFirst for static assets
  - StaleWhileRevalidate for images
- Configure offline fallback page
- Enable background sync API

**NEW: `src/components/OfflineBanner.tsx`**
- Create banner component shown when offline
- Display at top of app: "You're offline. Changes will sync when you reconnect."
- Dismissible but reappears on page reload if still offline

**NEW: `src/components/UpdateNotification.tsx`**
- Create notification for PWA updates
- Show when new version is available: "Update available. Refresh to get the latest version."
- Provide "Update Now" button that calls `registration.update()` and reloads

#### 2.4 Error Boundaries & Suspense

**NEW: `src/components/ErrorBoundary.tsx`**
- Create error boundary component
- Catch React errors and display fallback UI
- Log errors to console (future: send to error tracking service)
- Provide "Reset" button to recover

**NEW: `src/components/SuspenseFallback.tsx`**
- Create suspense fallback component
- Show skeleton loaders for route-level code splitting
- Match layout of expected content

**MODIFY: `src/main.tsx`**
- Wrap app in ErrorBoundary
- Add Suspense boundary for lazy-loaded routes

**MODIFY: `src/AppRouter.tsx`**
- Lazy load route components with `React.lazy()`
- Wrap routes in Suspense with SuspenseFallback

---

## Phase 3: Core Feature Revamp (2-3 sprints)

### Objectives
- Build comprehensive Dashboard/Command Center
- Revamp Rehearsals module with Kanban, templates, timers
- Revamp Gigs module with timeline, travel, compensation tracking
- Implement guided creation wizards with validation

### File Operations

#### 3.1 Dashboard / Command Center

**MODIFY: `src/app/routes/Home.tsx`**
- Transform into full-featured dashboard
- Layout: hero summary section + widget grid (2-3 columns on desktop, 1 on mobile)
- Hero section: greeting ("Good morning, [User]"), current date/time, quick stats (X rehearsals this week, Y upcoming gigs)

**NEW: `src/components/dashboard/UpcomingEventsWidget.tsx`**
- Create widget showing next 7 days of events
- List rehearsals and gigs chronologically
- Show event type icon, name, date/time, countdown ("in 2 days")
- Click to navigate to detail page
- Empty state: "No upcoming events. Create one!"

**NEW: `src/components/dashboard/OpenTasksWidget.tsx`**
- Create widget showing open tasks across all rehearsals
- Group by rehearsal or show flat list
- Show task title, associated rehearsal, due date (if applicable)
- Click to navigate to rehearsal detail
- Empty state: "All caught up!"

**NEW: `src/components/dashboard/EarningsWidget.tsx`**
- Create widget showing earnings summary
- Display total earnings this month, pending payments, paid amounts
- Show breakdown by gig (optional: chart/sparkline)
- Click to navigate to gigs list filtered by payment status

**NEW: `src/components/dashboard/TravelWidget.tsx`**
- Create widget showing upcoming travel
- List gigs with travel requirements (address set)
- Show destination, distance from home (if home address set in settings), travel time estimate
- Link to directions

**NEW: `src/components/dashboard/QuickActions.tsx`**
- Create quick action buttons
- Actions: "New Rehearsal", "New Gig", "View Calendar" (future), "Export Data"
- Large, prominent buttons with icons
- Open respective creation modals/sheets

**MODIFY: `src/components/onboarding/CoachMarks.tsx`**
- Enhance existing CoachMarks component
- Add tour steps for dashboard widgets
- Highlight quick actions, explain widget purposes
- Store tour completion in localStorage
- Provide "Skip Tour" and "Next" buttons

#### 3.2 Rehearsals Module

**MODIFY: `src/app/routes/RehearsalsList.tsx`**
- Enhance list view with filtering and grouping
- Filters: date range, status (upcoming/past), search by name
- Grouping options: by date (today/this week/this month/past), by status
- Display as cards with: event name, date, task count (X/Y completed), quick actions (edit, delete, duplicate)
- Add FAB (floating action button) for "New Rehearsal"
- Empty state: "No rehearsals yet. Create your first one!"

**NEW: `src/components/rehearsals/RehearsalCard.tsx`**
- Create rehearsal card component for list view
- Show event name, date, task completion progress bar
- Show template badge if created from template
- Hover actions: edit, delete, duplicate icons
- Click card to navigate to detail

**NEW: `src/components/rehearsals/RehearsalFilters.tsx`**
- Create filter controls component
- Date range picker, search input, grouping selector
- Apply filters to list view

**NEW: `src/components/rehearsals/CreateRehearsalWizard.tsx`**
- Create multi-step wizard for rehearsal creation
- Step 1: Basic info (event name, date/time) - use React Hook Form + Zod validation
- Step 2: Choose template or start blank
- Step 3: Add/edit tasks (drag to reorder)
- Step 4: Add instruments/roster (optional)
- Step 5: Attach files (optional)
- Validation: event name required, date required and must be valid ISO8601
- Submit: save to Dexie via Zustand action, show success toast, navigate to detail

**NEW: `src/components/rehearsals/TemplateSelector.tsx`**
- Create template selection component
- Display available templates as cards with preview
- Show template name, description, task count
- "Use Template" button populates wizard with template tasks
- "Start Blank" option

**MODIFY: `src/app/routes/RehearsalDetail.tsx`**
- Transform into full workspace
- Layout: header (event name, date, actions) + Kanban board + sidebar (notes, attachments, timer)
- Header actions: edit, duplicate, delete, export setlist

**NEW: `src/components/rehearsals/KanbanBoard.tsx`**
- Create Kanban board using @dnd-kit/sortable
- Lanes: "To Do", "In Progress", "Done" (or custom lanes)
- Drag tasks between lanes to update status
- Drag within lane to reorder (update `order` field)
- Add task button in each lane
- Persist lane and order changes to Dexie

**NEW: `src/components/rehearsals/TaskCard.tsx`**
- Create task card component for Kanban
- Show task title, note (truncated), owner (if assigned)
- Show tempo, key, duration (if applicable)
- Click to open task detail modal for editing
- Drag handle for reordering

**NEW: `src/components/rehearsals/TaskDetailModal.tsx`**
- Create modal for editing task details
- Fields: title, note, owner, tempo, key, duration, attachments
- Save button updates task in Dexie
- Delete button removes task

**NEW: `src/components/rehearsals/PracticeTimer.tsx`**
- Create timer widget for rehearsal workspace
- Modes: countdown timer, stopwatch, metronome
- Countdown: set duration, start/pause/reset, show remaining time
- Stopwatch: start/pause/reset, show elapsed time
- Metronome: set BPM, start/stop, play click sound (use Web Audio API)
- Persist timer state to localStorage (resume on page reload)

**NEW: `src/components/rehearsals/NotesTimeline.tsx`**
- Create notes timeline component
- Display notes chronologically with timestamps
- Add note button opens input field
- Edit/delete existing notes
- Store notes in Dexie as part of rehearsal

**NEW: `src/components/rehearsals/AttachmentsList.tsx`**
- Create attachments list component
- Display attached files with name, size, type icon
- Upload button opens file picker (store as blob URL or data URI in IndexedDB)
- Download/view button for each attachment
- Delete button removes attachment

**NEW: `src/components/rehearsals/ExportSetlistModal.tsx`**
- Create modal for exporting setlist
- Options: PDF (future: use jsPDF), plain text, print
- Include: event name, date, task list with notes
- Download or print

#### 3.3 Gigs Module

**MODIFY: `src/app/routes/GigsList.tsx`**
- Enhance list view with stylized cards
- Display as grid on desktop, list on mobile
- Card design: gradient background (random or based on status), event name, date, venue, pay badge, travel badge
- Filters: date range, status (pending/confirmed/completed/cancelled), search
- Sort options: date (asc/desc), pay amount
- Add FAB for "New Gig"

**NEW: `src/components/gigs/GigCard.tsx`**
- Create gig card component with gradient art
- Show event name, date, venue name, compensation amount
- Status badge (pending/confirmed/completed/cancelled)
- Travel indicator if address is set
- Hover actions: edit, delete
- Click to navigate to detail

**NEW: `src/components/gigs/GigFilters.tsx`**
- Create filter controls for gigs list
- Date range picker, status filter, search input, sort selector

**NEW: `src/components/gigs/CreateGigWizard.tsx`**
- Create multi-step wizard for gig creation
- Step 1: Basic info (event name, date, call time) - React Hook Form + Zod
- Step 2: Venue details (name, address, contact)
- Step 3: Compensation (amount, currency, status)
- Step 4: Travel (calculate mileage from home address if set)
- Step 5: Attachments (contracts, tech riders)
- Validation: event name required, date required, venue name required
- Submit: save to Dexie, calculate mileage if addresses provided, show success toast

**MODIFY: `src/app/routes/GigDetail.tsx`**
- Transform into mission pack layout
- Hero section: event name, date, countdown, status badge
- Timeline section: load-in → soundcheck → downbeat → end (visual timeline)
- Travel section: map embed (static image or iframe), directions link, rideshare links (Uber/Lyft deep links)
- Contacts section: venue contact, bandleader, other musicians
- Compensation section: amount, status, payment method, mark as paid button
- Attachments section: contracts, tech riders, notes
- Actions: edit, delete, export (ICS, PDF tech sheet)

**NEW: `src/components/gigs/GigTimeline.tsx`**
- Create visual timeline component
- Display milestones: load-in, soundcheck, downbeat, end
- Show times for each milestone (derived from call time and event date)
- Highlight current/next milestone based on current time
- Visual: horizontal timeline with dots and connecting lines

**NEW: `src/components/gigs/TravelWidget.tsx`**
- Create travel widget for gig detail
- Show venue address, distance from home (if home address set in settings)
- Embed static map image (use Google Maps Static API or similar)
- Links: "Get Directions" (Google Maps), "Uber", "Lyft" (deep links with destination pre-filled)
- Calculate and display mileage for expense tracking

**NEW: `src/components/gigs/ContactsList.tsx`**
- Create contacts list component
- Display venue contact, bandleader, other musicians
- Show name, role, phone, email
- Tap-to-call (tel: link), tap-to-email (mailto: link)
- Add/edit/delete contacts

**NEW: `src/components/gigs/CompensationTracker.tsx`**
- Create compensation tracking component
- Display amount, currency, status (pending/paid)
- "Mark as Paid" button updates status and sets paidAt timestamp
- Show payment method (cash, check, Venmo, etc.)
- Link to earnings widget on dashboard

**NEW: `src/components/gigs/MileageCalculator.tsx`**
- Create mileage calculator component
- Auto-calculate distance from home address to venue address (use Google Maps Distance Matrix API or similar)
- Display distance, mileage rate (from settings), total reimbursement amount
- Save mileage log to Dexie
- Manual override option if auto-calculation unavailable

**NEW: `src/components/gigs/ExportGigModal.tsx`**
- Create modal for exporting gig details
- Options: ICS calendar event (existing), PDF tech sheet (future: use jsPDF), shareable summary (copy to clipboard)
- ICS: include event name, date, call time, venue address, notes
- PDF: include all gig details formatted as tech sheet
- Shareable summary: plain text with key details

#### 3.4 Form Validation & Schemas

**NEW: `src/schemas/rehearsalSchema.ts`**
- Create Zod schema for rehearsal validation
- Fields: eventName (string, min 1, max 100), date (string, ISO8601 format), tasks (array of task objects)
- Export schema and infer TypeScript type

**NEW: `src/schemas/gigSchema.ts`**
- Create Zod schema for gig validation
- Fields: eventName (string, required), date (string, ISO8601, required), callTime (string, ISO8601, optional), venue (object with name required), compensation (object with amount number, currency string)
- Export schema and infer TypeScript type

**NEW: `src/schemas/taskSchema.ts`**
- Create Zod schema for task validation
- Fields: title (string, required), note (string, optional), order (number, required)

**NEW: `src/hooks/useFormValidation.ts`**
- Create custom hook for React Hook Form + Zod integration
- Wrap `useForm` with Zod resolver
- Return form methods and validation state

---

## Phase 4: Cross-Cutting Enhancements (1-2 sprints)

### Objectives
- Implement command palette for quick actions
- Add notifications panel for due tasks/call times
- Overhaul settings page
- Add analytics/insights dashboard
- Accessibility and internationalization pass

### File Operations

#### 4.1 Command Palette

**NEW: `src/components/CommandPalette.tsx`**
- Create command palette component (Cmd+K / Ctrl+K to open)
- Search input with fuzzy matching
- Commands: navigate to routes, create rehearsal/gig, open settings, export data, toggle theme
- Display recent items (rehearsals, gigs)
- Keyboard navigation: arrow keys to select, Enter to execute, Escape to close
- Use Portal to render above all content
- Integrate with uiSlice for open/close state

**NEW: `src/hooks/useCommandPalette.ts`**
- Create hook for command palette logic
- Register commands with labels, actions, keywords
- Implement fuzzy search (use fuse.js or simple string matching)
- Track recent items from Zustand store

**NEW: `src/hooks/useKeyboardShortcuts.ts`**
- Create hook for global keyboard shortcuts
- Register shortcuts: Cmd+K (command palette), Cmd+N (new rehearsal), Cmd+Shift+N (new gig), Cmd+, (settings)
- Listen to keydown events, prevent defaults, execute actions
- Display shortcuts in command palette and tooltips

#### 4.2 Notifications Panel

**NEW: `src/components/NotificationsPanel.tsx`**
- Create notifications panel component
- Slide-out panel from right side (Sheet component)
- Display notifications: upcoming call times (within 24h), overdue tasks, payment reminders
- Mark as read/dismiss functionality
- Empty state: "No notifications"

**NEW: `src/hooks/useNotifications.ts`**
- Create hook for generating notifications
- Check upcoming gigs (call time within 24h), open tasks (past due date), pending payments (gig completed but not paid)
- Return array of notification objects with type, message, timestamp, action
- Store dismissed notifications in localStorage

**NEW: `src/components/NotificationBadge.tsx`**
- Create badge component for notification count
- Display in header next to notifications icon
- Show count of unread notifications
- Pulse animation when new notification arrives

**MODIFY: `src/layouts/Header.tsx`**
- Add notifications icon button
- Show NotificationBadge with count
- Click to open NotificationsPanel

#### 4.3 Settings Overhaul

**MODIFY: `src/app/routes/Settings.tsx`**
- Transform into comprehensive settings page
- Sections: Profile, Preferences, Data Management, About
- Use tabs or accordion for organization

**NEW: `src/components/settings/ProfileSection.tsx`**
- Create profile settings section
- Fields: name, email, home address (for mileage calculation)
- Save to settingsSlice

**NEW: `src/components/settings/PreferencesSection.tsx`**
- Create preferences settings section
- Fields: theme (auto/light/dark), time format (12h/24h), currency, mileage rate, preferred travel method
- Notifications toggle (enable/disable)
- Save to settingsSlice

**NEW: `src/components/settings/DataManagementSection.tsx`**
- Create data management section
- Actions: export all data (JSON), import data (JSON), create backup, restore backup, reset app (clear all data)
- Show last backup timestamp
- Confirm dialogs for destructive actions

**NEW: `src/components/settings/AboutSection.tsx`**
- Create about section
- Display app version, build date, credits
- Links: GitHub repo, report bug, request feature
- "Replay Onboarding" button to restart CoachMarks tour

**NEW: `src/components/settings/ThemeToggle.tsx`**
- Create theme toggle component
- Options: Auto (system), Light, Dark
- Apply theme by setting data-theme attribute on <html>
- Save preference to settingsSlice

#### 4.4 Analytics & Insights

**NEW: `src/app/routes/Analytics.tsx`**
- Create analytics/insights page
- Sections: Rehearsal Stats, Earnings Trends, Mileage Ledger
- Use charts for visualization (consider recharts or chart.js)

**NEW: `src/components/analytics/RehearsalStatsChart.tsx`**
- Create chart showing rehearsal completion percentage over time
- X-axis: weeks/months, Y-axis: completion %
- Show trend line

**NEW: `src/components/analytics/EarningsTrendChart.tsx`**
- Create chart showing earnings over time
- X-axis: months, Y-axis: total earnings
- Show breakdown by gig type or status

**NEW: `src/components/analytics/MileageLedger.tsx`**
- Create table showing all mileage logs
- Columns: date, gig, origin, destination, distance, rate, amount
- Total mileage and reimbursement at bottom
- Export to CSV button

**NEW: `src/utils/analytics.ts`**
- Create analytics utility functions
- `calculateRehearsalCompletionRate(rehearsals)`: return percentage of completed tasks
- `calculateEarningsByMonth(gigs)`: return object with month keys and total earnings
- `calculateTotalMileage(mileageLogs)`: return total distance and reimbursement

**MODIFY: `src/layouts/Sidebar.tsx`**
- Add "Analytics" navigation item (optional, or include in dashboard)

#### 4.5 Accessibility Pass

**MODIFY: All UI components**
- Ensure all interactive elements have proper aria-labels
- Add aria-describedby for form fields with errors/helper text
- Ensure focus indicators are visible (use :focus-visible)
- Test keyboard navigation (Tab, Shift+Tab, Enter, Escape, Arrow keys)
- Add skip-to-content link in AppLayout
- Ensure color contrast meets WCAG AA standards (use contrast checker)

**NEW: `src/hooks/useFocusTrap.ts`**
- Create hook for focus trapping in modals
- Trap focus within modal when open
- Return focus to trigger element when closed

**NEW: `src/hooks/useAnnouncer.ts`**
- Create hook for screen reader announcements
- Use aria-live region to announce dynamic content changes
- Announce toast messages, loading states, errors

**NEW: `src/components/SkipToContent.tsx`**
- Create skip-to-content link component
- Visually hidden until focused
- Jump to main content area on click

**MODIFY: `src/layouts/AppLayout.tsx`**
- Add SkipToContent component at top
- Add `id="main-content"` to main content area

#### 4.6 Internationalization Scaffolding

**NEW: `src/i18n/en.json`**
- Create English translation file
- Keys for all UI strings: buttons, labels, messages, errors

**NEW: `src/i18n/index.ts`**
- Create i18n setup (use react-i18next or similar)
- Load translation files
- Export `useTranslation` hook

**MODIFY: All components**
- Replace hardcoded strings with translation keys
- Use `t('key')` from useTranslation hook
- (This is a large refactor, prioritize based on internationalization needs)

---

## Phase 5: Stabilization & Launch Prep (1 sprint)

### Objectives
- Comprehensive QA across browsers and devices
- Performance optimization
- Complete documentation
- Achieve Lighthouse PWA score ≥90

### File Operations

#### 5.1 Testing Implementation

**NEW: `src/components/ui/Button.test.tsx`**
- Create unit tests for Button component
- Test all variants, sizes, states (loading, disabled)
- Test click handlers
- Use Vitest + React Testing Library

**NEW: `src/components/ui/Input.test.tsx`**
- Create unit tests for Input component
- Test value changes, error states, accessibility

**NEW: `src/store/slices/rehearsalsSlice.test.ts`**
- Create unit tests for rehearsals slice
- Test actions: add, update, delete, load
- Test selectors
- Mock Dexie calls

**NEW: `src/store/slices/gigsSlice.test.ts`**
- Create unit tests for gigs slice
- Test actions and selectors

**NEW: `src/utils/dates.test.ts`**
- Create unit tests for date utilities
- Test fmtDate with various inputs

**NEW: `tests/e2e/rehearsal-flow.spec.ts`**
- Create E2E test for rehearsal creation flow
- Steps: navigate to rehearsals, click new, fill form, submit, verify detail page
- Use Playwright

**NEW: `tests/e2e/gig-flow.spec.ts`**
- Create E2E test for gig creation flow
- Steps: navigate to gigs, click new, fill form, submit, verify detail page

**NEW: `tests/e2e/offline.spec.ts`**
- Create E2E test for offline functionality
- Steps: load app, go offline (network throttling), create rehearsal, verify saved, go online, verify synced

**MODIFY: `package.json`**
- Add test coverage scripts: `"test:coverage": "vitest --coverage"`
- Add E2E test script: `"test:e2e": "playwright test"`

#### 5.2 Performance Optimization

**MODIFY: `src/AppRouter.tsx`**
- Implement route-level code splitting with React.lazy()
- Lazy load all route components
- Wrap in Suspense with loading fallback

**NEW: `src/utils/lazyWithPreload.ts`**
- Create utility for lazy loading with preload capability
- Preload routes on hover/focus for faster navigation

**MODIFY: `vite.config.ts`**
- Configure build optimizations:
  - Enable minification
  - Configure chunk splitting (vendor, common, routes)
  - Add preload hints for critical resources
  - Enable compression (gzip/brotli)

**NEW: `src/hooks/useVirtualization.ts`**
- Create hook for virtualizing long lists (rehearsals, gigs)
- Use react-virtual or similar library
- Render only visible items for performance

**MODIFY: `src/components/rehearsals/RehearsalsList.tsx`**
- Implement virtualization for long lists
- Use useVirtualization hook

**MODIFY: `src/components/gigs/GigsList.tsx`**
- Implement virtualization for long lists

**NEW: `src/hooks/useDebounce.ts`**
- Create debounce hook for search inputs
- Delay search execution until user stops typing

**MODIFY: `src/components/rehearsals/RehearsalFilters.tsx`**
- Apply debounce to search input

**MODIFY: `src/components/gigs/GigFilters.tsx`**
- Apply debounce to search input

#### 5.3 Documentation

**MODIFY: `README.md`**
- Expand with comprehensive project overview
- Add sections: Features, Tech Stack, Getting Started, Development, Testing, Deployment, Contributing
- Include screenshots/GIFs of key features
- Add badges: build status, coverage, license

**NEW: `docs/CONTRIBUTING.md`**
- Create contribution guide
- Sections: Code of Conduct, How to Contribute, Development Setup, Coding Standards, PR Process

**NEW: `docs/DEPLOYMENT.md`**
- Create deployment guide
- Instructions for deploying to Vercel, Netlify, or other platforms
- Environment variables, build commands, PWA considerations

**NEW: `docs/COMPONENTS.md`**
- Create component documentation
- List all UI components with props, usage examples, screenshots
- Link to Storybook for interactive examples

**NEW: `docs/STATE_MANAGEMENT.md`**
- Document Zustand store architecture
- Explain slices, actions, selectors
- Provide examples of common patterns

**NEW: `docs/DATABASE.md`**
- Document Dexie schema and migrations
- Explain tables, indexes, relationships
- Provide examples of queries

**NEW: `CHANGELOG.md`**
- Create changelog following Keep a Changelog format
- Document all changes by version
- Sections: Added, Changed, Deprecated, Removed, Fixed, Security

#### 5.4 Lighthouse & PWA Optimization

**MODIFY: `index.html`**
- Add meta tags: description, keywords, author, theme-color
- Add Open Graph tags for social sharing
- Add apple-touch-icon links
- Ensure viewport meta tag is set

**MODIFY: `public/manifest.json`**
- Ensure all required fields are set: name, short_name, start_url, display, icons
- Add description, categories, screenshots (for app stores)

**NEW: `public/robots.txt`**
- Create robots.txt for SEO (if applicable)

**NEW: `public/sitemap.xml`**
- Create sitemap for SEO (if applicable)

**MODIFY: `vite.config.ts`**
- Ensure PWA manifest is correctly generated
- Verify service worker registration
- Add offline fallback page

**NEW: `.github/workflows/lighthouse.yml`**
- Create GitHub Action for Lighthouse CI
- Run on every PR
- Fail if scores drop below thresholds (Performance ≥90, Accessibility ≥90, Best Practices ≥90, SEO ≥90, PWA ≥90)

#### 5.5 Final QA & Polish

**NEW: `docs/QA_MATRIX.md`**
- Create QA testing matrix
- Browsers: Chrome, Firefox, Safari, Edge
- Devices: Desktop (Windows, Mac), Mobile (iOS, Android), Tablet
- Scenarios: Create/edit/delete rehearsal, create/edit/delete gig, offline mode, sync, export, settings
- Track test results and issues

**NEW: `docs/KNOWN_ISSUES.md`**
- Document known issues and limitations
- Prioritize by severity
- Link to GitHub issues

**MODIFY: All components**
- Polish animations and transitions
- Ensure consistent spacing and alignment
- Fix any visual bugs
- Add loading states where missing
- Improve error messages

**NEW: `src/utils/sentry.ts`** (optional)
- Set up error tracking with Sentry or similar
- Capture and report errors in production
- Configure source maps for debugging

---

## Additional Recommendations

### Code Organization
- Follow consistent file naming: PascalCase for components, camelCase for utilities/hooks
- Co-locate related files: component, styles, tests, stories in same directory
- Use barrel exports (index.ts) for cleaner imports

### TypeScript Best Practices
- Enable strict mode in tsconfig.json
- Avoid `any` type, use `unknown` or proper types
- Use type inference where possible
- Create shared types in `src/types.ts` or domain-specific type files

### Performance Considerations
- Use React.memo for expensive components
- Use useMemo/useCallback to prevent unnecessary re-renders
- Optimize images: use WebP format, lazy load images
- Monitor bundle size with vite-bundle-visualizer

### Security Considerations
- Sanitize user inputs to prevent XSS
- Validate all data with Zod schemas
- Use Content Security Policy headers
- Keep dependencies updated (use Dependabot)

### Future Enhancements (Post-Launch)
- Cloud sync with Supabase or custom API
- Real-time collaboration (multiple users editing same rehearsal)
- Calendar integration (Google Calendar, Apple Calendar)
- Push notifications for call times
- Social features (share rehearsals/gigs with band members)
- Mobile app (React Native or Capacitor)
- Desktop app (Electron or Tauri)
- Advanced analytics (practice time tracking, gig revenue forecasting)
- AI features (setlist suggestions, task auto-generation)

---

## Implementation Priority

If time/resources are limited, prioritize in this order:

1. **Phase 1**: Foundation is critical for all other work
2. **Phase 2**: Data layer must be solid before building features
3. **Phase 3.2 & 3.3**: Core features (Rehearsals & Gigs) are the product's value
4. **Phase 3.1**: Dashboard ties everything together
5. **Phase 4.3**: Settings are essential for user customization
6. **Phase 5**: Testing and polish ensure quality
7. **Phase 4.1, 4.2, 4.4**: Nice-to-have enhancements
8. **Phase 4.5, 4.6**: Accessibility and i18n are important but can be iterative

---

## Success Metrics (from PLAN.md)

- **Time to create rehearsal**: <2 minutes (measure from click "New Rehearsal" to save)
- **Gig readiness score**: All logistics captured (venue, call time, compensation, travel)
- **PWA score**: ≥90 on all Lighthouse metrics
- **Offline reliability**: App fully functional offline, sync on reconnect
- **User satisfaction**: Gather feedback via in-app survey or analytics

---

## Conclusion

This plan provides a comprehensive roadmap for implementing SoundCheck Pro according to the vision in PLAN.md. Each phase builds on the previous, ensuring a solid foundation before adding advanced features. The plan is detailed enough for a cloud agent to execute autonomously while remaining flexible for adjustments based on feedback and constraints.

Good luck with the build! 🎸🎤🎹