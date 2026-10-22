// Generate visually faithful WebP versions; leave the original source PNG unchanged.
import sharp from 'sharp';
import { stat } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';

const source = fileURLToPath(new URL('../public/images/home/hero-hds-original.png', import.meta.url));
const original = await sharp(source).metadata();
if (original.width !== 1672 || original.height !== 941 || original.format !== 'png') {
  throw new Error('Source KALTRUCK hero image is not the approved 1672x941 PNG.');
}
const sourceSize = (await stat(source)).size;
for (const { name, width, quality } of [
  { name: 'desktop', width: 1672, quality: 87 },
  { name: 'mobile', width: 1280, quality: 86 },
]) {
  const destination = fileURLToPath(new URL(`../public/images/home/hero-hds-${name}.webp`, import.meta.url));
  const result = await sharp(source).resize({ width, withoutEnlargement: true })
    .webp({ quality, effort: 5, smartSubsample: true }).toFile(destination);
  if (result.format !== 'webp' || result.size >= sourceSize || result.size < 10_000) {
    throw new Error(`Hero ${name} output invalid: ${result.size} B`);
  }
  console.log(`Hero ${name}: ${result.width}x${result.height}, ${result.size} B vs PNG ${sourceSize} B`);
}
