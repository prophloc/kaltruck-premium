import { siteConfig } from '../config/site';

export interface BreadcrumbItem { name: string; path: string }
export interface FAQItem { question: string; answer: string }

const absolute = (path: string) => new URL(path, siteConfig.siteUrl).toString();

export function organizationSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    '@id': absolute('/#firma'),
    name: siteConfig.legalName,
    url: siteConfig.siteUrl,
    email: siteConfig.email,
    telephone: siteConfig.phone,
    vatID: `PL${siteConfig.nip}`,
    image: absolute(siteConfig.socialImage),
    address: {
      '@type': 'PostalAddress',
      streetAddress: 'Tokarska 40',
      postalCode: '09-401',
      addressLocality: 'Płock',
      addressRegion: 'mazowieckie',
      addressCountry: 'PL',
    },
    hasMap: siteConfig.googleMapsUrl,
    areaServed: [...siteConfig.serviceArea],
  };
}

export function serviceSchema(input: { name: string; description: string; path: string }) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Service',
    name: input.name,
    description: input.description,
    url: absolute(input.path),
    provider: { '@id': absolute('/#firma') },
    areaServed: [...siteConfig.serviceArea],
  };
}

export function breadcrumbSchema(items: BreadcrumbItem[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: absolute(item.path),
    })),
  };
}

export function faqSchema(items: FAQItem[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: items.map((item) => ({
      '@type': 'Question',
      name: item.question,
      acceptedAnswer: { '@type': 'Answer', text: item.answer },
    })),
  };
}
