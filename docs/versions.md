# Updating the version of node

This repo is frontend-only (no Java/Maven backend, no `pom.xml`, no Dockerfile); it is built
with Vite and deployed to GitHub Pages. So the node version lives in fewer places than in the
Maven-backed `ucsb-cs156` projects.

## Updating the node version

Places that name the node version:

* `engines` section in `frontend/package.json`. **This also controls CI**: every workflow in
  `.github/workflows/` that needs node (the GitHub Pages deploy/rebuild workflows, the Chromatic
  workflows, and the shared workflows in `ucsb-cs156/workflows` for coverage, mutation testing,
  eslint and format checking) calls `actions/setup-node` with
  `node-version-file: frontend/package.json`, so no workflow edit is needed.
* `frontend/.nvmrc` (convenience for `nvm use` / `fnm use` when developing locally; not used by CI).

Then check `grep -rIn "<old version>" --exclude-dir=node_modules .` for anything else
(README, docs, etc.).

After changing the version, run (in `frontend/`, on the new node version):

```
rm -rf node_modules && npm ci
npm audit
npm run lint
npm run check-format
npm test
npm run build
npm run build-storybook
npx stryker run
```

Unit tests alone do not catch Storybook or Stryker breakage; run all of the above. The full
Stryker run only takes about a minute in this repo, so there is no need to limit it to one file.

### Updating frontend dependencies at the same time

Notes from the move to node 24.21.0 (issue #22), useful as a checklist:

* `npm audit`, `npm outdated` and `npm ci 2>&1 | grep deprecated` show what needs attention.
* Remove dependencies that are not imported anywhere. In this repo, `@rollup/plugin-alias`,
  `@storybook/react-webpack5` (and with it webpack), `@storybook/builder-vite` (transitive via
  `@storybook/react-vite`), `@uiw/react-json-view`, `axios-mock-adapter` (there is no axios),
  `eslint-plugin-react` (not referenced by `eslint.config.js`) and `@vitejs/plugin-react-swc`
  were unused. The `eslintConfig` block in `package.json` was a leftover from the eslintrc
  era and is ignored by ESLint 9+ flat config, so it was deleted.
* `@testing-library/user-event` belongs in `devDependencies`, not `dependencies`.
* If `npm install` fails with a confusing `ERESOLVE` after editing versions, regenerate:
  `rm -rf node_modules package-lock.json && npm install`.
* **npm 11 blocks dependency install scripts by default** and warns
  `install-scripts ... not yet covered by allowScripts`. After checking that the listed packages
  are expected (here `esbuild` and, on macOS only, `fsevents`), run
  `npm install-scripts approve --all` and commit the resulting `allowScripts` block in
  `package.json`. Re-check it after removing packages; a stale entry for a package that is no
  longer installed can simply be deleted.
* Breaking changes hit in this repo:
  * **react-router 8** (this repo already imported from `react-router`, not `react-router-dom`,
    and already used React 19): no code changes were needed. v8 requires React 19.2.7+,
    Node 22.22+ and Vite 7+, is ESM-only, and drops the `react-router-dom` package.
  * **vite 8 (Rolldown)**: `build.rollupOptions` is now `build.rolldownOptions`; the
    `manualChunks` function is deprecated, replaced by `output.codeSplitting.groups`
    (see `vite.config.js`); use `import.meta.dirname` instead of `__dirname`. Because
    `package.json` has `"type": "module"`, `vite.config.js` is already ESM, so the ESM-only
    `rollup-plugin-visualizer` 7 loads fine (no rename to `.mjs` was needed, unlike proj-courses).
  * **@vitejs/plugin-react-swc → @vitejs/plugin-react 6**: Vite 8 transforms JSX with Oxc, and
    the swc plugin prints "We recommend switching to `@vitejs/plugin-react`" on every run. The
    swap is a one-line change in `vite.config.js` (`react()` with no options) and removes the
    `@swc/core` native postinstall script.
  * **eslint 10**: works here because `eslint-plugin-react` (which crashes on ESLint 10) was not
    actually used. `eslint-plugin-react-hooks` 7 needs `configs.flat.recommended` instead of
    `configs['recommended-latest']`; its new React-Compiler rule `incompatible-library` warned
    on react-hook-form's `watch()` and TanStack Table's `useReactTable()`, so it is turned off in
    `eslint.config.js` (this project does not use the React Compiler). `eslint-plugin-storybook`
    10's `flat/recommended` config is now included in `eslint.config.js`.
  * **Storybook 10** (`storybook`, `@storybook/*`, `eslint-plugin-storybook` together with
    `@chromatic-com/storybook` 5 and `chromatic` 18): no config changes were needed here
    (`.storybook/main.js` is already ESM; there is no `msw-storybook-addon` in this repo).
    Always run `npm run build-storybook` to verify.
  * **Stryker 10**'s new `CallExpression` mutator produced no survivors here (100%, 186 mutants),
    so it is left enabled. Other repos have had to exclude it or add tests.
* Held back on purpose:
  * `vitest`/`@vitest/coverage-v8` stay on 4.x: with vitest 5 (and `@stryker-mutator/vitest-runner`
    10) Stryker's dry run succeeds but maps no tests to mutants, so every mutant survives
    (`npx stryker run --mutate src/main/utils/sortCaretUtils.js` scored 0% instead of 100%).
    Re-check this when a newer Stryker vitest-runner is released.
  * `@tanstack/react-table` stays on 8 (9 is a rewrite).
