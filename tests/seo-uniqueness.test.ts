import { describe, expect, it } from 'vitest';
import { readFileSync, readdirSync } from 'node:fs';
import { join } from 'node:path';

function frontmatter(file: string) {
  const raw = readFileSync(file, 'utf8');
  const match = raw.match(/^---\n([\s\S]*?)\n---/);
  if (!match) throw new Error(`Missing frontmatter: ${file}`);
  const data: Record<string,string> = {};
  for (const line of match[1].split('\n')) {
    const idx = line.indexOf(':');
    if (idx > 0) data[line.slice(0, idx).trim()] = line.slice(idx + 1).trim().replace(/^['"]|['"]$/g, '');
  }
  return data;
}

const dir = join(process.cwd(), 'src/content/services');

describe('service SEO content', () => {
  it('has six unique titles, descriptions, h1s and intros', () => {
    const files = readdirSync(dir).filter((name) => name.endsWith('.md'));
    expect(files).toHaveLength(6);
    const rows = files.map((name) => frontmatter(join(dir, name)));
    for (const key of ['title', 'metaDescription', 'h1', 'intro']) {
      const values = rows.map((row) => row[key]?.trim()).filter(Boolean);
      expect(values).toHaveLength(6);
      expect(new Set(values.map((value) => value.toLowerCase())).size).toBe(6);
      expect(values).not.toContain('TRANSPORT, KTÓRY PODNOSI WIĘCEJ.');
    }
  });
});
