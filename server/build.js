import { spawnSync } from 'child_process';

const processes = [
  ['rm', ['-rf', 'dist']],
  ['mkdir', ['dist']],
  ['rollup', ['-c']],
  ['cp', ['./src/index.html', './dist/index.html']],
];

console.log('preparing build...');

for (const process of processes) spawnSync(...process, { stdio: 'inherit' });

console.log(`finished build at ${new Date().toLocaleTimeString()}.\n`);
