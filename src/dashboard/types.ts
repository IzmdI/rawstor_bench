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

export type CompareSort = 'cfg' | 'delta' | 'abs';
const COMPARE_SORTS: CompareSort[] = ['cfg', 'delta', 'abs'];
export function asCompareSort(v: string): CompareSort | null {
  return COMPARE_SORTS.includes(v as CompareSort) ? (v as CompareSort) : null;
}

export interface CompareSample { value: number; n: number; }

export interface CompareRow {
  config: string;
  metric: MetricKey;
  metricType: MetricType;
  operation: 'read' | 'write';
  a: CompareSample;
  b: CompareSample;
  deltaPct: number | null;  // null if A==0
  better: boolean;          // true if B improves over A wrt metric direction
}
