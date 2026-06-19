# Subwise
## Live demo: [project-bwrui.vercel.app](https://project-bwrui.vercel.app/)

A client-side subscription tracker. Add what you're paying for, see what's renewing soon, what it's costing you per month or year, and get lightweight spending insights. All in the browser, no account, no backend.

## Features

- **Track subscriptions** with a name (autocomplete for ~40 popular services), category, price, billing cycle (weekly/monthly/quarterly/yearly/custom), status (active/trial/paused), next billing date, and optional notes.
- **Dashboard metrics**: monthly/yearly total spend, active service count, renewals due this week.
- **Upcoming renewals timeline** within a configurable window, sorted by urgency.
- **Search, filter, and sort** the subscription list by name, category, status, price, or next billing date.
- **Spending insights**: a category breakdown chart plus rule-based flags (e.g. "3+ entertainment services," "total exceeds $100/month"), fully client-side, no AI/API calls involved.
- **JSON export/import** for manual backup, since everything lives in browser `localStorage`.
- **Light/dark/system theme**, responsive layout, and keyboard-accessible throughout (focus-trapped modals, keyboard-navigable autocomplete, WCAG AA contrast).

## Tech stack

- React 19 + TypeScript, built with Vite
- Plain CSS with custom properties for theming (no UI framework)
- `localStorage` for persistence. No backend, no auth, no server
- Vitest + React Testing Library for tests

## Getting started

```bash
npm install
npm run dev       # start the dev server
npm run build     # type-check + production build
npm run test      # run the test suite once
npm run test:watch
npm run lint
```

## Project structure

```
src/
├── types.ts            # Core data model (Subscription, Settings, Category, BillingCycle, SubStatus)
├── App.tsx              # Top-level state: loads/saves localStorage, theme, modal state
├── theme.css              # Design tokens (CSS custom properties) for light/dark
├── App.css                 # Component styling
├── components/              # Header, Metrics, UpcomingTimeline, SubscriptionList,
│                              # SubscriptionFormModal, AuditSection, SettingsModal,
│                              # Modal, ConfirmDialog, EmptyState, ThemeToggle
└── utils/                     # money.ts, migrate.ts, dates.ts, storage.ts,
                                 # exportImport.ts, sampleData.ts, popularServices.ts
```

Component and utility test files (`*.test.ts(x)`) live alongside the file they test.

