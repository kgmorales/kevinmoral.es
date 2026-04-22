# Styling & Architecture Consolidation Plan — kevinmoral.es

> Goal: unify all styling on Tailwind CSS, remove redundant packages, and tighten architecture for scalability, reusability, and maintainability.

## 1. Current Styling Landscape (5 practices in play)

| Practice                         | Where                                                                                                    | Verdict                                                                                                                                  |
| -------------------------------- | -------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------- |
| **Tailwind utilities** (primary) | ~30+ JS files                                                                                            | Keep as the single source                                                                                                                |
| **CSS Modules** (9 files)        | `pages/live-game.module.css`, `components/spotify/**`, `components/purdue/**`, `components/live-game/**` | Migrate to Tailwind                                                                                                                      |
| **Global CSS + `@apply`**        | `css/tailwind.css` (animations, utilities), `css/prism.css` (`.card`, code blocks)                       | Keep prism tokens + keyframes; hoist `.card`, `.footnotes`, `.csl-entry`, `.backdrop`, `.top-n-1` into Tailwind config or inline classes |
| **MUI + Emotion**                | `components/live-game/leader-tabs/leaders.js` only (Tabs/Tab/Avatar/Box/Typography)                      | Remove — single-file usage; replace with Headless UI Tab + Tailwind                                                                      |
| **Inline `style={{}}`**          | 6 locations (`PostLayout`, `Card`, `ScrollTop`, `spotifyBio` iframes)                                    | Only inline what can't be Tailwind                                                                                                       |

The nine `.module.css` files contain duplicated tokens (`#171717`, `rgb(64, 64, 64)`, `16px`, box-shadow stacks) that already exist as Tailwind theme entries (`customDark`, `border.root`, `shadow-normal`, `rounded-2xl`). Consolidation is mostly find-and-replace.

### The 9 `.module.css` files to migrate

1. `pages/live-game.module.css`
2. `components/spotify/SpotifyNowPlaying.module.css`
3. `components/spotify/spotify-bio/spotifyBio.module.css`
4. `components/purdue/Purdue.module.css`
5. `components/purdue/scoreboard/Scoreboard.module.css`
6. `components/purdue/scoreboard/live/Live.module.css`
7. `components/live-game/leader-tabs/leaders.module.css`
8. `components/live-game/leader-tabs/leader-bio/leader-bio.module.css`
9. `components/live-game/scoreboardLive/scoreboardLive.module.css`

## 2. Package Audit

### Remove (unused or single-use)

- `@mui/material`, `@emotion/react`, `@emotion/styled` — only used by `leaders.js`. Replace with Tailwind + Headless UI (already installed). Saves ~150 KB gz.
- `@tailwindcss/aspect-ratio` — Tailwind 3+ has native `aspect-*` utilities; plugin + `aspectRatio: ['responsive']` config entry are legacy.
- `ag-grid-community` + `ag-grid-react` (only `pages/live-game.js`) — ~400 KB for a stats table. A semantic `<table>` with Tailwind suffices.
- `smoothscroll-polyfill` (`ScrollTop.js`) — modern evergreen browsers support `scroll-behavior: smooth`.
- Preact alias in `next.config.js` — aliasing `react → preact/compat` while using MUI + framer-motion + React 17 is fragile.

### Broken / missing references

- `@vercel/analytics` — imported in `pages/index.js`, `pages/blog.js`, `pages/uses.js` but removed from `package.json` in commit `dab22143`. Delete the `<Analytics />` usages (handled in Phase 1).
- `prop-types` — `import PropTypes from 'prop-types'` in `spotifyBio.js`, not installed and never used. Delete the import (handled in Phase 1).
- `socket.io` / `socket.io-client` / `next-remote-watch` — only supports an MDX hot-reload dev script; Next built-in HMR covers MDX now.

### Stale / upgradeable

- `next 12.1.4` — EOL. Upgrade to 14+ unlocks App Router + RSC + `optimizePackageImports`.
- `react 17.0.2` — tied to Next 12. Move to React 18+ with Next upgrade.
- `framer-motion ^6` — uses deprecated `exitBeforeEnter` (6 occurrences) — now `mode="wait"`. Upgrade to 11.x.
- `next-themes` with `defaultTheme="dark"` but only 7 `dark:` variants exist — light mode effectively unused. Either commit to dark-only or flesh out light mode.

### Keep

`@headlessui/react`, `@tailwindcss/forms`, `@tailwindcss/typography`, `react-icons`, the remark/rehype/mdx-bundler stack, `sharp`, `github-slugger`, `reading-time`, `gray-matter`, `image-size`.

## 3. Architecture Issues

### Dead or duplicated code

- `components/atoms/Container.js` — exported but never imported.
- `components/molecules/Card.js` — never imported.
- `components/analytics/GoogleAnalytics.js` — never imported (`_app.js` inlines GA).
- `.card` class in `css/prism.css` — used only by `ProjectCard.js`; belongs with the component.
- `components/purdue/scoreboard/Scoreboard.js` and `components/live-game/scoreboardLive/scoreboardLive.js` are near-duplicates. Extract one `<Scoreboard variant="compact|live" />`.

### Atomic design is inconsistent

- `components/{atoms,molecules}` exists, but `Footer.js`, `LayoutWrapper.js`, `SectionContainer.js`, `MDXComponents.js` live at the root. Either commit fully (move into `organisms/` / `templates/`) or flatten.
- `components/framer-motion/AnimatedDiv.js` — folder named after a library; rename (e.g., `components/atoms/FadeIn.js`).

### Misleading directives

- `'use client'` appears at the top of several files in a Next 12 pages-router app — it's a no-op and misleads readers. Remove.

### CSS anti-patterns

- `Scoreboard.module.css` uses absolute positioning with hardcoded pixel offsets (`left: 115px`, `top: 77px`).
- `ProjectCard.js` renders the image block twice (desktop hidden + mobile hidden) — collapse into one element with responsive classes.
- `tailwind.config.js` has `experimental.optimizeUniversalDefaults` (legacy experimental flag) and an invalid `border.root` theme key.

### Tooling gaps

- No `cn()` / `clsx` helper — class concatenation done via template strings.
- No TypeScript (`jsconfig.json` only). Largest scalability win if the site grows.
- `prettier-plugin-tailwindcss` installed but no class-order lint enforced in CI.

## 4. Consolidation Plan — 4 Phases

### Phase 1 — unblock & clean (low risk) — ✅ DONE

1. Remove broken imports: `prop-types` in `spotifyBio.js`.
2. Remove all `@vercel/analytics` usages from `pages/index.js`, `pages/blog.js`, `pages/uses.js`.
3. Delete dead code:
   - `components/atoms/Container.js`
   - `components/molecules/Card.js`
   - `components/analytics/GoogleAnalytics.js`
   - `.card` rule in `css/prism.css` (inline it on `ProjectCard`)
4. Remove the `preact` alias in `next.config.js`.
5. Strip the no-op `'use client'` directives from pages-router files.

### Phase 2 — CSS-Module → Tailwind migration — ✅ DONE

**Outcome:** all 9 `.module.css` files deleted; components rewritten with Tailwind utility classes. Custom keyframes (`blinker`, `equalizer`, `marquee`) added to `tailwind.config.js`. MUI Tabs in `leaders.js` replaced with Headless UI `<Tab.Group>` using the `{ selected }` render-prop API (no extra plugin required).

**Follow-up flagged (outside Phase 2 scope):** `HeroPortrait.js` triggers a Next 12 / Node 20 squoosh WASM fetch error because of `placeholder="blur"` on a local `.webp` import. Resolve by dropping the `placeholder="blur"` prop, swapping to PNG/JPG, or upgrading Next (see Phase 4).

### Phase 2 (original notes)

For each of the 9 `.module.css` files, translate rules to Tailwind classes on the JSX, using existing theme tokens where they apply:

- `#171717` → `bg-themeColor` (or `bg-customDark`)
- `rgb(64,64,64)` border → `border border-neutral-700`
- `border-radius: 16px` → `rounded-2xl`
- shadow stack → `shadow-normal` (already in config)
- animations (`pulse`, `blinker`, `equalizer`, `marquee`) → move keyframes into `tailwind.config.js` under `theme.extend.keyframes/animation` and use `animate-pulse` (native) / custom names.

Special cases:

- `leaders.module.css` + `leaders.js` — replace MUI Tabs with Headless UI `<Tab.Group>` (already installed) + Tailwind.
- `live-game.module.css` — delete entirely once `AgGridReact` is replaced (or wrap the grid in a Tailwind `div` with utility classes).

### Phase 3 — package pruning — ✅ DONE

**Removed from dependencies:** `@mui/material`, `@emotion/react`, `@emotion/styled`, `@tailwindcss/aspect-ratio`, `smoothscroll-polyfill`, `ag-grid-community`, `ag-grid-react`, `preact`.

**Removed from devDependencies:** `next-remote-watch`, `socket.io`, `socket.io-client`.

**Supporting code changes:**

- `components/atoms/ScrollTop.js` — removed `smoothscroll-polyfill` import; native `scroll-behavior: smooth` is enough.
- `pages/live-game.js` — replaced `AgGridReact` with a semantic `<table>` styled via Tailwind.
- `lib/purdue/live-game.js` — removed unused `getColumnDefs` helper (ag-grid-specific).
- `components/ClientReload.js` (deleted) + `scripts/next-remote-watch.js` (deleted) + `_app.js` no longer imports `ClientReload` / `process.env.SOCKET`.
- `package.json` — removed the custom `start: cross-env SOCKET=true node ./scripts/next-remote-watch.js ./data` script; `start` is now the standard `next start`.
- `tailwind.config.js` — removed `experimental.optimizeUniversalDefaults`, the `aspectRatio` + `border.root` extend entries, and the `@tailwindcss/aspect-ratio` plugin.

**Result:** `npm install` removed 113 transitive packages; lint passes.

### Phase 3 (original notes)

Drop: `@mui/material`, `@emotion/react`, `@emotion/styled`, `@tailwindcss/aspect-ratio`, `smoothscroll-polyfill`, `ag-grid-community`, `ag-grid-react`, `socket.io`, `socket.io-client`, `next-remote-watch`, `prop-types`. Delete the corresponding `tailwind.config.js` plugin and `aspectRatio` entry.

### Phase 4 — structural polish — ✅ PARTIAL (subset done)

**Completed in this session:**

- **HeroPortrait blocker fixed.** `components/molecules/HeroPortrait.js` no longer statically imports the `.webp` (which triggered Next 12's squoosh WASM fetch bug on Node 20). Switched to a string `src="/static/images/me.webp"` + `priority`. `npx next build` now succeeds cleanly.
- **`cn()` helper added** at `lib/utils/cn.js` — minimal inline implementation (no extra packages). Ready to adopt incrementally.
- **Dark-only commit.** Removed `next-themes` from dependencies, dropped `ThemeProvider` from `pages/_app.js`, and hardcoded `class="dark"` on `<html>` in `pages/_document.js`. Removed the obsolete `theme` field from `data/siteMetadata.js`. The 7 `dark:` variants scattered through the codebase now always apply (no functional change).
- **Dead export cleanup.** `lib/purdue/index.js` no longer re-exports the removed `getColumnDefs` helper.

**Deferred (still on the table):**

- Upgrade to Next 14 + React 18 — separate PR recommended; would unlock `experimental.optimizePackageImports` and fix the squoosh/Node-20 family of bugs at the source.
- Promote atomic design consistently (move `Footer.js`, `LayoutWrapper.js`, `SectionContainer.js`, `MDXComponents.js` into `organisms/` / `templates/`, or flatten `components/framer-motion/` into `atoms/`).
- Consider swapping the ad-hoc `cn()` for `clsx + tailwind-merge` once class composition becomes more complex.
- Replace `framer-motion` v6's deprecated `exitBeforeEnter` with `mode="wait"` in the 6 call sites, and bump to v11.

### Phase 4 (original notes, optional)

- Add `lib/utils/cn.js` (`clsx + tailwind-merge`) and route class composition through it.
- Decide on light-or-dark-only; trim `next-themes` + dual `typography` config accordingly.
- Upgrade to Next 14 + React 18 in a separate PR; enable `experimental.optimizePackageImports` for `react-icons`, `@headlessui/react`, `framer-motion`.
- Promote atomic design consistently (or flatten it).

## 5. Estimated Impact

- **Bundle**: removing MUI/emotion/ag-grid/smoothscroll/preact-alias ≈ **~550–700 KB gzip** off the client.
- **Styling surface**: ~500 lines of CSS-module CSS deleted, ~15 duplicated tokens consolidated into the Tailwind theme.
- **Maintainability**: one styling primitive (Tailwind + design tokens) instead of five; removes the MUI/emotion/CSS-module branch of the dependency tree entirely.
