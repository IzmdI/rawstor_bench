import { formatConfigLabel } from './config-label';
import type { MetricType, TooltipData } from './types';

// ---- HTML escaping ----

const ESCAPE_MAP: Record<string, string> = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' };

export function escapeHtml(s: string): string {
  return s.replace(/[&<>"']/g, c => ESCAPE_MAP[c]);
}

// ---- 32-color palette ----

const PALETTE = [
  '#7654b5', '#008891', '#e15759', '#76b7b2', '#59a14f',
  '#edc948', '#b07aa1', '#ff9da7', '#9c755f', '#bab0ac',
  '#1b9e77', '#d95f02', '#7570b3', '#e7298a', '#66a61e',
  '#e6ab02', '#a6761d', '#666666', '#1f77b4', '#ff7f0e',
  '#2ca02c', '#d62728', '#9467bd', '#8c564b', '#e377c2',
  '#7f7f7f', '#bcbd22', '#17becf', '#aec7e8', '#ffbb78',
  '#98df8a', '#ff9896',
];

export function getColor(index: number): string {
  return PALETTE[index % PALETTE.length];
}

// ---- Operation styles ----

interface OperationStyle {
  strokeDasharray: string;
  strokeWidth: number;
}

const OPERATION_STYLES: Record<'read' | 'write', OperationStyle> = {
  read: { strokeDasharray: 'none', strokeWidth: 2.5 },
  write: { strokeDasharray: '6,3', strokeWidth: 2 },
};

export function getOperationStyle(operation: 'read' | 'write'): OperationStyle {
  return OPERATION_STYLES[operation] ?? OPERATION_STYLES.read;
}

// ---- Safe CSS class name ----

export function safeClassName(name: string): string {
  return name.replace(/[^a-zA-Z0-9]/g, '-').toLowerCase();
}

// ---- Date formatting ----

export function formatDate(date: Date, timeRangeDays: number): string {
  // timeRangeDays === 0 means "All time" — multi-year span, skip HH:MM.
  if (timeRangeDays > 0 && timeRangeDays < 15) {
    return (
      date.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit', hour12: false }) +
      ' ' +
      date.toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit' })
    );
  }
  return date.toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit', year: '2-digit' });
}

// ---- Metric value formatting ----

export function formatMetricValue(value: number, metricType: MetricType): string {
  if (metricType === 'iops') {
    if (value >= 1_000_000) return (value / 1_000_000).toFixed(2) + ' MIOPS';
    if (value >= 1_000) return (value / 1_000).toFixed(1) + ' kIOPS';
    return value.toFixed(0) + ' IOPS';
  }
  // latency in ms
  if (value >= 1000) return (value / 1000).toFixed(2) + ' s';
  if (value >= 1) return value.toFixed(2) + ' ms';
  return value.toFixed(3) + ' ms';
}

// ---- Y-axis tick formatting ----

export function formatYAxis(value: number, metricType: MetricType): string {
  if (metricType === 'iops') {
    if (value >= 1_000_000) return (value / 1_000_000).toFixed(1) + 'M';
    if (value >= 1_000) return (value / 1_000).toFixed(1) + 'k';
    return value.toFixed(0);
  }
  // latency in ms — match formatMetricValue convention (>=1000 -> seconds)
  if (value >= 1000) return (value / 1000).toFixed(1) + 's';
  return value >= 1 ? value.toFixed(1) : value.toFixed(3);
}

// ---- Tooltip ----

export class Tooltip {
  private el: HTMLElement | null = null;

  reset(): void {
    this.el = null;
  }

  private getElement(): HTMLElement | null {
    if (!this.el) this.el = document.getElementById('tooltip');
    return this.el;
  }

  show(event: MouseEvent, data: TooltipData, metricType: MetricType, timeRangeDays: number): void {
    const el = this.getElement();
    if (!el) return;
    el.setAttribute('role', 'tooltip');

    const valueStr = formatMetricValue(data.value, metricType);
    const dateStr = formatDate(data.timestamp, timeRangeDays);
    const branchShort = stripBranchPrefix(data.branch);
    const commitShort = data.commit_sha.substring(0, 8);

    const operation = data.operation === 'read' ? '● Read' : '◆ Write';
    el.innerHTML =
      `<div class="tooltip-header"><span class="tooltip-operation">${operation}</span><span class="tooltip-date">${escapeHtml(dateStr)}</span></div>` +
      `<div class="tooltip-metric">${escapeHtml(valueStr)}</div>` +
      `<div class="tooltip-branch">${escapeHtml(branchShort)}</div>` +
      `<div class="tooltip-meta" title="${escapeHtml(data.config)}">${escapeHtml(formatConfigLabel(data.config))}</div>` +
      `<div class="tooltip-footer"><span class="tooltip-commit">${escapeHtml(commitShort)}</span><span class="tooltip-hint">Click for test details ↗</span></div>`;

    el.classList.add('visible');

    const rect = el.getBoundingClientRect();
    const gap = 12;
    const x = Math.min(event.clientX + gap, window.innerWidth - rect.width - gap);
    const above = event.clientY - rect.height - gap;
    const y = above >= gap ? above : event.clientY + gap;
    el.style.left = Math.max(gap, x) + 'px';
    el.style.top = Math.max(gap, Math.min(y, window.innerHeight - rect.height - gap)) + 'px';
  }

  hide(): void {
    this.getElement()?.classList.remove('visible');
  }
}

// ---- Branch display name ----

export function stripBranchPrefix(branch: string): string {
  if (!branch) return 'Unknown';
  return branch.replace(/^refs\/heads\//, '').replace(/^refs\/tags\//, '');
}
