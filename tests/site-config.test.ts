import { describe, expect, it } from 'vitest';
import { siteConfig } from '../src/config/site';

describe('siteConfig', () => {
  it('uses the approved KALTRUCK brand and a valid absolute site URL', () => {
    expect(siteConfig.brandName).toBe('KALTRUCK');
    expect(() => new URL(siteConfig.siteUrl)).not.toThrow();
  });

  it('does not expose fake sentinel values as company facts', () => {
    const values = Object.values(siteConfig).filter((value): value is string => typeof value === 'string');
    const banned = /\b(?:TODO|123|example\.com)\b/i;
    for (const value of values) expect(value).not.toMatch(banned);
  });
});
