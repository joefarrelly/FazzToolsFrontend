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
    AccountTable.tsx    # Account page's per-alt table (ilvl, M+ rating, professions, gold, played time as columns)
    AddonFileUpload.tsx # .lua addon file upload form, mounted on Account above AccountTable
    AltTable.tsx        # Table used by Gear only (Account no longer uses this — see below)
    CollapsePanel.tsx   # Animated expand/collapse wrapper
    Header.tsx          # Top nav bar: brand + MenuBar nav links + Update button + staleness banner
    MenuBar.tsx         # Inline top nav links (includes NavLink, LoginLogout); active tab underlined
    MountTable.tsx      # Mount icon-grid accordion (collected + toggle for uncollected)
    PageLayout.tsx      # Wraps Header (top nav) + a centered max-w-7xl main content area
    PetTable.tsx        # Pet icon-grid accordion (collected + toggle for uncollected)
    ProfessionTable.tsx # Profession recipe accordion
  pages/            # One file per route
    Account.tsx         # "/" — alt-centric table (AccountTable); click an alt name for AltDetail
    Achievement.tsx     # Account-wide; grouped by category; lazy-loads per-category on expand
    AltDetail.tsx       # "/alt/:alt/:realm" — consolidated per-alt view (gear/professions/M+/achievements/reps)
    Auth.tsx
    AuthRedirect.tsx
    Gear.tsx            # Account-wide gear overview table
    Logout.tsx
    Mount.tsx
    MythicPlus.tsx      # Account-wide; accordion per alt sorted by rating
    Pet.tsx
    Reputation.tsx      # Account-wide; grouped by alt → expansion; standing derived from raw value
    SingleGear.tsx       # Click-through target from Gear.tsx (NOT from AltDetail, which duplicates this rendering)
    SingleProfession.tsx # Click-through target from AccountTable's Profession 1/2 columns (AltDetail renders ProfessionTable inline instead, no navigation)
  App.tsx           # BrowserRouter + Routes only
  App.css           # WoW-specific styles (class colors, item quality borders)
  classColors.ts    # WoW class → hex color map, shared by AltTable and AccountTable
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

**Page layout pattern**: every page uses `<PageLayout title="...">` which renders `<Header />` (a single top nav bar — brand, `<MenuBar />` nav links, and Update controls all in one row, modelled on a sibling project's `renegades-bot/web/templates/base.html`) + a centered `max-w-7xl` main content area. `MenuBar` conditionally shows authenticated links based on whether the `userid` cookie exists, and underlines the active tab via `useLocation()`. `AltDetail` has no nav link — it's only reachable by clicking an alt name on the Account page.

**`AltTable`**: shared table used only by `Gear.tsx` now (the standalone Profession page was removed — see below). The `page` prop (`PageType`, currently just `'gear'`) is now a single-branch vestige of when it also handled `'profession'`; not worth collapsing further unless another standalone page needs the pattern again.

**Account page redesign (alts as the focal point)**: `Account.tsx` fetches `/api/profile/alts/`, `/api/profile/altmythicplus/`, and `/api/profile/altprofessions/` in parallel and joins them by `alt_id` into a per-alt row (ilvl, M+ rating, professions) rendered via `AccountTable`. Rows are sorted client-side by level descending, then ilvl descending. The Profession 1/2 cells link to `SingleProfession` (`/profession/:alt/:realm/:profession`) when learned. Achievement points and reputation are deliberately left off this table — achievements are scraped from one representative alt per faction (not every alt, see `scan_user_collection` in the backend), so they aren't meaningfully per-alt data; reputation was a judgement call to keep the table focused. Clicking an alt's name navigates to `AltDetail` (gear/professions/M+/reputations for that one alt — also no achievements section, same reasoning). The standalone Profession page was removed entirely (decided unnecessary now that professions are clickable from Account) — Gear/Achievement/Reputation/Mythic+ remain, status still undecided.

**Data slicing in Mount/Pet**: the API appends count metadata at the end of the response array. `data.slice(0, -3)` passes actual records to the table; `data.slice(-3)` retrieves the counts.

**Addon file upload**: users upload a `.lua` file (WoW addon export) via `AddonFileUpload`, mounted above `AccountTable` on the Account page, which PUTs it to the backend as `multipart/form-data`. `Account.tsx` joins the parsed gold/played-time data (`/api/profile/users/?page=addon`) into `AccountTable`'s Gold and Played Time columns — `'—'` when an alt hasn't appeared in an uploaded file yet. Currencies/lockouts/keystone/vault are captured by the addon but not yet surfaced (same join pattern, not built).

### Styling

Tailwind CSS v3 with a dark WoW-themed palette (zinc neutrals, amber accents). WoW class color tints and item quality border styles are in `App.css` as named CSS classes (e.g. `.Warrior`, `.epic`) applied dynamically from API data.
