import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const services = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/services' }),
  schema: z.object({
    slug: z.string(),
    title: z.string(),
    metaDescription: z.string(),
    h1: z.string(),
    intro: z.string(),
    serviceType: z.string(),
    heroImage: z.string().optional(),
  }),
});

const realizations = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/realizations' }),
  schema: z.object({
    title: z.string(),
    category: z.string(),
    image: z.string(),
    alt: z.string(),
    width: z.number().int().positive(),
    height: z.number().int().positive(),
    summary: z.string().optional(),
  }),
});

export const collections = { services, realizations };
