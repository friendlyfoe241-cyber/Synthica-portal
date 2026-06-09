// Runs automatically after `npm run build` (npm postbuild hook)
// Renames dist/app.html → dist/index.html so Vercel can serve it as the SPA entry
import { existsSync, renameSync } from 'fs';
import { join } from 'path';

const root = process.cwd();
const src  = join(root, 'dist', 'app.html');
const dest = join(root, 'dist', 'index.html');

if (existsSync(src)) {
  renameSync(src, dest);
  console.log('✓ Renamed dist/app.html → dist/index.html');
} else if (existsSync(dest)) {
  console.log('✓ dist/index.html already exists — nothing to rename');
} else {
  console.error('✗ Neither dist/app.html nor dist/index.html found — build may have failed');
  process.exit(1);
}
