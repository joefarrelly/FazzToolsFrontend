# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm start        # dev server at http://localhost:3000
npm run build    # production build
npm test         # run tests (watch mode)
npm test -- --watchAll=false  # run tests once
```

## Architecture

This is a Create React App (React 18) single-page application styled with Tailwind CSS (v3).

### File structure

```
src/
  components/       # Shared UI — imported by multiple pages
    AltTable.tsx        # Table used by Account, Gear, Profession
    CollapsePanel.tsx   # Animated expand/collapse wrapper
    Header.tsx          # Top bar with brand + Update button
    KeybindUpload.tsx   # .lua addon file upload form (despite the name, generic upload widget)
    MenuBar.tsx         # Sidebar nav (includes SidebarLink, LoginLogout)
    MountTable.tsx      # Mount icon-grid accordion (collected + toggle for uncollected)
    PageLayout.tsx      # Wraps Header + MenuBar sidebar + main content
    PetTable.tsx        # Pet icon-grid accordion (collected + toggle for uncollected)
    ProfessionTable.tsx # Profession recipe accordion
  pages/            # One file per route
    Account.tsx
    Achievement.tsx     # Achievements grouped by category; lazy-loads per-category on expand
    Auth.tsx
    AuthRedirect.tsx
    Gear.tsx
    Home.tsx
    Logout.tsx
    Mount.tsx
    Pet.tsx
    Profession.tsx
    Reputation.tsx      # Reputations grouped by alt → expansion; standing derived from raw value
    SingleGear.tsx
    SingleProfession.tsx
  App.tsx           # BrowserRouter + Routes only
  App.css           # WoW-specific styles (class colors, item quality borders)
  Constants.ts      # API URL config
  cookies.ts        # Shared universal-cookie instance
  types.ts          # Shared TypeScript types (AltRow, PageType, etc.)
  index.css         # Tailwind directives + body base styles
```

Absolute imports are configured via `baseUrl: "src"` in `tsconfig.json`, so imports look like `import AltTable from 'components/AltTable'` rather than relative paths.

### Key modules

**`src/cookies.ts`** — exports a single shared `cookies` instance used across all components that need auth state.

**`src/Constants.ts`** — exports a `config` object with `config.url.API_URL` and `config.url.REDIRECT_URL` that automatically switch between dev (`localhost`) and prod (`fazztoolsapi.ddns.net`) based on `NODE_ENV`.

**`src/types.ts`** — shared TypeScript types: `AltRow` (`(string | number)[]`), `PageType`, `MountItem`, `PetItem`, `CollectionData`, `RecipeData`, etc.

**Environment variables** — copy `.env.example` to `.env` and fill in values before running locally:
- `REACT_APP_API_URL` — backend base URL (defaults to `http://localhost:8000`)
- `REACT_APP_REDIRECT_URL` — OAuth redirect URI (defaults to `http://localhost:3000/redirect/`)
- `REACT_APP_BLIZZ_CLIENT_ID` — Blizzard OAuth client ID (no default; required for auth)

**Authentication** uses Blizzard OAuth (EU). The flow is:
1. `/auth` redirects to battle.net OAuth using `REACT_APP_BLIZZ_CLIENT_ID`
2. Battle.net redirects back to `/redirect` with an auth code
3. `AuthRedirect` POSTs the code to the backend, which returns a `userid`
4. `userid` is stored in a cookie and used in all subsequent API requests as a query param

`axios.defaults.withCredentials = true` is set globally in `src/index.tsx`.

**Routing** uses React Router v6 (`BrowserRouter` + `Routes`). Detail views use URL params (e.g. `/gear/:alt/:realm`) accessed via `useParams`. The `public/_redirects` file handles Netlify SPA routing so all paths serve `index.html`.

**Page layout pattern**: every page uses `<PageLayout title="...">` which renders `<Header />` + sidebar `<MenuBar />` + the page's main content. `MenuBar` conditionally shows authenticated links based on whether the `userid` cookie exists.

**`AltTable`**: shared table used by Account, Gear, and Profession. Per-page rendering is controlled by a `page` prop (`'gear'`, `'profession'`) which governs which columns are hidden and which cells link to detail views.

**Data slicing in Mount/Pet**: the API appends count metadata at the end of the response array. `data.slice(0, -3)` passes actual records to the table; `data.slice(-3)` retrieves the counts.

**Addon file upload**: users upload a `.lua` file (WoW addon export) via `KeybindUpload`, which PUTs it to the backend as `multipart/form-data`. The backend currently only stores it (no feature consumes it yet — reserved for future addon-only data like gold/currencies/lockouts).

### Styling

Tailwind CSS v3 with a dark WoW-themed palette (zinc neutrals, amber accents). WoW class color tints and item quality border styles are in `App.css` as named CSS classes (e.g. `.Warrior`, `.epic`) applied dynamically from API data.
