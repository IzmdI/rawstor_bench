// Integration tests against the real app and D3. Requires Node >=22,
// Edge/Chromium (BROWSER_PATH on other systems), and access to the D3 CDN.
import assert from 'node:assert/strict';
import { test } from 'node:test';
import { build } from 'esbuild';
import { createServer } from 'node:http';
import { spawn } from 'node:child_process';
import { existsSync, mkdtempSync, readFileSync, rmSync, writeFileSync, mkdirSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import vm from 'node:vm';

const root = fileURLToPath(new URL('../', import.meta.url));
const browser = process.env.BROWSER_PATH ?? 'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe';
const sleep = ms => new Promise(resolve => setTimeout(resolve, ms));

test('dashboard browser regressions', { skip: !existsSync(browser) ? 'Set BROWSER_PATH to Edge or Chromium' : false, timeout: 90000 }, async t => {
  const response = await fetch('https://cdn.jsdelivr.net/npm/d3@7/dist/d3.min.js', { signal: AbortSignal.timeout(15000) });
  assert.equal(response.ok, true, 'D3 CDN must be available');
  const d3Source = await response.text();
  const context = {};
  vm.runInNewContext(d3Source, context);
  const d3Module = Object.keys(context.d3).map(key => `export const ${key}=globalThis.d3.${key};`).join('\n');
  const bundle = await build({ entryPoints: [join(root, 'src/dashboard/main.ts')], bundle: true,
    write: false, format: 'esm', external: ['d3'] });
  const configs = ['perftest-ost-4k-1-1', 'perftest-ost-4k-2-1'];
  const charts = {};
  const latestTimestamp = new Date(Date.now() - 3600000).toISOString();
  for (const metric of ['iops', 'latency']) for (const op of ['read', 'write']) {
    charts[`${metric}_${op}_by_config`] = configs.flatMap(config => ['main', 'feature/test'].flatMap(branch =>
      [1, 2, 3].map(day => ({ group: config, config, branch: `refs/heads/${branch}`,
        timestamp: new Date(Date.now() - day * 86400000).toISOString(), value: day * 10,
        commit_sha: 'abcdef', operation: op, test_url: `../${config}/abcdef.md` }))));
  }
  charts.latency_write_by_config.push({ ...charts.latency_write_by_config[0], timestamp: latestTimestamp });
  const data = { generated_at: new Date().toISOString(), filter: { days: 0, cutoff_date: null, applied: false },
    summary: { total_tests: 12, total_configurations: 2, total_branches: 2, configurations: configs,
      branches: ['refs/heads/main', 'refs/heads/feature/test'], time_range: { start: null, end: null } }, charts };
  const html = `<!doctype html><link rel="stylesheet" href="/styles.css"><script src="/d3.umd.js"></script>
    <script type="importmap">{"imports":{"d3":"/d3.mjs"}}</script><main id="app"></main><script type="module" src="/bundle.js"></script>`;
  const routes = { '/': ['text/html', html], '/bundle.js': ['text/javascript', bundle.outputFiles[0].text],
    '/d3.umd.js': ['text/javascript', d3Source], '/d3.mjs': ['text/javascript', d3Module],
    '/styles.css': ['text/css', readFileSync(join(root, 'src/dashboard/styles.css'))],
    '/data.json': ['application/json', JSON.stringify(data)] };
  const server = createServer((req, res) => {
    const route = routes[new URL(req.url, 'http://localhost').pathname];
    res.writeHead(route ? 200 : 404, { 'Content-Type': route?.[0] ?? 'text/plain' });
    res.end(route?.[1] ?? 'Not found');
  });
  await new Promise(resolve => server.listen(0, '127.0.0.1', resolve));
  const base = `http://127.0.0.1:${server.address().port}/`;
  const profile = mkdtempSync(join(tmpdir(), 'rawstor-browser-test-'));
  const child = spawn(browser, ['--headless', '--disable-gpu', '--no-first-run',
    '--remote-debugging-port=0', '--user-data-dir=' + profile, 'about:blank'], { windowsHide: true, stdio: 'ignore' });
  let ws;
  try {
    for (let i = 0; i < 100 && !existsSync(join(profile, 'DevToolsActivePort')); i++) await sleep(100);
    const port = readFileSync(join(profile, 'DevToolsActivePort'), 'utf8').split('\n')[0];
    const tabs = await (await fetch(`http://127.0.0.1:${port}/json`)).json();
    ws = new WebSocket(tabs.find(tab => tab.type === 'page').webSocketDebuggerUrl);
    await new Promise((resolve, reject) => { ws.addEventListener('open', resolve, { once: true }); ws.addEventListener('error', reject, { once: true }); });
    let seq = 0;
    const pending = new Map();
    const errors = [];
    ws.addEventListener('message', event => {
      const msg = JSON.parse(event.data);
      if (msg.id) { const p = pending.get(msg.id); pending.delete(msg.id); if (p) { clearTimeout(p.timer); msg.error ? p.reject(msg.error) : p.resolve(msg.result); } }
      else if (msg.method === 'Runtime.exceptionThrown') errors.push(msg.params.exceptionDetails.text);
    });
    const call = (method, params = {}) => new Promise((resolve, reject) => {
      const id = ++seq;
      const timer = setTimeout(() => { pending.delete(id); reject(Error(`CDP timeout: ${method}`)); }, 10000);
      pending.set(id, { resolve, reject, timer }); ws.send(JSON.stringify({ id, method, params }));
    });
    const evaluate = async expression => {
      const value = await call('Runtime.evaluate', { expression, returnByValue: true });
      if (value.exceptionDetails) throw Error(value.exceptionDetails.text);
      return value.result.value;
    };
    const load = async query => {
      await call('Page.navigate', { url: 'about:blank' });
      await call('Page.navigate', { url: base + query });
      for (let i = 0; i < 100; i++) {
        if (await evaluate(`!!document.querySelector('#infoBar span')`)) return;
        await sleep(100);
      }
      throw Error('App failed to load');
    };
    const click = selector => evaluate(`document.querySelector(${JSON.stringify(selector)}).click()`);
    const screenshot = async (name, selector) => {
      const dir = process.env.DASHBOARD_SCREENSHOT_DIR;
      if (!dir) return;
      mkdirSync(dir, { recursive: true });
      const clip = selector ? await evaluate(`(()=>{const r=document.querySelector(${JSON.stringify(selector)}).getBoundingClientRect();return {x:r.x+scrollX,y:r.y+scrollY,width:r.width,height:r.height,scale:1}})()`) : undefined;
      const result = await call('Page.captureScreenshot', { format: 'png', ...(clip ? { clip, captureBeyondViewport: true } : {}) });
      writeFileSync(join(dir, name + '.png'), Buffer.from(result.data, 'base64'));
    };

    const counts = () => evaluate(`({cards:document.querySelectorAll('.config-card').length,lines:[...document.querySelectorAll('path.line')].filter(p=>p.style.opacity==='1').length})`);
    await call('Runtime.enable'); await call('Page.enable');
    await call('Emulation.setFocusEmulationEnabled', { enabled: true });
    await t.test('mode selection stays highlighted across repeated switches', async () => {
      await load('');
      for (let i = 0; i < 3; i++) {
        await click('#modeCompare');
        assert.equal(await evaluate(`document.querySelector('#modeCompare').classList.contains('active')`), true);
        await click('#modeOverview');
        assert.equal(await evaluate(`document.querySelector('#modeOverview').classList.contains('active')`), true);
      }
    });
    await t.test('individual config selection matches All', async () => {
      await load('?view=compare&branches=main,feature%2Ftest&snap=table');
      await click('.chip-mini-btn:nth-child(2)');
      assert.deepEqual(await counts(), { cards: 0, lines: 0 });
      await click('.config-chip'); assert.equal((await counts()).cards, 1);
      await click('.config-chip:nth-of-type(2)');
      const individually = await counts();
      assert.deepEqual(individually, { cards: 2, lines: 16 });
      await click('.chip-mini-btn'); assert.deepEqual(await counts(), individually);
    });
    await t.test('hide/show and operation controls restore lines', async () => {
      await load('?view=compare&branches=main,feature%2Ftest&snap=table');
      await click('.branch-chip:nth-of-type(2)'); assert.equal((await counts()).lines, 8);
      await click('.branch-chip:nth-of-type(2)'); assert.equal((await counts()).lines, 16);
      await click('[data-op="read"]'); assert.equal((await counts()).lines, 8);
      assert.equal(await evaluate(`document.querySelector('.snapshot-body').textContent.includes('IOPS write')`), false);
      await click('[data-op="both"]'); assert.equal((await counts()).lines, 16);
    });
    await t.test('N is clamped, reflected in URL/info and keeps focus', async () => {
      await load('?view=compare&branches=main,feature%2Ftest');
      await evaluate(`(()=>{const e=document.querySelector('#compareN');e.focus();e.value='999';e.dispatchEvent(new Event('change'));})()`);
      assert.equal(await evaluate(`document.querySelector('#compareN').value`), '50');
      assert.equal(await evaluate(`new URLSearchParams(location.search).get('n')`), '50');
      assert.equal(await evaluate(`document.querySelector('#infoBar').textContent.includes('N=50')`), true);
      assert.equal(await evaluate(`document.activeElement.id`), 'compareN');
    });
    await t.test('custom URL selection survives reload including base order', async () => {
      await load('?view=compare&branches=feature%2Ftest,main&configs=perftest-ost-4k-2-1&op=write&n=2&snap=table&days=7');
      assert.deepEqual(await counts(), { cards: 1, lines: 4 });
      assert.equal(await evaluate(`document.querySelector('.chip-base .chip-name').textContent`), 'feature/test');
      assert.equal(await evaluate(`document.querySelector('.snapshot-body').textContent.includes('IOPS read')`), false);
      assert.equal(await evaluate(`document.querySelector('.snapshot-body').textContent.includes('IOPS write')`), true);
      const query = await evaluate('location.search'); await load(query);
      assert.deepEqual(await counts(), { cards: 1, lines: 4 });
    });

    await t.test('branch picker searches, selects by keyboard and preserves selection on Escape', async () => {
      await load('');
      await evaluate(`(()=>{const e=document.querySelector('#branchInput');e.focus();e.value='feature';e.dispatchEvent(new Event('input'));})()`);
      assert.equal(await evaluate(`document.querySelector('#branchInput').getAttribute('aria-expanded')`), 'true');
      assert.equal(await evaluate(`document.querySelector('[role="listbox"]').textContent.includes('feature/test')`), true);
      await screenshot('branch-search');
      await evaluate(`document.querySelector('#branchInput').dispatchEvent(new KeyboardEvent('keydown',{key:'Enter',bubbles:true}))`);
      assert.equal(await evaluate(`new URLSearchParams(location.search).get('branch')`), 'feature/test');
      await evaluate(`(()=>{const e=document.querySelector('#branchInput');e.focus();e.value='no-such-branch';e.dispatchEvent(new Event('input'));})()`);
      assert.equal(await evaluate(`document.querySelector('.branch-picker-status').textContent.includes('No branches')`), true);
      await evaluate(`document.querySelector('#branchInput').dispatchEvent(new KeyboardEvent('keydown',{key:'Escape',bubbles:true}))`);
      assert.equal(await evaluate(`document.querySelector('#branchInput').value`), 'feature/test');
      assert.equal(await evaluate(`document.querySelector('#branchInput').getAttribute('aria-expanded')`), 'false');
    });
    await t.test('branch picker supports arrows and restores committed value on blur', async () => {
      await load('');
      await click('.branch-picker-toggle');
      await evaluate(`document.querySelector('#branchInput').dispatchEvent(new KeyboardEvent('keydown',{key:'ArrowDown',bubbles:true}))`);
      await evaluate(`document.querySelector('#branchInput').dispatchEvent(new KeyboardEvent('keydown',{key:'Enter',bubbles:true}))`);
      assert.equal(await evaluate(`document.querySelector('#branchInput').value`), 'feature/test');
      await evaluate(`(()=>{const e=document.querySelector('#branchInput');e.value='invalid';e.dispatchEvent(new Event('input'));document.querySelector('#refreshBtn').focus()})()`);
      assert.equal(await evaluate(`document.querySelector('#branchInput').value`), 'feature/test');
      assert.equal(await evaluate(`document.querySelector('#branchInput').getAttribute('aria-expanded')`), 'false');
    });
    await t.test('compare branch search excludes selected branches and adds a result', async () => {
      await load('?view=compare&branches=main');
      await click('.branch-picker-toggle');
      assert.deepEqual(await evaluate(`[...document.querySelectorAll('[role="option"] .branch-option-name')].map(e=>e.textContent)`), ['feature/test']);
      await click('[role="option"]');
      assert.equal(await evaluate(`new URLSearchParams(location.search).get('branches')`), 'main,feature/test');
      assert.equal(await evaluate(`document.activeElement.id`), 'compareBranchInput');
      assert.equal(await evaluate(`document.querySelectorAll('[role="option"]').length`), 0);
    });
    await t.test('branch dates show the latest benchmark across metrics in both modes', async () => {
      await load('');
      await click('.branch-picker-toggle');
      await screenshot('branch-dates');
      const expected = latestTimestamp.slice(0,10);
      assert.equal(await evaluate(`document.querySelector('[role="option"] time').textContent`), expected);
      assert.equal(await evaluate(`document.querySelector('[role="option"] time').dateTime`), latestTimestamp);
      await load('?view=compare&branches=feature%2Ftest&days=2');
      await click('.branch-picker-toggle');
      assert.equal(await evaluate(`document.querySelector('[role="option"] .branch-option-name').textContent`), 'main');
      assert.equal(await evaluate(`document.querySelector('[role="option"] time').textContent`), expected);
      await click('[role="option"]');
      assert.equal(await evaluate(`new URLSearchParams(location.search).get('branches')`), 'feature/test,main');
    });
    await t.test('branches without valid dates show No date instead of a fabricated date', async () => {
      const undated = structuredClone(data);
      for (const points of Object.values(undated.charts)) for (const p of points) {
        if (p.branch === 'refs/heads/feature/test') p.timestamp = 'Unknown date';
      }
      const original = routes['/data.json'];
      routes['/data.json'] = ['application/json', JSON.stringify(undated)];
      try {
        await load('?view=compare&branches=main');
        await click('.branch-picker-toggle');
        assert.equal(await evaluate(`document.querySelector('[role="option"] .branch-option-date').textContent`), 'No date');
        assert.equal(await evaluate(`document.querySelector('[role="option"] time') === null`), true);
      } finally { routes['/data.json'] = original; }
    });
    await t.test('friendly configuration labels keep original URL and selection identifiers', async () => {
      await load('?view=compare&branches=main,feature%2Ftest');
      assert.equal(await evaluate(`document.querySelector('.config-card-title .config-title-text').textContent`), 'Object storage');
      assert.deepEqual(await evaluate(`[...document.querySelectorAll('.config-card-title .config-tag')].slice(0,3).map(e=>e.textContent)`), ['4 KiB','QD 1','1 job']);
      assert.equal(await evaluate(`document.querySelector('.config-chip').textContent`), 'OST · 4 KiB · QD 1 · 1 job');
      assert.equal(await evaluate(`document.querySelector('.config-chip').title.includes('perftest-ost-4k-1-1')`), true);
      assert.equal(await evaluate(`document.querySelector('.snapshot-config .config-title-text').textContent`), 'Object storage');
      await click('.config-chip');
      assert.equal(await evaluate(`new URLSearchParams(location.search).get('configs')`), 'perftest-ost-4k-2-1');
      await load('');
      assert.equal(await evaluate(`document.querySelector('.legend-label').textContent`), 'Object storage');
      assert.equal(await evaluate(`document.querySelector('.legend-item').title`), 'perftest-ost-4k-1-1');
      assert.deepEqual(await evaluate(`[...document.querySelectorAll('.legend-table tbody tr:first-child td')].map(cell => cell.textContent)`), ['4 KiB', '1', '1 job', '—']);
      await click('.legend-table tbody tr:first-child .legend-item');
      assert.equal(await evaluate(`document.querySelector('.legend-item').getAttribute('aria-checked')`), 'false');
    });
    await t.test('operation markers and separate charts work in both views', async () => {
      await load('');
      const panels = () => evaluate(`document.querySelectorAll('.chart-container').length`);
      assert.equal(await panels(), 2);
      assert.equal(await evaluate(`document.querySelector('#chartsTogether').getAttribute('aria-pressed')`), 'true');
      assert.match(await evaluate(`document.querySelector('.dot[data-operation="read"]').getAttribute('d')`), / a/);
      assert.match(await evaluate(`document.querySelector('.dot[data-operation="write"]').getAttribute('d')`), / L/);
      await click('#chartsSeparate');
      assert.equal(await panels(), 4);
      assert.equal(await evaluate(`[...document.querySelectorAll('.chart-container')].every(el => new Set([...el.querySelectorAll('.dot')].map(dot => dot.dataset.operation)).size === 1)`), true);
      assert.equal(await evaluate(`new URLSearchParams(location.search).get('split')`), '1');
      await click('.op-btn[data-op="write"]');
      assert.equal(await panels(), 2);
      await click('#modeCompare');
      assert.equal(await panels(), 4);
      await click('.chart-layout .op-btn[data-op="both"]');
      assert.equal(await panels(), 8);
      await click('#chartsTogether');
      assert.equal(await panels(), 4);
      assert.equal(await evaluate(`new URLSearchParams(location.search).has('split')`), false);
      await load('?view=compare&branches=main,feature%2Ftest&split=1');
      assert.equal(await evaluate(`document.querySelector('.chart-heading h4').textContent`), 'IOPS');
      assert.equal(await evaluate(`document.querySelector('.chart-operation-badge').textContent`), '● Read');
      assert.equal(await evaluate(`document.querySelector('#compareSummary .compare-summary-note').textContent.includes('Base: main')`), true);
      assert.equal(await evaluate(`document.querySelectorAll('#compareSummary .compare-summary-delta').length`), 8);
      await click('.chart-layout .op-btn[data-op="write"]');
      assert.equal(await evaluate(`document.querySelectorAll('#compareSummary .compare-summary-delta').length`), 4);
      assert.equal(await evaluate(`[...document.querySelectorAll('#compareSummary .compare-summary-delta')].every(el => el.textContent.includes('write'))`), true);

    });
    await t.test('two-branch delta stays compact on wide screens and fits narrow screens', async () => {
      await call('Emulation.setDeviceMetricsOverride', {width:1920,height:1080,deviceScaleFactor:1,mobile:false});
      for (const mode of ['dots','bars','table']) {
        await load('?view=compare&branches=main,feature%2Ftest&snap='+mode);
        const dimensions=await evaluate(`(()=>{const e=document.querySelector('.snapshot-section');return {width:e.getBoundingClientRect().width,viewport:innerWidth};})()`);
        assert.ok(dimensions.width <= 1060, mode+' comparison must not stretch across the screen');
        await evaluate(`document.querySelector('.snapshot-panel').scrollIntoView({block:'start'})`);
        await screenshot('compare-wide-'+mode);
        if(mode==='dots') await screenshot('compare-compact', '.snapshot-section');
        if(mode==='bars') assert.equal(await evaluate(`[...document.querySelectorAll('.snap-bar-label')].every(e=>e.clientHeight>=e.scrollHeight)`), true, 'bar labels must not be clipped');
        if(mode==='bars') assert.ok(await evaluate(`(()=>{const e=[...document.querySelectorAll('.snap-bars .snap-bar-col')].slice(0,2);return Math.abs(e[1].getBoundingClientRect().x-e[0].getBoundingClientRect().x)<250})()`));
      }
      await call('Emulation.setDeviceMetricsOverride', {width:390,height:844,deviceScaleFactor:1,mobile:false});
      await load('?view=compare&branches=main,feature%2Ftest&snap=dots');
      assert.equal(await evaluate(`document.querySelector('.snapshot-section').getBoundingClientRect().right <= innerWidth`), true);
      await evaluate(`document.querySelector('.snapshot-panel').scrollIntoView({block:'start'})`);
      await screenshot('compare-mobile-dots');
      await call('Emulation.clearDeviceMetricsOverride');
    });
    assert.deepEqual(errors, [], 'No uncaught browser exceptions');
  } finally {
    ws?.close(); child.kill();
    await new Promise(resolve => server.close(resolve));
    // Chromium may still be closing profile files on Windows.
    try { rmSync(profile, { recursive: true, force: true, maxRetries: 5, retryDelay: 200 }); } catch { /* OS temp cleanup can finish later. */ }
  }
});
