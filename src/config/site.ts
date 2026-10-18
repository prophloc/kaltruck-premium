const rawSiteUrl = process.env.PUBLIC_SITE_URL || 'http://localhost:4321';

export const siteConfig = {
  brandName: 'KALTRUCK',
  legalName: 'Transport HDS Kalwasińscy',
  siteUrl: new URL(rawSiteUrl).origin,
  phone: '+48514948373',
  secondaryPhone: '+48784430022',
  email: 'hds.plock@gmail.com',
  baseAddress: 'Tokarska 40, 09-401 Płock',
  googleMapsUrl: 'https://www.google.com/maps/search/?api=1&query=Tokarska%2040%2C%2009-401%20P%C5%82ock',
  serviceArea: ['Płock', 'Mazowieckie', 'Kujawsko-Pomorskie', 'Łódzkie', 'Wielkopolskie', 'Polska'],
  socialImage: 'https://hdsplock.pl/og-image-v02.jpg',
  facebook: 'https://www.facebook.com/profile.php?id=61561070733012',
  instagram: 'https://www.instagram.com/transporthdsplock/',
  allegro: 'https://allegro.pl/uzytkownik/kaldreww',
} as const;

export type SiteConfig = typeof siteConfig;
