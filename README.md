# Inkwell — Blog Publishing Platform

A production-style full-stack blog publishing platform built with Next.js (App Router),
TypeScript, Tailwind CSS, Prisma, and **PostgreSQL**.

Visitors browse published articles. Authors write, save drafts, and submit for review.
Admins approve or reject submissions before anything goes live. A submitted blog never
appears publicly until an admin approves it.

## Tech stack

- **Frontend:** Next.js 15 (App Router), React 19, TypeScript, Tailwind CSS
- **Backend:** Next.js Route Handlers, Prisma ORM
- **Database:** Hosted PostgreSQL (Neon, Supabase, or equivalent)
- **Auth:** HTTP-only JWT session cookie (`jose`), bcrypt password hashing
- **Validation:** Zod

## 1. Prerequisites

- Node.js 20+
- A hosted PostgreSQL database you can connect to, such as Neon or Supabase

## 2. Setup

```bash
# 1. Install dependencies
npm install

# 2. Copy the environment template and fill in your PostgreSQL connection string
cp .env.example .env
```

Edit `.env`:

```
DATABASE_URL="postgresql://USER:PASSWORD@HOST/DATABASE?sslmode=require"
JWT_SECRET="a-long-random-string"
NEXT_PUBLIC_SITE_URL="http://localhost:3000"
```

Generate a strong `JWT_SECRET`, e.g.:

```bash
node -e "console.log(require('crypto').randomBytes(48).toString('hex'))"
```

Create the hosted database first, then use its connection string in `.env`.

## 3. Database: migrate and seed

```bash
# Local development: create and apply a migration
npx prisma migrate dev --name init

# Vercel/production: apply committed migrations
npm run prisma:migrate:deploy

# Seed roles, an admin account, 6 authors, 8 categories, and 50 sample blogs
npm run prisma:seed
```

Seed blogs use category-based real-photo images from `loremflickr.com`, selected with
relevant keywords such as `database`, `design`, or `startup`. These are demo images;
authors can provide a hosted featured image URL when creating or editing a blog.

Seeded logins (printed at the end of the seed script too):

| Role   | Email                     | Password       |
|--------|---------------------------|-----------------|
| Admin  | admin@inkwell.dev         | Admin@12345     |
| Author | sara.malik@inkwell.dev    | Author@12345    |
| Author | (any other seeded author) | Author@12345    |

**Change these credentials before deploying anywhere real.**

## 4. Run it

```bash
npm run dev
```

Visit `http://localhost:3000`.

- Public site: home, blogs, blog detail, categories, search
- Author area: `/author/dashboard` (log in as a seeded author)
- Admin area: `/admin/dashboard` (log in as admin)

## 5. Lint & build

```bash
npm run lint
npm run build
npm start
```

## Project structure

```
app/                  Routes (App Router) — public, /author, /admin, /api
  api/                Route handlers: auth, blogs, categories, search
  author/              Author dashboard, blog editor, status lists
  admin/               Admin dashboard, review queue, management
components/           Reusable UI components
lib/                  Prisma client, auth helpers, utilities
prisma/
  schema.prisma        Data model (PostgreSQL)
  seed.ts               Seed script (roles, admin, authors, 50 blogs)
types/                 Shared TypeScript types
middleware.ts          Route protection for /author and /admin
```

## Data model

`Users` → `Roles` (ADMIN / AUTHOR) · `Authors` (1:1 with a User) · `Categories` ·
`Tags` / `BlogTags` (many-to-many) · `Blogs` (status: DRAFT → PENDING → PUBLISHED /
REJECTED / UNPUBLISHED) · `BlogSubmissions` (audit trail of each review decision) ·
`BlogStatuses` (lookup table) · `Media`.

Full definitions, indexes, and relations are in `prisma/schema.prisma`.

## Workflow

```
Visitor → Register → Login → Author Dashboard → Create Blog → Save Draft
   → Submit for Review → Pending → Admin Review → Approve / Reject
   → Published (or sent back with a reason) → Public Website
```

Enforced in code:
- The public site only ever queries `status: "PUBLISHED"` blogs.
- Only an admin can move a blog from `PENDING` to `PUBLISHED` or `REJECTED`
  (`app/api/blogs/[id]/approve`, `app/api/blogs/[id]/reject`).
- Authors can only edit their own `DRAFT` or `REJECTED` blogs.
- `middleware.ts` blocks unauthenticated or wrong-role access to `/author/*` and `/admin/*`.

## SEO

- Dynamic per-blog metadata + Open Graph (`app/blogs/[slug]/page.tsx`)
- `app/sitemap.ts` and `app/robots.ts` (served at `/sitemap.xml` and `/robots.txt`)
- Canonical URLs on blog detail pages
- SEO-friendly slugs generated from titles, with automatic de-duplication

## Notes on production readiness

- Passwords are hashed with bcrypt (cost 12); sessions are signed JWTs in an
  HTTP-only cookie — never store the JWT in localStorage.
- All mutating API routes validate input with Zod and check the caller's session/role.
- Set `DATABASE_URL` to your production PostgreSQL database and set a
  fresh `JWT_SECRET` before deploying — do not reuse the seed credentials.
- Consider adding rate limiting on `/api/auth/*` before going live publicly.
