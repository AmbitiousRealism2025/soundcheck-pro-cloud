# SoundCheck Pro 🎸

[![Build Status](https://img.shields.io/github/actions/workflow/status/AmbitiousRealism2025/soundcheck-pro-cloud/ci.yml?branch=main)](https://github.com/AmbitiousRealism2025/soundcheck-pro-cloud/actions)
[![License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.6-blue.svg)](https://www.typescriptlang.org/)
[![PWA](https://img.shields.io/badge/PWA-Ready-success.svg)](https://web.dev/progressive-web-apps/)

An **offline-first Progressive Web App** for gigging musicians to manage rehearsals, gigs, and performance logistics. Built with modern web technologies for a seamless experience across all devices.

## ✨ Features

### 🎵 Rehearsal Management
- **Kanban Board**: Organize tasks with drag-and-drop functionality
- **Templates**: Save and reuse common rehearsal setups
- **Practice Timer**: Built-in timer, stopwatch, and metronome
- **Notes & Attachments**: Keep all your rehearsal materials in one place
- **Task Tracking**: Monitor completion progress at a glance

### 🎤 Gig Management
- **Mission Pack Layout**: All gig details in a comprehensive view
- **Timeline Visualization**: Track load-in, soundcheck, downbeat, and more
- **Compensation Tracking**: Monitor payments and earnings
- **Travel Integration**: Calculate mileage, view maps, and get directions
- **ICS Export**: Add gigs to your calendar with one click

### 📊 Dashboard & Analytics
- **Upcoming Events**: See your next 7 days at a glance
- **Open Tasks**: Track outstanding items across all rehearsals
- **Earnings Summary**: Monitor monthly income and payments
- **Analytics**: Visualize rehearsal completion rates and trends
- **Quick Actions**: Rapid access to common tasks

### 🎯 Cross-Cutting Features
- **Command Palette** (Cmd+K): Navigate anywhere instantly
- **Notifications**: Get alerts for upcoming call times
- **Dark Theme**: Easy on the eyes, optimized for stage lighting
- **Offline-First**: All features work without internet
- **PWA**: Install on any device for app-like experience

## 🚀 Tech Stack

### Core Technologies
- **[React 18](https://react.dev/)** - Modern UI framework
- **[TypeScript](https://www.typescriptlang.org/)** - Type-safe development
- **[Vite](https://vitejs.dev/)** - Lightning-fast build tool
- **[Tailwind CSS](https://tailwindcss.com/)** - Utility-first styling

### State & Data
- **[Zustand](https://zustand-demo.pmnd.rs/)** - Lightweight state management
- **[Dexie](https://dexie.org/)** - IndexedDB wrapper for offline storage
- **[React Hook Form](https://react-hook-form.com/)** - Performant form handling
- **[Zod](https://zod.dev/)** - Schema validation

### Features & UI
- **[React Router](https://reactrouter.com/)** - Client-side routing
- **[@dnd-kit](https://dndkit.com/)** - Accessible drag-and-drop
- **[Lucide Icons](https://lucide.dev/)** - Beautiful icon library
- **[date-fns](https://date-fns.org/)** - Modern date utilities

### Development & Testing
- **[Vitest](https://vitest.dev/)** - Unit and component testing
- **[Playwright](https://playwright.dev/)** - End-to-end testing
- **[ESLint](https://eslint.org/)** - Code linting
- **[Prettier](https://prettier.io/)** - Code formatting

### PWA & Performance
- **[vite-plugin-pwa](https://vite-pwa-org.netlify.app/)** - PWA capabilities
- **Workbox** - Service worker & caching strategies

## 📦 Installation

### Prerequisites
- Node.js 18+ and npm
- Modern browser (Chrome, Firefox, Safari, Edge)

### Quick Start

```bash
# Clone the repository
git clone https://github.com/AmbitiousRealism2025/soundcheck-pro-cloud.git

# Navigate to directory
cd soundcheck-pro-cloud

# Install dependencies
npm install

# Start development server
npm run dev

# Open http://localhost:5173
```

## 🛠️ Development

### Available Scripts

```bash
# Development
npm run dev          # Start dev server with hot reload
npm run build        # Build for production
npm run preview      # Preview production build

# Testing
npm run test         # Run unit tests
npm run test:ui      # Run tests with UI
npm run test:coverage # Generate coverage report
npm run test:e2e     # Run E2E tests
npm run test:e2e:ui  # Run E2E tests with UI

# Code Quality
npm run lint         # Lint code
npm run lint:fix     # Fix linting issues
npm run typecheck    # Type-check without building
```

### Project Structure

```
soundcheck-pro-cloud/
├── src/
│   ├── app/
│   │   └── routes/          # Page components
│   ├── components/
│   │   ├── ui/              # Reusable UI components
│   │   ├── dashboard/       # Dashboard widgets
│   │   ├── rehearsals/      # Rehearsal-specific components
│   │   └── gigs/            # Gig-specific components
│   ├── db/                  # Dexie database setup
│   ├── store/
│   │   ├── slices/          # Zustand state slices
│   │   └── hooks.ts         # Custom state hooks
│   ├── schemas/             # Zod validation schemas
│   ├── hooks/               # Custom React hooks
│   ├── layouts/             # App shell layouts
│   ├── styles/              # Global styles
│   ├── utils/               # Utility functions
│   └── types.ts             # TypeScript types
├── tests/
│   └── e2e/                 # Playwright E2E tests
├── docs/                    # Documentation
└── public/                  # Static assets
```

### Architecture

SoundCheck Pro follows an **offline-first architecture**:

```
User Action → Zustand Store → Dexie → IndexedDB
                ↓
           React Components (re-render)
```

**Key principles:**
- All mutations go through Zustand actions
- Zustand handles both IndexedDB persistence and state updates
- The store is the single source of truth
- Service worker caches assets for offline use

For detailed architecture documentation, see [ARCHITECTURE.md](docs/ARCHITECTURE.md).

## 🧪 Testing

### Unit Tests

```bash
# Run all unit tests
npm run test

# Run tests in watch mode
npm run test -- --watch

# Generate coverage report
npm run test:coverage
```

Unit tests are located alongside component files with `.test.tsx` or `.test.ts` extensions.

### End-to-End Tests

```bash
# Run E2E tests
npm run test:e2e

# Run E2E tests with UI
npm run test:e2e:ui

# Run E2E tests in a specific browser
npm run test:e2e -- --project=chromium
```

E2E tests are in the `tests/e2e/` directory and test critical user flows.

## 📱 PWA Installation

SoundCheck Pro can be installed as a Progressive Web App on any device:

### Desktop
1. Open the app in Chrome, Edge, or Safari
2. Look for the install icon in the address bar
3. Click "Install" to add to your applications

### Mobile
1. Open the app in your mobile browser
2. Tap the share/menu button
3. Select "Add to Home Screen"
4. The app will appear on your home screen like a native app

### Offline Usage
Once installed, SoundCheck Pro works completely offline:
- All features remain functional
- Data syncs automatically when you reconnect
- Updates install seamlessly in the background

## 🎨 Customization

### Theme
The app uses a dark theme by default. Theme settings can be customized in:
```typescript
src/styles/tokens.css  // Design tokens
tailwind.config.js     // Tailwind configuration
```

### Settings
User preferences are managed through the Settings page:
- Home address for mileage calculation
- Currency and mileage rate
- Time format (12h/24h)
- Notification preferences

## 📚 Documentation

- **[Architecture](docs/ARCHITECTURE.md)** - System design and data flow
- **[Contributing](docs/CONTRIBUTING.md)** - Contribution guidelines
- **[Deployment](docs/DEPLOYMENT.md)** - Deployment instructions
- **[Technical Debt](docs/TECH_DEBT.md)** - Known issues and improvements

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guide](docs/CONTRIBUTING.md) for details.

### Quick Contribution Steps

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Make your changes
4. Run tests (`npm run test && npm run test:e2e`)
5. Commit your changes (`git commit -m 'Add amazing feature'`)
6. Push to the branch (`git push origin feature/amazing-feature`)
7. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Built with [React](https://react.dev/)
- Icons by [Lucide](https://lucide.dev/)
- Fonts from [Google Fonts](https://fonts.google.com/)
- Inspired by musicians everywhere managing their craft

## 📧 Support

- **Issues**: [GitHub Issues](https://github.com/AmbitiousRealism2025/soundcheck-pro-cloud/issues)
- **Discussions**: [GitHub Discussions](https://github.com/AmbitiousRealism2025/soundcheck-pro-cloud/discussions)

---

**Made with ❤️ for musicians, by musicians.**
