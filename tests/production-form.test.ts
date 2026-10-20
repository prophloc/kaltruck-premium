import { describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';
const file = (path: string) => readFileSync(path, 'utf8');

describe('Premium production form and Google reviews', () => {
  it('uses the corrected case-sensitive Place ID everywhere', () => {
    const placeId = 'ChIJhbMF0yh3HEcRVtTOsPxz9eM';
    for (const path of ['src/components/GoogleReviews.astro', '.env.example', '.github/workflows/plockhds-cpanel.yml']) {
      expect(file(path)).toContain(placeId);
      expect(file(path)).not.toContain('ChIJhbMF0yh3HEcRVTtOsPxz9eM');
    }
  });
  it('includes a PHP submission handler and enables it in production builds', () => {
    const workflow = file('.github/workflows/plockhds-cpanel.yml');
    const form = file('src/components/QuoteForm.astro');
    const handler = file('public/wycena-wyslij.php');
    expect(workflow).toContain('PUBLIC_FORM_ENDPOINT: /wycena-wyslij.php');
    expect(workflow).toContain('php -l public/wycena-wyslij.php');
    expect(form).toContain('data-quote-form');
    expect(form).toContain('data-quote-status');
    expect(form).toContain('fetch(form.action');
    expect(handler).toContain("mail('hds.plock@gmail.com'");
    expect(handler).toContain('FILTER_VALIDATE_EMAIL');
    expect(handler).toContain('flock(');
  });
});
