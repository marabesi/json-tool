import { access, readFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const scriptsDir = path.dirname(fileURLToPath(import.meta.url));

export const repoRoot = path.resolve(scriptsDir, '..');
export const chromeRoot = process.env.CHROME_FOR_TESTING_DIR
  ? path.resolve(process.env.CHROME_FOR_TESTING_DIR)
  : path.join(repoRoot, 'tmp', 'chrome-for-testing');
export const metadataPath = path.join(chromeRoot, 'installation.json');

export function chromePlatform() {
  if (process.platform === 'darwin') {
    return process.arch === 'arm64' ? 'mac-arm64' : 'mac-x64';
  }

  if (process.platform === 'linux') {
    return process.arch === 'arm64' ? 'linux-arm64' : 'linux64';
  }

  if (process.platform === 'win32') {
    return 'win64';
  }

  throw new Error(`Chrome for Testing is not available for ${process.platform}/${process.arch}`);
}

export function chromeExecutablePath(platform = chromePlatform()) {
  if (platform.startsWith('mac')) {
    return path.join(
      chromeRoot,
      `chrome-${platform}`,
      'Google Chrome for Testing.app',
      'Contents',
      'MacOS',
      'Google Chrome for Testing'
    );
  }

  if (platform.startsWith('win')) {
    return path.join(chromeRoot, `chrome-${platform}`, 'chrome.exe');
  }

  return path.join(chromeRoot, `chrome-${platform}`, 'chrome');
}

export async function pathExists(file) {
  try {
    await access(file);
    return true;
  } catch {
    return false;
  }
}

export async function readInstallation() {
  try {
    return JSON.parse(await readFile(metadataPath, 'utf8'));
  } catch {
    return null;
  }
}

export async function resolveChromeExecutable() {
  if (process.env.CHROME_PATH) {
    const override = path.resolve(process.env.CHROME_PATH);

    if (await pathExists(override)) {
      return override;
    }
  }

  const installation = await readInstallation();
  const platform = chromePlatform();
  const candidates = [];

  if (installation?.platform === platform && installation.executable) {
    const stored = path.isAbsolute(installation.executable)
      ? installation.executable
      : path.resolve(chromeRoot, installation.executable);
    const insideRoot =
      stored === chromeRoot || stored.startsWith(`${chromeRoot}${path.sep}`);

    if (insideRoot) {
      candidates.push(stored);
    }
  }

  candidates.push(chromeExecutablePath(platform));

  for (const candidate of candidates) {
    if (await pathExists(candidate)) {
      return candidate;
    }
  }

  throw new Error(
    'Chrome for Testing is not installed. Run "pnpm chrome:setup" to download it into tmp/chrome-for-testing.'
  );
}
