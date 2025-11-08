# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

SoundCheck Pro is an offline-first PWA for gigging musicians to manage rehearsals, gigs, and performance logistics. Built with React, it stores all data locally in IndexedDB via Dexie, with Zustand managing application state.

## Development Commands

```bash
# Development
npm install          # Install dependencies
npm run dev          # Start dev server at http://localhost:5173

# Build & Preview
npm run build        # TypeScript compile + Vite build
npm run preview      # Preview production build locally
```

## Architecture

### Data Flow Pattern
The application follows an offline-first architecture with this data flow:

```
User Action → Zustand Store → Dexie → IndexedDB
                ↓
            React Components (re-render)
```

**Key principle**: All mutations go through Zustand actions which handle both IndexedDB persistence and state updates. The store is the single source of truth.

### Core Technologies

- **React 18** with TypeScript for UI
- **Zustand** for state management (simple, no provider required)
- **Dexie** as IndexedDB wrapper with reactive queries
- **React Router** for navigation
- **Tailwind CSS** for styling (dark theme default)
- **@dnd-kit** for drag-and-drop (future Kanban boards)
- **React Hook Form + Zod** for form validation
- **vite-plugin-pwa** for PWA capabilities and offline support

### State Management Strategy

**Current implementation** (`src/store/useStore.ts`):
- Single Zustand store with flat structure
- Actions: `load()`, `addRehearsal()`, `addGig()`, `updateRehearsal()`, `updateGig()`
- State mirrors IndexedDB tables: `rehearsals[]`, `gigs[]`

**Future planned architecture** (see `plan-v2-:-coding-plan.md`):
- Modular slices: `rehearsalsSlice`, `gigsSlice`, `uiSlice`, `settingsSlice`
- Optimistic updates with rollback
- Selectors for derived state

When adding state logic, prepare for this migration by keeping domain concerns separate.

### Database Schema

**Current Dexie v3 schema** (`src/db/db.ts`):
```typescript
rehearsals: 'id, date, eventName, updatedAt, templateId'
gigs: 'id, date, status, updatedAt'
rehearsalTemplates: 'id, name'
mileageLogs: 'id, gigId, date'
syncQueue: 'id, status, nextAttemptAt, timestamp'
```

**Schema Evolution:**
- **v1**: Basic rehearsals and gigs tables
- **v2**: Added templates, mileage logs, enhanced types with attachments/notes
- **v3**: Added syncQueue table for offline sync coordination

**When modifying schema:**
- Increment version number in `db.ts`
- Add `.upgrade()` function for data migration
- Update type definitions in `src/types.ts`
- Test migration path from previous version

### File Organization

```
src/
├── app/routes/          # Page components (Home, RehearsalsList, etc.)
├── components/
│   ├── ui/              # Reusable UI primitives (Button, Input, etc.)
│   └── onboarding/      # CoachMarks and onboarding flows
├── db/                  # Dexie database setup
├── store/               # Zustand state management
├── styles/              # Global CSS and Tailwind config
├── utils/               # Pure functions (dates, ICS export, maps, IDs)
└── types.ts             # TypeScript interfaces
```

### Path Aliases

TypeScript is configured with `@/*` pointing to `src/*`:
```typescript
import { db } from '@/db/db'
import type { Rehearsal } from '@/types'
```

Always use `@/` imports instead of relative paths.

### Type System

Core domain types in `src/types.ts`:

- **Rehearsal**: Event with tasks array, date, location, optional template reference
- **Task**: Title, note, status (open/closed), sortable order
- **Gig**: Performance event with venue, compensation, call time, status
- **Venue**: Name, address, contact
- **RehearsalTemplate**: Reusable task lists with default tasks
- **MileageLog**: Travel tracking for gigs with distance and reimbursement
- **SyncOperation**: Offline mutation queue entry with retry logic

All IDs are string type. Dates are ISO8601 strings. Timestamps (`createdAt`, `updatedAt`) are Unix milliseconds.

**Sync Queue Types:**
- `SyncOperation`: Tracks mutations for future cloud sync
- `SyncOperationStatus`: `'pending' | 'processing' | 'failed' | 'completed'`
- Operations include: type (`create | update | delete`), entity, data, timestamp, retry count

## Implementation Guidance

### Adding New Features

1. **Check the roadmap** in `plan-v2-:-coding-plan.md` before implementing
2. **Define types first** in `src/types.ts`
3. **Update Dexie schema** in `src/db/db.ts` if new tables needed (increment version)
4. **Add Zustand actions** in `src/store/useStore.ts` for state mutations
5. **Build UI components** following existing patterns in `src/components/ui/`
6. **Use form validation** with React Hook Form + Zod for user inputs

### Form Validation Pattern

When creating forms:
```typescript
import { useForm } from 'react-hook-form'
import { z } from 'zod'

const schema = z.object({
  eventName: z.string().min(1).max(100),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}T/)
})

const { register, handleSubmit, formState: { errors } } = useForm({
  resolver: zodResolver(schema)
})
```

All user inputs should be validated before touching the database.

### Offline-First Principles

- **All data persists to IndexedDB immediately** - no backend calls
- **Service worker caches static assets** - configured in `vite.config.ts`
- **PWA manifest** defines app metadata for installation
- **Sync queue** (`src/service-worker/sync-queue.ts`) tracks offline mutations for future cloud sync

**Sync Queue Architecture:**
- Uses Dexie `syncQueue` table for atomic operations
- `BroadcastChannel` for cross-tab communication
- `navigator.locks` API ensures only one tab processes queue at a time
- Exponential backoff retry strategy with `nextAttemptAt` field
- Reactive updates via `liveQuery()` and cross-tab events

When adding features, ensure they work completely offline. For operations that need cloud sync, add them to the sync queue via `addToSyncQueue()`.

### Styling Conventions

- **Tailwind utility classes** for most styling
- **Dark theme default** - colors defined in `tailwind.config.js`
- **Glassmorphism effects** for elevated cards (backdrop-blur)
- Use semantic color tokens for status indicators
- Mobile-first responsive design (breakpoints: sm, md, lg, xl)

### Component Patterns

UI components follow this structure:
```typescript
interface ButtonProps {
  variant?: 'primary' | 'secondary'
  size?: 'sm' | 'md' | 'lg'
  children: React.ReactNode
  onClick?: () => void
}

export function Button({ variant = 'primary', size = 'md', ...props }: ButtonProps) {
  // Use clsx for conditional classes
  const className = clsx(
    'btn-base',
    variant === 'primary' && 'bg-primary',
    size === 'lg' && 'text-lg'
  )
  return <button className={className} {...props} />
}
```

### Date/Time Handling

Use utilities in `src/utils/dates.ts`:
- `fmtDate(iso: string, fmt?: string)` - formats ISO8601 strings
- Store all dates as ISO8601 strings in database
- Use `date-fns` for date math

### ID Generation

Use `newId()` from `src/utils/id.ts` for generating unique IDs. Currently uses `Date.now() + Math.random()` - sufficient for offline-first single-user app.

## Key Design Decisions

1. **No authentication/backend** - Pure client-side app for offline reliability
2. **IndexedDB as single source of truth** - No external database dependencies
3. **Zustand over Redux** - Simpler API, less boilerplate, better TypeScript support
4. **Tailwind over CSS Modules** - Faster development, smaller bundle
5. **React Router over file-based routing** - More explicit, easier to understand
6. **PWA over native apps** - Cross-platform without separate codebases

## Future Roadmap Awareness

The `plan-v2-:-coding-plan.md` outlines a 5-phase expansion plan:

- **Phase 1**: Design system + app shell with navigation
- **Phase 2**: State/data refactoring (modular Zustand slices, Dexie v2 migration)
- **Phase 3**: Core features (Dashboard, Kanban rehearsals, mission-pack gigs)
- **Phase 4**: Command palette, notifications, settings, analytics
- **Phase 5**: Testing, performance, documentation

When implementing features, check if they're part of the roadmap and follow the planned architecture patterns to avoid rework.

## Testing Strategy

**Current Stack:**
- **Playwright** for E2E tests (see `tests/e2e/`)
- **Vitest** for unit/component tests (planned)
- **React Testing Library** for component testing (planned)
- **Storybook** for component documentation (planned)

**E2E Testing Best Practices:**
- Always use `data-testid` attributes for stable selectors
- Use `page.getByTestId('element-name')` over text-based or class selectors
- Add test IDs to critical UI elements: cards, buttons, form controls, dialogs
- Convention: Use kebab-case for test IDs (e.g., `rehearsal-card`, `new-gig-button`)

**Test ID Naming Conventions:**
- Cards: `{entity}-card` (e.g., `rehearsal-card`, `gig-card`)
- Action buttons: `{action}-{entity}-button` (e.g., `new-rehearsal-button`, `delete-gig-button`)
- Form buttons: `{action}-{form-name}` (e.g., `submit-create-rehearsal`, `cancel-create-gig`)
- Dialog buttons: `confirm-dialog-{action}` (e.g., `confirm-dialog-confirm`, `confirm-dialog-cancel`)

When adding components, structure them for testability (pure functions, dependency injection for Dexie/Zustand). Always add `data-testid` attributes to interactive elements.

## PWA Considerations

- **Service worker** auto-updates via `vite-plugin-pwa`
- **Manifest** defines app name, icons, theme for installation
- **Offline support** caches all assets with Workbox
- Test PWA features with Lighthouse (target score ≥90)

When modifying build config or adding new asset types, update `workbox.globPatterns` in `vite.config.ts`.

---

## Cloud Agent Instructions

This section provides specific guidance for Claude Code Cloud Agents working through the implementation phases.

### Session Initialization

**ALWAYS start every session by reading these files in order:**

1. **`PROGRESS.md`** - Current phase status, what's completed, and where to start
2. **`CLAUDE.md`** (this file) - Architecture patterns and implementation guidelines
3. **`plan-v2-:-coding-plan.md`** - Detailed roadmap for the current phase
4. **`git status` and `git log`** - Recent changes and branch status

### Phase Execution Strategy

**Goal**: Complete one full phase per session when possible.

For each phase:

1. **Plan** - Review all file operations listed in the phase from `plan-v2-:-coding-plan.md`
2. **Implement** - Work through each file operation systematically
3. **Validate** - Run `npm run build` to ensure TypeScript compilation succeeds
4. **Test manually** - Start dev server (`npm run dev`) and verify core functionality works
5. **Document** - Update `PROGRESS.md` with completion status and next steps
6. **Commit** - Create a properly formatted commit following the git guidelines below

### Progress Documentation Requirements

**At the end of each phase**, update `PROGRESS.md` with:

1. Update the **Quick Status** table with ✅ status and completion date
2. Add a detailed **Phase Summary** section with:
   - Completion date and agent identifier
   - Key accomplishments (3-5 bullet points)
   - Known issues or blockers
   - Files created/modified count
   - Build and test status
3. Update **Next Steps** section to point to the upcoming phase

See `PROGRESS.md` for the exact format and examples.

### Git Commit & PR Format

**After completing each phase:**

1. **Create feature branch** (if not already on one):
   ```bash
   git checkout -b phase-[N]-[brief-description]
   ```

2. **Stage and commit** with this format:
   ```bash
   git add .
   git commit -m "$(cat <<'EOF'
   feat(phase-[N]): [Brief summary of phase completion]

   Implemented Phase [N]: [Phase Name]

   Key changes:
   - [Major change 1]
   - [Major change 2]
   - [Major change 3]

   Files affected: [number] files
   Build status: ✅ Passing
   Manual testing: ✅ Verified in dev mode

   🤖 Generated with [Claude Code](https://claude.com/claude-code)

   Co-Authored-By: Claude <noreply@anthropic.com>
   EOF
   )"
   ```

3. **Prepare for PR** by running:
   ```bash
   git log -1 --format="%B" > .pr-message.txt
   ```
   Then inform the user that the commit is ready and `.pr-message.txt` contains the PR description.

### Quality Standards

**Every phase completion must meet these criteria:**

- ✅ `npm run build` passes without TypeScript errors
- ✅ All new components follow existing patterns in `src/components/ui/`
- ✅ All TypeScript types properly defined (no `any` types)
- ✅ All imports use `@/*` path aliases (not relative paths)
- ✅ All async operations have try-catch blocks with error handling
- ✅ All user-facing strings are meaningful (prepare for future i18n)
- ✅ All interactive elements have `data-testid` attributes for E2E testing
- ✅ All database operations use Dexie transactions for atomicity

### Communication Guidelines

**Keep the user informed:**

- Report progress through each major file operation
- Flag any deviations from the plan with clear reasoning
- Ask for clarification if plan instructions are ambiguous or conflicting
- Report any unexpected errors immediately with full context

### Session Continuity

**If a phase cannot be completed in one session:**

1. Create a WIP (work in progress) commit with detailed notes
2. Update `PROGRESS.md` with "⚠️ IN PROGRESS" status
3. Document exactly where you stopped and precise next steps
4. List any blockers or questions for the next agent/session

### Additional Best Practices

**Dependency Management:**
- Before adding npm packages, verify they align with the existing stack
- Prefer packages that are: actively maintained (updated within 6 months), TypeScript-native, tree-shakeable, and <50kb gzipped
- Run `npm run build` after adding dependencies to check bundle impact

**Error Handling Pattern:**
- All async operations (Dexie calls, file operations) should have try-catch blocks
- Show user-friendly error messages via toast notifications (when implemented)
- Log detailed errors to console for debugging

**Accessibility Checkpoint:**
- Before completing each phase, verify: all interactive elements are keyboard accessible, focus indicators are visible, form fields have labels
- Color should not be the only indicator of state
- Use browser DevTools accessibility checker

**Performance Budget:**
- Monitor bundle size with each phase
- Target: Initial bundle <200kb gzipped, route chunks <50kb each
- If exceeded, implement code splitting or evaluate dependency alternatives
