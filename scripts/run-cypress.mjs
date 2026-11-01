import { spawn } from 'node:child_process';
import path from 'node:path';
import { repoRoot, resolveChromeExecutable } from './chrome-for-testing.mjs';

const args = process.argv.slice(2);

if (args.length === 0) {
  console.error('Usage: node scripts/run-cypress.mjs <run|open> [cypress options]');
  process.exit(1);
}

let executable;

try {
  executable = await resolveChromeExecutable();
} catch (error) {
  console.error(`[cypress] ${error.message}`);
  process.exit(1);
}

const cypressCli = path.join(repoRoot, 'node_modules', 'cypress', 'bin', 'cypress');

console.log(`[cypress] Using Chrome for Testing at ${executable}`);

const child = spawn(process.execPath, [cypressCli, ...args, '--browser', executable], {
  cwd: repoRoot,
  env: process.env,
  stdio: 'inherit',
});

child.on('error', (error) => {
  console.error(`[cypress] ${error.message}`);
  process.exit(1);
});

child.on('exit', (code, signal) => {
  if (signal) {
    process.kill(process.pid, signal);
  }

  process.exit(code ?? 1);
});
