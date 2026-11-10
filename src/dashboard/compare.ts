import { formatConfigLabel, renderConfigHeading } from './config-label';
import { createBranchPicker } from './branch-picker';
import type {
  ChartDataPoint, DashboardData, OperationFilter,
  SnapshotSection, SnapshotRow, SnapshotCell, SnapMode,
  CompareControlState, CompareControlHandlers,
} from './types';
import { METRIC_SPECS, asSnapMode, MAX_COMPARE_BRANCHES } from './types';
import { stripBranchPrefix, formatMetricValue, getColor } from './utils';

// ---- Pure helpers ----

/** Median of a numeric array (avg of two middle for even length). 0 if empty. */
export function computeMedian(values: number[]): number {
  if (!values.length) return 0;
  const s = [...values].sort((a, b) => a - b);
  const mid = Math.floor(s.length / 2);
  return s.length % 2 ? s[mid] : (s[mid - 1] + s[mid]) / 2;
}

/** Most-recent N dated points; undated measurements cannot be ordered. */
export function lastN(points: ChartDataPoint[], n: number): ChartDataPoint[] {
  return points
    .filter(p => Number.isFinite(Date.parse(p.timestamp)))
    .sort((a, b) => Date.parse(b.timestamp) - Date.parse(a.timestamp))
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
  operation: OperationFilter = 'both',
): SnapshotSection[] {
  if (branches.length < 2) return [];
  const sections: SnapshotSection[] = [];

  for (const config of configs) {
    const rows: SnapshotRow[] = [];

    for (const spec of METRIC_SPECS) {
      if (operation !== 'both' && spec.operation !== operation) continue;
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

// ---- DOM helpers (compare v2) ----

function el<K extends keyof HTMLElementTagNameMap>(tag: K, className?: string): HTMLElementTagNameMap[K] {
  const e = document.createElement(tag);
  if (className) e.className = className;
  return e;
}

function pct(value: number, max: number): string {
  return Math.max(0, Math.min(100, (value / max) * 100)) + '%';
}

function deltaText(c: SnapshotCell, isBase: boolean): string {
  if (isBase) return 'base';
  if (c.value === null) return '—';
  if (c.deltaPct === null) return '—';
  return (c.deltaPct >= 0 ? '+' : '') + c.deltaPct.toFixed(1) + '%';
}

function deltaClass(c: SnapshotCell): string {
  if (c.better === null || c.deltaPct === 0) return 'na';
  return c.better ? 'good' : 'bad';
}

export function renderCompareSummary(
  host: HTMLElement, sections: SnapshotSection[], branches: string[], n: number,
): void {
  host.replaceChildren();
  host.hidden = branches.length < 2;
  if (host.hidden) return;

  const heading = el('h2', 'compare-summary-title');
  heading.textContent = 'Comparison summary';
  const note = el('p', 'compare-summary-note');
  note.textContent = `Base: ${branches[0]} · Median of last ${n} daily points per branch`;
  host.append(heading, note);

  if (!sections.length) {
    const empty = el('p', 'compare-summary-note');
    empty.textContent = 'No comparable measurements for the current selection.';
    host.appendChild(empty);
    return;
  }

  const grid = el('div', 'compare-summary-grid');
  for (const section of sections) {
    const card = el('div', 'compare-summary-card');
    const title = el('h3', 'compare-summary-config');
    title.textContent = formatConfigLabel(section.config);
    title.title = section.config;
    card.appendChild(title);
    section.branches.slice(1).forEach((branch, index) => {
      const row = el('div', 'compare-summary-row');
      const name = el('strong', 'compare-summary-branch');
      name.textContent = branch;
      row.appendChild(name);
      for (const metric of section.rows) {
        const cell = metric.cells[index + 1];
        const badge = el('span', `compare-summary-delta snap-badge ${deltaClass(cell)}`);
        badge.textContent = `${metric.label} ${deltaText(cell, false)}`;
        row.appendChild(badge);
      }
      card.appendChild(row);
    });
    grid.appendChild(card);
  }
  host.appendChild(grid);
}

/** Radiogroup behavior: click + arrows/Home/End + roving tabindex (WCAG 2.1.1). */
function bindRadiogroup(
  buttons: HTMLButtonElement[],
  initial: number,
  onSelect: (btn: HTMLButtonElement) => void,
  signal?: AbortSignal,
): void {
  const select = (btn: HTMLButtonElement) => {
    buttons.forEach(b => {
      const active = b === btn;
      b.classList.toggle('active', active);
      b.setAttribute('aria-checked', String(active));
      b.setAttribute('tabindex', active ? '0' : '-1');
    });
    onSelect(btn);
  };
  buttons.forEach((btn, i) => {
    btn.setAttribute('role', 'radio');
    btn.setAttribute('aria-checked', String(i === initial));
    btn.setAttribute('tabindex', i === initial ? '0' : '-1');
    if (i === initial) btn.classList.add('active');
    btn.addEventListener('click', () => select(btn), { signal });
    btn.addEventListener('keydown', (e: KeyboardEvent) => {
      let next: HTMLButtonElement | null = null;
      if (e.key === 'ArrowRight' || e.key === 'ArrowDown') next = buttons[(i + 1) % buttons.length];
      else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') next = buttons[(i - 1 + buttons.length) % buttons.length];
      else if (e.key === 'Home') next = buttons[0];
      else if (e.key === 'End') next = buttons[buttons.length - 1];
      if (next) { e.preventDefault(); next.focus(); select(next); }
    }, { signal });
  });
}

// ---- Snapshot renderers (pure DOM, colors = getColor(branch index)) ----

function snapshotSectionHeader(config: string): HTMLElement {
  const h = el('h4', 'snapshot-config');
  renderConfigHeading(h, config);
  return h;
}

function renderSnapshotDots(container: HTMLElement, sections: SnapshotSection[]): void {
  for (const sec of sections) {
    const secEl = el('div', 'snapshot-section' + (sec.branches.length === 2 ? ' snapshot-pair' : ''));
    secEl.appendChild(snapshotSectionHeader(sec.config));

    for (const row of sec.rows) {
      const values = row.cells.map(c => c.value).filter((v): v is number => v !== null);
      const blockMax = values.length ? Math.max(...values) : 1;
      const baseValue = row.cells[0]?.value ?? null;

      const block = el('div', 'snap-block');
      const mh = el('div', 'snap-metric');
      mh.textContent = row.label;
      block.appendChild(mh);

      row.cells.forEach((c, i) => {
        const isBase = i === 0;
        const r = el('div', 'snap-row' + (isBase ? ' snap-row-base' : ''));
        const name = el('span', 'snap-branch');
        name.textContent = sec.branches[i];
        name.title = sec.branches[i];
        r.appendChild(name);

        const track = el('div', 'snap-track');
        if (baseValue !== null && blockMax > 0) {
          const ref = el('div', 'snap-refline');
          ref.style.left = pct(baseValue, blockMax);
          track.appendChild(ref);
        }
        if (c.value !== null) {
          const dot = el('div', 'snap-dot');
          dot.style.left = pct(c.value, blockMax);
          dot.style.background = getColor(i);
          dot.title = `${sec.branches[i]}: ${formatMetricValue(c.value, row.metricType)} (n=${c.n})`;
          track.appendChild(dot);
        }
        r.appendChild(track);

        const value = el('span', 'snap-value');
        value.textContent = c.value === null ? '—' : formatMetricValue(c.value, row.metricType);
        r.appendChild(value);
        const d = el('span', 'snap-delta ' + deltaClass(c));
        d.textContent = deltaText(c, isBase);
        r.appendChild(d);
        block.appendChild(r);
      });
      secEl.appendChild(block);
    }
    container.appendChild(secEl);
  }
}

function renderSnapshotBars(container: HTMLElement, sections: SnapshotSection[]): void {
  for (const sec of sections) {
    const secEl = el('div', 'snapshot-section' + (sec.branches.length === 2 ? ' snapshot-pair' : ''));
    secEl.appendChild(snapshotSectionHeader(sec.config));

    for (const row of sec.rows) {
      const values = row.cells.map(c => c.value).filter((v): v is number => v !== null);
      const blockMax = values.length ? Math.max(...values) : 1;

      const block = el('div', 'snap-block');
      const mh = el('div', 'snap-metric');
      mh.textContent = row.label;
      block.appendChild(mh);

      const plot = el('div', 'snap-bars');
      row.cells.forEach((c, i) => {
        const isBase = i === 0;
        const col = el('div', 'snap-bar-col');
        const d = el('span', 'snap-bar-delta ' + deltaClass(c));
        d.textContent = deltaText(c, isBase);
        const bar = el('div', 'snap-bar' + (isBase ? ' snap-bar-base' : ''));
        if (c.value !== null) {
          bar.style.height = pct(c.value, blockMax);
          bar.style.background = getColor(i);
          bar.title = `${sec.branches[i]}: ${formatMetricValue(c.value, row.metricType)} (n=${c.n})`;
        }
        const lab = el('span', 'snap-bar-label');
        lab.textContent = sec.branches[i];
        lab.title = sec.branches[i];
        const value = el('span', 'snap-bar-value');
        value.textContent = c.value === null ? '—' : formatMetricValue(c.value, row.metricType);
        const plotArea = el('div', 'snap-bar-plot');
        plotArea.appendChild(bar);
        col.append(d, value, plotArea, lab);
        plot.appendChild(col);
      });
      block.appendChild(plot);
      secEl.appendChild(block);
    }
    container.appendChild(secEl);
  }
}

function renderSnapshotTable(container: HTMLElement, sections: SnapshotSection[]): void {
  for (const sec of sections) {
    const secEl = el('div', 'snapshot-section' + (sec.branches.length === 2 ? ' snapshot-pair' : ''));
    secEl.appendChild(snapshotSectionHeader(sec.config));

    const table = el('table', 'snap-table');
    const thead = el('thead');
    const headRow = el('tr');
    const corner = el('th');
    corner.scope = 'col';
    headRow.appendChild(corner);
    sec.branches.forEach((b, i) => {
      const th = el('th');
      th.scope = 'col';
      if (i === 0) th.className = 'snap-col-base';
      th.style.color = getColor(i);
      th.textContent = b;
      th.title = b;
      headRow.appendChild(th);
    });
    thead.appendChild(headRow);
    table.appendChild(thead);

    const tbody = el('tbody');
    for (const row of sec.rows) {
      const tr = el('tr');
      const labelTd = el('td');
      labelTd.textContent = row.label;
      tr.appendChild(labelTd);
      row.cells.forEach((c, i) => {
        const td = el('td');
        if (i === 0) td.className = 'snap-col-base';
        td.textContent = c.value === null ? '—' : formatMetricValue(c.value, row.metricType);
        if (i > 0 && c.deltaPct !== null) {
          const badge = el('span', 'snap-badge ' + deltaClass(c));
          badge.textContent = deltaText(c, false);
          td.appendChild(badge);
        }
        tr.appendChild(td);
      });
      tbody.appendChild(tr);
    }
    table.appendChild(tbody);
    secEl.appendChild(table);
    container.appendChild(secEl);
  }
}

function renderSnapshotBody(body: HTMLElement, sections: SnapshotSection[], mode: SnapMode, emptyMessage?: string): void {
  body.innerHTML = '';
  if (!sections.length) {
    const p = el('p', 'no-data');
    p.textContent = emptyMessage ?? 'No snapshot data for the selected branches and configs';
    body.appendChild(p);
    return;
  }
  if (mode === 'dots') renderSnapshotDots(body, sections);
  else if (mode === 'bars') renderSnapshotBars(body, sections);
  else renderSnapshotTable(body, sections);
}

/** Render the snapshot block: header with view toggle + sections in `mode`. */
export function renderSnapshot(
  container: HTMLElement,
  sections: SnapshotSection[],
  mode: SnapMode,
  onModeChange: (mode: SnapMode) => void,
  emptyMessage?: string,
  signal?: AbortSignal,
): void {
  container.innerHTML = '';
  container.className = 'snapshot-panel';

  const header = el('div', 'snapshot-header');
  const title = el('h3', 'snapshot-title');
  title.textContent = 'Snapshot · median of last N daily points · Δ% vs base';
  header.appendChild(title);

  const toggle = el('div', 'snap-toggle');
  toggle.setAttribute('role', 'radiogroup');
  toggle.setAttribute('aria-label', 'Snapshot view mode');
  const buttons: HTMLButtonElement[] = [];
  const modes: SnapMode[] = ['dots', 'bars', 'table'];
  modes.forEach(m => {
    const btn = el('button');
    btn.type = 'button';
    btn.dataset.snap = m;
    btn.textContent = m === 'dots' ? 'Dots' : m === 'bars' ? 'Bars' : 'Table';
    buttons.push(btn);
    toggle.appendChild(btn);
  });
  header.appendChild(toggle);

  const body = el('div', 'snapshot-body');
  container.append(header, body);

  bindRadiogroup(buttons, modes.indexOf(mode), btn => {
    const m = asSnapMode(btn.dataset.snap ?? '');
    if (!m) return;
    renderSnapshotBody(body, sections, m, emptyMessage);
    onModeChange(m);
  }, signal);
  renderSnapshotBody(body, sections, mode, emptyMessage);
}

/** Render the compare-mode controls bar (branch chips + search, config chips,
 *  operation radiogroup, time range, N). Listeners are wired to `handlers`;
 *  pass `signal` so main.ts can tear them down. */
export function renderCompareControls(
  container: HTMLElement,
  state: CompareControlState,
  handlers: CompareControlHandlers,
  signal?: AbortSignal,
): void {
  container.innerHTML = '';
  container.className = 'compare-controls';

  // --- Branches ---
  const bGroup = el('div', 'control-group');
  const bLabel = el('label');
  bLabel.htmlFor = 'compareBranchInput';
  bLabel.textContent = `Branches (first = base, max ${MAX_COMPARE_BRANCHES})`;
  bGroup.appendChild(bLabel);

  const bRow = el('div', 'chip-row');
  const branchField = el('div', 'branch-field');
  const full = state.selectedBranches.length >= MAX_COMPARE_BRANCHES;
  branchField.appendChild(createBranchPicker({
    id: 'compareBranchInput',
    lastUpdated: state.branchLastUpdated,
    branches: state.allBranches.filter(b => !state.selectedBranches.includes(b)),
    placeholder: full ? 'Maximum 8 branches selected' : 'Search and add a branch…',
    disabled: full,
    onSelect: handlers.onAddBranch,
    signal,
  }));

  const refresh = el('button', 'surface-action refresh-action');
  refresh.id = 'refreshBtn';
  refresh.type = 'button';
  refresh.textContent = 'Refresh';
  branchField.appendChild(refresh);
  bGroup.appendChild(branchField);

  state.selectedBranches.forEach((b, i) => {
    const isBase = i === 0;
    const chip = el('span', 'branch-chip'
      + (isBase ? ' chip-base' : '')
      + (state.hiddenBranches.has(b) ? ' chip-hidden' : ''));
    chip.title = 'Click to toggle chart line visibility';
    const dot = el('span', 'chip-dot');
    dot.style.background = getColor(i);
    const name = el('span', 'chip-name');
    name.textContent = b;
    chip.append(dot, name);

    if (isBase) {
      const badge = el('span', 'chip-base-badge');
      badge.textContent = 'A';
      badge.title = 'Base branch — Δ% is computed against it';
      chip.appendChild(badge);
    } else {
      const baseBtn = el('button', 'chip-base-btn');
      baseBtn.type = 'button';
      baseBtn.textContent = '⌃';
      baseBtn.title = `Make ${b} the base`;
      baseBtn.setAttribute('aria-label', `Make ${b} the base branch`);
      baseBtn.addEventListener('click', e => { e.stopPropagation(); handlers.onSetBase(b); }, { signal });
      chip.appendChild(baseBtn);
    }
    const x = el('button', 'chip-remove');
    x.type = 'button';
    x.textContent = '×';
    x.title = `Remove ${b}`;
    x.setAttribute('aria-label', `Remove branch ${b}`);
    x.addEventListener('click', e => { e.stopPropagation(); handlers.onRemoveBranch(b); }, { signal });
    chip.appendChild(x);

    chip.addEventListener('click', () => handlers.onToggleBranchVisibility(b), { signal });
    bRow.appendChild(chip);
  });
  bGroup.appendChild(bRow);
  container.appendChild(bGroup);

  // --- Configs ---
  const cGroup = el('div', 'control-group');
  const cLabel = el('span', 'control-label');
  cLabel.textContent = 'Configurations';
  cGroup.appendChild(cLabel);

  const cRow = el('div', 'chip-row');
  const allBtn = el('button', 'chip-mini-btn surface-action');
  allBtn.type = 'button';
  allBtn.textContent = 'All';
  allBtn.addEventListener('click', () => handlers.onAllConfigs(), { signal });
  const noneBtn = el('button', 'chip-mini-btn surface-action');
  noneBtn.type = 'button';
  noneBtn.textContent = 'None';
  noneBtn.addEventListener('click', () => handlers.onNoConfigs(), { signal });
  cRow.append(allBtn, noneBtn);

  for (const cfg of state.allConfigs) {
    const chip = el('span', 'config-chip '
      + (state.selectedConfigs.includes(cfg) ? 'on' : 'off'));
    chip.textContent = formatConfigLabel(cfg);
    chip.title = `${cfg} — click to toggle this config`;
    chip.addEventListener('click', () => handlers.onToggleConfig(cfg), { signal });
    cRow.appendChild(chip);
  }
  cGroup.appendChild(cRow);
  container.appendChild(cGroup);

  // --- Time Range ---
  const tGroup = el('div', 'control-group');
  const tLabel = el('label');
  tLabel.htmlFor = 'compareTimeRange';
  tLabel.textContent = 'Chart time range';
  tGroup.appendChild(tLabel);
  const tSelect = el('select');
  tSelect.id = 'compareTimeRange';
  for (const [value, label] of [['2', 'Last 2 days'], ['7', 'Last 7 days'], ['15', 'Last 15 days'],
    ['30', 'Last 30 days'], ['90', 'Last 90 days'], ['365', 'Last year'], ['0', 'All time']] as const) {
    const opt = el('option');
    opt.value = value;
    opt.textContent = label;
    tSelect.appendChild(opt);
  }
  tSelect.value = String(state.timeRange);
  tSelect.addEventListener('change', () => {
    const d = parseInt(tSelect.value, 10);
    if (Number.isFinite(d)) handlers.onTimeRange(d);
  }, { signal });
  tGroup.appendChild(tSelect);
  container.appendChild(tGroup);

  // --- Snapshot N ---
  const nGroup = el('div', 'control-group');
  const nLabel = el('label');
  nLabel.htmlFor = 'compareN';
  nLabel.textContent = 'Snapshot: last N daily points';
  nGroup.appendChild(nLabel);
  const nInput = el('input', 'n-input');
  nInput.id = 'compareN';
  nInput.type = 'number';
  nInput.min = '1';
  nInput.max = '50';
  nInput.value = String(state.n);
  let lastValidN = state.n;
  nInput.addEventListener('change', () => {
    const v = parseInt(nInput.value, 10);
    if (Number.isFinite(v)) {
      const n = Math.min(50, Math.max(1, v));
      lastValidN = n;
      nInput.value = String(n);
      handlers.onN(n);
    } else {
      nInput.value = String(lastValidN);
    }
  }, { signal });
  nGroup.appendChild(nInput);
  container.appendChild(nGroup);
}
