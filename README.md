# Destination Hostels redesign

A static, multi-page redesign of Destination Hostels, structured for **Cloudflare Pages**.

## Site structure

The deployable site lives in [`public/`](public/):

- `index.html` — redesigned homepage
- `stays.html` — full accommodation directory
- `lisbon.html`, `arrifana.html`, `porto-santo.html` — destination pages
- `property.html?property=…` — seven individual accommodation views
- `experiences.html` — tours, social experiences, and co-living
- `offers.html`, `groups.html`, `camper-vans.html`
- `journal.html`, `about.html`, `contact.html`, `book.html`
- `_redirects` — legacy-route redirects from the existing WordPress URLs
- `_headers` — production security and caching headers

All visual photography is referenced from the current Destination Hostels media library; no AI-generated images are used.

## Local preview

```bash
python3 -m http.server 4173 --bind 0.0.0.0 --directory public
```

## Cloudflare Pages deployment

### Git integration (recommended)

1. Push this branch to GitHub and create a Cloudflare Pages project from the repository.
2. Select the production branch when ready.
3. Use no build command.
4. Set the **Build output directory** to `public`.
5. Deploy. Cloudflare automatically applies `public/_headers` and `public/_redirects`.

### Wrangler CLI

Authentication is intentionally not committed to the repository.

```bash
npx wrangler pages deploy public --project-name destination-hostels
```

`wrangler.toml` declares `public` as the Pages build output directory for Cloudflare-compatible tooling.

## Booking and forms

- The booking page routes each selected property to its current direct booking URL (Mews, or the HI Arrifana provider).
- Contact and group forms open a pre-addressed email to the existing reservations or groups address, so the static site is usable before a form backend is added.

For a full production integration, add a Cloudflare Worker or Pages Function to receive form submissions, validate them server-side, send them to the preferred CRM/email provider, and return a success state. Also configure a verified custom domain, analytics, and cookie consent before launch.
