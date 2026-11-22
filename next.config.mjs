const nextConfig = {
  output: 'export',
  reactStrictMode: true,
  swcMinify: true,
  images: {
    domains: ["localhost"]
  },
};

// Demo deployments (e.g. Vercel) can hide the whole site under a secret path: SECRET_BASE_PATH=weroiujw…
// serves everything (pages, assets, /data/cases.json, /uploads) only below /weroiujw…/. Obscurity, not
// access control. scripts/nest-base-path.mjs moves out/ into that folder after the build.
const secretBasePath = (process.env.SECRET_BASE_PATH || "").replace(/^\/+|\/+$/g, "");
if (secretBasePath) {
  nextConfig.basePath = `/${secretBasePath}`;
}

// basePath is injected by the configure-pages GitHub Action for GitHub Pages deploys.
// Expose it so client components can prefix asset URLs (e.g. PMTiles).
nextConfig.env = {
  NEXT_PUBLIC_BASE_PATH: nextConfig.basePath || '',
};

export default nextConfig;
