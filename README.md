# West Estimating — Next.js + Cloudflare Workers

Converted from the original Vite/React SPA + Cloudflare Pages Functions project
to **Next.js 15 (App Router)**, deployed to **Cloudflare Workers via the
OpenNext adapter**.

## Why Workers instead of Pages?

The old project used Cloudflare Pages Functions for its `/api/*` routes.
Cloudflare has since deprecated `@cloudflare/next-on-pages` (the tool that ran
Next.js on Pages) and now recommends **`@opennextjs/cloudflare`**, which runs
a full Next.js app on Cloudflare Workers. Workers now serve static assets
too, so this isn't a downgrade — you get the whole App Router (layouts,
`generateMetadata`, `generateStaticParams`, Server Components, real API
routes) instead of being limited to the Edge Runtime subset Pages Functions
supported.

## What changed from the old site

- **React Router → Next.js App Router.** Pages now live in `app/`, routing is
  file-based, and every page/route/service-detail page has real
  server-rendered `<title>` and meta description tags (`generateMetadata`) —
  the old SPA served one static `<title>` for every URL, which is bad for
  SEO. There's also a `sitemap.xml`, `robots.txt`, and JSON-LD
  `ProfessionalService` structured data in `app/layout.jsx`.
- **Pages Functions → Next.js Route Handlers.** `frontend/functions/api/*`
  became `app/api/*/route.js`, same behavior, same `/api/services`,
  `/api/services/[slug]`, `/api/contact` paths.
- **Client-side data fetching → direct data import.** The old Home/Services
  pages fetched `/api/services` in a `useEffect` after first paint with a
  static fallback. Pages now import `lib/services.js` directly in Server
  Components, so the data is in the initial HTML — no fetch waterfall, no
  flash of fallback content. The `/api/services` routes still exist for any
  external consumer.
- **Images added.** Real, freely-licensed photography (Unsplash License —
  free for commercial use, no attribution required) was added to the Hero,
  About, Services, and Contact pages. See `lib/photos.js` for the registry
  and credits.
- **Fonts** moved from a render-blocking Google Fonts `<link>` to
  `next/font/google`, which self-hosts and inlines the font CSS — faster,
  no layout shift, no third-party request.

## Local development

```bash
npm install
npm run dev
```

Visit `http://localhost:3000`.

## Deploying to Cloudflare Workers

1. Install the Cloudflare adapter and Wrangler (already in `devDependencies`,
   just run `npm install`).
2. Authenticate once: `npx wrangler login`.
3. Build and deploy:

   ```bash
   npm run deploy
   ```

   This runs `opennextjs-cloudflare build` (transforms the Next.js build
   output into a Worker) and `opennextjs-cloudflare deploy`.

4. To preview locally in the actual Workers runtime (not just `next dev`)
   before deploying:

   ```bash
   npm run preview
   ```

### Custom domain (westestimating.com)

In the Cloudflare dashboard → **Workers & Pages → west-estimating →
Settings → Domains & Routes**, add `westestimating.com` and `www.
westestimating.com`. If the domain's DNS already lives on Cloudflare, this
is a couple of clicks and propagates immediately; no separate DNS records
needed beyond what the dashboard sets up for you.

### Environment variables

Set these in **Settings → Variables and Secrets** (or via
`wrangler secret put NAME`):

- `FORM_WEBHOOK` — optional. If set, contact form submissions are POSTed
  here (e.g. a Slack/Discord webhook or your own endpoint) in addition to
  being logged.

## Project structure

```
app/
  layout.jsx              Root layout: fonts, metadata, JSON-LD, TopBar/Navbar/Footer
  page.jsx                Home
  about/page.jsx           About (metadata) → components/AboutView.jsx
  services/page.jsx        Services listing (metadata) → components/ServicesView.jsx
  services/[slug]/page.jsx Service detail (generateStaticParams + generateMetadata)
  contact/page.jsx         Contact (metadata) → components/ContactView.jsx
  not-found.jsx             404
  api/services/route.js               GET /api/services
  api/services/[slug]/route.js        GET /api/services/:slug
  api/contact/route.js                POST /api/contact
  api/health/route.js                 GET /api/health
  sitemap.js               /sitemap.xml
  robots.js                /robots.txt
  globals.css              Design tokens + base styles (ported as-is)
components/                All UI components, Icon set, forms
lib/
  services.js              Service catalog data
  photos.js                Image registry (Unsplash, credited)
  api.js                   Client-side fetch wrapper (used by ContactForm)
hooks/                     useReveal (scroll animations), useCountUp
```

## Notes

- `next.config.mjs` sets `images.unoptimized: true` because Cloudflare
  Workers doesn't run Next's built-in image-optimization server by default.
  Images are still responsive and lazy-loaded via `next/image`, just not
  re-encoded on the fly. If you want on-the-fly resizing later, look at
  Cloudflare Images and swap in a custom loader.
- This was built and reviewed for correctness but not run through a live
  `npm install && npm run build` in this environment (no network access
  here). Run `npm run build` locally first — if anything surfaces, it'll
  most likely be a missing dependency version pin, easy to fix.
