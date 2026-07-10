# Portfolio

A personal portfolio site built with [Next.js](https://nextjs.org/) and TypeScript. The project showcases my work, blog articles, and includes a contact form that uses [Resend](https://resend.com/) for email delivery.

## Getting Started

Install dependencies and run common scripts:

```bash
pnpm install
pnpm dev
pnpm build
pnpm lint
```

The project uses ESLint with Next.js's strict configuration. Run `pnpm lint` to check for warnings in the codebase.

The local site will be running at [http://localhost:3000](http://localhost:3000).

The production site is available at [https://mikechaves.io](https://mikechaves.io).

### Environment Variables

Copy `.env.example` to `.env.local` and configure only the services you use.

- `OPENAI_API_KEY` enables GPT role interpretation for custom Adaptive Focus requests. It is read only by the server route and must never use a `NEXT_PUBLIC_` prefix.
- `OPENAI_ADAPTIVE_FOCUS_MODEL` optionally overrides the default `gpt-5-mini` model.
- `RESEND_API_KEY` enables contact-form email delivery.

Without an OpenAI key, Adaptive Focus presets still run locally and custom requests fall back to the deterministic local parser. Without a Resend key, the contact form uses its existing mock behavior.

## Features

- Blog section with example posts
- Project gallery with filterable categories
- Adaptive Focus Role Fit Briefs with GPT interpretation, reviewed evidence, and a local fallback
- Animated hero background using Three.js
- Custom cursor and terminal-inspired UI components

## Learn More

- [Next.js Documentation](https://nextjs.org/docs) – features and API
- [Learn Next.js](https://nextjs.org/learn) – interactive tutorial

## Deploy on Vercel

Deploying to the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) is the easiest way to get this app live.

Check out the [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more information.
