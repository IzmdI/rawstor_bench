import assert from 'node:assert/strict';
import { test } from 'node:test';
import { build } from 'esbuild';
import { fileURLToPath } from 'node:url';

const { outputFiles } = await build({
  entryPoints: [fileURLToPath(new URL('../src/dashboard/config-label.ts', import.meta.url))],
  bundle: true, write: false, format: 'esm', platform: 'node',
});
const { describeConfig, formatConfigLabel } = await import(
  `data:text/javascript;base64,${Buffer.from(outputFiles[0].contents).toString('base64')}`);

test('labels use iodepth before numjobs and show binary block units', () => {
  assert.equal(formatConfigLabel('perftest-ost-4k-2-1'), 'OST · 4 KiB · QD 2 · 1 job');
  assert.equal(formatConfigLabel('perftest-file-1m-8-4'), 'File · 1 MiB · QD 8 · 4 jobs');
  assert.deepEqual(describeConfig('perftest-ost-4k-2-1'), {
    title: 'Object storage', tags: ['4 KiB', 'QD 2', '1 job'],
    compact: 'OST · 4 KiB · QD 2 · 1 job',
  });
});

test('No liburing and Legacy remain separate explicit labels', () => {
  assert.equal(formatConfigLabel('perftest--without-liburing-ost-legacy-4k-2-1'),
    'OST · 4 KiB · QD 2 · 1 job · No liburing · Legacy');
  assert.equal(formatConfigLabel('perftest-without-liburing-file-4k-1-1'),
    'File · 4 KiB · QD 1 · 1 job · No liburing');
});

test('all existing backend, depth and build combinations retain unique labels', () => {
  const labels = [];
  for (const build of ['', '-without-liburing-']) for (const backend of ['file', 'ost']) for (const qd of [1, 2]) {
    labels.push(formatConfigLabel(`perftest-${build}${backend}-4k-${qd}-1`));
  }
  assert.equal(new Set(labels).size, 8);
  assert.equal(labels.some(label => label.includes('perftest')), false);
});

test('unrecognized names are preserved rather than partially misinterpreted', () => {
  for (const name of ['future-backend-4k-2-1', '<new-config>', 'perftest-ost-4k-2-1-extra']) {
    assert.equal(formatConfigLabel(name), name);
    assert.deepEqual(describeConfig(name), { title: name, tags: [], compact: name });
  }
});
