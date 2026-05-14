# FazzToolsFrontend

React frontend for **FazzTools** — a World of Warcraft companion app.

Displays character data (professions, equipment, mounts, pets, keybinds) synced from the Blizzard Battle.net API. Authenticates via Blizzard OAuth and communicates with the Django REST backend.

The companion backend lives at [FazzToolsAPI](../FazzToolsAPI).

## Stack

- React 18, Create React App
- React Router v6
- React Bootstrap
- Docker Compose (for local dev)

## Getting started

**1. Clone and install**

```bash
npm install
```

**2. Start with Docker**

```bash
docker compose up
```

Or run directly:

```bash
npm start
```

Dev server runs at `http://localhost:3000`.

## Environment / API config

API URLs are configured in `src/Constants.js`. The `config` object automatically switches between dev (`localhost`) and prod (`fazztoolsapi.ddns.net`) based on `NODE_ENV` — no `.env` file needed.

## Authentication

Uses Blizzard OAuth (EU region):

1. `/auth` redirects to Battle.net OAuth
2. Battle.net redirects back to `/redirect` with an auth code
3. The backend exchanges the code and returns a `userid`
4. `userid` is stored in a cookie and sent as a query param on all subsequent API requests

## Commands

```bash
npm start                         # dev server at http://localhost:3000
npm run build                     # production build
npm test                          # run tests (watch mode)
npm test -- --watchAll=false      # run tests once
```

## Branch flow

```
feature branches → dev → main
```
