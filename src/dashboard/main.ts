import { describeConfig, renderConfigHeading } from './config-label';
import { createBranchPicker } from './branch-picker';
import * as d3 from 'd3';
import type { DashboardData, OperationFilter, MetricType, ViewMode, SnapMode, ChartDataPoint } from './types';
import { CHART_KEYS_BY_CONFIG, asOperationFilter, asViewMode, asSnapMode,
         MAX_COMPARE_BRANCHES, DEFAULT_COMPARE_CONFIGS } from './types';
import { loadData } from './data-loader';
import { createChart } from './charts';
import { computeSnapshotSections, renderCompareSummary, renderSnapshot, renderCompareControls } from './compare';
import { stripBranchPrefix, getColor } from './utils';

class DashboardApp {
  private data: DashboardData | null = null;
  private charts = new Map<string, ReturnType<typeof createChart>>();

  private timeRange = 30;
  private branch = DashboardApp.DEFAULT_BRANCH;
  private operation: OperationFilter = 'both';
  private splitOperations = false;
  private viewMode: ViewMode = 'overview';
  private compareBranches: string[] = ['main'];
  private compareTouched = false;
  private compareConfigs: string[] = [...DEFAULT_COMPARE_CONFIGS];
  private compareHidden = new Set<string>();
  private compareDays = 0;   // compare default = All time (overview: 30)
  private compareN = 5;
  private snapMode: SnapMode = 'dots';
  private colorMap = new Map<string, number>();
  private groupColorMap = new Map<string, string>();
  private hiddenGroups = new Set<string>();

  private allBranches: string[] = [];
  private branchLastUpdated = new Map<string, string>();
  private allGroups: string[] = [];
  private abortController: AbortController | null = null;
  private listenerAbort: AbortController = new AbortController();
  private loading = false;
  private generation = 0;

  private static readonly ALLOWED_DAYS = new Set([2, 7, 15, 30, 90, 365, 0]);
  private static readonly DEFAULT_BRANCH = 'main';

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
    this.normalizeCompareState();
    this.render();
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
    this.splitOperations = p.get('split') === '1';
    const daysParam = p.get('days');
    const days = daysParam !== null && DashboardApp.ALLOWED_DAYS.has(parseInt(daysParam, 10))
      ? parseInt(daysParam, 10) : null;
    this.timeRange = days ?? 30;
    this.branch = p.get('branch') ?? DashboardApp.DEFAULT_BRANCH;
    this.operation = asOperationFilter(p.get('op') ?? '') ?? 'both';
    this.viewMode = asViewMode(p.get('view') ?? '') ?? 'overview';

    if (this.viewMode === 'compare') {
      let raw = p.get('branches');
      if (raw === null) {
        // legacy v1 compare URLs: ?b1=&b2=
        const b1 = p.get('b1'), b2 = p.get('b2');
        if (b1 || b2) raw = [b1, b2].filter(Boolean).join(',');
      }
      this.compareBranches = raw
        ? [...new Set(raw.split(',').map(s => stripBranchPrefix(s.trim())).filter(Boolean))]
            .slice(0, MAX_COMPARE_BRANCHES)
        : [];
      if (raw !== null) this.compareTouched = true;
      this.compareConfigs = (p.get('configs') ?? '')
        .split(',').map(s => s.trim()).filter(Boolean);
      this.compareDays = days ?? 0;
      const nRaw = parseInt(p.get('n') ?? '5', 10);
      this.compareN = Number.isFinite(nRaw) && nRaw >= 1 && nRaw <= 50 ? nRaw : 5;
      this.snapMode = asSnapMode(p.get('snap') ?? '') ?? 'dots';
    }
  }

  /** Normalize branch to short form and drop if not present in loaded branches. */
  private normalizeBranch() {
    if (!this.allBranches.length) return;
    // Convert to short form if needed (handles old URLs with full refs)
    const shortBranch = stripBranchPrefix(this.branch);
    if (this.allBranches.includes(shortBranch)) {
      this.branch = shortBranch;
    } else {
      this.branch = this.allBranches.includes(DashboardApp.DEFAULT_BRANCH)
        ? DashboardApp.DEFAULT_BRANCH
        : this.allBranches[0];
    }
  }

  /** Validate compare selections against loaded data; fall back to defaults. */
  private normalizeCompareState() {
    if (!this.allBranches.length || !this.data) return;
    const validBranches = this.compareBranches.filter(b => this.allBranches.includes(b));
    if (validBranches.length) {
      this.compareBranches = validBranches;
    } else if (!this.compareTouched) {
      this.compareBranches = this.defaultCompareBranches();
    } else {
      this.compareBranches = []; // explicit empty selection stays empty
    }
    this.compareHidden = new Set([...this.compareHidden].filter(b => this.compareBranches.includes(b)));

    const validConfigs = this.compareConfigs.filter(c => this.allGroups.includes(c));
    if (validConfigs.length) {
      this.compareConfigs = validConfigs;
    } else {
      const def = DEFAULT_COMPARE_CONFIGS.filter(c => this.allGroups.includes(c));
      this.compareConfigs = def.length ? def : this.allGroups.slice(0, 2);
    }
  }

  /** Default compare selection: main + most recent non-main branch. */
  private defaultCompareBranches(): string[] {
    const main = this.allBranches.includes(DashboardApp.DEFAULT_BRANCH)
      ? DashboardApp.DEFAULT_BRANCH : this.allBranches[0];
    const other = this.defaultCompareBranch(main);
    return other && other !== main ? [main, other] : [main];
  }

  /** Most recent non-b1 branch by max point timestamp. */
  private defaultCompareBranch(b1: string): string {
    const maxTs = new Map<string, number>();
    for (const key of CHART_KEYS_BY_CONFIG) {
      for (const p of this.data?.charts[key] ?? []) {
        const b = stripBranchPrefix(p.branch);
        if (b === b1) continue;
        const t = new Date(p.timestamp).getTime();
        if (!isNaN(t)) maxTs.set(b, Math.max(maxTs.get(b) ?? 0, t));
      }
    }
    let best = b1, bestT = -1;
    for (const [b, t] of maxTs) if (t > bestT) { best = b; bestT = t; }
    return best;
  }

  private writeUrlParams() {
    const p = new URLSearchParams();
    p.set('view', this.viewMode);
    if (this.splitOperations) p.set('split', '1');
    if (this.viewMode === 'overview') {
      if (this.timeRange !== 30) p.set('days', String(this.timeRange));
      if (this.branch !== DashboardApp.DEFAULT_BRANCH) p.set('branch', this.branch);
      if (this.operation !== 'both') p.set('op', this.operation);
    } else {
      p.set('branches', this.compareBranches.join(','));
      if (this.compareConfigs.length && this.compareConfigs.join(',') !== DEFAULT_COMPARE_CONFIGS.join(',')) {
        p.set('configs', this.compareConfigs.join(','));
      }
      if (this.operation !== 'both') p.set('op', this.operation);
      if (this.compareDays !== 0) p.set('days', String(this.compareDays));
      if (this.compareN !== 5) p.set('n', String(this.compareN));
      if (this.snapMode !== 'dots') p.set('snap', this.snapMode);
    }
    const qs = p.toString();
    try {
      history.replaceState(null, '', qs ? `?${qs}` : window.location.pathname);
    } catch (e) {
      // SecurityError on file:// — silently fall back without URL update.
    }
  }

  private syncControlsFromState() {
    // Mode toggle
    document.getElementById('modeOverview')?.setAttribute('aria-selected', String(this.viewMode === 'overview'));
    document.getElementById('modeCompare')?.setAttribute('aria-selected', String(this.viewMode === 'compare'));
    document.querySelectorAll('.mode-toggle button').forEach(btn => {
      const el = btn as HTMLElement;
      el.classList.toggle('active', el.id === (this.viewMode === 'overview' ? 'modeOverview' : 'modeCompare'));
    });

    for (const [id, split] of [['chartsTogether', false], ['chartsSeparate', true]] as const) {
      const button = document.getElementById(id);
      button?.classList.toggle('active', this.splitOperations === split);
      button?.setAttribute('aria-pressed', String(this.splitOperations === split));
    }

    // Overview controls
    const timeEl = document.getElementById('timeRange') as HTMLSelectElement | null;
    if (timeEl) timeEl.value = String(this.timeRange);

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

    // Derive groups/branches from the config-grouped chart set.
    // Branches are stored in short form (without refs/heads/ and refs/tags/ prefixes).
    this.branchLastUpdated.clear();
    const branchSet = new Set<string>();
    const groupSet = new Set<string>();
    for (const key of CHART_KEYS_BY_CONFIG) {
      for (const pt of this.data.charts[key] ?? []) {
        const branch = stripBranchPrefix(pt.branch);
        branchSet.add(branch);
        const timestamp = Date.parse(pt.timestamp);
        const previous = Date.parse(this.branchLastUpdated.get(branch) ?? '');
        if (Number.isFinite(timestamp) && (!Number.isFinite(previous) || timestamp > previous)) {
          this.branchLastUpdated.set(branch, new Date(timestamp).toISOString());
        }
        groupSet.add(pt.config);
      }
    }
    this.allBranches = [...branchSet].sort((a, b) => {
      if (a === 'main') return -1;
      if (b === 'main') return 1;
      return a.localeCompare(b);
    });

    this.allGroups = [...groupSet].sort();
    this.allGroups.forEach((g, i) => this.colorMap.set(g, i));
  }

  private populateBranchSelector() {
    const host = document.getElementById('branchPickerHost');
    if (!host) return;
    host.replaceChildren(createBranchPicker({
      id: 'branchInput', branches: this.allBranches, value: this.branch,
      lastUpdated: this.branchLastUpdated,
      onSelect: branch => {
        this.branch = branch;
        this.writeUrlParams();
        this.buildCharts();
        this.renderLegend();
        this.updateInfo();
      },
      signal: this.listenerAbort.signal,
    }));
  }

  // ---- Charts ----

  // ---- Render dispatch ----

  private render() {
    const app = document.getElementById('app');
    if (!app || !this.data) return;
    // Tear down previous overview charts (cancel pending RAFs, unbind zoom)
    // before their DOM nodes are removed by `app.innerHTML = ''`.
    for (const chart of this.charts.values()) chart?.destroy?.();
    this.charts.clear();
    app.innerHTML = '';
    this.renderHeader(app);
    if (this.viewMode === 'compare') this.renderCompare(app);
    else this.renderOverview(app);
    this.syncControlsFromState();
    this.renderAboutDialog(app);
    this.updateInfo();
  }

  private renderHeader(app: HTMLElement) {
    const header = document.createElement('header');
    header.className = 'dashboard-header';
    header.innerHTML = `
      <div class="header-top">
        <div class="header-brand">
          <p class="header-kicker">Rawstor · Performance</p>
          <h1>Benchmark Dashboard</h1>
        </div>
        <div class="mode-toggle" role="tablist" aria-label="View mode">
          <button id="modeOverview" role="tab" aria-selected="${this.viewMode === 'overview'}">Overview</button>
          <button id="modeCompare" role="tab" aria-selected="${this.viewMode === 'compare'}">Compare</button>
        </div>
        <button class="btn-about" id="aboutBtn" aria-label="${this.viewMode === 'compare' ? 'About compare view' : 'About test configurations'}">?</button>
      </div>
      <p class="header-subtitle">Interactive dashboard for tracking librawstor fio benchmark results across commits and configurations.</p>
      <div class="info-bar" id="infoBar" role="status" aria-live="polite"></div>
    `;
    app.appendChild(header);
  }

  private renderAboutDialog(app: HTMLElement) {
    const aboutDialog = document.createElement('dialog');
    aboutDialog.className = 'about-dialog';
    aboutDialog.id = 'aboutDialog';
    aboutDialog.setAttribute('aria-labelledby', 'aboutDialogTitle');
    const content = document.createElement('div');
    content.className = 'about-content';

    if (this.viewMode === 'compare') {
      content.innerHTML = `
        <h2 id="aboutDialogTitle">About Compare View</h2>
        <p>Pick up to 8 branches — the <strong>first one is the base</strong> (badge <code>A</code>): all Δ% are computed against it.</p>
        <dl>
          <dt>⌃ on a chip</dt>
          <dd>Make that branch the base (moves it to the first position)</dd>
          <dt>× on a chip</dt>
          <dd>Remove the branch from the comparison</dd>
          <dt>Click a chip</dt>
          <dd>Hide/show that branch's chart lines (the chip dims; the snapshot keeps showing it)</dd>
          <dt>Search field</dt>
          <dd>Add branches (max 8)</dd>
          <dt>Config chips</dt>
          <dd>Choose which configurations get chart cards (All / None shortcuts)</dd>
          <dt>Operations</dt>
          <dd>Read / Write / Both filters both the charts and the snapshot.</dd>
          <dt>Chart time range</dt>
          <dd>Filters the time-series charts only</dd>
          <dt>Snapshot: last N daily points</dt>
          <dd>The snapshot block shows the median of the last N daily points per (config, metric, branch). <strong>N affects only the snapshot</strong>, not the charts.</dd>
        </dl>
        <p><strong>Δ%:</strong> green = improvement (IOPS up, latency down), red = regression, <code>—</code> = no data.</p>
        <p><strong>Snapshot views:</strong> Dots — values on a shared scale, dashed line = base; Bars — heights, outlined bar = base; Table — exact numbers.</p>
        <p>Configuration cards show the backend and separate parameter labels. <strong>QD</strong> means queue depth; <strong>jobs</strong> means parallel fio jobs. Hover a configuration heading or chip to see its original name.</p>
        <button class="btn-close-about" id="closeAbout">Close</button>
      `;
    } else {
      content.innerHTML = `
        <h2 id="aboutDialogTitle">About Test Configurations</h2>
        <p>Cards show the backend with labels for block size, queue depth (QD), parallel fio jobs, and optional build modes. Filters use compact versions of the same labels. Hover a configuration to see its original name.</p>
        <p>Original configuration names follow the pattern:</p>
        <code>perftest[-without-liburing]-{backend}[-legacy]-{blocksize}-{iodepth}-{numjobs}</code>
        <dl>
          <dt>backend</dt>
          <dd><code>file</code> — regular file I/O, <code>ost</code> — object storage target</dd>
          <dt>blocksize</dt>
          <dd>Block size for I/O operations (e.g. <code>4k</code> = 4 KiB)</dd>
          <dt>QD / iodepth</dt>
          <dd>Maximum number of outstanding I/O requests per fio job</dd>
          <dt>jobs / numjobs</dt>
          <dd>Number of parallel fio jobs</dd>
          <dt>without-liburing</dt>
          <dd>Built without liburing support; shown as <code>No liburing</code></dd>
          <dt>legacy</dt>
          <dd>Legacy configuration mode; shown as a separate <code>Legacy</code> label</dd>
        </dl>
        <p>Example: <code>perftest-ost-4k-2-1</code> = Object storage · 4 KiB · QD 2 · 1 job.</p>
        <p>Compare mode has its own help — switch the mode and press <code>?</code> again.</p>
        <button class="btn-close-about" id="closeAbout">Close</button>
      `;
    }
    aboutDialog.appendChild(content);
    app.appendChild(aboutDialog);
  }

  private renderChartLayout(app: HTMLElement) {
    const toolbar = document.createElement('div');
    toolbar.className = 'chart-layout';
    toolbar.innerHTML = `
      <h2 class="chart-layout-title">Charts</h2>
      <div class="chart-layout-choice">
        <span class="chart-layout-label" id="chartLayoutLabel">Read / Write layout</span>
        <div class="snap-toggle" role="group" aria-labelledby="chartLayoutLabel">
          <button type="button" id="chartsTogether">Together</button>
          <button type="button" id="chartsSeparate">Separate</button>
        </div>
      </div>
      <div class="chart-layout-choice">
        <span class="chart-layout-label" id="chartOperationsLabel">Operations</span>
        <div class="snap-toggle" role="radiogroup" aria-labelledby="chartOperationsLabel">
          <button class="op-btn" data-op="read" role="radio" aria-checked="false">Read</button>
          <button class="op-btn" data-op="write" role="radio" aria-checked="false">Write</button>
          <button class="op-btn active" data-op="both" role="radio" aria-checked="true">Both</button>
        </div>
      </div>
      <span class="operation-key"><span aria-hidden="true">●</span> Read <span aria-hidden="true">◆</span> Write</span>
    `;
    app.appendChild(toolbar);
  }

  private renderOverview(app: HTMLElement) {
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
        <label for="branchInput">Branch</label>
        <div class="branch-field">
          <div id="branchPickerHost"></div>
          <button id="refreshBtn" type="button" class="surface-action refresh-action">Refresh</button>
        </div>
      </div>
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
    this.renderChartLayout(app);
    app.appendChild(grid);

    // Tooltip
    const tooltip = document.createElement('div');
    tooltip.className = 'tooltip';
    tooltip.id = 'tooltip';
    app.appendChild(tooltip);

    this.populateBranchSelector();
    this.syncControlsFromState();
    this.buildCharts();
    this.renderLegend();
  }

  private renderCompare(app: HTMLElement) {
    const controlsHost = document.createElement('div');
    app.appendChild(controlsHost);
    this.renderCompareControlsDom(controlsHost);

    const grid = document.createElement('div');
    grid.className = 'compare-charts-grid';
    grid.id = 'compareChartsGrid';
    const summary = document.createElement('section');
    summary.id = 'compareSummary';
    app.appendChild(summary);
    this.renderChartLayout(app);
    app.appendChild(grid);

    const snapshot = document.createElement('div');
    snapshot.id = 'snapshotPanel';
    app.appendChild(snapshot);

    const tooltip = document.createElement('div');
    tooltip.className = 'tooltip';
    tooltip.id = 'tooltip';
    app.appendChild(tooltip);

    this.buildCompareCharts();
    this.renderSnapshotPanel();
  }

  private renderCompareControlsDom(host: HTMLElement) {
    renderCompareControls(host, {
      allBranches: this.allBranches,
      branchLastUpdated: this.branchLastUpdated,
      selectedBranches: this.compareBranches,
      hiddenBranches: this.compareHidden,
      allConfigs: this.allGroups,
      selectedConfigs: this.compareConfigs,
      timeRange: this.compareDays,
      n: this.compareN,
    }, {
      onAddBranch: b => this.addCompareBranch(b),
      onRemoveBranch: b => this.removeCompareBranch(b),
      onToggleBranchVisibility: b => this.toggleCompareBranchVisibility(b),
      onSetBase: b => this.setCompareBase(b),
      onToggleConfig: c => this.toggleCompareConfig(c),
      onAllConfigs: () => this.setCompareConfigs(this.allGroups.slice()),
      onNoConfigs: () => this.setCompareConfigs([]),
      onTimeRange: d => { this.compareDays = d; this.writeUrlParams(); this.buildCompareCharts(); this.updateInfo(); },
      onN: n => {
        if (Number.isFinite(n)) {
          this.compareN = Math.min(50, Math.max(1, n));
          const inp = document.getElementById('compareN') as HTMLInputElement | null;
          if (inp) inp.value = String(this.compareN);
        }
        this.writeUrlParams();
        this.renderSnapshotPanel();
        this.updateInfo();
      },
    }, this.listenerAbort.signal);
  }

  /** Re-render just the controls bar in place (host stays in DOM). */
  private rerenderCompareControls() {
    const host = document.querySelector('.compare-controls') as HTMLElement | null;
    if (host) this.renderCompareControlsDom(host);
  }

  private addCompareBranch(b: string) {
    if (!this.allBranches.includes(b)) return;
    if (this.compareBranches.includes(b)) return;
    if (this.compareBranches.length >= MAX_COMPARE_BRANCHES) return;
    this.compareTouched = true;
    this.compareBranches.push(b);
    this.writeUrlParams();
    this.rerenderCompareAll();
  }

  private removeCompareBranch(b: string) {
    this.compareBranches = this.compareBranches.filter(x => x !== b);
    this.compareTouched = true;
    this.writeUrlParams();
    this.rerenderCompareAll();
  }

  private setCompareBase(b: string) {
    this.compareTouched = true;
    const rest = this.compareBranches.filter(x => x !== b);
    this.compareBranches = [b, ...rest];
    this.writeUrlParams();
    this.rerenderCompareAll();
  }

  private toggleCompareBranchVisibility(b: string) {
    if (this.compareHidden.has(b)) this.compareHidden.delete(b);
    else this.compareHidden.add(b);
    // hidden-состояние не входит в URL (как hiddenGroups в overview)
    this.rerenderCompareControls();
    this.updateCompareVisibility();
  }

  private toggleCompareConfig(c: string) {
    this.compareConfigs = this.compareConfigs.includes(c)
      ? this.compareConfigs.filter(x => x !== c)
      : [...this.compareConfigs, c];
    this.writeUrlParams();
    this.rerenderCompareAll();
  }

  private setCompareConfigs(configs: string[]) {
    this.compareConfigs = configs;
    this.writeUrlParams();
    this.rerenderCompareAll();
  }

  /** Full compare re-render: controls + charts + snapshot + info. */
  private rerenderCompareAll() {
    this.rerenderCompareControls();
    this.buildCompareCharts();
    this.renderSnapshotPanel();
    this.updateInfo();
  }

  /** Visibility-only update for op / branch-hide changes (no chart rebuild). */
  private updateCompareVisibility() {
    const visible = new Set(this.compareBranches.filter(b => !this.compareHidden.has(b)));
    const opSet = this.operation === 'both' ? new Set(['read', 'write']) : new Set([this.operation]);
    for (const chart of this.charts.values()) {
      if (!chart) continue;
      const fg = new Set<string>();
      for (const p of chart.data) {
        if (visible.has(p.group) && opSet.has(p.operation)) fg.add(p.fullGroup);
      }
      chart.updateVisibility(fg);
    }
  }

  private chartSpecs(prefix: string) {
    const keys = CHART_KEYS_BY_CONFIG;
    const metrics: { id: string; title: string; metricType: MetricType; keys: string[]; operation?: ChartDataPoint['operation'] }[] = [
      { id: `${prefix}-iops`, title: 'IOPS', metricType: 'iops' as const, keys: keys.slice(0, 2) },
      { id: `${prefix}-latency`, title: 'Latency', metricType: 'latency' as const, keys: keys.slice(2, 4) },
    ];
    if (!this.splitOperations) return metrics;
    const operations = ['read', 'write'] as const;
    return metrics.flatMap(metric => operations.flatMap((op, i) =>
      this.operation === 'both' || this.operation === op
        ? [{ ...metric, id: `${metric.id}-${op}`, operation: op, keys: [metric.keys[i]] }]
        : []));
  }

  private buildCharts() {
    const grid = document.getElementById('chartsGrid');
    if (!grid || !this.data) return;
    // Tear down previous chart instances (cancel pending RAFs, unbind zoom)
    // before the DOM nodes are removed.
    for (const chart of this.charts.values()) chart?.destroy?.();
    this.charts.clear();
    grid.innerHTML = '';

    const opSet = this.operation === 'both' ? new Set(['read', 'write']) : new Set([this.operation]);
    const chartsToRender = this.chartSpecs('chart');

    for (const cfg of chartsToRender) {
      const container = document.createElement('div');
      container.className = 'chart-container';
      container.id = cfg.id;
      grid.appendChild(container);

      const cutoff = this.timeRange > 0 ? Date.now() - this.timeRange * 86400000 : null;
      const branchFiltered = cfg.keys.flatMap(key => this.data?.charts[key] ?? []).filter(p =>
        stripBranchPrefix(p.branch) === this.branch && (cutoff === null || Date.parse(p.timestamp) >= cutoff));

      const chart = createChart({
        container: d3.select(container) as unknown as d3.Selection<HTMLDivElement, unknown, HTMLElement, unknown>,
        title: cfg.title,
        operation: cfg.operation,
        data: branchFiltered,
        metricType: cfg.metricType,
        timeRangeDays: this.timeRange,
        visibleGroups: new Set(this.allGroups.filter(group => !this.hiddenGroups.has(group))),
        visibleOperations: opSet,
        colorMap: this.colorMap,
        onGroupColors: (groups, colors) => {
          for (const [g, c] of colors) this.groupColorMap.set(g, c);
        },
      });

      if (chart) this.charts.set(cfg.id, chart);
    }
  }

  private buildCompareCharts() {
    const grid = document.getElementById('compareChartsGrid');
    if (!grid || !this.data) return;
    for (const chart of this.charts.values()) chart?.destroy?.();
    this.charts.clear();
    grid.innerHTML = '';

    if (!this.compareBranches.length) {
      grid.appendChild(this.makeCompareEmptyState(
        'Select at least one branch', 'Restore default branches',
        () => { this.compareBranches = this.defaultCompareBranches(); this.compareHidden.clear(); this.writeUrlParams(); this.rerenderCompareAll(); }));
      return;
    }
    if (!this.compareConfigs.length) {
      grid.appendChild(this.makeCompareEmptyState('No configs selected', null, null));
      return;
    }

    const visibleBranches = new Set(this.compareBranches.filter(b => !this.compareHidden.has(b)));
    // Данные — по ВСЕМ выбранным веткам (включая скрытые): createChart создаёт
    // линии всех групп из data и прячет через opacity, поэтому updateCompareVisibility
    // позже может раскрыть скрытую ветку без пересоздания графика.
    const allSelected = new Set(this.compareBranches);
    const opSet = this.operation === 'both' ? new Set(['read', 'write']) : new Set([this.operation]);
    const branchColorMap = new Map<string, number>();
    this.compareBranches.forEach((b, i) => branchColorMap.set(b, i));
    const cutoff = this.compareDays > 0 ? new Date(Date.now() - this.compareDays * 86400000) : null;

    this.compareConfigs.forEach((config, cfgIdx) => {
      const card = document.createElement('section');
      card.className = 'config-card';
      const h = document.createElement('h3');
      h.className = 'config-card-title';
      renderConfigHeading(h, config);
      card.appendChild(h);
      const pair = document.createElement('div');
      pair.className = 'config-card-pair';
      card.appendChild(pair);
      grid.appendChild(card);

      for (const mc of this.chartSpecs(`cmp-${cfgIdx}`)) {
        const container = document.createElement('div');
        container.className = 'chart-container';
        pair.appendChild(container);
        const data = this.compareChartPoints(mc.keys, config, allSelected, cutoff);
        const chart = createChart({
          container: d3.select(container) as unknown as d3.Selection<HTMLDivElement, unknown, HTMLElement, unknown>,
          title: mc.title,
          operation: mc.operation,
          data,
          metricType: mc.metricType,
          timeRangeDays: this.compareDays,
          visibleGroups: visibleBranches,
          visibleOperations: opSet,
          colorMap: branchColorMap,
          onGroupColors: (groups, colors) => {
            for (const [g, c] of colors) this.groupColorMap.set(g, c);
          },
        });
        if (chart) this.charts.set(mc.id, chart);
      }
    });
  }

  /** Filter points for one compare chart and remap group -> branch short name
   *  so createChart draws one line per branch. `branches` must contain ALL
   *  selected branches (hidden included) — hiding is done via visibleGroups. */
  private compareChartPoints(
    keys: string[],
    config: string,
    branches: Set<string>,
    cutoff: Date | null,
  ): ChartDataPoint[] {
    const out: ChartDataPoint[] = [];
    for (const key of keys) {
      for (const p of this.data?.charts[key] ?? []) {
        if (p.config !== config) continue;
        const b = stripBranchPrefix(p.branch);
        if (!branches.has(b)) continue;
        if (cutoff && new Date(p.timestamp) < cutoff) continue;
        out.push({ ...p, group: b });
      }
    }
    return out;
  }

  private makeCompareEmptyState(
    message: string,
    buttonLabel: string | null,
    onRestore: (() => void) | null,
  ): HTMLElement {
    const wrap = document.createElement('div');
    wrap.className = 'compare-empty';
    const p = document.createElement('p');
    p.textContent = message;
    wrap.appendChild(p);
    if (buttonLabel && onRestore) {
      const btn = document.createElement('button');
      btn.className = 'btn-retry';
      btn.textContent = buttonLabel;
      btn.addEventListener('click', onRestore);
      wrap.appendChild(btn);
    }
    return wrap;
  }

  private renderSnapshotPanel() {
    const panel = document.getElementById('snapshotPanel');
    if (!panel || !this.data) return;
    const sections = computeSnapshotSections(
      this.data, this.compareBranches, this.compareConfigs, this.compareN, this.operation);
    const summary = document.getElementById('compareSummary');
    if (summary) renderCompareSummary(summary, sections, this.compareBranches, this.compareN);
    const emptyMsg = this.compareBranches.length < 2
      ? 'Add at least one more branch to compare — Δ% needs a base and another branch'
      : undefined;
    renderSnapshot(panel, sections, this.snapMode, m => {
      this.snapMode = m;
      this.writeUrlParams();
    }, emptyMsg, this.listenerAbort.signal);
  }

  // ---- Legend ----

  private renderLegend() {
    const el = document.getElementById('legend');
    if (!el) return;
    el.innerHTML = '';

    const title = document.createElement('h3');
    title.textContent = 'Configurations';
    el.appendChild(title);

    const hint = document.createElement('div');
    hint.className = 'configuration-help';
    hint.innerHTML = `
      <span><strong>QD</strong> Queue depth</span>
      <span><strong>Jobs</strong> Parallel fio jobs</span>
      <button class="surface-action" id="aboutBtnLegend" type="button">About configurations</button>
    `;
    el.appendChild(hint);

    const controls = document.createElement('div');
    controls.className = 'legend-controls';
    const showAll = document.createElement('button');
    showAll.className = 'surface-action';
    showAll.textContent = 'Show All';
    showAll.addEventListener('click', () => this.showAllGroups());
    const hideAll = document.createElement('button');
    hideAll.className = 'surface-action';
    hideAll.textContent = 'Hide All';
    hideAll.addEventListener('click', () => this.hideAllGroups());
    controls.append(showAll, hideAll);
    el.appendChild(controls);

    const scroll = document.createElement('div');
    scroll.className = 'legend-table-wrap';
    const table = document.createElement('table');
    table.className = 'legend-table';
    table.setAttribute('aria-label', 'Configuration visibility');
    const headings = table.createTHead().insertRow();
    for (const label of ['Storage', 'Block', 'QD', 'Jobs', 'Mode']) {
      const th = document.createElement('th');
      th.scope = 'col';
      th.textContent = label;
      headings.appendChild(th);
    }
    const body = table.createTBody();

    for (const group of this.allGroups) {
      const color = this.groupColorMap.get(group) ?? getColor(this.colorMap.get(group) ?? 0);
      const item = document.createElement('button');
      item.className = 'legend-item';
      item.dataset.group = group;
      item.type = 'button';
      item.setAttribute('role', 'checkbox');
      item.classList.toggle('hidden', this.hiddenGroups.has(group));
      item.setAttribute('aria-checked', String(!this.hiddenGroups.has(group)));
      const dot = document.createElement('span');
      dot.className = 'legend-dot';
      dot.style.background = color;
      const label = document.createElement('span');
      label.className = 'legend-label';
      const config = describeConfig(group);
      label.textContent = config.title;
      item.setAttribute('aria-label', config.compact);
      const row = body.insertRow();
      const name = document.createElement('th');
      name.scope = 'row';
      name.appendChild(item);
      row.appendChild(name);
      const [block, depth, jobs, ...modes] = config.tags;
      for (const value of [block, depth?.replace('QD ', ''), jobs, modes.join(' · ')]) {
        row.insertCell().textContent = value || '—';
      }
      item.title = group;
      item.append(dot, label);
      item.addEventListener('click', () => this.toggleGroup(group));
      item.addEventListener('keydown', (e: KeyboardEvent) => {
        // Space/Enter handled natively by <button>; only handle arrows.
        if (e.key === 'ArrowDown' || e.key === 'ArrowRight') {
          e.preventDefault();
          row.nextElementSibling?.querySelector<HTMLElement>('.legend-item')?.focus();
        } else if (e.key === 'ArrowUp' || e.key === 'ArrowLeft') {
          e.preventDefault();
          row.previousElementSibling?.querySelector<HTMLElement>('.legend-item')?.focus();
        }
      });
    }

    scroll.appendChild(table);
    el.appendChild(scroll);

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
    if (this.viewMode === 'compare') {
      const texts = [
        `${this.compareBranches.length} branches`,
        `${this.compareConfigs.length} configs`,
        `base: ${this.compareBranches[0] ?? '—'}`,
        `N=${this.compareN}`,
        this.compareDays === 0 ? 'Charts: all time' : `Charts: last ${this.compareDays} days`,
      ];
      el.textContent = '';
      for (const text of texts) {
        const span = document.createElement('span');
        span.textContent = text;
        el.appendChild(span);
      }
      return;
    }
    if (!this.data) return;

    const s = this.data.summary;
    const tr = this.timeRange === 0 ? 'All time' : `Last ${this.timeRange} days`;
    const br = stripBranchPrefix(this.branch);
    const branchCount = `${s.total_branches} branches`;
    const generated = this.data.generated_at
      ? `Updated: ${new Date(this.data.generated_at).toLocaleDateString()}`
      : '';

    el.textContent = '';
    for (const text of [`${s.total_tests} tests`, `${s.total_configurations} configs`, branchCount, br, tr, generated]) {
      if (!text) continue;
      const span = document.createElement('span');
      span.textContent = text;
      el.appendChild(span);
    }
  }

  // ---- Events ----

  private bindEvents() {
    const signal = this.listenerAbort.signal;

    for (const [id, split] of [['chartsTogether', false], ['chartsSeparate', true]] as const) {
      document.getElementById(id)?.addEventListener('click', () => {
        if (this.splitOperations === split) return;
        this.splitOperations = split;
        this.syncControlsFromState();
        this.writeUrlParams();
        if (this.viewMode === 'compare') this.buildCompareCharts();
        else this.buildCharts();
      }, { signal });
    }


    // Mode toggle
    document.getElementById('modeOverview')?.addEventListener('click', () => {
      if (this.viewMode !== 'overview') {
        this.viewMode = 'overview';
        this.writeUrlParams();
        this.hiddenGroups.clear();
        this.render();
        this.bindEvents();
      }
    }, { signal });
    document.getElementById('modeCompare')?.addEventListener('click', () => {
      if (this.viewMode !== 'compare') {
        this.viewMode = 'compare';
        this.writeUrlParams();
        this.hiddenGroups.clear();
        this.render();
        this.bindEvents();
      }
    }, { signal });

    document.getElementById('timeRange')?.addEventListener('change', (e) => {
      this.timeRange = parseInt((e.target as HTMLSelectElement).value, 10);
      if (isNaN(this.timeRange)) this.timeRange = 30;
      this.writeUrlParams();
      this.buildCharts();
      this.renderLegend();
      this.updateInfo();
    }, { signal });

    const selectOperation = (btn: HTMLElement) => {
      const op = asOperationFilter(btn.dataset.op ?? '');
      if (!op) return;
      this.operation = op;
      this.syncControlsFromState();
      this.writeUrlParams();
      if (this.viewMode === 'compare') {
        if (this.splitOperations) this.buildCompareCharts();
        else this.updateCompareVisibility();
        this.renderSnapshotPanel();
      } else if (this.splitOperations) {
        this.buildCharts();
        this.renderLegend();
      } else {
        this.updateChartsVisibility();
      }
      this.updateInfo();
    };

    document.querySelectorAll('.op-btn').forEach(btnEl => {
      const btn = btnEl as HTMLButtonElement;
      btn.addEventListener('click', () => selectOperation(btn), { signal });
      btn.addEventListener('keydown', ((e: KeyboardEvent) => {
        const container = btn.closest('[role="radiogroup"]');
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
          selectOperation(next);
        }
      }) as EventListener, { signal });
    });

    document.querySelector(this.viewMode === 'compare' ? '.compare-controls' : '.controls-bar')
      ?.addEventListener('click', async event => {
      const refreshButton = (event.target as HTMLElement).closest<HTMLButtonElement>('#refreshBtn');
      if (!refreshButton || refreshButton.disabled) return;
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
        this.normalizeCompareState();
        this.render();
        this.bindEvents();
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
      const legend = document.getElementById('legend') ?? document.querySelector('.charts-grid, .compare-charts-grid');
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
