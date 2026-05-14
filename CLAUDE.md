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

This is a Create React App (React 18) single-page application. All components live in `src/App.js` — there is no component splitting into separate files.

**Environment / API config** is in `src/Constants.js`. It exports a `config` object with `config.url.API_URL` and `config.url.REDIRECT_URL` that automatically switch between dev (`localhost`) and prod (`fazztoolsapi.ddns.net`) based on `NODE_ENV`.

**Authentication** uses Blizzard OAuth (EU). The flow is:
1. `/auth` redirects to battle.net OAuth
2. Battle.net redirects back to `/redirect` with an auth code
3. `AuthRedirect` POSTs the code to the backend, which returns a `userid`
4. `userid` is stored in a cookie (`universal-cookie`) and used in all subsequent API requests as a query param

**Routing** uses React Router v6 (`BrowserRouter` + `Routes`). Routes are defined in a `RouterSetup` component. Detail views use URL params (e.g. `/gear/:alt/:realm`, `/keybind/:alt/:realm/:spec`, `/profession/:alt/:realm/:profession`) accessed via `useParams`. The `public/_redirects` file handles Netlify SPA routing so all paths serve `index.html`.

**Page layout pattern**: every page component renders `<Header />` + `<MenuBar />` (sidebar) + main content in a two-column `react-bootstrap` grid. `MenuBar` conditionally shows authenticated links based on whether the `userid` cookie exists.

**`AltTable` / `AltTableRowData`**: a shared table component used by Account, Keybind, Gear, and Profession pages. It has per-page rendering logic (switched on a `page` prop: `'kb'`, `'gear'`, `'profession'`) that controls which columns are hidden and which cells become links to detail views.

**Data slicing in Mount/Pet**: the API returns count metadata appended at the end of the array (indices 11–13 for mounts, 12–14 for pets). `data.slice(0, N)` passes the actual records to the table; `data.slice(N, N+3)` retrieves the counts.

**Keybind upload**: users upload a `.lua` file (WoW addon export) via `KeybindUpload`, which PUTs it to the backend as `multipart/form-data`.
