# Deployment (GitHub Pages)

Static export. `yarn build` copies the Strapi uploads the content references into `public/uploads/` and
prerenders all pages into `out/`. Strapi is only needed **at build time**. Content and media change on the
live site only after a rebuild. The map loads cases from `NEXT_PUBLIC_CASES_URL` in the browser.

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
| `NEXT_PUBLIC_CASES_URL` | full URL of the case dataset (default `https://api.feminizidmap.org/cases`) |

All of them are read at build time. Changing them later has no effect without a rebuild.

## Pitfalls

- Use `yarn build`, not `next build`. Otherwise `scripts/fetch-media.mjs` doesn't run and the uploads are missing.
- If a content request or a download fails, the build **fails** on purpose, so no dead links ship. `yarn dev` only warns.
- `basePath` is injected by `actions/configure-pages`. For other hosts, serve `out/` from the domain root.
