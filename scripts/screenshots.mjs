import { spawn } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { mkdirSync } from 'node:fs';
import { chromium } from 'playwright';

const viteBin = fileURLToPath(new URL('../node_modules/vite/bin/vite.js', import.meta.url));

const PORT = process.env.SCREENSHOT_PORT ?? '4173';
const ORIGIN = process.env.SCREENSHOT_ORIGIN ?? `http://localhost:${PORT}`;
const OUT_DIR = process.env.SCREENSHOT_OUT_DIR ?? 'docs/public/screenshots';

const sample = `{
  "project": "json-tool",
  "users": [
    { "id": 1, "name": "Ada", "roles": ["admin"], "active": true },
    { "id": 2, "name": "Grace", "roles": ["editor"], "active": true },
    { "id": 3, "name": "Alan", "roles": ["viewer"], "active": false }
  ],
  "settings": { "theme": "dark", "notifications": null },
  "total": 3
}`;

function startServer() {
  console.log(`[screenshots] starting vite on ${ORIGIN}`);
  const server = spawn(process.execPath, [viteBin, '--port', PORT, '--strictPort'], {
    stdio: ['ignore', 'pipe', 'pipe'],
  });

  server.stdout.on('data', (data) => process.stdout.write(`[vite] ${data}`));
  server.stderr.on('data', (data) => process.stderr.write(`[vite] ${data}`));
  server.on('exit', (code, signal) => console.log(`[screenshots] vite exited (${code ?? signal})`));

  return server;
}

async function waitForServer(url, timeoutMs = 60000) {
  const started = Date.now();
  let attempt = 0;

  while (Date.now() - started < timeoutMs) {
    attempt += 1;
    try {
      const response = await fetch(url);
      if (response.ok) {
        console.log(`[screenshots] server ready after ${Date.now() - started}ms`);
        return;
      }
    } catch {
      // server not ready yet
    }
    if (attempt % 4 === 0) {
      console.log(`[screenshots] waiting for server... (${Date.now() - started}ms)`);
    }
    await new Promise((resolve) => setTimeout(resolve, 500));
  }

  throw new Error(`Server did not start at ${url}`);
}

async function fillSampleJson(page) {
  await page.goto(`${ORIGIN}/#/`, { waitUntil: 'domcontentloaded' });
  await page.getByTestId('paste-from-clipboard').waitFor({ state: 'visible' });

  await page.evaluate(async (text) => {
    await navigator.clipboard.writeText(text);
  }, sample);

  await page.getByTestId('paste-from-clipboard').click();

  await page.waitForFunction(() => {
    const content = document.querySelector('[data-testid="result"] .cm-content');
    return content !== null && content.textContent.includes('"project"');
  });

  await page.locator('[data-testid="loading"]').waitFor({ state: 'hidden' }).catch(() => {});
  await page.waitForTimeout(400);
}

async function run() {
  mkdirSync(OUT_DIR, { recursive: true });

  const server = startServer();
  try {
    await waitForServer(`${ORIGIN}/`);

    const browser = await chromium.launch();
    const context = await browser.newContext({
      viewport: { width: 1280, height: 800 },
      deviceScaleFactor: 2,
      permissions: ['clipboard-read', 'clipboard-write'],
    });
    const page = await context.newPage();

    console.log('📸 editor.png');
    await fillSampleJson(page);
    await page.screenshot({ path: `${OUT_DIR}/editor.png` });

    console.log('📸 editor-dark.png');
    await page.getByTestId('dark-mode').click({ force: true });
    await page.waitForTimeout(500);
    await page.screenshot({ path: `${OUT_DIR}/editor-dark.png` });
    await page.getByTestId('dark-mode').click({ force: true });
    await page.waitForTimeout(300);

    console.log('📸 table.png');
    await page.getByTestId('table').click();
    await page.getByTestId('json-table').waitFor({ state: 'visible' });
    await page.waitForTimeout(500);
    await page.screenshot({ path: `${OUT_DIR}/table.png` });

    console.log('📸 shape.png');
    await page.getByTestId('schema').click();
    await page.getByTestId('json-shape').waitFor({ state: 'visible' });
    await page.getByTestId('json-shape-nested').waitFor({ state: 'visible' });
    await page.waitForTimeout(500);
    await page.screenshot({ path: `${OUT_DIR}/shape.png` });

    console.log('📸 settings.png');
    await page.getByTestId('settings').click();
    await page.getByTestId('font-size').waitFor({ state: 'visible' });
    await page.waitForTimeout(500);
    await page.screenshot({ path: `${OUT_DIR}/settings.png` });

    await browser.close();
    console.log(`Screenshots saved to ${OUT_DIR}`);
  } finally {
    server.kill('SIGKILL');
  }
}

run()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });