/**
 * Central registry of photography used across the site.
 *
 * All photos are from Unsplash and licensed under the Unsplash License
 * (free for commercial use, no attribution required). Served directly from
 * Unsplash's CDN via next/image with remotePatterns configured in
 * next.config.mjs.
 */
export const photos = {
  heroConstruction: {
    src: 'https://images.unsplash.com/photo-1609867271967-a82f85c48531?auto=format&fit=crop&w=1600&q=80',
    alt: 'Panoramic view of a commercial building under construction, with scaffolding and structural framework',
    credit: 'Jan Huber / Unsplash'
  },
  worker: {
    src: 'https://images.unsplash.com/photo-1587582423116-ec07293f0395?auto=format&fit=crop&w=1200&q=80',
    alt: 'Construction worker in a hard hat working on a building frame',
    credit: 'Josh Olalde / Unsplash'
  },
  blueprints: {
    src: 'https://images.unsplash.com/photo-1762146828422-50a8bd416d3c?auto=format&fit=crop&w=1200&q=80',
    alt: 'Architectural blueprints and construction drawings spread out on a table',
    credit: 'Marina Zvada / Unsplash'
  }
};
