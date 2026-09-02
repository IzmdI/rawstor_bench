# Rawstor Benchmark Dashboard — Rewrite Plan

## Контекст проекта

**Репозиторий:** `rawstor_bench` — хранилище результатов fio-тестов библиотеки [rawstor/librawstor](https://github.com/rawstor/librawstor). Результаты публикуются как GitHub Pages дашборд.

**Дашборд:** `docs/fio/librawstor/dashboard/` — визуализация IOPS, Latency по конфигурациям и веткам.

**Требования:** `docs/REQUIREMENTS.md` — Functional requirements к дашборду.

**Статус:** Все фазы завершены. Post-review критические и��-priority баги исправлены. См. `STATUS.md`.

## Решения

| Решение | Выбор |
|---------|-------|
| Подход | Полный rewrite (удалить всё, писать с нуля) |
| Стек | TypeScript + D3.js 7.x (CDN) |
| Билдер | esbuild (быстрый bundle в один .js файл) |
| styles.css | Переписать с нуля |
| index.html | Переписать с нуля |
| Detail View | Редирект на существующие .md страницы |

## Архитектура

### Структура файлов

```
src/dashboard/
  main.ts             ← точка входа: DashboardApp
  types.ts            ← TypeScript интерфейсы + CHART_KEYS константы
  utils.ts            ← escapeHtml, Tooltip class, палитра, форматеры
  data-loader.ts      ← fetch data.json, валидация, AbortSignal
  charts.ts           ← D3 line chart (processData, createScales, drawGrid, drawAxes)
  styles.css          ← стили
  index.html          ← разметка
docs/fio/librawstor/dashboard/
  index.html          ← копируется из src/ при билде
  bundle.js           ← генерируется esbuild из src/dashboard/*.ts
  styles.css          ← копируется из src/ при билде
  data.json           ← генерируется data-processor (CI), даунсемплинг 1 точка/день/группа
```

### Модули и зависимости

```
types.ts       ← чистые интерфейсы + константы, без импортов
utils.ts       ← escapeHtml, Tooltip class, цвета, форматеры (импортирует types.ts)
data-loader.ts ← fetch + валидация + AbortSignal (импортирует types.ts)
charts.ts      ← D3 рендеринг: processData, createScales, drawGrid, drawAxes (импортирует types.ts, utils.ts)
main.ts        ← DashboardApp: state, URL params, controls, legend, AbortController, generation token (imports all)
```

### Ключевые интерфейсы (types.ts)

```typescript
interface ChartDataPoint {
  group: string;
  timestamp: string;
  value: number;
  commit_sha: string;
  branch: string;
  config: string;
  test_url: string;
  operation: 'read' | 'write';
}

interface DashboardData {
  generated_at: string;
  filter: { days: number; cutoff_date: string; applied: boolean };
  summary: DashboardSummary;
  charts: Record<string, ChartDataPoint[]>;
}

interface DashboardSummary {
  total_tests: number;
  tests_without_date: number;
  total_configurations: number;
  total_branches: number;
  configurations: string[];
  branches: string[];
  time_range: { start: string | null; end: string | null };
}

interface ProcessedPoint {
  group: string;
  timestamp: Date;
  value: number;
  commit_sha: string;
  branch: string;
  config: string;
  test_url: string;
  metric: string;
  operation: 'read' | 'write';
  fullGroup: string;
}

type ViewMode = 'config' | 'branch';
type OperationFilter = 'read' | 'write' | 'both';
type MetricType = 'iops' | 'latency';
```

## Инфраструктура

### Файлы

| Файл | Назначение |
|------|------------|
| `package.json` | `typescript`, `@types/d3`, `esbuild` |
| `tsconfig.json` | strict, ES2020, ESNext modules |
| `.gitignore` | `node_modules/`, `docs/.../bundle.js`, `docs/.../index.html`, `docs/.../styles.css` |
| `scripts/build.js` | tsc --noEmit && esbuild bundle + копия index.html + styles.css |

### CI (deploy.yaml)

```
Push to main → Checkout → Python 3.9 → data-processor → Node.js 20 → npm ci → npm run typecheck → npm run build → Upload ./docs → Deploy Pages
```

## Что удалено

| Файл | Строк | Причина |
|------|-------|---------|
| `app.js` | 760 | Заменяется на `main.ts` + `types.ts` |
| `charts.js` | 424 | Заменяется на `charts.ts` |
| `data-loader.js` | 262 | Заменяется на `data-loader.ts` |
| `utils.js` | 193 | Заменяется на `utils.ts` |

## Ключевые решения

- **D3 external:** esbuild не бандлит D3, загружается с CDN (`d3.min.js`) + import map
- **Noise filter:** при масштабе ≥7д — только последний запуск за день
- **Zoom:** колёсико мыши + кнопки (+, −, Reset)
- **data.json:** даунсемплинг 1 точка/день/группа + operation field (read/write)
- **Tooltip:** `Tooltip` class с lazy-init DOM
- **AbortController:** отмена предыдущего fetch + индикатор загрузки
- **Responsive:** SVG `viewBox` (без ResizeObserver — пересоздание графиков не требуется)
- **Type safety:** runtime guards + ChartState parent = SVGGElement + destroy() interface
- **Security:** CSS.escape, window.open validation (noopener,noreferrer), SRI
- **Accessibility:** aria-live, aria-pressed, aria-label, keyboard navigation

## Ссылки

- Требования: `docs/REQUIREMENTS.md`
- Compare v2: дизайн — `COMPARE-V2-DESIGN.md`, план — `COMPARE-V2-PLAN.md`
- CI: `.github/workflows/deploy.yaml`
- Дашборд: `docs/fio/librawstor/dashboard/`
- Data processor: `tools/data-processor`
- Статус: `STATUS.md`
- Код-ревью: `REVIEW.md`

---

# Compare View v2 — Multi-Branch Comparison

Дата дизайна: 2026-09-01 — `COMPARE-V2-DESIGN.md` (одобрен пользователем). План: `COMPARE-V2-PLAN.md` (7 задач, subagent-driven). Реализовано 2026-09-01 (коммиты `aaca5ea81..c3dcafdd8`), ручной проход живого UI пройден. Весь код в `src/dashboard/` (`types.ts`, `compare.ts`, `main.ts`, `styles.css`); Python/CI не менялись, новых зависимостей нет.

## Кратко о v2

- Режим Compare в том же SPA (`?view=compare`): выбор веток (первая = base, лимит `MAX_COMPARE_BRANCHES`) и конфигов через чипы с поиском; тогл операций, Time Range, N.
- Time-series: карта на каждый выбранный конфиг (IOPS + Latency), линии = ветки (group-remap в общий `createChart`); клик по чипу ветки скрывает/показывает линию.
- Snapshot: медиана последних N точек на (конфиг, метрика, ветка), Δ% против base; три вида — Dots / Bars / Table с тоглом.
- URL: `?view=compare&branches=<csv>&configs=<csv>&op=&days=&n=&snap=`; legacy v1 `?b1=&b2=` мигрирует автоматически.
- Режим-зависимый `?`-диалог справки.
- v1 (2026-08-24, коммит `3728462fe` — таблица A/B с сортировкой и inline-барами) полностью заменён; v1-код/типы/стили удалены.

Вердикт и детали: `COMPARE-V2-DESIGN.md` / `COMPARE-V2-PLAN.md`. Отложенные минорные правки — ledger в `.superpowers/sdd/COMPARE-V2-PLAN/progress.md`.
