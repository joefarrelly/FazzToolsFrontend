# TODO

## Migrate CRA to Vite

`react-scripts` (Create React App) is abandoned and carries a pile of unpatched
vulnerabilities including a critical in `shell-quote` (Dependabot alert #16).
There is no patched version — the fix is migrating to Vite.

Steps:
1. Remove `react-scripts` from `dependencies`
2. Add `vite` + `@vitejs/plugin-react` to `devDependencies`
3. Move `public/index.html` to repo root, update it for Vite's entry point format
4. Rename any `REACT_APP_*` env vars to `VITE_*`
5. Update `package.json` scripts (`start` → `vite`, `build` → `vite build`, `test` → vitest)
6. Run `npm audit` to confirm the vulnerability pile clears
