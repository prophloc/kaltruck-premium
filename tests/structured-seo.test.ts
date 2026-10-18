import { describe, expect, it } from 'vitest';
import { siteConfig } from '../src/config/site';
import { breadcrumbSchema, faqSchema, organizationSchema, serviceSchema } from '../src/lib/seo';

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

  it('connects company contact information to the service provider graph', () => {
    const business = organizationSchema();
    const service = serviceSchema({ name: 'Rozładunek HDS', description: 'Usługi HDS.', path: '/rozladunek-hds/' });
    expect(business['@type']).toBe('LocalBusiness');
    expect(business['@id']).toBe(new URL('/#firma', siteConfig.siteUrl).toString());
    expect(business.address.postalCode).toBe('09-401');
    expect(business.address.addressLocality).toBe('Płock');
    expect(service.provider['@id']).toBe(business['@id']);
    expect(business.areaServed).toContain('Kujawsko-Pomorskie');
  });

  it('uses real route content in service schema', () => {
    const schema = serviceSchema({ name: 'Transport HDS', description: 'Transport i rozładunek HDS.', path: '/transport-hds/' });
    expect(schema.name).toBe('Transport HDS');
    expect(schema.url).toBe(new URL('/transport-hds/', siteConfig.siteUrl).toString());
  });
});
