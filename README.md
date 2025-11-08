# SoundCheck Pro — React Web (PWA) Starter

A browser-first, offline-friendly **PWA** for gigging musicians to prep rehearsals and manage gig logistics.

## Stack
- React + Vite + TypeScript
- Tailwind CSS
- React Router
- Zustand
- Dexie (IndexedDB)
- @dnd-kit for drag & drop
- `ics` for calendar exports
- vite-plugin-pwa for offline/install

## Quickstart
```bash
npm install
npm run dev
# open http://localhost:5173
```

## Build
```bash
npm run build
npm run preview
```

## Notes
- Data is stored locally in IndexedDB (see `src/db/db.ts` and `src/store/useStore.ts`).
- Create rehearsals/gigs from the **+ Add** button in the header.
- Export .ics and open directions from detail views.
