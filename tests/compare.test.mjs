import assert from 'node:assert/strict';
import { test } from 'node:test';
import { build } from 'esbuild';
import { fileURLToPath } from 'node:url';

const { outputFiles } = await build({
  entryPoints: [fileURLToPath(new URL('../src/dashboard/compare.ts', import.meta.url))],
  bundle: true, write: false, format: 'esm', platform: 'node',
});
const { computeSnapshotSections } = await import(
  `data:text/javascript;base64,${Buffer.from(outputFiles[0].contents).toString('base64')}`);

const data = { charts: {} };
for (const metric of ['iops', 'latency']) {
  for (const operation of ['read', 'write']) {
    data.charts[`${metric}_${operation}_by_config`] = ['main', 'fix/test'].flatMap(branch =>
      [10, 20, 30].map((value, i) => ({
        config: 'test', group: 'test', branch: `refs/heads/${branch}`, operation,
        timestamp: `2026-01-0${i + 1}T00:00:00Z`, value,
      })));
  }
}

for (const operation of ['read', 'write', 'both']) {
  test(`snapshot respects ${operation} operation selection`, () => {
    const [section] = computeSnapshotSections(data, ['main', 'fix/test'], ['test'], 2, operation);
    assert.deepEqual(section.rows.map(row => row.operation),
      operation === 'both' ? ['read', 'write', 'read', 'write'] : [operation, operation]);
    assert.equal(section.rows[0].cells[0].value, 25);
    assert.equal(section.rows[0].cells[0].n, 2);
  });
}

test('snapshot omits configs with no data for the selected operation', () => {
  const readOnly = { charts: { iops_read_by_config: data.charts.iops_read_by_config } };
  assert.deepEqual(computeSnapshotSections(readOnly, ['main', 'fix/test'], ['test'], 2, 'write'), []);
});
