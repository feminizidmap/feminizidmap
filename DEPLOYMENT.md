# Deployment (GitHub Pages)

Static export. `yarn build` copies the Strapi uploads the content references into `public/uploads/` and
prerenders all pages into `out/`. Strapi is only needed **at build time**. Content and media change on the
live site only after a rebuild. The case dataset (`NEXT_PUBLIC_CASES_URL`) is snapshotted into `public/data/cases.json`
at build time and shared by map and database, so the deployed site never calls an API. **Case updates need a
rebuild too.**

## One-time setup

1. **Strapi admin** (prod) → Settings → API Tokens → new token `github-pages-build`, type *Custom*,
   only `find` on: home, about, faq, imprint, dataprotection, report, team-member, event-item, publication-item.
2. **nginx** (`ansible-feminizidmap`): `feminizidmap_strapi_token_content_paths` in
   `host_vars/backend.feminizidmap.org.yml` opens exactly these `/api/…` paths for GET requests with a token. Deploy the nginx role.
3. **GitHub** repo → Settings → Secrets and variables → Actions:
   - secret `STRAPI_API_TOKEN` = the token
   - variable `NEXT_PUBLIC_STRAPI_URL` = `https://backend.feminizidmap.org`
   - variable `NEXT_PUBLIC_CASES_URL` = `https://api.feminizidmap.org/cases`
4. GitHub → Settings → Pages → Source: *GitHub Actions*.

## Deploy

Push to a branch listed in `.github/workflows/nextjs.yml`, or Actions → *Deploy Next.js site to Pages* → *Run workflow*.
**Run it again after content changes in Strapi.**

## Local build

Copy `.env.example` to `.env` and set `NEXT_PUBLIC_STRAPI_URL=http://localhost:1337`. A token is optional locally as long as the
public role can read the content. Then run `yarn build` and serve `out/` (e.g. `npx serve out`).

## Variables

| Name | Purpose |
|---|---|
| `NEXT_PUBLIC_STRAPI_URL` | Strapi base URL for content and uploads (default `https://backend.feminizidmap.org`) |
| `STRAPI_API_TOKEN` | read-only token for content requests. Secret, never prefix with `NEXT_PUBLIC_` |
| `NEXT_PUBLIC_CASES_URL` | full URL of the case dataset, read at build time only (default `https://api.feminizidmap.org/cases`). If it points to the Strapi host (`NEXT_PUBLIC_STRAPI_URL`), `CASES_API_TOKEN` is sent with it, otherwise never |
| `CASES_API_TOKEN` | separate read-only token for the case request (demo only), e.g. `find` on `cases-public-preview`. Secret, never `NEXT_PUBLIC_` |
| `NEXT_PUBLIC_NOINDEX` | `true` for demo builds: `noindex, nofollow` and `no-referrer` on every page |

All of them are read at build time. Changing them later has no effect without a rebuild.

## Preview/demo deployment (Vercel)

A separate deployment that shows the preview dataset (2019–2026 incl. unpublished drafts) without going through the
public API: the build reads the cases straight from Strapi with a token.

| Variable | Value |
|---|---|
| `NEXT_PUBLIC_STRAPI_URL` | `https://backend.feminizidmap.org` |
| `NEXT_PUBLIC_CASES_URL` | `https://backend.feminizidmap.org/api/cases-public-preview` |
| `STRAPI_API_TOKEN` | website content token (`find` on the website types), as for prod |
| `CASES_API_TOKEN` | case token: `find` on `cases-public-preview` only |
| `NEXT_PUBLIC_NOINDEX` | `true` |

Prerequisites outside this repo: nginx must let `GET /api/cases-public-preview` through on the backend vhost with a token,
and the case token needs the permission in Strapi. Build command: `yarn build`, output directory: `out`.

**The deployment itself is public.** The cases end up in `/data/cases.json` and in the database page, drafts included, so
the obscure deployment URL is the only protection. Share it carefully, or enable Vercel Deployment Protection.

## Pitfalls

- Use `yarn build`, not `next build`. Otherwise `scripts/fetch-media.mjs` doesn't run and the uploads are missing.
- If a content request or a download fails, the build **fails** on purpose, so no dead links ship. `yarn dev` only warns.
- `basePath` is injected by `actions/configure-pages`. For other hosts, serve `out/` from the domain root.
