import * as d3 from 'd3';
import type { DashboardData, ViewMode, OperationFilter, MetricType } from './types';
import { CHART_KEYS_BY_CONFIG, CHART_KEYS_BY_BRANCH, asViewMode, asOperationFilter } from './types';
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

  async init() {
    if (this.loading) return;
    this.loading = true;
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

    this.extractMeta();
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
    this.timeRange = parseInt(p.get('days') ?? '30', 10) || 30;
    this.branch = p.get('branch') ?? 'all';

    const view = p.get('view');
    this.viewMode = view === 'branch' ? 'branch' : 'config';

    const op = p.get('op');
    this.operation = op === 'read' || op === 'write' ? op : 'both';
  }

  private writeUrlParams() {
    const p = new URLSearchParams();
    if (this.timeRange !== 30) p.set('days', String(this.timeRange));
    if (this.branch !== 'all') p.set('branch', this.branch);
    if (this.viewMode !== 'config') p.set('view', this.viewMode);
    if (this.operation !== 'both') p.set('op', this.operation);
    const qs = p.toString();
    history.replaceState(null, '', qs ? `?${qs}` : window.location.pathname);
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

    // Derive branches from current view mode's charts for consistency
    const keys = this.viewMode === 'config' ? CHART_KEYS_BY_CONFIG : CHART_KEYS_BY_BRANCH;
    const branchSet = new Set<string>();
    const groupSet = new Set<string>();
    for (const key of keys) {
      for (const pt of this.data.charts[key] ?? []) {
        branchSet.add(pt.branch);
        groupSet.add(pt.group);
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
    document.getElementById('d3-error')?.remove();

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
    grid.innerHTML = '';
    this.charts.clear();

    const keys = this.viewMode === 'config' ? CHART_KEYS_BY_CONFIG : CHART_KEYS_BY_BRANCH;

    const opSet = this.operation === 'both' ? new Set(['read', 'write']) : new Set([this.operation]);

    const chartsToRender: { id: string; title: string; metricType: MetricType; keys: string[] }[] = [
      { id: 'chart-iops', title: `IOPS by ${this.viewMode === 'config' ? 'Configuration' : 'Branch'}`, metricType: 'iops', keys: [keys[0], keys[1]] },
      { id: 'chart-latency', title: `Latency by ${this.viewMode === 'config' ? 'Configuration' : 'Branch'}`, metricType: 'latency', keys: [keys[2], keys[3]] },
    ];

    for (const cfg of chartsToRender) {
      const container = document.createElement('div');
      container.className = 'chart-container';
      container.id = cfg.id;
      grid.appendChild(container);

      const points1 = this.data.charts[cfg.keys[0]] ?? [];
      const points2 = this.data.charts[cfg.keys[1]] ?? [];
      const filtered = this.branch === 'all'
        ? [...points1, ...points2]
        : [...points1.filter(p => p.branch === this.branch), ...points2.filter(p => p.branch === this.branch)];

      const chart = createChart({
        container: d3.select(container) as unknown as d3.Selection<HTMLDivElement, unknown, HTMLElement, unknown>,
        title: cfg.title,
        data: filtered,
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
        if (e.key === ' ' || e.key === 'Enter') { e.preventDefault(); this.toggleGroup(group); }
        if (e.key === 'ArrowDown' || e.key === 'ArrowRight') {
          e.preventDefault();
          const next = item.nextElementSibling as HTMLElement | null;
          if (next) next.focus();
        }
        if (e.key === 'ArrowUp' || e.key === 'ArrowLeft') {
          e.preventDefault();
          const prev = item.previousElementSibling as HTMLElement | null;
          if (prev) prev.focus();
        }
      });
      grid.appendChild(item);
    }

    el.appendChild(grid);
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
      const fg = new Set<string>();
      for (const fullGroup of chart.fullGroups) {
        const base = fullGroup.split(' - ')[0];
        const op = fullGroup.split(' - ')[1];
        if (visibleGroups.has(base) && opSet.has(op)) fg.add(fullGroup);
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
    const branchCount = s.total_branches_all && s.total_branches_all > s.total_branches
      ? `${s.total_branches} of ${s.total_branches_all} branches`
      : `${s.total_branches} branches`;
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
      this.timeRange = parseInt((e.target as HTMLSelectElement).value, 10) || 30;
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
    const setupRadiogroup = (selector: string, onSelect: (btn: HTMLElement) => void) => {
      document.querySelectorAll(selector).forEach(btnEl => {
        const btn = btnEl as HTMLButtonElement;
        btn.addEventListener('click', () => {
          onSelect(btn);
          this.syncControlsFromState();
          this.writeUrlParams();
          this.buildCharts();
          this.renderLegend();
          this.updateInfo();
        }, { signal });
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
            next.click();
          }
        }) as EventListener, { signal });
      });
    };

    setupRadiogroup('.view-btn', (btn) => {
      const v = asViewMode(btn.dataset.view ?? '');
      if (v) this.viewMode = v;
      this.extractMeta();
    });

    setupRadiogroup('.op-btn', (btn) => {
      const op = asOperationFilter(btn.dataset.op ?? '');
      if (op) this.operation = op;
    });

    document.getElementById('refreshBtn')?.addEventListener('click', async () => {
      this.abortController?.abort();
      const btn = document.getElementById('refreshBtn') as HTMLButtonElement | null;
      if (btn) { btn.disabled = true; btn.textContent = 'Loading...'; }
      this.updateInfo('Refreshing data...');
      try {
        this.abortController = new AbortController();
        this.data = await loadData('./data.json', this.abortController.signal);
        this.extractMeta();
        this.populateBranchSelector();
        this.buildCharts();
        this.renderLegend();
        this.updateInfo('Data refreshed');
        document.getElementById('refresh-error')?.remove();
      } catch (e) {
        if (e instanceof DOMException && e.name === 'AbortError') return;
        let banner = document.getElementById('refresh-error');
        if (!banner) {
          banner = document.createElement('div');
          banner.id = 'refresh-error';
          banner.className = 'error';
          banner.setAttribute('role', 'alert');
          banner.style.margin = '12px 24px';
          document.getElementById('app')?.prepend(banner);
        }
        banner.textContent = '';
        const p = document.createElement('p');
        p.textContent = `Refresh failed: ${e instanceof Error ? e.message : String(e)}`;
        banner.appendChild(p);
        this.updateInfo('Refresh failed');
      } finally {
        if (btn) { btn.disabled = false; btn.textContent = 'Refresh'; }
      }
    }, { signal });

    document.getElementById('aboutBtn')?.addEventListener('click', () => {
      (document.getElementById('aboutDialog') as HTMLDialogElement | null)?.showModal();
    }, { signal });
    document.getElementById('closeAbout')?.addEventListener('click', () => {
      (document.getElementById('aboutDialog') as HTMLDialogElement | null)?.close();
    }, { signal });
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
