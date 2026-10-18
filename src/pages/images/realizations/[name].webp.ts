import type { APIRoute } from 'astro';
import { Buffer } from 'node:buffer';

export const prerender = true;

const chunkModules = import.meta.glob('../../../assets/realizations-b64/*.part.*', {
  eager: true,
  query: '?raw',
  import: 'default',
}) as Record<string, string>;

const grouped = new Map<string, Array<[number, string]>>();

for (const [path, raw] of Object.entries(chunkModules)) {
  const fileName = path.split('/').pop() || '';
  const match = fileName.match(/^(.*)\.part\.(\d+)$/);
  if (!match) continue;

  const [, name, part] = match;
  const existing = grouped.get(name) || [];
  existing.push([Number(part), raw.trim()]);
  grouped.set(name, existing);
}

const encodedImages = new Map(
  [...grouped.entries()].map(([name, parts]) => [
    name,
    parts
      .sort((a, b) => a[0] - b[0])
      .map(([, value]) => value)
      .join(''),
  ]),
);

export function getStaticPaths() {
  return [...encodedImages.keys()].map((name) => ({ params: { name } }));
}

export const GET: APIRoute = ({ params }) => {
  const encoded = params.name ? encodedImages.get(params.name) : undefined;
  if (!encoded) return new Response('Not found', { status: 404 });

  return new Response(Buffer.from(encoded, 'base64'), {
    headers: {
      'Content-Type': 'image/webp',
      'Cache-Control': 'public, max-age=31536000, immutable',
    },
  });
};
