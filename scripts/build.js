import { buildSync } from 'esbuild';
import { copyFileSync, mkdirSync, existsSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const srcDir = join(__dirname, '..', 'src', 'dashboard');
const outDir = join(__dirname, '..', 'docs', 'fio', 'librawstor', 'dashboard');

// Ensure output directory exists
if (!existsSync(outDir)) {
  mkdirSync(outDir, { recursive: true });
}

// Bundle TypeScript → single JS file (d3 loaded from CDN, marked external)
buildSync({
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
  external: ['d3'],
});

// Copy index.html
copyFileSync(join(srcDir, 'index.html'), join(outDir, 'index.html'));

// Copy styles.css
copyFileSync(join(srcDir, 'styles.css'), join(outDir, 'styles.css'));

console.log('Dashboard built successfully');
