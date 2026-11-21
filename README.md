This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.js`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/basic-features/font-optimization) to automatically optimize and load Inter, a custom Google Font.

## Generating the map tiles (pmtiles)

The map uses `public/germany9.pmtiles`, a vector tile extract rendered with the [`@protomaps/basemaps`](https://github.com/protomaps/basemaps) style (see `src/app/[locale]/map/map.js`). It's cut from the daily Protomaps planet build using the `pmtiles` CLI ([go-pmtiles](https://github.com/protomaps/go-pmtiles)).

1. Install the CLI, e.g. via Homebrew:
   ```bash
   brew install protomaps/tap/pmtiles
   ```
   or build from source with Go:
   ```bash
   go install github.com/protomaps/go-pmtiles/cmd/pmtiles@latest
   ```

2. Pick a daily planet build from [build.protomaps.com](https://build.protomaps.com) (URLs look like `https://build.protomaps.com/YYYYMMDD.pmtiles`).

3. Extract the Germany region at maxzoom 9, either with a bounding box or a region GeoJSON boundary:
   ```bash
   pmtiles extract https://build.protomaps.com/<date>.pmtiles germany9.pmtiles \
     --maxzoom=9 \
     --region=germany.geojson
   ```
   (a Germany boundary GeoJSON can be exported from sources like [geoBoundaries](https://www.geoboundaries.org/) or [Natural Earth](https://www.naturalearthdata.com/)).

4. Replace `public/germany9.pmtiles` with the new file.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js/) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/deployment) for more details.
