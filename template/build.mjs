import { build } from 'esbuild';
import { cpSync, mkdirSync, existsSync } from 'fs';

// Ensure dist directory exists
mkdirSync('dist', { recursive: true });

// Copy Vite build output to dist
if (existsSync('dist-renderer')) {
  cpSync('dist-renderer', 'dist', { recursive: true });
  console.log('✓ Copied Vite build output');
} else {
  console.warn('⚠ Vite build output not found. Run "vite build" first.');
}

// Build main process
await build({
  entryPoints: ['main.ts'],
  bundle: true,
  platform: 'node',
  target: 'node20',
  outfile: 'dist/main.cjs',
  format: 'cjs',
  external: ['electron'],
  minify: false,
  sourcemap: true,
  banner: {
    js: 'const import_meta_url = require("url").pathToFileURL(__filename).href;',
  },
  define: {
    'import.meta.url': 'import_meta_url',
  },
});

console.log('✓ Built main.cjs');

// Build preload script
await build({
  entryPoints: ['preload.ts'],
  bundle: true,
  platform: 'node',
  target: 'node20',
  outfile: 'dist/preload.cjs',
  format: 'cjs',
  external: ['electron'],
  minify: false,
  sourcemap: true,
});

console.log('✓ Built preload.cjs');


