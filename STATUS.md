# Dashboard Rewrite — Status

## Текущий статус: Все исправления выполнены ✅ (Phase 6) + Compare View v2 реализован, прошёл ручной проход (2026-09-01)

## Compare View v2 (2026-09-01) — multi-branch charts + snapshot (dots/bars/table), legacy таблица удалена

Полная замена v1. Режим Compare (`?view=compare`): карты time-series по выбранным конфигам (линии = ветки, group-remap в общий `createChart`) + snapshot-блок (медиана последних N на (конфиг, метрика, ветка), Δ% против base, три вида Dots/Bars/Table с тоглом) + чипы веток/конфигов + режим-зависимый `?`-диалог. URL: `?view=compare&branches=<csv>&configs=<csv>&op=&days=&n=&snap=` (порядок branches = base первым; legacy `?b1=&b2=` мигрирует).

| Что | Где | Статус |
|-----|-----|--------|
| Дизайн (2026-09-01, одобрен пользователем) | `COMPARE-V2-DESIGN.md` | ✅ |
| План (7 задач, subagent-driven) | `COMPARE-V2-PLAN.md` | ✅ |
| Код (`types.ts`, `compare.ts`, `main.ts`, `styles.css`) | `src/dashboard/` | ✅ (коммиты `aaca5ea81..c3dcafdd8`) |
| Python/CI/зависимости | — | без изменений |
| Ручной проход живого UI | — | ✅ пройден 2026-09-01 |
| Удаление legacy v1 (код/типы/стили) | `compare.ts`, `types.ts`, `styles.css` | ✅ |
| Верификация `npm run typecheck && npm run build` | — | ✅ pass |

**Вердикт:** см. `COMPARE-V2-DESIGN.md` / `COMPARE-V2-PLAN.md`. Отложенные минорные правки — ledger в `.superpowers/sdd/COMPARE-V2-PLAN/progress.md`.

---

## Compare View v1 (2026-08-24) — реализовано, закоммичено в 3728462fe

Задача: head-to-head сравнение двух веток (медиана последних N точек на (конфиг, метрика), Δ% с цветом, inline-бары). Mode-toggle в существующем SPA, без изменений в Python/CI.

| Что | Файлы | Статус |
|-----|-------|--------|
| Дизайн | `PLAN.md` (секция Compare View) | ✅ |
| План реализации | `COMPARE-PLAN.md` | ✅ |
| Типы (ViewMode, MetricSpec, CompareRow, CompareSort) | `src/dashboard/types.ts` | ✅ |
| Pure-логика (computeMedian, lastN, computeCompareRows, sortRows, renderCompareTable) | `src/dashboard/compare.ts` (новый) | ✅ |
| Интеграция (viewMode, URL, тогл, render-диспетчер, compare-controls, биндинги, defaultCompareBranch) | `src/dashboard/main.ts` | ✅ |
| Стили (.mode-toggle, .compare-controls, .compare-table, .compare-bar, .delta) | `src/dashboard/styles.css` | ✅ |
| Верификация: `npm run typecheck && npm run build` | — | ✅ pass |
| Реген `data.json` (`python3 tools/data-processor 0`) | `docs/fio/librawstor/dashboard/data.json` | ✅ (13.8 MB, 20370 tests, coroutines включены) |

**Итог:** закоммичено в `3728462fe` («add compare view»). Позднее полностью заменено v2 (2026-09-01, см. выше) — v1-код, типы и стили удалены (COMPARE-V2-PLAN, Task 7).

**Сигнал из данных (perftest-ost-4k-1-1, последние значения):** coroutines медленнее main (IOPS read 14003 vs 15555; latency read 0.070 vs 0.063 ms). В compare-view строки будут с красной Δ. В дашборде видна медиана последних N.

**Отклонения от плана (безопасные):** about-диалог вынесен в общий `renderAboutDialog` (вместо дублирования); в `render()` добавлен teardown чартов (RAF/zoom) при переключении режима; Refresh-хендлер вызывает `render()` вместо `buildCharts()` напрямую.

---

## Phase 6: review-results.md remediation (завершена)

Источник: `review-results.md` (ревью 2026-08-09).

| # | Severity | Что | Файлы | Статус |
|---|----------|-----|-------|--------|
| C1 | CRITICAL | `rawstor-bench-compile` selective clean (preserve dashboard/, index.md) | `tools/rawstor-bench-compile` | ✅ |
| C2 | CRITICAL | PEP 701 f-strings → Python 3.9-compatible | `tools/rawstor-bench-compile` | ✅ |
| H1 | HIGH | Hidden dots `pointer-events:none` (init + updateVisibility) | `src/dashboard/charts.ts` | ✅ |
| H2 | HIGH | Generation token — race-safe Refresh + control changes | `src/dashboard/main.ts` | ✅ |
| H3 | HIGH | URL params validation: `days` against `{2,7,15,30,90,365,0}`, branch normalized | `src/dashboard/main.ts` | ✅ |
| H4 | HIGH | `formatYAxis` latency ≥1000 → seconds (matches tooltip) | `src/dashboard/utils.ts` | ✅ |
| H5 | HIGH | Atomic import (`*.tmp` + `os.replace`, `.meta` last) | `tools/rawstor-bench-import` | ✅ |
| H6 | HIGH | Path-traversal guards (regex + resolve-in-prefix) + commit stem check | `tools/rawstor-bench-import` | ✅ |
| H7 | HIGH | `days=0` → cutoff=None, `filter.cutoff_date=None`, `applied=False` | `tools/data-processor` | ✅ |
| H8 | HIGH | CI fail-fast: `test -f data.json` instead of `ls || echo` | `.github/workflows/deploy.yaml` | ✅ |
| H9 | HIGH | Per-iteration try/except + `.get()` defaults in compile | `tools/rawstor-bench-compile` | ✅ |
| M1 | MEDIUM | REQUIREMENTS drift (noise-фильтр) — synced spec to server-side always-on downsample | `docs/REQUIREMENTS.md` | ✅ |
| M2 | MEDIUM | CI push default 30d → `all` (= 0) | `.github/workflows/deploy.yaml` | ✅ |
| M3 | MEDIUM | `paths` filter: added `package-lock.json`, `scripts/**`, `.github/workflows/**` | `.github/workflows/deploy.yaml` | ✅ |
| M4 | MEDIUM | PR-only `validate` job (typecheck + build) | `.github/workflows/deploy.yaml` | ✅ |
| M5 | MEDIUM | Deleted unused `docs/_config.yml` (.nojekyll makes it inert) | `docs/_config.yml` | ✅ |
| M6 | MEDIUM | `git rm --cached` dashboard index.html + styles.css (build outputs) | git index | ✅ |
| M7 | MEDIUM | `dotDataMap` scoped per chart instance (inside `createChart`) | `src/dashboard/charts.ts` | ✅ |
| M8 | MEDIUM | `.chart-wrapper { touch-action: none }` | `src/dashboard/styles.css` | ✅ |
| M9 | MEDIUM | `clipId` module counter `clip-${CLIP_SEQ++}` (replaces `Math.random`) | `src/dashboard/charts.ts` | ✅ |
| M10 | MEDIUM | IOPS/latency units aligned: compile uses `iops`/lat→ms (matches data-processor) | `tools/rawstor-bench-compile` | ✅ |
| M11 | MEDIUM | `test_url`/`commit_sha` consistent: compile uses `meta_path.stem` | `tools/rawstor-bench-compile` | ✅ |
| M12 | MEDIUM | `try { history.replaceState }` (SecurityError on file://) | `src/dashboard/main.ts` | ✅ |
| M13 | MEDIUM | Refresh error banner placed below legend (not above spinner) | `src/dashboard/main.ts` | ✅ |
| M14 | MEDIUM | Single UTC policy: parse with tz, normalize to UTC, emit `Z` | `tools/data-processor` | ✅ |
| M15 | MEDIUM | AGENTS.md / PLAN.md: `ResizeObserver` references removed | `AGENTS.md`, `PLAN.md` | ✅ |
| M16 | MEDIUM | Pin GitHub Actions by SHA — **DEFERRED** (API rate-limited, no deploy-pages@v4 SHA) | `.github/workflows/deploy.yaml` | ⏸ tech-debt |
| M17 | MEDIUM | `setup-python@v4` → `@v5`; smoke-test `rawstor-bench-compile` job added | `.github/workflows/deploy.yaml` | ✅ |
| L1 | LOW | Dead `d3-error` lookup removed | `src/dashboard/main.ts` | ✅ |
| L2 | LOW | Helpers `asViewMode`/`asOperationFilter` used in `readUrlParams` (no inline dup) | `src/dashboard/main.ts` | ✅ |
| L3 | LOW | `hiddenGroups` cleared on view-mode switch | `src/dashboard/main.ts` | ✅ |
| L4 | LOW | `timeRangeDays === 0` ("All") no longer emits HH:MM | `src/dashboard/utils.ts`, `charts.ts` | ✅ |
| L5 | LOW | Tooltip branch uses `formatBranchName` (consistent cutter) | `src/dashboard/utils.ts` | ✅ |
| L7 | LOW | `updateChartsVisibility` uses `chart.data` (no `split(' - ')`) | `src/dashboard/main.ts` | ✅ |
| L8 | LOW | `ChartState.destroy()` cancels pending RAF + unbinds zoom | `src/dashboard/charts.ts`, `types.ts`, `main.ts` | ✅ |
| L9 | LOW | Removed duplicate `<title>` on SVG (kept `aria-label`) | `src/dashboard/charts.ts` | ✅ |
| L10 | LOW | `selectRadio` helper replaces synthetic `next.click()` | `src/dashboard/main.ts` | ✅ |
| L11 | LOW | Legend item keydown: only arrows (Space/Enter handled natively) | `src/dashboard/main.ts` | ✅ |
| L12 | LOW | `metas[:10]` → `REPO_TABLE_COMMIT_LIMIT` const | `tools/rawstor-bench-compile` | ✅ |
| L13 | LOW | Undated downsample asymmetry documented (no behavior change) | `tools/data-processor` | ✅ |
| L14 | LOW | Groups sorted by key (deterministic order) | `tools/data-processor` | ✅ |
| L15 | LOW | `except Exception` split into I/O vs parse handlers | `tools/data-processor` | ✅ |
| L16 | LOW | days=0 fallback — handled by H7 (`cutoff_date=None` consistently) | `tools/data-processor` | ✅ |
| L17 | LOW | `load_meta` validates `data.{txt,json}` block | `tools/rawstor-bench-compile` | ✅ |
| L18 | LOW | `.gitignore`: `tools/__pycache__/` + `*.pyc` + `bundle.js.map` | `.gitignore` | ✅ |
| L19 | LOW | `engines.node` added | `package.json` | ✅ (noUnusedLocals deferred) |
| L20 | LOW | esbuild emits `bundle.js.map` (external sourcemap) | `scripts/build.js`, `.gitignore` | ✅ |

---

## Previous phases (1–5)

---

## Фаза 1: Rewrite (завершена)

| Step | Файл | Статус |
|------|------|--------|
| 1. Scaffold | `package.json`, `tsconfig.json`, `.gitignore`, `scripts/build.js` | ✅ |
| 2. types.ts | `src/dashboard/types.ts` | ✅ |
| 3. utils.ts | `src/dashboard/utils.ts` | ✅ |
| 4. data-loader.ts | `src/dashboard/data-loader.ts` | ✅ |
| 5. charts.ts | `src/dashboard/charts.ts` | ✅ |
| 6. main.ts | `src/dashboard/main.ts` | ✅ |
| 7. index.html | `src/dashboard/index.html` | ✅ |
| 8. styles.css | `src/dashboard/styles.css` | ✅ |
| 9. CI | `.github/workflows/deploy.yaml` | ✅ |
| 10. Удаление | `app.js`, `charts.js`, `data-loader.js`, `utils.js` | ✅ |
| 11. Тестирование | data-processor + build | ✅ |
| 12. .gitignore | `docs/.../bundle.js`, `index.html`, `styles.css` | ✅ |

## Фаза 2: Ревью и исправления (завершена)

### Critical / Major исправления

| Step | Что | Описание | Статус |
|------|-----|----------|--------|
| 13. Даунсемплинг | `tools/data-processor` | data.json 55 МБ → 3.9 МБ. 1 точка/день/группа. | ✅ |
| 14. XSS fix | `utils.ts`, `main.ts` | textContent + escapeHtml + Tooltip class. | ✅ |
| 15. CI typecheck | `deploy.yaml` | typecheck + paths + cancel-in-progress: true. | ✅ |
| 16. Константы | `types.ts`, `main.ts` | CHART_KEYS из types.ts. | ✅ |
| 17. AbortController | `data-loader.ts`, `main.ts` | Отмена fetch + спиннер. | ✅ |
| 18. Summary | `main.ts` | extractMeta() → data.summary. Exact match для main. | ✅ |
| 19. test_url | `charts.ts`, `data-processor` | buildTestUrl() → test_url из данных. | ✅ |
| 20. URL params | `main.ts` | Валидация viewMode/operation. | ✅ |

### Архитектурные улучшения

| Step | Что | Описание | Статус |
|------|-----|----------|--------|
| 21. Разбить charts.ts | `charts.ts` | processData, createScales, drawGrid, drawAxes. | ✅ |
| 22. Tooltip класс | `utils.ts` | Tooltip class (убраны legacy free functions). | ✅ |
| 23. ResizeObserver | `main.ts` | Debounced пересоздание графиков. | ✅ |
| 24. Redraw оптимизация | `charts.ts` | Pre-sorted sortedByGroup. | ✅ |

---

## Фаза 3: Business + Arch review fixes (завершена)

| # | Что | Файлы | Статус |
|---|-----|-------|--------|
| 1 | Loading-индикатор (spinner) | `index.html`, `styles.css` | ✅ |
| 2 | Лимит веток до 32 по дате | `tools/data-processor`, `types.ts`, `main.ts` | ✅ |
| 3 | Легенда: "Branches" в branch-режиме | `main.ts` | ✅ |
| 4 | Retry-кнопка при ошибке | `main.ts`, `styles.css` | ✅ |
| 5 | Пояснение конфигураций тестов (?) | `main.ts`, `styles.css` | ✅ |
| 6 | Fallback D3 CDN + SRI | `index.html` | ✅ |
| 7 | Info-бар: дата, view mode, filtered count | `main.ts` | ✅ |
| 8 | Убраны legacy tooltip functions | `utils.ts`, `charts.ts` | ✅ |
| 9 | Unsafe casts → runtime guards | `types.ts`, `main.ts`, `charts.ts`, `utils.ts` | ✅ |
| 10 | SRI для CDN D3 | `index.html` | ✅ |
| 11 | Убрано дублирование в processData | `charts.ts` | ✅ |
| 12 | Show All / Hide All в легенде | `main.ts`, `styles.css` | ✅ |
| 13 | Sticky controls bar | `styles.css` | ✅ |
| 14 | Контраст text-muted → #666 | `styles.css` | ✅ |

### Minor исправления

| # | Что | Описание | Статус |
|---|-----|----------|--------|
| m-2 | querySelector CSS ID | Передаём контейнер напрямую в d3.select(). | ✅ |
| m-4 | OperationStyle тип | Record\<string\> → Record\<'read'\|'write'\>. | ✅ |
| m-5 | validate() глубокий | Валидация filter, summary, point полей (commit_sha, branch, config, test_url). | ✅ |
| m-6 | D3 zoom as any | Убраны `as any` для scaleBy/transform. | ✅ |
| m-7 | eslint-disable Map | Типизированы LineSelection, DotSelection. | ✅ |
| m-8 | build.js ESM | CJS → ESM + `"type": "module"` в package.json. | ✅ |
| m-10 | getVisibleGroups() | Мёртвый код удалён, инлайн `new Set(this.allGroups)`. | ✅ |
| m-11 | groupColorMap | Мерж цветов вместо перезаписи. | ✅ |
| — | computeVisibleGroups | hiddenGroups Set вместо DOM итерации. | ✅ |
| — | Branch filter | Фильтрация каждого массива отдельно вместо конкатенации. | ✅ |
| — | cancel-in-progress | false → true в deploy.yaml. | ✅ |
| — | formatBranchName | replace → regex. | ✅ |
| — | processData dedup | base object + spread вместо дублирования 7 полей. | ✅ |
| — | getOperationStyle | string → 'read' \| 'write' в сигнатуре. | ✅ |
| — | D3 callbacks | Типизированы mouseenter/click/attr лямбды. | ✅ |
| — | text-muted контраст | #888 → #666 (WCAG AA 4.5:1+). | ✅ |

---

## Фаза 4: Post-review fixes (завершена)

| # | Severity | Что | Файлы | Статус |
|---|----------|-----|-------|--------|
| C1 | CRITICAL | Tooltip lazy init (el=null при import) | `utils.ts` | ✅ |
| C2 | CRITICAL | processData: operation field из data-processor | `data-processor`, `types.ts`, `charts.ts` | ✅ |
| C3 | CRITICAL | Import map для D3 (ESM bare specifier) | `index.html` | ✅ |
| H1 | HIGH | CSS.escape для group names | `main.ts` | ✅ |
| H2 | HIGH | window.open validation + noopener | `charts.ts` | ✅ |
| H3 | HIGH | destroy() — ResizeObserver leak | `main.ts` | ✅ |
| H4 | HIGH | Grid data join (не destroy/recreate) | `charts.ts` | ✅ |
| H5 | HIGH | Zoom cleanup при rebuild | `charts.ts` | ✅ |
| M1 | MEDIUM | Legend keyboard accessible (button + role=checkbox) | `main.ts`, `styles.css` | ✅ |
| M2 | MEDIUM | Toggle buttons aria-pressed | `main.ts` | ✅ |
| M3 | MEDIUM | Focus ring contrast (outline вместо box-shadow) | `styles.css` | ✅ |
| M4 | MEDIUM | About button aria-label | `main.ts` | ✅ |
| M5 | MEDIUM | aria-live для #app | `index.html` | ✅ |
| M6 | MEDIUM | D3 timeout flash fix (banner append) | `index.html`, `main.ts` | ✅ |
| M7 | MEDIUM | Refresh error toast (не замена app) | `main.ts` | ✅ |
| M8 | MEDIUM | CI: env var вместо unquoted | `deploy.yaml` | ✅ |
| M9 | MEDIUM | ChartState types: null → SVGGElement | `types.ts`, `charts.ts` | ✅ |
| M10 | MEDIUM | Non-null assertion → optional chaining | `charts.ts` | ✅ |
| — | HIGH | Visibility check: includes('0') → strict === | `charts.ts` | ✅ |

---

## Фаза 5: Final-review fixes (завершена)

| # | Severity | Что | Файлы | Статус |
|---|----------|-----|-------|--------|
| H3 | HIGH | D3 double-load: убран глобальный `<script src>` + fallback | `index.html` | ✅ |
| M1 | MEDIUM | Event delegation для dots (один listener на `<g class="dots">`) | `charts.ts` | ✅ |
| M2 | MEDIUM | ResizeObserver удалён (SVG viewBox responsive) | `main.ts` | ✅ |
| M4 | MEDIUM | Zoom buttons: aria-label | `charts.ts` | ✅ |
| M5 | MEDIUM | `:focus-visible` стили для всех interactive элементов | `styles.css` | ✅ |
| M6 | MEDIUM | Dead CSS `.grid-x line` → `.grid-x-line, .grid-y-line` | `styles.css` | ✅ |
| L1 | LOW | Tooltip: innerHTML вместо 6× createElement (с escapeHtml) | `utils.ts` | ✅ |
| L2 | LOW | Убран лишний populateBranchSelector() вызов в init() | `main.ts` | ✅ |
| — | — | aria-live перенесён с #app (too noisy) | `index.html` | ✅ |

---

## Проверка

- `npm run typecheck` → passes
- `npm run build` → passes
- D3 loaded from CDN, marked `external` in esbuild
- `bundle.js` generated
- `data.json` — даунсемплинг + лимит веток до 32 последних

## Ключевые решения

- **Stack:** TypeScript + D3.js 7.x (CDN) + esbuild
- **Detail View:** клик → `test_url` из данных → `.md` страница
- **D3:** CDN + import map (ESM bare specifier), без глобального `<script>` тега
- **Noise filter:** ≥7д — последний запуск за день
- **Zoom:** колёсико + кнопки (+, −, Reset)
- **data.json:** даунсемплинг 1 точка/день/группа + лимит веток 32
- **Tooltip:** Tooltip class с lazy-init + innerHTML (escapeHtml для XSS safety)
- **AbortController:** отмена fetch + спиннер
- **Dots:** Event delegation на `<g class="dots">` вместо per-circle listeners
- **build.js:** ESM (`"type": "module"`)
- **CI:** typecheck → build, cancel-in-progress: true
- **Loading:** HTML skeleton → replace on render
- **Legend:** Show All / Hide All + динамический заголовок
- **About:** ? иконка + dialog с расшифровкой конфигураций
- **Type safety:** runtime guards для ViewMode/OperationFilter

## Файлы проекта

```
src/dashboard/
  types.ts          — интерфейсы + CHART_KEYS + runtime guards + operation field
  utils.ts          — escapeHtml, Tooltip class (lazy-init), палитра 32цветов, форматеры
  data-loader.ts    — fetch data.json + validate (deep + operation) + AbortSignal
  charts.ts         — D3: processData, createScales, drawGrid (data join), drawAxes, zoom, event delegation
  main.ts           — DashboardApp (destroy(), CSS.escape, aria-pressed, toast errors, legend keyboard, no ResizeObserver)
  index.html        — D3 CDN import map + loading skeleton + aria-live on error only
  styles.css        — стили + sticky controls + legend button reset + focus ring
scripts/
  build.js          — ESM, esbuild (d3 external) + копия html/css
tools/
  data-processor    — data.json генератор (даунсемплинг + лимит веток 32 + operation field)
docs/fio/librawstor/dashboard/
  bundle.js, index.html, styles.css — генерируются
  data.json         — генерируется data-processor (CI)
.github/workflows/
  deploy.yaml       — CI: Python → data-processor → Node.js → typecheck → build → deploy
```
