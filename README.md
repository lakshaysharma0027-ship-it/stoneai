# StoneAI

StoneAI is a monorepo for the public web app, website editor, template system, Supabase-backed persistence, publishing, credits, subscriptions, and custom-domain routing.

## Apps

- `apps/web`: Next.js app deployed to Vercel.
- `packages/ui`: Shared React UI package.
- `packages/shared-types`: Shared website/domain types.

## Commands

```bash
npm install
npm run check-types
npm run lint
npm run build
npm run dev --workspace=web
```

## Deployment

Production deployment targets Vercel with `apps/web` as the root directory. See [docs/DEPLOYMENT.md](docs/DEPLOYMENT.md) for environment variables, Vercel settings, and DNS setup.
