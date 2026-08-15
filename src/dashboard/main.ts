import * as d3 from 'd3';
import type { DashboardData, ViewMode, OperationFilter, MetricType, ChartDataPoint } from './types';
import { CHART_KEYS_BY_CONFIG, asViewMode, asOperationFilter } from './types';
import { loadData } from './data-loader';
import { createChart, type CreateChartOptions } from './charts';
import { formatBranchName, getColor } from './utils';

class DashboardApp {
  private data: DashboardData | null = null;
  private charts = new Map<string, ReturnType<typeof createChart>>();

  private viewMode: ViewMode = 'config';
  private timeRange = 30;
  private branch = 'all';
  private operation: OperationFilter = 'both';
  private colorMap = new Map<string, number>();
  private groupColorMap = new Map<string, string>();
  private hiddenGroups = new Set<string>();

  private allBranches: string[] = [];
  private allGroups: string[] = [];
  private abortController: AbortController | null = null;
  private listenerAbort: AbortController = new AbortController();
  private loading = false;
  private generation = 0;

  private static readonly ALLOWED_DAYS = new Set([2, 7, 15, 30, 90, 365, 0]);

  async init() {
    if (this.loading) return;
    this.loading = true;
    const gen = ++this.generation;
    this.destroy();
    this.readUrlParams();
    this.syncControlsFromState();

    try {
      this.abortController = new AbortController();
      this.data = await loadData('./data.json', this.abortController.signal);
    } catch (e) {
      if (e instanceof DOMException && e.name === 'AbortError') return;
      this.showError(e instanceof Error ? e.message : String(e));
      return;
    } finally {
      this.loading = false;
    }

    if (gen !== this.generation) return; // superseded by a newer load

    this.extractMeta();
    this.normalizeBranch();
    this.renderCharts();
    this.renderLegend();
    this.updateInfo();
    this.bindEvents();
  }

  // ---- Cleanup ----

  private destroy() {
    this.abortController?.abort();
    this.listenerAbort.abort();
    this.listenerAbort = new AbortController();
  }

  // ---- URL params ----

  private readUrlParams() {
    const p = new URLSearchParams(window.location.search);
    const daysRaw = parseInt(p.get('days') ?? '30', 10);
    this.timeRange = DashboardApp.ALLOWED_DAYS.has(daysRaw) ? daysRaw : 30;
    this.branch = p.get('branch') ?? 'all';

    const viewMode = asViewMode(p.get('view') ?? '');
    this.viewMode = viewMode ?? 'config';

    const op = p.get('op') ?? '';
    this.operation = asOperationFilter(op) ?? 'both';
  }

  /** Drop branch if it is not present (or normalizes to) one of the loaded branches. */
  private normalizeBranch() {
    if (this.branch === 'all') return;
    if (!this.allBranches.length) return;
    const matches = (b: string) => b === this.branch || formatBranchName(b) === formatBranchName(this.branch);
    if (!this.allBranches.some(matches)) {
      this.branch = 'all';
    }
  }

  private writeUrlParams() {
    const p = new URLSearchParams();
    if (this.timeRange !== 30) p.set('days', String(this.timeRange));
    if (this.branch !== 'all') p.set('branch', this.branch);
    if (this.viewMode !== 'config') p.set('view', this.viewMode);
    if (this.operation !== 'both') p.set('op', this.operation);
    const qs = p.toString();
    try {
      history.replaceState(null, '', qs ? `?${qs}` : window.location.pathname);
    } catch (e) {
      // SecurityError on file:// — silently fall back without URL update.
    }
  }

  private syncControlsFromState() {
    const timeEl = document.getElementById('timeRange') as HTMLSelectElement | null;
    if (timeEl) timeEl.value = String(this.timeRange);

    const viewBtns = document.querySelectorAll('.view-btn');
    viewBtns.forEach(btn => {
      const isActive = (btn as HTMLElement).dataset.view === this.viewMode;
      btn.classList.toggle('active', isActive);
      btn.setAttribute('aria-checked', String(isActive));
      btn.setAttribute('tabindex', isActive ? '0' : '-1');
    });

    const opBtns = document.querySelectorAll('.op-btn');
    opBtns.forEach(btn => {
      const isActive = (btn as HTMLElement).dataset.op === this.operation;
      btn.classList.toggle('active', isActive);
      btn.setAttribute('aria-checked', String(isActive));
      btn.setAttribute('tabindex', isActive ? '0' : '-1');
    });
  }

  // ---- Meta extraction ----

  private extractMeta() {
    if (!this.data) return;

    // Derive groups/branches from the single config-grouped chart set.
    // For branch-view the group key is taken from each point's `branch`
    // field (not its stored `group`, which is always the config).
    const keys = CHART_KEYS_BY_CONFIG;
    const branchSet = new Set<string>();
    const groupSet = new Set<string>();
    for (const key of keys) {
      for (const pt of this.data.charts[key] ?? []) {
        branchSet.add(pt.branch);
        groupSet.add(this.viewMode === 'config' ? pt.config : pt.branch);
      }
    }
    this.allBranches = [...branchSet].sort((a, b) => {
      if (a === 'main' || a === 'refs/heads/main') return -1;
      if (b === 'main' || b === 'refs/heads/main') return 1;
      return a.localeCompare(b);
    });

    this.allGroups = [...groupSet].sort();
    this.allGroups.forEach((g, i) => this.colorMap.set(g, i));
  }

  private populateBranchSelector() {
    const sel = document.getElementById('branchSelect') as HTMLSelectElement | null;
    if (!sel) return;
    sel.innerHTML = '<option value="all">All Branches</option>';
    for (const b of this.allBranches) {
      const opt = document.createElement('option');
      opt.value = b;
      opt.textContent = formatBranchName(b);
      if (b === this.branch) opt.selected = true;
      sel.appendChild(opt);
    }
  }

  // ---- Charts ----

  private renderCharts() {
    const app = document.getElementById('app');
    if (!app || !this.data) return;

    app.innerHTML = '';

    // Header
    const header = document.createElement('header');
    header.className = 'dashboard-header';
    header.innerHTML = `
      <div class="header-top">
        <h1>Rawstor Benchmark Dashboard</h1>
        <button class="btn-about" id="aboutBtn" aria-label="About test configurations">?</button>
      </div>
      <p class="header-subtitle">Interactive dashboard for tracking librawstor fio benchmark results across commits and configurations.</p>
      <div class="info-bar" id="infoBar" role="status" aria-live="polite"></div>
    `;
    app.appendChild(header);

    // Controls
    const controls = document.createElement('div');
    controls.className = 'controls-bar';
    controls.innerHTML = `
      <div class="control-group">
        <label for="timeRange">Time Range</label>
        <select id="timeRange">
          <option value="2">Last 2 days</option>
          <option value="7">Last 7 days</option>
          <option value="15">Last 15 days</option>
          <option value="30">Last 30 days</option>
          <option value="90">Last 90 days</option>
          <option value="365">Last year</option>
          <option value="0">All time</option>
        </select>
      </div>
      <div class="control-group">
        <label for="branchSelect">Branch</label>
        <select id="branchSelect"><option value="all">All Branches</option></select>
      </div>
      <fieldset class="control-group">
        <legend>View</legend>
        <div class="toggle-group" role="radiogroup" aria-label="View mode">
          <button class="view-btn active" data-view="config" role="radio" aria-checked="true">Config</button>
          <button class="view-btn" data-view="branch" role="radio" aria-checked="false">Branch</button>
        </div>
      </fieldset>
      <fieldset class="control-group">
        <legend>Operations</legend>
        <div class="toggle-group" role="radiogroup" aria-label="Operation filter">
          <button class="op-btn" data-op="read" role="radio" aria-checked="false">Read</button>
          <button class="op-btn" data-op="write" role="radio" aria-checked="false">Write</button>
          <button class="op-btn active" data-op="both" role="radio" aria-checked="true">Both</button>
        </div>
      </fieldset>
      <button id="refreshBtn" class="btn-refresh">Refresh</button>
    `;
    app.appendChild(controls);

    // Legend
    const legend = document.createElement('div');
    legend.className = 'legend-bar';
    legend.id = 'legend';
    app.appendChild(legend);

    // Charts grid
    const grid = document.createElement('div');
    grid.className = 'charts-grid';
    grid.id = 'chartsGrid';
    app.appendChild(grid);

    // Tooltip
    const tooltip = document.createElement('div');
    tooltip.className = 'tooltip';
    tooltip.id = 'tooltip';
    app.appendChild(tooltip);

    // About dialog
    const aboutDialog = document.createElement('dialog');
    aboutDialog.className = 'about-dialog';
    aboutDialog.id = 'aboutDialog';
    aboutDialog.setAttribute('aria-labelledby', 'aboutDialogTitle');
    aboutDialog.innerHTML = `
      <div class="about-content">
        <h2 id="aboutDialogTitle">About Test Configurations</h2>
        <p>Configuration names follow the pattern:</p>
        <code>perftest[-without-liburing][-legacy]-{backend}-{blocksize}-{threads}-{queues}</code>
        <dl>
          <dt>backend</dt>
          <dd><code>file</code> — regular file I/O, <code>ost</code> — object storage target</dd>
          <dt>blocksize</dt>
          <dd>Block size for I/O operations (e.g. <code>4k</code> = 4 KB)</dd>
          <dt>threads</dt>
          <dd>Number of concurrent I/O threads</dd>
          <dt>queues</dt>
          <dd>Queue depth per thread</dd>
          <dt>without-liburing</dt>
          <dd>Built without io_uring support (legacy AIO backend)</dd>
          <dt>legacy</dt>
          <dd>Legacy configuration mode</dd>
        </dl>
        <p>Example: <code>perftest-ost-4k-2-1</code> = object storage, 4 KB blocks, 2 threads, queue depth 1.</p>
        <button class="btn-close-about" id="closeAbout">Close</button>
      </div>
    `;
    app.appendChild(aboutDialog);

    this.populateBranchSelector();
    this.syncControlsFromState();
    this.buildCharts();
  }

  private buildCharts() {
    const grid = document.getElementById('chartsGrid');
    if (!grid || !this.data) return;
    // Tear down previous chart instances (cancel pending RAFs, unbind zoom)
    // before the DOM nodes are removed.
    for (const chart of this.charts.values()) chart?.destroy?.();
    this.charts.clear();
    grid.innerHTML = '';

    const keys = CHART_KEYS_BY_CONFIG;

    const opSet = this.operation === 'both' ? new Set(['read', 'write']) : new Set([this.operation]);

    const chartsToRender: { id: string; title: string; metricType: MetricType; keys: string[] }[] = [
      { id: 'chart-iops', title: 'IOPS', metricType: 'iops', keys: [keys[0], keys[1]] },
      { id: 'chart-latency', title: 'Latency', metricType: 'latency', keys: [keys[2], keys[3]] },
    ];

    for (const cfg of chartsToRender) {
      const container = document.createElement('div');
      container.className = 'chart-container';
      container.id = cfg.id;
      grid.appendChild(container);

      const points1 = this.data.charts[cfg.keys[0]] ?? [];
      const points2 = this.data.charts[cfg.keys[1]] ?? [];
      const cutoff = this.timeRange > 0 ? new Date(Date.now() - this.timeRange * 86400000) : null;
      const filterByTime = (pts: typeof points1) => cutoff ? pts.filter(p => new Date(p.timestamp) >= cutoff) : pts;
      const branchFiltered = this.branch === 'all'
        ? [...filterByTime(points1), ...filterByTime(points2)]
        : [...filterByTime(points1).filter(p => p.branch === this.branch), ...filterByTime(points2).filter(p => p.branch === this.branch)];

      // Points stored in data.json are grouped by config (`group === config`).
      // For branch-view rebind the group key to each point's `branch` field.
      const remap = (p: ChartDataPoint): ChartDataPoint =>
        this.viewMode === 'config' ? p : { ...p, group: p.branch };
      const chartData = branchFiltered.map(remap);

      const chart = createChart({
        container: d3.select(container) as unknown as d3.Selection<HTMLDivElement, unknown, HTMLElement, unknown>,
        title: cfg.title,
        data: chartData,
        metricType: cfg.metricType,
        timeRangeDays: this.timeRange,
        visibleGroups: new Set(this.allGroups),
        visibleOperations: opSet,
        colorMap: this.colorMap,
        onGroupColors: (groups, colors) => {
          for (const [g, c] of colors) this.groupColorMap.set(g, c);
        },
      });

      if (chart) this.charts.set(cfg.id, chart);
    }
  }

  // ---- Legend ----

  private renderLegend() {
    const el = document.getElementById('legend');
    if (!el) return;
    el.innerHTML = '';

    const title = document.createElement('h3');
    title.textContent = this.viewMode === 'branch' ? 'Branches' : 'Configurations';
    el.appendChild(title);

    if (this.viewMode === 'config') {
      const hint = document.createElement('p');
      hint.className = 'legend-hint';
      hint.innerHTML = 'Pattern: <code>perftest[-...]-{backend}-{size}-{threads}-{queues}</code> — <button class="btn-about-inline" id="aboutBtnLegend" type="button">?</button>';
      el.appendChild(hint);
    }

    const controls = document.createElement('div');
    controls.className = 'legend-controls';
    const showAll = document.createElement('button');
    showAll.className = 'legend-btn';
    showAll.textContent = 'Show All';
    showAll.addEventListener('click', () => this.showAllGroups());
    const hideAll = document.createElement('button');
    hideAll.className = 'legend-btn';
    hideAll.textContent = 'Hide All';
    hideAll.addEventListener('click', () => this.hideAllGroups());
    controls.append(showAll, hideAll);
    el.appendChild(controls);

    const grid = document.createElement('div');
    grid.className = 'legend-items';
    grid.setAttribute('role', 'group');
    grid.setAttribute('aria-label', this.viewMode === 'branch' ? 'Toggle branch visibility' : 'Toggle configuration visibility');

    for (const group of this.allGroups) {
      const color = this.groupColorMap.get(group) ?? getColor(this.colorMap.get(group) ?? 0);
      const item = document.createElement('button');
      item.className = 'legend-item';
      item.dataset.group = group;
      item.type = 'button';
      item.setAttribute('role', 'checkbox');
      item.setAttribute('aria-checked', 'true');
      const dot = document.createElement('span');
      dot.className = 'legend-dot';
      dot.style.background = color;
      const label = document.createElement('span');
      label.className = 'legend-label';
      label.textContent = group;
      item.append(dot, label);
      item.addEventListener('click', () => this.toggleGroup(group));
      item.addEventListener('keydown', (e: KeyboardEvent) => {
        // Space/Enter handled natively by <button>; only handle arrows.
        if (e.key === 'ArrowDown' || e.key === 'ArrowRight') {
          e.preventDefault();
          (item.nextElementSibling as HTMLElement | null)?.focus();
        } else if (e.key === 'ArrowUp' || e.key === 'ArrowLeft') {
          e.preventDefault();
          (item.previousElementSibling as HTMLElement | null)?.focus();
        }
      });
      grid.appendChild(item);
    }

    el.appendChild(grid);

    document.getElementById('aboutBtnLegend')?.addEventListener('click', () => {
      (document.getElementById('aboutDialog') as HTMLDialogElement | null)?.showModal();
    });
  }

  private toggleGroup(group: string) {
    if (this.hiddenGroups.has(group)) {
      this.hiddenGroups.delete(group);
    } else {
      this.hiddenGroups.add(group);
    }

    const item = document.querySelector(`.legend-item[data-group="${CSS.escape(group)}"]`) as HTMLElement | null;
    if (item) {
      item.classList.toggle('hidden');
      item.setAttribute('aria-checked', String(!this.hiddenGroups.has(group)));
    }

    this.updateChartsVisibility();
  }

  private showAllGroups() {
    this.hiddenGroups.clear();
    document.querySelectorAll('.legend-item').forEach(el => {
      el.classList.remove('hidden');
      el.setAttribute('aria-checked', 'true');
    });
    this.updateChartsVisibility();
  }

  private hideAllGroups() {
    for (const group of this.allGroups) this.hiddenGroups.add(group);
    document.querySelectorAll('.legend-item').forEach(el => {
      el.classList.add('hidden');
      el.setAttribute('aria-checked', 'false');
    });
    this.updateChartsVisibility();
  }

  private updateChartsVisibility() {
    const visibleGroups = new Set(this.allGroups.filter(g => !this.hiddenGroups.has(g)));
    const opSet = this.operation === 'both' ? new Set(['read', 'write']) : new Set([this.operation]);

    for (const chart of this.charts.values()) {
      if (!chart) continue;
      // Derive visible fullGroups from per-chart point data (avoids fragile
      // split of fullGroup back into base/op; preserves group names containing ' - ').
      const fg = new Set<string>();
      for (const p of chart.data) {
        if (visibleGroups.has(p.group) && opSet.has(p.operation)) {
          fg.add(p.fullGroup);
        }
      }
      chart.updateVisibility(fg);
    }
  }

  // ---- Info ----

  private updateInfo(override?: string) {
    const el = document.getElementById('infoBar');
    if (!el) return;

    if (override) {
      el.textContent = override;
      return;
    }
    if (!this.data) return;

    const s = this.data.summary;
    const tr = this.timeRange === 0 ? 'All time' : `Last ${this.timeRange} days`;
    const br = this.branch === 'all' ? 'All branches' : formatBranchName(this.branch);
    const branchCount = `${s.total_branches} branches`;
    const viewLabel = this.viewMode === 'branch' ? 'View: Branches' : 'View: Configs';
    const generated = this.data.generated_at
      ? `Updated: ${new Date(this.data.generated_at).toLocaleDateString()}`
      : '';

    el.textContent = '';
    for (const text of [`${s.total_tests} tests`, `${s.total_configurations} configs`, branchCount, br, tr, viewLabel, generated]) {
      if (!text) continue;
      const span = document.createElement('span');
      span.textContent = text;
      el.appendChild(span);
    }
  }

  // ---- Events ----

  private bindEvents() {
    const signal = this.listenerAbort.signal;

    document.getElementById('timeRange')?.addEventListener('change', (e) => {
      this.timeRange = parseInt((e.target as HTMLSelectElement).value, 10);
      if (isNaN(this.timeRange)) this.timeRange = 30;
      this.writeUrlParams();
      this.buildCharts();
      this.renderLegend();
      this.updateInfo();
    }, { signal });

    document.getElementById('branchSelect')?.addEventListener('change', (e) => {
      this.branch = (e.target as HTMLSelectElement).value;
      this.writeUrlParams();
      this.buildCharts();
      this.renderLegend();
      this.updateInfo();
    }, { signal });

// Radiogroup keyboard navigation helper
    const setupRadiogroup = (selector: string, onSelect: (btn: HTMLElement) => void, rebuild = true) => {
      const selectRadio = (btn: HTMLElement) => {
        onSelect(btn);
        this.syncControlsFromState();
        this.writeUrlParams();
        if (rebuild) {
          this.buildCharts();
          this.renderLegend();
        } else {
          this.updateChartsVisibility();
        }
        this.updateInfo();
      };

    document.querySelectorAll(selector).forEach(btnEl => {
      const btn = btnEl as HTMLButtonElement;
      btn.addEventListener('click', () => selectRadio(btn), { signal });
      btn.addEventListener('keydown', ((e: KeyboardEvent) => {
        const container = btn.closest('.toggle-group');
        if (!container) return;
        const radios = Array.from(container.querySelectorAll('[role="radio"]')) as HTMLElement[];
        const idx = radios.indexOf(btn);
        let next: HTMLElement | null = null;
        if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
          e.preventDefault();
          next = radios[(idx + 1) % radios.length];
        } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
          e.preventDefault();
          next = radios[(idx - 1 + radios.length) % radios.length];
        } else if (e.key === 'Home') {
          e.preventDefault();
          next = radios[0];
        } else if (e.key === 'End') {
          e.preventDefault();
          next = radios[radios.length - 1];
        }
        if (next) {
          next.focus();
          selectRadio(next);
        }
      }) as EventListener, { signal });
    });
  };

  setupRadiogroup('.view-btn', (btn) => {
    const v = asViewMode(btn.dataset.view ?? '');
    if (v && v !== this.viewMode) {
      this.viewMode = v;
      // Switching view mode invalidates per-group visibility state — old
      // group names no longer apply to the new grouping.
      this.hiddenGroups.clear();
    }
    this.extractMeta();
  });

    setupRadiogroup('.op-btn', (btn) => {
      const op = asOperationFilter(btn.dataset.op ?? '');
      if (op) this.operation = op;
    }, false);

    document.getElementById('refreshBtn')?.addEventListener('click', async () => {
      const gen = ++this.generation;
      this.abortController?.abort();
      const btn = document.getElementById('refreshBtn') as HTMLButtonElement | null;
      if (btn) { btn.disabled = true; btn.textContent = 'Loading...'; }
      this.updateInfo('Refreshing data...');
      try {
        this.abortController = new AbortController();
        const data = await loadData('./data.json', this.abortController.signal);
        if (gen !== this.generation) return; // superseded
        this.data = data;
        this.extractMeta();
        this.normalizeBranch();
        this.populateBranchSelector();
        this.syncControlsFromState();
        this.buildCharts();
        this.renderLegend();
        this.updateInfo('Data refreshed');
        document.getElementById('refresh-error')?.remove();
      } catch (e) {
        if (gen !== this.generation) return; // superseded
        if (e instanceof DOMException && e.name === 'AbortError') return;
        this.showRefreshError(e instanceof Error ? e.message : String(e));
        this.updateInfo('Refresh failed');
      } finally {
        if (gen === this.generation && btn) { btn.disabled = false; btn.textContent = 'Refresh'; }
      }
    }, { signal });

    document.getElementById('aboutBtn')?.addEventListener('click', () => {
      (document.getElementById('aboutDialog') as HTMLDialogElement | null)?.showModal();
    }, { signal });
    document.getElementById('closeAbout')?.addEventListener('click', () => {
      (document.getElementById('aboutDialog') as HTMLDialogElement | null)?.close();
    }, { signal });
  }

  private showRefreshError(msg: string) {
    // Insert banner below the controls bar (not above spinner/controls).
    let banner = document.getElementById('refresh-error');
    if (!banner) {
      banner = document.createElement('div');
      banner.id = 'refresh-error';
      banner.className = 'error';
      banner.setAttribute('role', 'alert');
      banner.style.margin = '12px 24px';
      const legend = document.getElementById('legend') ?? document.querySelector('.charts-grid');
      legend?.insertAdjacentElement('beforebegin', banner);
    }
    banner.textContent = `Refresh failed: ${msg}`;
  }

  private showError(msg: string) {
    const app = document.getElementById('app');
    if (!app) return;
    app.textContent = '';
    const wrapper = document.createElement('div');
    wrapper.className = 'error';
    wrapper.setAttribute('role', 'alert');
    const h2 = document.createElement('h2');
    h2.textContent = 'Error';
    const p = document.createElement('p');
    p.textContent = msg;
    const retryBtn = document.createElement('button');
    retryBtn.className = 'btn-retry';
    retryBtn.textContent = 'Retry';
    retryBtn.addEventListener('click', () => this.init());
    wrapper.append(h2, p, retryBtn);
    app.appendChild(wrapper);
  }
}

// ---- Boot ----
document.addEventListener('DOMContentLoaded', () => {
  new DashboardApp().init();
});
