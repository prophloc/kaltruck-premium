import { describe, expect, it } from 'vitest';
import { siteConfig } from '../src/config/site';
import { breadcrumbSchema, faqSchema, serviceSchema } from '../src/lib/seo';

describe('structured SEO helpers', () => {
  it('builds canonical breadcrumb URLs from the configured site host', () => {
    const schema = breadcrumbSchema([{ name: 'Start', path: '/' }, { name: 'Transport HDS', path: '/transport-hds/' }]);
    expect(schema.itemListElement[1].item).toBe(new URL('/transport-hds/', siteConfig.siteUrl).toString());
  });

  it('keeps FAQ JSON-LD exactly aligned with visible FAQ data', () => {
    const items = [{ question: 'Czy działacie w całej Polsce?', answer: 'Tak, realizujemy zlecenia na terenie całej Polski.' }];
    const schema = faqSchema(items);
    expect(schema.mainEntity[0].name).toBe(items[0].question);
    expect(schema.mainEntity[0].acceptedAnswer.text).toBe(items[0].answer);
  });

  it('uses real route content in service schema', () => {
    const schema = serviceSchema({ name: 'Transport HDS', description: 'Transport i rozładunek HDS.', path: '/transport-hds/' });
    expect(schema.name).toBe('Transport HDS');
    expect(schema.url).toBe(new URL('/transport-hds/', siteConfig.siteUrl).toString());
  });
});
