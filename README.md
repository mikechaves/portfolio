# Portfolio

A personal portfolio site built with [Next.js](https://nextjs.org/) and TypeScript. The project showcases my work, blog articles, and includes a contact form that uses [Resend](https://resend.com/) for email delivery.

## Getting Started

Install dependencies and start the development server:

```bash
pnpm install
pnpm dev
```

The site will be available at [https://mikechaves.io](https://mikechaves.io).

### Environment Variables

To enable email sending from the contact form, create a `.env.local` file in the project root and define `RESEND_API_KEY` with your Resend API key.

Without this variable the form falls back to a mock implementation.

## Features

- Blog section with example posts
- Project gallery with filterable categories
- Animated hero background using Three.js
- Custom cursor and terminal-inspired UI components

## Learn More

- [Next.js Documentation](https://nextjs.org/docs) – features and API
- [Learn Next.js](https://nextjs.org/learn) – interactive tutorial

## Deploy on Vercel

Deploying to the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) is the easiest way to get this app live.

Check out the [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more information.
