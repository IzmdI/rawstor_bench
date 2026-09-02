# rawstor_bench

Benchmark data repository for [rawstor/librawstor](https://github.com/rawstor/librawstor). Stores fio test results and publishes them as a GitHub Pages dashboard. This is a data + docs repo — there is no application code, no test suite, and no build/lint/typecheck toolchain.

## Structure

- `data/fio/<repo>/<test-name>/<sha-prefix>/<commit>.{json,txt,meta}` — raw benchmark results. Each result is a triplet of fio JSON, fio text output, and a `.meta` sidecar (commit, branch, date, repo, test name).
- `tools/` — Python 3.9+ CLI scripts (no pip dependencies, stdlib only):
  - `rawstor-bench-import` — imports a new fio result into `data/`
  - `rawstor-bench-compile` — regenerates markdown summary tables under `docs/fio/` from `data/`
  - `data-processor` — generates `docs/fio/librawstor/dashboard/data.json` for the web dashboard
- `docs/` — GitHub Pages site (static; `.nojekyll` disables Jekyll processing). Dashboard at `docs/fio/librawstor/dashboard/`.

## Workflow

1. **Import result**: `tools/rawstor-bench-import --prefix . --repo <repo> --name <test> --branch <branch> --commit <sha> --date <iso-date> fio <txt> <json>`
2. **Rebuild docs**: `tools/rawstor-bench-compile --prefix . fio`
3. **Regenerate dashboard data**: `tools/data-processor <days>` (pass `0` for all data)
4. **Dashboard build check** (before push): `npm run typecheck && npm run build`
5. Push to `main` — CI auto-deploys to GitHub Pages.

## Pre-push checklist

**Before every push that touches `src/dashboard/**`, `package.json`, `tsconfig.json`, or `scripts/build.js`:**

```bash
npm run typecheck && npm run build
```

CI runs this in deploy.yaml, but failing at CI is slow feedback. Run locally first.

## Gotchas

- Tools are standalone Python scripts, not installed via any package manager. Run them directly with `python3 tools/<script>`.
- `rawstor-bench-compile` regenerates the markdown summary tables in `docs/fio/`. It selectively cleans previously compiled `.md` files and test-name subdirectories, always preserving the `dashboard/` subdirectory and hand-maintained `index.md` files. Don't hand-edit generated markdown.
- `data-processor` filters results by a time window. Pass `0` (or no arg) to include all available data, in which case `filter.applied` is `false` and `cutoff_date` is `null`.
- `.nojekyll` disables Jekyll processing for the Pages build; there is no `_config.yml`.
- D3.js + TypeScript: `Selection.append()` widens parent type to `HTMLElement` through method chains. Use `as unknown as d3.Selection<..., SVGGElement, ...>` cast when TypeScript infers wrong parent type.

## Dashboard Rewrite (completed)

The dashboard at `docs/fio/librawstor/dashboard/` has been rewritten from scratch.

**Plan and task list:** See `PLAN.md` and `STATUS.md` in the repo root. Requirements in `docs/REQUIREMENTS.md`.

**Key decisions:**
- Full rewrite — delete all existing JS, write from scratch
- Stack: TypeScript + D3.js 7.x (CDN), bundled with esbuild
- `styles.css` — rewritten from scratch
- `index.html` — rewritten from scratch
- Detail View: redirect to existing `.md` pages (not a new UI)
- data.json downsampling: 1 point/day/group in data-processor (Python)
- Tooltip: `Tooltip` class with cached DOM element
- AbortController for fetch race condition prevention
- Generation token to make Refresh / control-change fetches race-safe
- SVG `viewBox` responsive (no ResizeObserver)

**Source:** `src/dashboard/` — TypeScript modules (`main.ts`, `charts.ts`, `compare.ts`, `types.ts`, `utils.ts`, `data-loader.ts`, `index.html`, `styles.css`)
**Build:** `esbuild` → single `bundle.js` → output to `docs/fio/librawstor/dashboard/`
**CI:** deploy.yaml: Python → data-processor → Node.js → typecheck → build → deploy
**Status:** All critical/major/P2/minor fixes done. See `STATUS.md`.

## Compare View v2 (completed)

Multi-branch comparison mode behind the mode toggle in the same SPA (`?view=compare`), computed client-side from the existing `data.json` (no Python/CI change, no new dependencies). Per selected config it renders a time-series card (IOPS + Latency side by side; lines = branches via group-remap into the shared `createChart`; clicking a branch chip toggles its line), plus a snapshot block: median of last N runs per (config, metric, branch) with Δ% vs the base branch, in three switchable views (Dots / Bars / Table). Branch chips (first = base, with search + base switch) and config chips, operation toggle (Read/Write/Both), Time Range, N. The `?` help dialog is mode-dependent (compare-specific text).

URL: `?view=compare&branches=<csv>&configs=<csv>&op=<read|write|both>&days=<2|7|15|30|90|365|0>&n=<1-50>&snap=<dots|bars|table>` — `branches` order = base first; legacy v1 URLs (`?b1=&b2=`) migrate automatically.

- **Design / plan:** `COMPARE-V2-DESIGN.md`, `COMPARE-V2-PLAN.md` (7 tasks, subagent-driven; commits `aaca5ea81..c3dcafdd8`). Deferred minor items: `.superpowers/sdd/COMPARE-V2-PLAN/progress.md`.
- **Code:** `src/dashboard/` — `compare.ts` (snapshot computation, renderers, controls), `main.ts` (compare state/URL/rendering), `types.ts`, `styles.css`.
- **Removed:** the v1 two-branch compare table (code, types, styles) — fully superseded by the snapshot block. Manual walkthrough of the live UI passed 2026-09-01.
- **Local preview:** `python3 -m http.server 8000 --directory docs/fio/librawstor/dashboard` → `http://localhost:8000/?view=compare`
