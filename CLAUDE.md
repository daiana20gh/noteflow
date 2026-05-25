@AGENTS.md

# NoteFlow — Project Context for Claude

## What this app is
NoteFlow is a note-taking web app (university thesis project). Users register, verify their email, log in, and write/manage rich-text documents with AI assistance.

## Tech stack
- **Framework**: Next.js (App Router, TypeScript)
- **Styling**: Tailwind CSS
- **Database**: PostgreSQL via Prisma ORM (local: `localhost:5432/noteflow`, prod: Neon or similar on Vercel)
- **Auth**: Custom JWT (jose library), bcrypt password hashing, HttpOnly cookie (`token`)
- **Email**: Nodemailer + Gmail (`noteflow.ro@gmail.com`)
- **AI**: Groq API (`llama-3.1-8b-instant`) — also has a Gemini API key available
- **Deployment**: Vercel

## Key files
- `src/lib/auth.ts` — JWT sign/verify/getSession
- `src/lib/email.ts` — Nodemailer transporter, email functions
- `src/lib/prisma.ts` — Prisma client singleton
- `src/app/api/auth/` — login, register, logout, verify routes
- `src/app/api/ai/route.ts` — AI text actions (improve, summarize, expand, fix, continue)
- `src/app/(main)/` — authenticated layout with sidebar
- `prisma/schema.prisma` — DB schema

## Database schema (User model)
```
User {
  id                String   (cuid, PK)
  email             String   (unique)
  name              String
  password          String   (bcrypt hash)
  emailVerified     Boolean
  verificationToken String?  (unique) — used for email verification on register
  resetToken        String?  (unique) — password reset token (added)
  resetTokenExpiry  DateTime?          — expiry for reset token (added)
  createdAt         DateTime
  documents         Document[]
}
```

## Auth flow
1. Register → bcrypt hash password → save user with `emailVerified: false` + `verificationToken`
2. Send verification email → user clicks link → `GET /api/auth/verify?token=...` → sets `emailVerified: true`
3. Login → check bcrypt + `emailVerified` → sign JWT → set HttpOnly cookie `token` (7 days)
4. Forgot password → send reset email → user clicks link → `/reset-password?token=...` → hash new password → clear reset fields

## Environment variables (local .env)
- `DATABASE_URL` — PostgreSQL connection string
- `JWT_SECRET` — JWT signing secret
- `GEMINI_API_KEY` — Google Gemini (available, not primary)
- `GROQ_API_KEY` — Groq (primary AI provider)
- `EMAIL_USER` — noteflow.ro@gmail.com
- `EMAIL_PASS` — Gmail app password
- `NEXT_PUBLIC_BASE_URL` — base URL (localhost:3000 locally, Vercel URL in prod)

## Planned work / TODO

### In progress
- **Forgot password feature** — full email-based reset flow

### Upcoming
- **Update UI** — general UI polish and improvements across the app
- **Update AI** — improve AI features in the editor (better models, more actions, better UX)

## Conventions
- API routes return `Response.json(...)` (Next.js App Router style)
- Auth is checked via `getSession()` from `src/lib/auth.ts`
- Prisma client is imported from `@/lib/prisma`
- Styles match existing pattern: dark mode support via `dark:` classes, violet as accent color, black/white buttons
