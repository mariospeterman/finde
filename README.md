## Finde Landing Page

A production-ready marketing site for the Finde pilot programme, built with **Next.js 16 (App Router)**, **TypeScript**, **Tailwind CSS v4**, and **shadcn/ui**. The page mirrors the original Viki experience with refreshed branding, analytics, cookie consent, and Typeform capture.

### Local Development

```bash
npm install
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000) to see the landing page.

### Environment Variables

Create a `.env.local` file with the following keys before running the site in production:

```
NEXT_PUBLIC_BRAND_NAME=Finde
NEXT_PUBLIC_SLOGAN=Search. Decide. Deliver.
NEXT_PUBLIC_DEFAULT_PRICING=199
NEXT_PUBLIC_TIRES_OFFER=20% Off Installation
NEXT_PUBLIC_TYPEFORM_URL=https://yourtypeformurl.com
NEXT_PUBLIC_POSTHOG_KEY=phc_xxxxxxxx
NEXT_PUBLIC_POSTHOG_API_HOST=https://app.posthog.com
```

All variables prefixed with `NEXT_PUBLIC_` are safe to expose to the browser and are used throughout the UI for copy, pricing, analytics, and embeds.

### Scripts

| Command         | Description                              |
| --------------- | ---------------------------------------- |
| `npm run dev`   | Start the development server (Turbopack) |
| `npm run build` | Create an optimized production build     |
| `npm run start` | Run the production server                |
| `npm run lint`  | Check TypeScript and ESLint rules        |

### Technology Highlights

- **Next.js 16 App Router** with server + client component split
- **Tailwind v4** custom theme + paper texture styling
- **shadcn/ui** component registry for consistent design tokens
- **PostHog** analytics (loaded client-side with consent)
- **react-cookie-consent** banner with decline support
- **Typeform** embed (lazy-loaded, optional)
- GSAP-powered **CardSwap** and **paper-sheet** animations

### Deployment

The project is Vercel-ready. After setting environment variables in your Vercel project:

```bash
vercel login
vercel link
vercel --prod
```

### Notes

- Static assets (textures, imagery, legal pages) live in `public/`.
- Content and data structures are centralised in `src/data/content.ts`.
- Analytics helpers and env parsing live in `src/lib`.
- Interactive UI primitives live in `src/components`.

For questions or improvements, please open a pull request or reach out to the Finde team.
