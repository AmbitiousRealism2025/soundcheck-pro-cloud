# SoundCheck Pro - Architecture Documentation

**Last Updated**: 2025-11-08
**Version**: 0.1.0

---

## Table of Contents

1. [Overview](#overview)
2. [Architecture Principles](#architecture-principles)
3. [Data Flow](#data-flow)
4. [Technology Stack](#technology-stack)
5. [Component Hierarchy](#component-hierarchy)
6. [State Management](#state-management)
7. [Data Persistence](#data-persistence)
8. [Offline-First Strategy](#offline-first-strategy)
9. [PWA Architecture](#pwa-architecture)
10. [Key Design Decisions](#key-design-decisions)

---

## Overview

SoundCheck Pro is an **offline-first Progressive Web App (PWA)** designed for gigging musicians to manage rehearsals, gigs, and performance logistics. The application runs entirely in the browser with no backend dependencies, storing all data locally in IndexedDB for maximum reliability and offline functionality.

### Core Objectives

- ✅ **100% offline functionality** - Works without internet connection
- ✅ **Zero dependencies on servers** - All data stored locally
- ✅ **Fast and responsive** - Optimized for mobile and desktop
- ✅ **Installable** - Can be installed as a native-like app on any device
- ✅ **Privacy-first** - No user data leaves the device

---

## Architecture Principles

### 1. Offline-First

The application is designed to work offline by default. All functionality is available without an internet connection:

- **Local-first data storage** using IndexedDB
- **Service worker** caches all static assets
- **No API calls** to external services (except optional features like maps)
- **Immediate persistence** of all user actions

### 2. Progressive Enhancement

The app provides a baseline experience for all users and enhances features based on device capabilities:

- Core functionality works on all modern browsers
- Enhanced features (like notifications) activate when supported
- Responsive design adapts to screen sizes
- Touch and keyboard interactions both supported

### 3. Single Source of Truth

State management follows a unidirectional data flow with Zustand as the single source of truth:

```
User Action → Zustand Store → IndexedDB → UI Update
```

All state mutations flow through Zustand actions, which handle both state updates and database persistence.

---

## Data Flow

### Complete Data Flow Diagram

```
┌─────────────────────────────────────────────────────────────┐
│                         User Interface                       │
│                    (React Components)                        │
└────────────────────┬────────────────────────────────────────┘
                     │
                     │ 1. User Action (click, submit, etc.)
                     ↓
┌─────────────────────────────────────────────────────────────┐
│                      Zustand Store                           │
│  ┌──────────────────────────────────────────────────────┐   │
│  │  State: { rehearsals, gigs, ui, settings }           │   │
│  │  Actions: add(), update(), delete(), load()          │   │
│  └──────────────────────────────────────────────────────┘   │
└────────────────────┬────────────────────────────────────────┘
                     │
                     │ 2. Action triggers state update + DB write
                     ↓
┌─────────────────────────────────────────────────────────────┐
│                      Dexie (IndexedDB)                       │
│  ┌──────────────────────────────────────────────────────┐   │
│  │  Tables: rehearsals, gigs                            │   │
│  │  Indexes: date, updatedAt                            │   │
│  └──────────────────────────────────────────────────────┘   │
└────────────────────┬────────────────────────────────────────┘
                     │
                     │ 3. Data persisted to IndexedDB
                     ↓
┌─────────────────────────────────────────────────────────────┐
│                         IndexedDB                            │
│              (Browser's Local Storage)                       │
└─────────────────────────────────────────────────────────────┘
                     │
                     │ 4. State change triggers React re-render
                     ↓
┌─────────────────────────────────────────────────────────────┐
│                    UI Updates (React)                        │
│                Components re-render with new state           │
└─────────────────────────────────────────────────────────────┘
```

### Data Flow Examples

#### Creating a Rehearsal

1. User fills out form and clicks "Create"
2. Form validation (React Hook Form + Zod)
3. `useStore().addRehearsal(data)` called
4. Zustand action:
   - Generates new ID
   - Adds timestamps
   - Writes to IndexedDB via Dexie
   - Updates Zustand state
5. React components re-render with new data
6. User sees new rehearsal in list

#### Updating a Task

1. User drags task to different column in Kanban board
2. `useStore().updateRehearsal(id, { tasks: newTasks })` called
3. Zustand action:
   - Updates task status/order
   - Writes to IndexedDB
   - Updates state
4. UI reflects new task position immediately

---

## Technology Stack

### Frontend Framework

- **React 18.3+** - UI library with concurrent features
- **TypeScript 5.6+** - Type safety and developer experience
- **Vite 5.4+** - Fast build tool and dev server

### State Management

- **Zustand 4.5+** - Lightweight state management
  - No providers needed
  - Simple API with hooks
  - Middleware support (persist, devtools)
  - TypeScript-first design

### Data Persistence

- **Dexie 4.0+** - IndexedDB wrapper
  - Reactive queries
  - Schema versioning and migrations
  - TypeScript support
  - Promise-based API

### UI & Styling

- **Tailwind CSS 3.4+** - Utility-first CSS framework
- **Lucide React** - Icon library
- **clsx** - Conditional class names
- **tailwind-merge** - Merge Tailwind classes

### Routing

- **React Router 6.26+** - Client-side routing
  - Nested routes
  - Code splitting support
  - Browser history management

### Forms & Validation

- **React Hook Form 7.52+** - Form state management
- **Zod 3.23+** - Schema validation
  - Type inference
  - Runtime validation
  - Error messages

### Drag & Drop

- **@dnd-kit** - Accessible drag and drop
  - Sortable lists
  - Kanban boards
  - Touch and keyboard support

### Date Handling

- **date-fns 3.6+** - Date utilities
  - Lightweight
  - Modular
  - Immutable

### PWA

- **vite-plugin-pwa 0.20+** - PWA support
  - Service worker generation
  - Web app manifest
  - Offline caching
  - Auto-update

### Development Tools

- **ESLint 8.57+** - Code linting
- **Prettier 3.3+** - Code formatting
- **Vitest 2.1+** - Unit testing
- **Playwright 1.48+** - E2E testing
- **Husky 9.1+** - Git hooks
- **lint-staged 15.2+** - Pre-commit linting

---

## Component Hierarchy

### High-Level Structure

```
App
├── AppRouter
│   ├── Home (Dashboard)
│   ├── RehearsalsList
│   │   └── RehearsalDetail
│   ├── GigsList
│   │   └── GigDetail
│   └── Settings
├── DevTools (dev mode only)
└── ServiceWorker (PWA)
```

### Component Organization

```
src/
├── app/
│   └── routes/           # Top-level route components
│       ├── Home.tsx
│       ├── RehearsalsList.tsx
│       ├── RehearsalDetail.tsx
│       ├── GigsList.tsx
│       ├── GigDetail.tsx
│       └── Settings.tsx
├── components/
│   ├── ui/               # Reusable UI primitives
│   │   ├── Button.tsx
│   │   ├── Input.tsx
│   │   └── ...
│   └── onboarding/       # Onboarding flows
│       └── CoachMarks.tsx
├── db/                   # Database layer
│   ├── db.ts             # Dexie setup
│   └── seed.ts           # Dev utilities
├── store/                # State management
│   └── useStore.ts       # Zustand store
├── utils/                # Pure utility functions
│   ├── dates.ts
│   ├── maps.ts
│   ├── ics.ts
│   └── id.ts
└── types.ts              # TypeScript types
```

---

## State Management

### Zustand Store Structure

```typescript
interface Store {
  // Data state
  rehearsals: Rehearsal[]
  gigs: Gig[]

  // UI state (planned)
  sidebarOpen: boolean
  activeModal: string | null

  // Settings state (planned)
  theme: 'auto' | 'light' | 'dark'
  homeAddress: string

  // Actions
  load: () => Promise<void>
  addRehearsal: (data: Partial<Rehearsal>) => Promise<void>
  updateRehearsal: (id: string, data: Partial<Rehearsal>) => Promise<void>
  deleteRehearsal: (id: string) => Promise<void>
  addGig: (data: Partial<Gig>) => Promise<void>
  updateGig: (id: string, data: Partial<Gig>) => Promise<void>
  deleteGig: (id: string) => Promise<void>
}
```

### State Update Pattern

All mutations follow this pattern:

```typescript
addRehearsal: async (data) => {
  // 1. Generate ID and timestamps
  const rehearsal = {
    id: uid('reh'),
    createdAt: Date.now(),
    updatedAt: Date.now(),
    ...data,
  }

  // 2. Write to IndexedDB
  await db.rehearsals.add(rehearsal)

  // 3. Update Zustand state
  set((state) => ({
    rehearsals: [...state.rehearsals, rehearsal]
  }))
}
```

### Future: Modular Slices

Planned refactor (Phase 2) will split store into domain slices:

- `rehearsalsSlice` - Rehearsal CRUD + selectors
- `gigsSlice` - Gig CRUD + selectors
- `uiSlice` - UI state (sidebar, modals, theme)
- `settingsSlice` - User preferences

---

## Data Persistence

### IndexedDB Schema (v1)

**Rehearsals Table:**
```
id (primary key, string)
date (indexed, ISO8601 string)
eventName (indexed, string)
updatedAt (indexed, number)
location (string, optional)
tasks (Task[], embedded array)
createdAt (number, timestamp)
```

**Gigs Table:**
```
id (primary key, string)
date (indexed, ISO8601 string)
venue.name (indexed, string)
updatedAt (indexed, number)
callTime (ISO8601 string, optional)
venue (Venue object)
compensation (number, optional)
notes (string, optional)
mileage (number, optional)
createdAt (number, timestamp)
```

### Planned v2 Migration

Phase 2 will introduce:
- `rehearsalTemplates` table
- `attachments` table
- `mileageLogs` table
- Enhanced types with status fields, compensation tracking, etc.

### Migration Strategy

Dexie provides version-based migrations:

```typescript
this.version(2).stores({
  // New schema
}).upgrade(tx => {
  // Transform existing data
})
```

---

## Offline-First Strategy

### Service Worker

The service worker (generated by `vite-plugin-pwa`) caches:

- **Static assets** - HTML, CSS, JS, fonts, icons
- **Runtime caching** - Images, external resources (optional)
- **Offline fallback** - Fallback page when offline and route not cached

### Caching Strategies

- **CacheFirst** - Static assets (JS, CSS, fonts)
- **NetworkFirst** - Dynamic content (future API calls)
- **StaleWhileRevalidate** - Images and media

### Update Flow

1. User opens app
2. Service worker checks for updates
3. If new version available, download in background
4. Show update notification
5. User clicks "Update" → reload with new version

---

## PWA Architecture

### Web App Manifest

Defines app metadata for installation:

```json
{
  "name": "SoundCheck Pro",
  "short_name": "SoundCheck",
  "start_url": "/",
  "display": "standalone",
  "theme_color": "#1e40af",
  "icons": [...],
  "categories": ["music", "productivity"]
}
```

### Installation Triggers

- **Desktop** - Install prompt in address bar
- **Mobile** - Add to Home Screen banner
- **Criteria** - HTTPS, manifest, service worker, icons

### Lighthouse Score Target

Target: **≥90** on all metrics
- Performance
- Accessibility
- Best Practices
- SEO
- PWA

---

## Key Design Decisions

### 1. **No Backend/Authentication**

**Decision**: Pure client-side app with no backend or user accounts.

**Rationale**:
- Maximum offline reliability
- Zero server costs
- Instant setup (no signup required)
- Privacy by design (data never leaves device)
- Simpler architecture

**Trade-offs**:
- No cross-device sync (without future cloud backup feature)
- Data tied to single browser/device
- No collaboration features (without future P2P sync)

### 2. **Zustand over Redux**

**Decision**: Use Zustand for state management instead of Redux.

**Rationale**:
- Simpler API (less boilerplate)
- No providers needed
- Better TypeScript support
- Smaller bundle size (~1kb vs ~8kb)
- Easier to learn and maintain

**Trade-offs**:
- Smaller ecosystem (fewer plugins)
- Less middleware available
- Community smaller than Redux

### 3. **IndexedDB over LocalStorage**

**Decision**: Use IndexedDB (via Dexie) for data persistence.

**Rationale**:
- Larger storage limits (50MB+ vs 5-10MB)
- Structured queries with indexes
- Asynchronous (non-blocking)
- Better performance for large datasets
- Support for blobs (future attachments feature)

**Trade-offs**:
- More complex API (mitigated by Dexie)
- Browser support considerations (covered by Dexie polyfill)

### 4. **Tailwind over CSS Modules**

**Decision**: Use Tailwind CSS for styling.

**Rationale**:
- Faster development (no context switching)
- Smaller CSS bundle (PurgeCSS removes unused styles)
- Consistent design system
- Responsive utilities built-in
- Dark mode support

**Trade-offs**:
- Learning curve for new developers
- HTML can get verbose
- Harder to change design system globally

### 5. **React Router over File-Based Routing**

**Decision**: Use React Router with explicit route configuration.

**Rationale**:
- More control over route structure
- Easier to understand for small apps
- Better TypeScript integration
- More explicit (easier to trace)

**Trade-offs**:
- Manual route configuration
- No automatic code splitting (needs explicit lazy())

### 6. **Vite over Create React App**

**Decision**: Use Vite as build tool instead of CRA.

**Rationale**:
- Much faster HMR (Hot Module Replacement)
- Smaller bundle sizes (better tree-shaking)
- Native ES modules (faster cold starts)
- Better plugin ecosystem
- Modern defaults (TypeScript, CSS, etc.)

**Trade-offs**:
- Less mature ecosystem than CRA
- More manual configuration for some features

---

## Future Architectural Considerations

### Planned Enhancements

1. **Cloud Sync (Optional)**
   - End-to-end encrypted backup to user's cloud storage
   - Manual or automatic sync
   - Maintains offline-first principles

2. **Modular Store Architecture**
   - Split Zustand store into domain slices
   - Selectors for derived state
   - Optimistic updates with rollback

3. **Code Splitting**
   - Route-level lazy loading
   - Component-level code splitting
   - Preloading for faster navigation

4. **Testing Infrastructure**
   - Unit tests (Vitest)
   - Component tests (React Testing Library)
   - E2E tests (Playwright)
   - Visual regression tests (Storybook + Chromatic)

5. **Analytics (Privacy-Preserving)**
   - Local-only usage analytics
   - No tracking or personal data collection
   - Insights to improve UX

---

## Appendix

### Browser Support

**Minimum supported versions:**
- Chrome/Edge 90+
- Firefox 88+
- Safari 14+
- Mobile Safari (iOS 14+)
- Chrome Mobile (Android 90+)

### Performance Targets

- **Time to Interactive (TTI)**: <3s on 3G
- **First Contentful Paint (FCP)**: <1.5s
- **Largest Contentful Paint (LCP)**: <2.5s
- **Cumulative Layout Shift (CLS)**: <0.1
- **Bundle size**: <200kb (gzipped)

### Accessibility Standards

- **WCAG 2.1 Level AA** compliance
- Keyboard navigation support
- Screen reader compatibility
- Focus management
- Color contrast >4.5:1

---

**Document maintained by**: Cloud Agents
**Review frequency**: After each major phase completion
