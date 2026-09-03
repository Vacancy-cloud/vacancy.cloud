import { spawn, execSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.resolve(__dirname, '..');
const distIndex = path.join(rootDir, 'dist', 'index.html');
const previewHost = '127.0.0.1';
const previewPort = 4173;
const previewUrl = `http://${previewHost}:${previewPort}/`;
const isVercel = Boolean(process.env.VERCEL);

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function waitForServer(url, attempts = 60) {
  for (let i = 0; i < attempts; i += 1) {
    try {
      const response = await fetch(url);
      if (response.ok) return;
    } catch {
      // Server not ready yet
    }
    await sleep(250);
  }
  throw new Error(`Preview server did not become ready at ${url}`);
}

function stopPreview(child) {
  if (process.platform === 'win32') {
    if (child?.pid) {
      try {
        execSync(`taskkill /pid ${child.pid} /T /F`, { stdio: 'ignore' });
      } catch {
        // Process may already have exited
      }
    }

    try {
      const output = execSync(`netstat -ano | findstr :${previewPort}`, {
        encoding: 'utf8',
      });
      const pids = new Set();
      for (const line of output.split(/\r?\n/)) {
        if (!line.includes('LISTENING')) continue;
        const parts = line.trim().split(/\s+/);
        const pid = parts[parts.length - 1];
        if (pid && /^\d+$/.test(pid)) pids.add(pid);
      }
      for (const pid of pids) {
        try {
          execSync(`taskkill /pid ${pid} /T /F`, { stdio: 'ignore' });
        } catch {
          // Ignore
        }
      }
    } catch {
      // Nothing listening on the port
    }
    return;
  }

  if (child?.pid) {
    try {
      process.kill(-child.pid, 'SIGTERM');
    } catch {
      child.kill('SIGTERM');
    }
  }
}

async function launchBrowser() {
  // Vercel build images lack system libraries required by stock Puppeteer Chrome.
  if (isVercel) {
    const chromium = (await import('@sparticuz/chromium')).default;
    const puppeteerCore = (await import('puppeteer-core')).default;
    return puppeteerCore.launch({
      args: chromium.args,
      defaultViewport: { width: 1440, height: 900 },
      executablePath: await chromium.executablePath(),
      headless: chromium.headless,
    });
  }

  const puppeteer = (await import('puppeteer')).default;
  return puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
    defaultViewport: { width: 1440, height: 900 },
  });
}

async function main() {
  if (!fs.existsSync(distIndex)) {
    throw new Error('dist/index.html not found. Run vite build before prerender.');
  }

  const preview = spawn(
    `npx vite preview --host ${previewHost} --port ${previewPort} --strictPort`,
    {
      cwd: rootDir,
      stdio: 'ignore',
      windowsHide: true,
      shell: true,
      detached: process.platform !== 'win32',
    }
  );

  try {
    await waitForServer(previewUrl);

    const browser = await launchBrowser();

    try {
      const page = await browser.newPage();
      await page.goto(previewUrl, {
        waitUntil: 'domcontentloaded',
        timeout: 120000,
      });

      // Wait briefly for React to paint static homepage copy.
      // Do not wait for Mapbox, tiles, animations, or other dynamic UI.
      // Previous condition waited for outdated hero text ("Upgrade aging buildings")
      // and used a 90s timeout that failed the Vercel build.
      try {
        await page.waitForFunction(
          () => {
            const root = document.getElementById('root');
            if (!root) return false;
            const text = root.innerText || '';
            return (
              text.includes('Plan the path') ||
              text.includes('How Vacancy.Cloud Works') ||
              text.includes('Early-stage building screening')
            );
          },
          { timeout: 12000 }
        );
      } catch {
        console.warn(
          'Dynamic content did not fully load; continuing with prerender.'
        );
      }

      await sleep(750);

      const html = await page.content();
      fs.writeFileSync(distIndex, `${html}\n`, 'utf8');
      console.log(
        `Prerendered homepage HTML written to dist/index.html (${isVercel ? 'vercel-chromium' : 'local-puppeteer'})`
      );
    } finally {
      await browser.close();
    }
  } finally {
    stopPreview(preview);
    await sleep(300);
  }
}

main().catch((error) => {
  console.error('Prerender failed:', error);
  process.exit(1);
});
