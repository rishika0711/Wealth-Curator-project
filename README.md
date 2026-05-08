# Wealth Curator — Personal Finance Dashboard

Production-quality **React + Vite + JavaScript (JSX) + React Native Web** personal finance cockpit: sidebar + chrome inspired by editorial fintech references, portfolio **Insights** layout (signals, sentiment, performance chart, sector rail, cash-flow intelligence), net worth / budget velocity summaries, deterministic “AI” copy from holdings + spend, proactive alerts, Recharts (**lazy-loaded**), and a **TanStack Virtual** ledger with debounced search.

## Quick start

```bash
npm install
npm run dev
npm run build && npm run preview
```

### Mock API flags

[`fetchDashboardMock`](src/features/dashboard/mockApi.js) reads browser query params:

| Param | Behavior |
|-------|-----------|
| `?fail=1` | Throws after latency — exercise error UI + retry |
| `?empty=1` | Returns structured empty payloads — alerts, holdings, ledger, vault |

### Analytics (GA4 / GTM)

Copy `.env.example` to `.env.local` and set **either**:

- `VITE_GA_MEASUREMENT_ID` — loads gtag.js, disables automatic SPA double-counting (`send_page_view: false`), and mirrors `page_view` through `gtag('event', …)` plus `window.dataLayer`
- `VITE_GTM_CONTAINER_ID` — injects the GTM bootstrap snippet; continues to mirror custom events onto `dataLayer` for QA

**Verify tagging:** GA4 Admin → Configure → DebugView (optional Chrome extension **Google Analytics Debugger**), open the app + DevTools `[analytics]` logs. Toggle search, chips, strategy CTAs, and query params to observe `page_view` and events.

Production GTM often includes canonical `<noscript><iframe …></iframe>` after `<body>`; this repo keeps HTML minimal and documents that expectation here.

---

## Architecture decisions

| Decision | Rationale |
|----------|-----------|
| **Vite SPA** | Fast dev/build, straightforward static deploy (`dist/`). |
| **React Native Web** | `resolve.alias` maps `react-native` → `react-native-web`; same primitives could align with a future React Native shell. **`AppRegistry.runApplication`** in `main.jsx` matches RN bootstrap patterns on web. |
| **React Router v7** | Client routing, lazy route-level code split for the dashboard bundle, analytics tied to `useLocation()` for SPA `page_view` parity. |
| **Feature-folder dashboard** | `features/dashboard/` owns mock API, tokens consumers, **`buildInsights`** / **`getPortfolioInsightsModel`**, and section components — keeps UI shell (`SidebarNav`, `MainHeader`) separate from data shaping. |
| **Design tokens** | Single source in [`theme/tokens.js`](src/theme/tokens.js): `space`, `radii`, `shadows`, light/dark palettes including **sidebar** / **nav active** surfaces, semantic colors for finance (accent, positive, negative, warning). Typography stack is **Inter-first** (with DM Sans fallbacks in Google Fonts). |
| **Mock-first data** | `useFetch` + `fetchDashboardMock` simulate latency, errors, and empty states without a backend — swap `createJsonFetcher` for real REST when needed. |
| **Mixed RN + DOM** | Virtualized ledger uses a **web `div` host** for `@tanstack/react-virtual`; Recharts renders inside **`<div>`** leaves under RN `View` — intentional for charting and scroll performance. |
| **Icons** | **lucide-react** (tree-shaken SVG) via a small [`IconGlyph`](src/components/icons/IconGlyph.jsx) wrapper for consistent sizing inside RN Web layouts. |

```text
src/
├── analytics/events.js          # Event name constants
├── App.jsx                      # Router, lazy dashboard, error boundary, route analytics
├── main.jsx                     # AppRegistry + React root
├── hooks/                       # useFetch, useAnalytics, useDebounce, useLocalStorage
├── theme/tokens.js              # Spacing, radii, shadows, themes
├── components/
│   ├── icons/IconGlyph.jsx
│   └── states/                  # Loading, error, empty
└── features/dashboard/
    ├── DashboardScreen.jsx      # Shell: sidebar + main header + scroll sections
    ├── insights.js              # buildInsights + getPortfolioInsightsModel
    ├── mockApi.js, mockData.js
    └── components/              # PortfolioInsights, TransactionsList, charts, etc.
```

---

## Custom hooks (`src/hooks/`)

Hooks are re-exported from [`hooks/index.js`](src/hooks/index.js) for ergonomic imports.

### `useFetch`

- State machine: **`idle` → `loading` → `success` | `error`**.
- Accepts an **`AbortSignal`** from the caller so navigations/unmount cancel in-flight mocks or future `fetch` calls.
- **`refetch()`** uses refs so the latest fetcher is always invoked without stale closures.
- **[`createJsonFetcher`](src/hooks/useFetch.js)** is a thin adapter over `fetch` + JSON parsing for swapping mocks with real APIs.

### `useAnalytics`

- Normalizes tagging to **`window.dataLayer`** (GTM-friendly) and optionally **`window.gtag`** when GA bootstrap env vars are set.
- In development without IDs, logs structured events for debugging.
- Event names live only in **[`analytics/events.js`](src/analytics/events.js)** to avoid string drift.

| Event (`ANALYTICS_EVENTS`) | Typical trigger |
|---------------------------|-----------------|
| `PAGE_VIEW` | SPA path or query change |
| `SEARCH` | Debounced query length (privacy-preserving payload) |
| `FILTER_CLICK` | Sidebar nav, tabs, chips, profile, vault, CTAs |
| `CTA_EXECUTE_STRATEGY` | Insight execute/dismiss/refine paths, alert CTAs |
| `THEME_TOGGLE` | Light/dark persistence |
| `LAZY_CHUNK_ERROR` | Error boundary after lazy chunk failure |

### `useDebounce`

- Debounces fast inputs (e.g. search **280ms**).
- **Empty string bypasses the timer** so clearing the field resets filters immediately instead of waiting for the trailing debounce.

### `useLocalStorage`

- JSON serialize/deserialize for small preferences (e.g. theme mode).
- Handles **quota errors** and listens to the **`storage` event** for cross-tab consistency.

---

## Performance optimizations

- **Route-level code splitting:** `React.lazy` + `Suspense` for [`DashboardScreen`](src/App.jsx) so first paint does not download the full dashboard + heavy feature code until `/` loads.
- **Chart code splitting:** [`SpendingRecharts`](src/features/dashboard/components/SpendingBars.jsx) and **Recharts** usage inside insights performance are **lazy-imported**, keeping initial dashboard JS smaller and isolating chart libraries into separate chunks.
- **Virtualized transactions:** [`@tanstack/react-virtual`](https://tanstack.com/virtual) over a fixed-height scroll region; **scroll position resets** when filters/search change so users do not land on a blank viewport after filtering.
- **Memoization:** Section components and rows use **`React.memo`**, **`useMemo`**, and **`useCallback`** where prop churn is high (header, lists, analytics handlers).
- **Build output:** Rollup **`manualChunks`** in [`vite.config.js`](vite.config.js) group **`vendor`** (React + RN Web), **`router`**, and **`virtual`** (TanStack Virtual) for long-lived browser caching.
- **Font loading:** `preconnect` to Google Fonts + a single combined font CSS request in [`index.html`](index.html).

Run `npm run build` and inspect `dist/assets/*.js` for chunk sizes and cache groups.

---

## SEO techniques used

This is a **client-rendered SPA**; techniques focus on **crawlable/social metadata**, **document structure**, and **accessible naming** (which also helps assistive tech and some parsers).

- **Primary meta:** `<title>`, `meta name="description"`, `lang="en"` on `<html>`.
- **Open Graph & Twitter Card** tags in [`index.html`](index.html): `og:type`, `og:title`, `og:description`, `og:url` (placeholder — replace with production canonical), `twitter:card`, titles/descriptions.
- **`theme-color`** for mobile browser chrome (aligned with dark shell).
- **Skip link:** “Skip to main content” targets the main scroll surface (`#main-content` via `nativeID` on RN Web `ScrollView`).
- **Landmarks & roles:** `accessibilityRole="main"` on main content; sections use `nativeID` anchors (`section-overview`, `section-insights`, …) for in-page navigation + deep links from the sidebar/header.
- **Meaningful control labels:** `accessibilityLabel` / `accessibilityRole` on inputs, tabs, and icon-only buttons.

**Limitation:** There is **no SSR/SSG**; crawlers that execute JavaScript still see one HTML shell while social bots relying only on **static OG tags** see the homepage metadata for every URL until you adopt SSR (e.g. Remix/Next) or prerender meta per route.

---

## Trade-offs

| Choice | Benefit | Cost |
|--------|---------|------|
| **RN Web primitives** | Shared mental model with mobile RN; styling via `StyleSheet` | Mixing RN `View` with raw `div`/SVG/Recharts requires clear boundaries |
| **Deterministic insights** | Stable demos, testable logic, no LLM cost/latency | Copy is templated—not generative AI without a backend model |
| **Mock-only custodian layer** | Fast iteration on UI states (`?fail=1`, `?empty=1`) | Real auth, schemas, pagination, and rate limits remain to be implemented |
| **Virtualized ledger in DOM host** | Smooth scrolling on long feeds | Escape hatch from pure RN trees; accessibility must be verified on targets |
| **Single-page shell** | Simple deploy anywhere static assets are hosted | SEO per-route and OG per-view need a meta framework upgrade if mandatory |
| **Large dashboard chunk** | One cohesive financial screen | Insight chart + deps increase the lazy-loaded dashboard chunk versus many tiny routes |

---

## Design tokens

[`theme/tokens.js`](src/theme/tokens.js): `space.*`, `radii.*`, `shadows.sm|md|panel`, **`themes.dark` / `themes.light`** (including sidebar/nav tokens), typography stack via **`font.sans`** / **`font.serif`** (currently Inter-led).

---

## Deploy

Outputs static assets to **`dist/`**. Configure the host for **SPA fallback** (all paths → `index.html`). Compatible with **Vercel**, **Netlify**, Firebase Hosting, S3 + CloudFront, etc.
