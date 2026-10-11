import { siteConfig } from '../config/site';

const endpoint = process.env.PUBLIC_FORM_ENDPOINT?.trim() || '';

export const formConfig = {
  endpoint,
  method: 'POST' as const,
  canSubmit: endpoint.length > 0,
  fallbackPhone: siteConfig.phone,
  fallbackEmail: siteConfig.email,
} as const;
