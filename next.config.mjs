import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

/** @type {import('next').NextConfig} */
const nextConfig = {
  // Pin the project root explicitly — avoids Next.js mis-detecting the
  // workspace root when a stray lockfile exists in a parent directory
  // (common on Windows when npm/yarn/pnpm lockfiles pile up in %USERPROFILE%).
  outputFileTracingRoot: __dirname,
  images: {
    // Cloudflare Workers doesn't run Next's built-in image-optimization server
    // out of the box. Images are still responsive/lazy-loaded via next/image —
    // just not re-encoded server-side. Swap this for a Cloudflare Images loader
    // later if you want on-the-fly resizing (see README).
    unoptimized: true,
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com'
      }
    ]
  }
};

export default nextConfig;
