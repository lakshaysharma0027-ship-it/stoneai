# StoneAI Deployment Checklist

## Required Environment Variables

Set these in Vercel for the `web` app.

```text
NEXT_PUBLIC_SUPABASE_URL
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY
DATABASE_URL
SUPABASE_PROJECT_REF
SUPABASE_SERVICE_ROLE_KEY
AWS_BEDROCK_API_KEY
BEDROCK_CLAUDE_MODEL=global.anthropic.claude-opus-4-8
AWS_REGION=us-east-1
GOOGLE_API_KEY
GOOGLE_NANO_BANANA_MODEL=gemini-3.1-flash-image
GOOGLE_VEO_MODEL=veo-3.1-lite-generate-preview
GEMINI_GENERATION_ENABLED=true
RESEND_API_KEY
RESEND_FROM_EMAIL
NEXT_PUBLIC_STONEAI_ROOT_DOMAIN=stoneai.in
NEXT_PUBLIC_STONEAI_APP_HOST=app.stoneai.in
NEXT_PUBLIC_STONEAI_CUSTOM_DOMAIN_TARGET=stoneai.in
DODO_API_KEY
DODO_ENVIRONMENT=live_mode
DODO_WEBHOOK_SECRET
DODO_PRODUCT_FREE_TRIAL
DODO_PRODUCT_BASIC
DODO_PRODUCT_BASIC_PLUS
DODO_PRODUCT_PRO
DODO_PRODUCT_PREMIUM
```

Optional:

```text
NEXT_PUBLIC_STONEAI_APP_HOSTS
GEMINI_API_KEY
STONEAI_ADMIN_EMAILS
```

## Vercel Settings

```text
Framework preset: Next.js
Root directory: apps/web
Install command: npm install
Build command: npm run build
Output directory: .next
```

## DNS

Point these records at the Vercel deployment:

```text
stoneai.in       A / ALIAS / CNAME according to Vercel's project instructions
app.stoneai.in   CNAME cname.vercel-dns.com
*.stoneai.in     CNAME cname.vercel-dns.com
```

Use Vercel's exact DNS target if it differs for the project.

## Supabase

Apply all migrations in `supabase/migrations` before public traffic:

```bash
supabase db push
```

Confirm Auth providers and redirect URLs include production app URLs:

```text
https://app.stoneai.in/auth/callback
https://stoneai.in/auth/callback
```

## Custom Domain Records for Users

TXT verification:

```text
TXT _stoneai.example.com = stoneai-site-verification=<token>
```

CNAME verification and serving:

```text
CNAME www.example.com = stoneai.in
```

For apex/root domains, use provider-supported ALIAS, ANAME, or flattened CNAME to `stoneai.in`.

## Production launch commands

Apply database (if not using Supabase MCP):

```bash
supabase link --project-ref aajwfpikldlangtmnnhd
supabase db push
```

Register Dodo webhook (from `apps/web`, with `DODO_API_KEY` in `.env.local`):

```bash
node --env-file=.env.local scripts/setup-dodo-webhook.mjs
```

Push env vars to Vercel production (fill missing keys in `.env.local` first):

```bash
node --env-file=.env.local scripts/push-vercel-env.mjs
```

Verify Bedrock model access:

```bash
node --env-file=.env.local scripts/verify-bedrock.mjs
```

Dodo webhook URL:

```text
https://app.stoneai.in/api/webhooks/dodo
```

Rotate `GOOGLE_API_KEY` in [Google AI Studio](https://aistudio.google.com/apikey) after any exposure, then update Vercel only.
