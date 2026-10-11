import { siteConfig } from '../config/site';

export interface BreadcrumbItem { name: string; path: string }
export interface FAQItem { question: string; answer: string }

const absolute = (path: string) => new URL(path, siteConfig.siteUrl).toString();

export function organizationSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: siteConfig.legalName,
    url: siteConfig.siteUrl,
    email: siteConfig.email,
    telephone: [siteConfig.phone, siteConfig.secondaryPhone],
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
    provider: { '@type': 'Organization', name: siteConfig.legalName, url: siteConfig.siteUrl },
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
