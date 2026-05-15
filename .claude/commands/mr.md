# Ship Changes as PR

Same as the global /mr skill, with one additional step before committing: run lint and format checks.

## Steps

Follow all steps from the global mr skill, but insert this step between "Stage all changes" and "Commit":

**Run lint and format checks** — run `npm run lint` and `npm run format:check` from the project root. If lint fails, report the errors and stop. If format issues are found, run `npm run format` to fix them automatically, re-stage with `git add -A`, then continue to commit.
