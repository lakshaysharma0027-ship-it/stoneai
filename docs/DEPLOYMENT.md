# StoneAI Deployment Checklist

## Required Environment Variables

Set these in Vercel for the `web` app.

```text
NEXT_PUBLIC_SUPABASE_URL
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY
DATABASE_URL
SUPABASE_PROJECT_REF
OPENAI_API_KEY
OPENAI_MODEL
RESEND_API_KEY
RESEND_FROM_EMAIL
NEXT_PUBLIC_STONEAI_ROOT_DOMAIN
NEXT_PUBLIC_STONEAI_APP_HOST
NEXT_PUBLIC_STONEAI_CUSTOM_DOMAIN_TARGET
```

Optional:

```text
NEXT_PUBLIC_STONEAI_APP_HOSTS
DODO_API_KEY
```

`NEXT_PUBLIC_STONEAI_APP_HOSTS` is a comma-separated allowlist for app/control-plane hosts, such as Vercel preview domains, that should not be interpreted as customer site hosts.

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
