// Keep the exact Open Graph artwork from the original KALTRUCK website.
// The generated JPG is packaged into dist/ by Astro so social crawlers
// never have to fetch it from a different domain.
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const source = 'https://www.hdsplock.pl/og-image-v02.jpg';
const target = fileURLToPath(new URL('../public/og-image-v02.jpg', import.meta.url));
const minimumBytes = 1024;
const maximumBytes = 8 * 1024 * 1024;

function validJpeg(data) {
  return data.length >= minimumBytes
    && data.length <= maximumBytes
    && data[0] === 0xff && data[1] === 0xd8
    && data[2] === 0xff
    && data[data.length - 2] === 0xff && data[data.length - 1] === 0xd9;
}

try {
  const response = await fetch(source, {
    redirect: 'follow',
    signal: AbortSignal.timeout(30000),
    headers: { 'User-Agent': 'KALTRUCK-Premium-Build/1.0' },
  });
  if (!response.ok) throw new Error(`HTTP ${response.status}`);
  const bytes = Buffer.from(await response.arrayBuffer());
  if (!validJpeg(bytes)) throw new Error('The OG source did not return a valid JPEG under 8 MB.');
  await mkdir(dirname(target), { recursive: true });
  await writeFile(target, bytes);
  console.log(`OG: original artwork copied locally (${bytes.length} bytes).`);
} catch (error) {
  // An already downloaded and validated original can be reused offline.
  const cached = await readFile(target).catch(() => null);
  if (cached && validJpeg(cached)) {
    console.warn(`OG: source unavailable; using previously verified local JPG: ${error}`);
  } else {
    console.error(`OG: unable to include original social image from ${source}: ${error}`);
    console.error('Refusing to publish a package with a broken Open Graph preview.');
    process.exitCode = 1;
  }
}
