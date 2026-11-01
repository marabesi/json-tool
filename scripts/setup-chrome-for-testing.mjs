import { spawnSync } from 'node:child_process';
import { createWriteStream } from 'node:fs';
import { chmod, mkdir, rm, writeFile } from 'node:fs/promises';
import { Readable } from 'node:stream';
import { pipeline } from 'node:stream/promises';
import path from 'node:path';
import {
  chromeExecutablePath,
  chromePlatform,
  chromeRoot,
  metadataPath,
  pathExists,
  readInstallation,
} from './chrome-for-testing.mjs';

const manifestUrl =
  'https://googlechromelabs.github.io/chrome-for-testing/last-known-good-versions-with-downloads.json';
const knownPlatforms = ['linux64', 'linux-arm64', 'mac-arm64', 'mac-x64', 'win32', 'win64'];

function requestedPlatform() {
  const args = process.argv.slice(2);
  const index = args.indexOf('--platform');

  if (index === -1) {
    return chromePlatform();
  }

  const platform = args[index + 1];

  if (!platform) {
    throw new Error('Missing value for --platform');
  }

  if (!knownPlatforms.includes(platform)) {
    throw new Error(
      `Unsupported platform "${platform}". Use one of: ${knownPlatforms.join(', ')}`
    );
  }

  return platform;
}

async function downloadFile(url, destination) {
  const response = await fetch(url);

  if (!response.ok || !response.body) {
    throw new Error(`Failed to download ${url}: ${response.status} ${response.statusText}`);
  }

  await pipeline(Readable.fromWeb(response.body), createWriteStream(destination));
}

function extractArchive(archive, destination) {
  if (process.platform === 'win32') {
    const escape = (value) => value.replace(/'/g, "''");
    const script = `Expand-Archive -LiteralPath '${escape(archive)}' -DestinationPath '${escape(destination)}' -Force`;
    const result = spawnSync('powershell.exe', ['-NoProfile', '-NonInteractive', '-Command', script], {
      stdio: 'inherit',
    });

    if (result.status !== 0) {
      throw new Error(`Failed to extract ${archive} with PowerShell`);
    }

    return;
  }

  const result = spawnSync('unzip', ['-q', '-o', archive, '-d', destination], { stdio: 'inherit' });

  if (result.error) {
    throw new Error(`Failed to extract ${archive}. Make sure "unzip" is available.`);
  }

  if (result.status !== 0) {
    throw new Error(`Failed to extract ${archive}`);
  }
}

async function writeMetadata(version, platform, executable) {
  const metadata = {
    version,
    platform,
    executable: path.relative(chromeRoot, executable),
  };

  await writeFile(metadataPath, `${JSON.stringify(metadata, null, 2)}\n`);
}

async function main() {
  const platform = requestedPlatform();
  console.log(`[chrome-for-testing] Resolving the stable version for ${platform}...`);

  const response = await fetch(manifestUrl);

  if (!response.ok) {
    throw new Error(
      `Failed to resolve Chrome for Testing: ${response.status} ${response.statusText}`
    );
  }

  const manifest = await response.json();
  const stable = manifest?.channels?.Stable;
  const download = stable?.downloads?.chrome?.find((item) => item.platform === platform);

  if (!stable?.version || !download?.url) {
    throw new Error(`Chrome for Testing ${platform} was not found in the release manifest`);
  }

  const executable = chromeExecutablePath(platform);
  const previous = await readInstallation();
  const installed = await pathExists(executable);

  if (installed && previous?.version === stable.version) {
    await writeMetadata(stable.version, platform, executable);
    console.log(`[chrome-for-testing] Chrome ${stable.version} is already installed.`);
    console.log(`[chrome-for-testing] Executable: ${executable}`);
    return;
  }

  if (installed && !previous) {
    await writeMetadata(stable.version, platform, executable);
    console.log('[chrome-for-testing] Reusing the existing build (metadata was missing).');
    console.log('[chrome-for-testing] Delete tmp/chrome-for-testing to force a fresh download.');
    console.log(`[chrome-for-testing] Executable: ${executable}`);
    return;
  }

  await mkdir(chromeRoot, { recursive: true });

  const archive = path.join(chromeRoot, `chrome-${platform}-${stable.version}.zip`);

  console.log(`[chrome-for-testing] Downloading Chrome ${stable.version}...`);
  await downloadFile(download.url, archive);

  console.log('[chrome-for-testing] Extracting...');
  await rm(path.join(chromeRoot, `chrome-${platform}`), { recursive: true, force: true });
  extractArchive(archive, chromeRoot);
  await rm(archive, { force: true });

  if (!(await pathExists(executable))) {
    throw new Error(`Chrome for Testing was extracted but ${executable} was not found`);
  }

  await chmod(executable, 0o755);

  if (platform === chromePlatform()) {
    const versionCheck = spawnSync(executable, ['--version'], { stdio: 'inherit' });

    if (versionCheck.status !== 0) {
      throw new Error(`Chrome for Testing at ${executable} could not be executed`);
    }
  } else {
    console.log(
      `[chrome-for-testing] Skipping execution check for ${platform} on this host.`
    );
  }

  await writeMetadata(stable.version, platform, executable);

  console.log(`[chrome-for-testing] Chrome ${stable.version} is ready.`);
  console.log(`[chrome-for-testing] Executable: ${executable}`);
}

main().catch((error) => {
  console.error(`[chrome-for-testing] ${error.message}`);
  process.exit(1);
});
