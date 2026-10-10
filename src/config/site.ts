const rawSiteUrl = process.env.PUBLIC_SITE_URL || 'http://localhost:4321';

export const siteConfig = {
  brandName: 'KALTRUCK',
  legalName: 'Transport HDS Kalwasińscy',
  siteUrl: new URL(rawSiteUrl).origin,
  phone: '+48514948373',
  secondaryPhone: '+48784430022',
  email: 'hds.plock@gmail.com',
  serviceArea: ['Płock', 'Mazowieckie', 'Polska'],
  socialImage: '/images/og-kaltruck.jpg',
  facebook: 'https://www.facebook.com/kaldrewplock',
  allegro: 'https://allegro.pl/uzytkownik/kaldreww',
} as const;

export type SiteConfig = typeof siteConfig;
