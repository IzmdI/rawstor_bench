import type { DashboardData } from './types';
import { CHART_KEYS_BY_CONFIG } from './types';

export async function loadData(url = './data.json', signal?: AbortSignal): Promise<DashboardData> {
  const res = await fetch(url, { signal });
  if (!res.ok) throw new Error(`Failed to load data: ${res.status}`);
  const data: DashboardData = await res.json();
  validate(data);
  return data;
}

function validate(data: unknown): asserts data is DashboardData {
  if (!data || typeof data !== 'object') throw new Error('Invalid data');
  const d = data as Record<string, unknown>;

  if (typeof d.generated_at !== 'string') throw new Error('Missing generated_at');

  // filter
  if (!d.filter || typeof d.filter !== 'object') throw new Error('Missing filter');
  const f = d.filter as Record<string, unknown>;
  if (typeof f.days !== 'number') throw new Error('Missing filter.days');
  if (f.cutoff_date !== null && typeof f.cutoff_date !== 'string') throw new Error('Invalid filter.cutoff_date');

  // summary
  if (!d.summary || typeof d.summary !== 'object') throw new Error('Missing summary');
  const s = d.summary as Record<string, unknown>;
  if (typeof s.total_tests !== 'number') throw new Error('Missing summary.total_tests');
  if (!Array.isArray(s.configurations)) throw new Error('Missing summary.configurations');
  if (!Array.isArray(s.branches)) throw new Error('Missing summary.branches');

  // charts
  if (!d.charts || typeof d.charts !== 'object') throw new Error('Missing charts');

  const charts = d.charts as Record<string, unknown[]>;
  const expectedKeys = new Set(CHART_KEYS_BY_CONFIG);
  const actualKeys = new Set(Object.keys(charts));
  const hasExpected = [...expectedKeys].some(k => actualKeys.has(k));
  if (!hasExpected) throw new Error('No expected chart keys found in data');

  for (const [key, points] of Object.entries(charts)) {
    if (!Array.isArray(points)) throw new Error(`Chart "${key}" is not an array`);
    for (const [i, p] of points.entries()) {
      if (!p || typeof p !== 'object') throw new Error(`Invalid point ${i} in "${key}"`);
      const pt = p as Record<string, unknown>;
      if (typeof pt.group !== 'string') throw new Error(`Point ${i} in "${key}": missing group`);
      if (typeof pt.timestamp !== 'string') throw new Error(`Point ${i} in "${key}": missing timestamp`);
      if (typeof pt.value !== 'number') throw new Error(`Point ${i} in "${key}": missing value`);
      if (typeof pt.commit_sha !== 'string') throw new Error(`Point ${i} in "${key}": missing commit_sha`);
      if (typeof pt.branch !== 'string') throw new Error(`Point ${i} in "${key}": missing branch`);
      if (typeof pt.config !== 'string') throw new Error(`Point ${i} in "${key}": missing config`);
      if (typeof pt.test_url !== 'string') throw new Error(`Point ${i} in "${key}": missing test_url`);
      if (pt.operation !== 'read' && pt.operation !== 'write') throw new Error(`Point ${i} in "${key}": invalid operation`);
    }
  }
}
