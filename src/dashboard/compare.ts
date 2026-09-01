import type {
  ChartDataPoint, DashboardData, CompareRow, CompareSort, MetricType,
  SnapshotSection, SnapshotRow, SnapshotCell,
} from './types';
import { METRIC_SPECS } from './types';
import { stripBranchPrefix, escapeHtml, formatMetricValue } from './utils';

// ---- Pure helpers ----

/** Median of a numeric array (avg of two middle for even length). 0 if empty. */
export function computeMedian(values: number[]): number {
  if (!values.length) return 0;
  const s = [...values].sort((a, b) => a - b);
  const mid = Math.floor(s.length / 2);
  return s.length % 2 ? s[mid] : (s[mid - 1] + s[mid]) / 2;
}

/** Most-recent N points by timestamp (desc). At least 1 if input non-empty. */
export function lastN(points: ChartDataPoint[], n: number): ChartDataPoint[] {
  return [...points]
    .sort((a, b) => (a.timestamp < b.timestamp ? 1 : a.timestamp > b.timestamp ? -1 : 0))
    .slice(0, Math.max(1, n));
}

/** Snapshot sections for the compare view: per (config, metric) medians of the
 *  last n points per branch, with delta vs branches[0] (base). A metric row is
 *  included only when the base branch has a non-zero median for it; a section
 *  only when it has at least one such row. Returns [] for < 2 branches. */
export function computeSnapshotSections(
  data: DashboardData,
  branches: string[],
  configs: string[],
  n: number,
): SnapshotSection[] {
  if (branches.length < 2) return [];
  const sections: SnapshotSection[] = [];

  for (const config of configs) {
    const rows: SnapshotRow[] = [];

    for (const spec of METRIC_SPECS) {
      const points = data.charts[spec.chartKey] ?? [];
      const medians: (number | null)[] = [];
      const counts: number[] = [];

      for (const b of branches) {
        const pts = points.filter(p => p.config === config && stripBranchPrefix(p.branch) === b);
        const recent = lastN(pts, n);
        counts.push(recent.length);
        medians.push(recent.length ? computeMedian(recent.map(p => p.value)) : null);
      }

      const baseValue = medians[0];
      if (baseValue === null || baseValue === 0) continue; // base must have data

      const cells: SnapshotCell[] = branches.map((_, i) => {
        const v = medians[i];
        const deltaPct = v !== null ? ((v - baseValue) / baseValue) * 100 : null;
        const better = deltaPct === null ? null
          : spec.metricType === 'iops' ? deltaPct > 0 : deltaPct < 0;
        return { value: v, n: counts[i], deltaPct, better };
      });
      rows.push({
        metric: spec.key, metricType: spec.metricType,
        operation: spec.operation, label: spec.label, cells,
      });
    }

    if (rows.length) sections.push({ config, branches: [...branches], rows });
  }
  return sections;
}

/** Build one CompareRow per (config, metric) where BOTH branches have ≥1 point. */
export function computeCompareRows(
  data: DashboardData,
  b1: string,
  b2: string,
  n: number,
): CompareRow[] {
  if (b1 === b2) return [];
  const rows: CompareRow[] = [];
  for (const spec of METRIC_SPECS) {
    const points = data.charts[spec.chartKey] ?? [];
    const byCfg = new Map<string, { a: ChartDataPoint[]; b: ChartDataPoint[] }>();
    for (const p of points) {
      const cfg = p.config;
      const isA = stripBranchPrefix(p.branch) === b1;
      const isB = stripBranchPrefix(p.branch) === b2;
      if (!isA && !isB) continue;
      const entry = byCfg.get(cfg) ?? { a: [], b: [] };
      (isA ? entry.a : entry.b).push(p);
      byCfg.set(cfg, entry);
    }
    for (const [config, { a, b }] of byCfg) {
      if (!a.length || !b.length) continue;
      const aRecent = lastN(a, n);
      const bRecent = lastN(b, n);
      const aValue = computeMedian(aRecent.map(p => p.value));
      const bValue = computeMedian(bRecent.map(p => p.value));
      const deltaPct = aValue !== 0 ? ((bValue - aValue) / aValue) * 100 : null;
      const better = spec.metricType === 'iops' ? bValue > aValue : bValue < aValue;
      rows.push({
        config, metric: spec.key, metricType: spec.metricType, operation: spec.operation,
        a: { value: aValue, n: aRecent.length },
        b: { value: bValue, n: bRecent.length },
        deltaPct, better,
      });
    }
  }
  return rows;
}

/** Sort rows per chosen key. `delta` = improvements first by magnitude. */
export function sortRows(rows: CompareRow[], sort: CompareSort): CompareRow[] {
  const arr = [...rows];
  if (sort === 'cfg') {
    arr.sort((a, b) => a.config.localeCompare(b.config) || a.metric.localeCompare(b.metric));
  } else if (sort === 'delta') {
    arr.sort((a, b) => {
      const sa = (a.better ? 1 : -1) * Math.abs(a.deltaPct ?? 0);
      const sb = (b.better ? 1 : -1) * Math.abs(b.deltaPct ?? 0);
      return sb - sa;
    });
  } else { // abs
    arr.sort((a, b) => Math.abs(b.deltaPct ?? 0) - Math.abs(a.deltaPct ?? 0));
  }
  return arr;
}

// ---- Render ----

export interface CompareTableOpts {
  b1: string;   // short branch names for column headers
  b2: string;
  sort: CompareSort;
}

const METRIC_LABEL: Record<string, string> = Object.fromEntries(
  METRIC_SPECS.map(s => [s.key, s.label]),
);

/** Render the compare table into `container`. */
export function renderCompareTable(
  container: HTMLElement,
  rows: CompareRow[],
  opts: CompareTableOpts,
): void {
  container.innerHTML = '';
  container.className = 'compare-panel';

  if (!rows.length) {
    const p = document.createElement('p');
    p.className = 'no-data';
    p.textContent = 'No comparable configs for the selected branches';
    container.appendChild(p);
    return;
  }

  const sorted = sortRows(rows, opts.sort);
  const table = document.createElement('table');
  table.className = 'compare-table';

  const thead = document.createElement('thead');
  thead.innerHTML =
    `<tr><th>Config</th><th>Metric</th>` +
    `<th>${escapeHtml(opts.b1)}</th><th>${escapeHtml(opts.b2)}</th>` +
    `<th>Δ%</th><th>A vs B</th></tr>`;
  table.appendChild(thead);

  const tbody = document.createElement('tbody');
  let prevCfg = '';
  for (const r of sorted) {
    const tr = document.createElement('tr');

    const cfgTd = document.createElement('td');
    cfgTd.className = 'cfg';
    if (opts.sort === 'cfg' && r.config === prevCfg) {
      cfgTd.textContent = '';
      cfgTd.classList.add('cfg-blank');
    } else {
      cfgTd.textContent = r.config;
    }
    prevCfg = r.config;
    tr.appendChild(cfgTd);

    const metricTd = document.createElement('td');
    metricTd.className = 'metric';
    metricTd.textContent = METRIC_LABEL[r.metric] ?? r.metric;
    tr.appendChild(metricTd);

    tr.appendChild(makeValueCell(r.a.value, r.metricType));
    tr.appendChild(makeValueCell(r.b.value, r.metricType));

    const deltaTd = document.createElement('td');
    deltaTd.className = 'delta ' + (r.deltaPct === null ? 'delta-na' : (r.better ? 'delta-good' : 'delta-bad'));
    deltaTd.textContent = r.deltaPct === null ? '—' : (r.deltaPct >= 0 ? '+' : '') + r.deltaPct.toFixed(1) + '%';
    tr.appendChild(deltaTd);

    tr.appendChild(makeBarCell(r.a.value, r.b.value, r.better));
    tbody.appendChild(tr);
  }
  table.appendChild(tbody);
  container.appendChild(table);
}

function makeValueCell(value: number, metricType: MetricType): HTMLTableCellElement {
  const td = document.createElement('td');
  td.className = 'val';
  td.textContent = formatMetricValue(value, metricType);
  return td;
}

function makeBarCell(a: number, b: number, better: boolean): HTMLTableCellElement {
  const td = document.createElement('td');
  td.className = 'bar-cell';
  const max = Math.max(a, b, 1);
  const wrap = document.createElement('div');
  wrap.className = 'compare-bar';
  const aBar = document.createElement('div');
  aBar.className = 'compare-bar-a';
  aBar.style.width = (a / max * 100) + '%';
  const bBar = document.createElement('div');
  bBar.className = 'compare-bar-b ' + (better ? 'better' : 'worse');
  bBar.style.width = (b / max * 100) + '%';
  wrap.append(aBar, bBar);
  td.appendChild(wrap);
  return td;
}
