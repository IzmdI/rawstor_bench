import { buildSync } from 'esbuild';
import { copyFileSync, mkdirSync, readFileSync, writeFileSync } from 'fs';
import { join, dirname, resolve } from 'path';
import { fileURLToPath } from 'url';

const rootDir = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const srcDir = join(rootDir, 'src', 'dashboard');
const outDir = process.argv[2]
  ? resolve(process.argv[2])
  : join(rootDir, 'docs', 'fio', 'librawstor', 'dashboard');

mkdirSync(outDir, { recursive: true });

// Bundle TypeScript and D3 into a single JavaScript file.
const { metafile } = buildSync({
  absWorkingDir: rootDir,
  entryPoints: [join(srcDir, 'main.ts')],
  bundle: true,
  outfile: join(outDir, 'bundle.js'),
  format: 'esm',
  platform: 'browser',
  target: 'es2020',
  minify: true,
  // External sourcemap (separate bundle.js.map) to aid runtime debugging
  // without affecting the served payload size meaningfully.
  sourcemap: true,
  metafile: true,
  banner: { js: '/*! Third-party licenses: bundle.js.LICENSE.txt */' },
});

const packageDirs = new Set(['node_modules/d3']);
for (const output of Object.values(metafile.outputs)) {
  for (const [input, { bytesInOutput }] of Object.entries(output.inputs)) {
    const match = input.match(/^(?:.*\/)?node_modules\/(?:@[^/]+\/)?[^/]+(?=\/)/);
    if (bytesInOutput && match) packageDirs.add(match[0]);
  }
}
const licenses = new Set([...packageDirs].sort().map(dir => readFileSync(join(rootDir, dir, 'LICENSE'), 'utf8')));
writeFileSync(join(outDir, 'bundle.js.LICENSE.txt'), [...licenses].join('\n'));

// Copy index.html
copyFileSync(join(srcDir, 'index.html'), join(outDir, 'index.html'));

// Copy styles.css
copyFileSync(join(srcDir, 'styles.css'), join(outDir, 'styles.css'));

console.log('Dashboard built successfully');
