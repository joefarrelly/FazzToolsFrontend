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
    AccountAltRow.tsx   # Account page's per-alt accordion row (collapsed summary + expand panel)
    AltTable.tsx        # Table used by Gear, Profession (Account no longer uses this — see below)
    CollapsePanel.tsx   # Animated expand/collapse wrapper
    Header.tsx          # Top bar with brand + Update button
    KeybindUpload.tsx   # .lua addon file upload form (despite the name, generic upload widget)
    MenuBar.tsx         # Sidebar nav (includes SidebarLink, LoginLogout)
    MountTable.tsx      # Mount icon-grid accordion (collected + toggle for uncollected)
    PageLayout.tsx      # Wraps Header + MenuBar sidebar + main content
    PetTable.tsx        # Pet icon-grid accordion (collected + toggle for uncollected)
    ProfessionTable.tsx # Profession recipe accordion
  pages/            # One file per route
    Account.tsx         # "/" — alt-centric accordion list; click an alt name for AltDetail
    Achievement.tsx     # Account-wide; grouped by category; lazy-loads per-category on expand
    AltDetail.tsx       # "/alt/:alt/:realm" — consolidated per-alt view (gear/professions/M+/achievements/reps)
    Auth.tsx
    AuthRedirect.tsx
    Gear.tsx            # Account-wide gear overview table
    Logout.tsx
    Mount.tsx
    MythicPlus.tsx      # Account-wide; accordion per alt sorted by rating
    Pet.tsx
    Profession.tsx      # Account-wide profession overview table
    Reputation.tsx      # Account-wide; grouped by alt → expansion; standing derived from raw value
    SingleGear.tsx       # Click-through target from Gear.tsx (NOT from AltDetail, which duplicates this rendering)
    SingleProfession.tsx # Click-through target from Profession.tsx (same note as SingleGear)
  App.tsx           # BrowserRouter + Routes only
  App.css           # WoW-specific styles (class colors, item quality borders)
  classColors.ts    # WoW class → hex color map, shared by AltTable and AccountAltRow
  Constants.ts      # API URL config
  cookies.ts        # Shared universal-cookie instance
  format.ts         # capitalize() — shared by SingleGear, SingleProfession, AltDetail
  types.ts          # Shared TypeScript types (AltRow, PageType, MythicPlusEntry, etc.)
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

**Routing** uses React Router v6 (`BrowserRouter` + `Routes`). Detail views use URL params (e.g. `/gear/:alt/:realm`, `/alt/:alt/:realm`) accessed via `useParams`. The `public/_redirects` file handles Netlify SPA routing so all paths serve `index.html`.

**Page layout pattern**: every page uses `<PageLayout title="...">` which renders `<Header />` + sidebar `<MenuBar />` + the page's main content. `MenuBar` conditionally shows authenticated links based on whether the `userid` cookie exists. `AltDetail` has no sidebar link — it's only reachable by clicking an alt name on the Account page.

**`AltTable`**: shared table used by Gear and Profession (the account-wide overview pages). Per-page rendering is controlled by a `page` prop (`'gear'`, `'profession'`) which governs which columns are hidden and which cells link to detail views. The Account page does **not** use this anymore — it has its own accordion-row component (`AccountAltRow`) since it's expand-in-place rather than tabular.

**Account page redesign (alts as the focal point)**: `Account.tsx` fetches `/api/profile/alts/`, `/api/profile/altmythicplus/`, and `/api/profile/altprofessions/` in parallel and joins them by `alt_id` into a per-alt summary (ilvl, M+ rating, professions) shown inline on expand via `AccountAltRow`. Achievement points and reputation are deliberately *not* shown inline — achievements are scraped from one representative alt per faction (not every alt, see `scan_user_collection` in the backend), so they aren't meaningfully per-alt data; reputation was a judgement call to keep the row light. Clicking an alt's name (not the row background) navigates to `AltDetail` instead of toggling the row. The standalone Gear/Profession/Achievement/Reputation/Mythic+ pages are intentionally untouched by this — they're a known-incomplete first step of a larger planned redesign, not yet decided whether they'll be folded in or stay as account-wide views.

**Data slicing in Mount/Pet**: the API appends count metadata at the end of the response array. `data.slice(0, -3)` passes actual records to the table; `data.slice(-3)` retrieves the counts.

**Addon file upload**: users upload a `.lua` file (WoW addon export) via `KeybindUpload`, which PUTs it to the backend as `multipart/form-data`. The backend currently only stores it (no feature consumes it yet — reserved for future addon-only data like gold/currencies/lockouts).

### Styling

Tailwind CSS v3 with a dark WoW-themed palette (zinc neutrals, amber accents). WoW class color tints and item quality border styles are in `App.css` as named CSS classes (e.g. `.Warrior`, `.epic`) applied dynamically from API data.
