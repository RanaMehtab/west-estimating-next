import { services } from '../lib/services.js';

const siteUrl = 'https://westestimating.com';

export default function sitemap() {
  const staticRoutes = ['', '/about', '/services', '/contact'].map((path) => ({
    url: `${siteUrl}${path}`,
    lastModified: new Date(),
    changeFrequency: 'monthly',
    priority: path === '' ? 1 : 0.8
  }));

  const serviceRoutes = services.map((s) => ({
    url: `${siteUrl}/services/${s.slug}`,
    lastModified: new Date(),
    changeFrequency: 'monthly',
    priority: 0.7
  }));

  return [...staticRoutes, ...serviceRoutes];
}
