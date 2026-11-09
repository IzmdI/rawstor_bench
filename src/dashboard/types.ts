// ---- Raw data point from data.json charts ----

export interface ChartDataPoint {
  group: string;
  timestamp: string;
  value: number;
  commit_sha: string;
  branch: string;
  config: string;
  test_url: string;
  operation: 'read' | 'write';
}

// ---- data.json top-level structure ----

export interface DashboardFilter {
  days: number;
  cutoff_date: string | null;
  applied: boolean;
}

export interface DashboardSummary {
  total_tests: number;
  tests_without_date: number;
  total_configurations: number;
  total_branches: number;
  configurations: string[];
  branches: string[];
  time_range: {
    start: string | null;
    end: string | null;
  };
}

export interface DashboardData {
  generated_at: string;
  filter: DashboardFilter;
  summary: DashboardSummary;
  charts: Record<string, ChartDataPoint[]>;
}

// ---- Dashboard state ----

export type OperationFilter = 'read' | 'write' | 'both';
export type MetricType = 'iops' | 'latency';

const OPERATION_FILTERS: OperationFilter[] = ['read', 'write', 'both'];

export function asOperationFilter(value: string): OperationFilter | null {
  return OPERATION_FILTERS.includes(value as OperationFilter) ? (value as OperationFilter) : null;
}

// ---- Processed point for D3 rendering ----

export interface ProcessedPoint {
  group: string;
  timestamp: Date;
  value: number;
  commit_sha: string;
  branch: string;
  config: string;
  test_url: string;
  operation: 'read' | 'write';
  fullGroup: string; // "groupName - read|write"
}

// ---- Chart state returned by createChart ----

export interface ChartState {
  data: ProcessedPoint[];
  fullGroups: string[];
  lines: Map<string, d3.Selection<SVGPathElement, ProcessedPoint[], SVGGElement, undefined>>;
  dots: Map<string, d3.Selection<SVGCircleElement, ProcessedPoint, SVGGElement, undefined>>;
  updateVisibility(visibleGroups: Set<string>): void;
  /** Cancel pending RAF and unbind zoom — call before the chart DOM is replaced. */
  destroy(): void;
}

// ---- Tooltip data ----

export interface TooltipData {
  group: string;
  operation: 'read' | 'write';
  value: number;
  timestamp: Date;
  branch: string;
  config: string;
  commit_sha: string;
}

// ---- Chart data keys mapping ----

export const CHART_KEYS_BY_CONFIG: string[] = [
  'iops_read_by_config',
  'iops_write_by_config',
  'latency_read_by_config',
  'latency_write_by_config',
];

// ---- Compare view ----

export type ViewMode = 'overview' | 'compare';
const VIEW_MODES: ViewMode[] = ['overview', 'compare'];
export function asViewMode(v: string): ViewMode | null {
  return VIEW_MODES.includes(v as ViewMode) ? (v as ViewMode) : null;
}

export type MetricKey = 'iops_read' | 'iops_write' | 'latency_read' | 'latency_write';

export interface MetricSpec {
  key: MetricKey;
  chartKey: string;        // data.charts key, e.g. 'iops_read_by_config'
  metricType: MetricType;  // 'iops' | 'latency'
  operation: 'read' | 'write';
  label: string;           // e.g. 'IOPS read'
}

export const METRIC_SPECS: MetricSpec[] = [
  { key: 'iops_read',    chartKey: 'iops_read_by_config',    metricType: 'iops',    operation: 'read',  label: 'IOPS read' },
  { key: 'iops_write',   chartKey: 'iops_write_by_config',   metricType: 'iops',    operation: 'write', label: 'IOPS write' },
  { key: 'latency_read', chartKey: 'latency_read_by_config', metricType: 'latency', operation: 'read',  label: 'Latency read' },
  { key: 'latency_write',chartKey: 'latency_write_by_config',metricType: 'latency', operation: 'write', label: 'Latency write' },
];

// ---- Compare view v2 (multi-branch) ----

export type SnapMode = 'dots' | 'bars' | 'table';
const SNAP_MODES: SnapMode[] = ['dots', 'bars', 'table'];

/** Runtime guard for the snapshot view-mode URL param. */
export function asSnapMode(v: string): SnapMode | null {
  return SNAP_MODES.includes(v as SnapMode) ? (v as SnapMode) : null;
}

/** Max branches selectable in compare mode (readability of lines). */
export const MAX_COMPARE_BRANCHES = 8;

/** Default configs preselected in compare mode (user's priority configs). */
export const DEFAULT_COMPARE_CONFIGS: string[] = [
  'perftest-ost-4k-1-1',
  'perftest-ost-4k-2-1',
];

/** One branch's result in one (config, metric) snapshot row. */
export interface SnapshotCell {
  value: number | null;   // median of last N; null = no data
  n: number;              // samples behind the median (0 when value null)
  deltaPct: number | null; // vs base; null when base/self missing or base == 0
  better: boolean | null;  // green/red direction; null when deltaPct null
}

/** One metric row of a snapshot section; cells align with SnapshotSection.branches. */
export interface SnapshotRow {
  metric: MetricKey;
  metricType: MetricType;
  operation: 'read' | 'write';
  label: string;
  cells: SnapshotCell[];
}

/** Snapshot block for one config: branches[0] is the base. */
export interface SnapshotSection {
  config: string;
  branches: string[]; // short branch names, order = selection order
  rows: SnapshotRow[];
}

/** Current compare-mode control values, consumed by renderCompareControls. */
export interface CompareControlState {
  allBranches: string[];
  branchLastUpdated: ReadonlyMap<string, string>;
  selectedBranches: string[];
  hiddenBranches: Set<string>;
  allConfigs: string[];
  selectedConfigs: string[];
  operation: OperationFilter;
  timeRange: number;
  n: number;
}

/** Callbacks wired by main.ts to compare-control interactions. */
export interface CompareControlHandlers {
  onAddBranch(branch: string): void;
  onRemoveBranch(branch: string): void;
  onToggleBranchVisibility(branch: string): void;
  onSetBase(branch: string): void;
  onToggleConfig(config: string): void;
  onAllConfigs(): void;
  onNoConfigs(): void;
  onOperation(op: OperationFilter): void;
  onTimeRange(days: number): void;
  onN(n: number): void;
}
