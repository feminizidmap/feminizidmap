// Copies every Strapi upload the site references into public/uploads, so the static
// site serves its own files and doesn't link into the Strapi media library.
// The pages rewrite upload URLs to these copies (src/services/api.js → localizeUploads).
//
//   node scripts/fetch-media.mjs           build: any failure aborts (no dead links ship)
//   node scripts/fetch-media.mjs --lenient dev: failures are only reported
//
// Only referenced files are copied, never the whole media library. Files that are no longer
// referenced are removed from public/uploads.
//
// Also writes the case dataset (NEXT_PUBLIC_CASES_URL) to public/data/cases.json: the map loads that file
// in the browser and the database page reads it at build time, so both show the same snapshot and the
// deployed site never calls the API.
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import nextEnv from "@next/env";

const root = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
const dev = process.argv.includes("--lenient");
nextEnv.loadEnvConfig(root, dev);

// Import after loading .env, so NEXT_PUBLIC_STRAPI_URL is set.
const { CONTENT_PATHS, STRAPI_URL, UPLOADS_DIR, collectUploads, strapiHeaders } = await import("../src/services/strapi.mjs");

const LOCALES = ["de", "en"];
const CASES_URL = process.env.NEXT_PUBLIC_CASES_URL || "https://api.feminizidmap.org/cases";
// Build snapshot of the case dataset, shared by the map (browser) and the database page (build).
const casesFile = path.join(root, "public", "data", "cases.json");
const targetDir = path.join(root, "public", UPLOADS_DIR);
const errors = [];

async function fetchContent() {
  const paths = new Set(Object.values(CONTENT_PATHS).flatMap((toPath) => LOCALES.map((locale) => toPath(locale))));
  const uploads = new Map();

  await Promise.all([...paths].map(async (apiPath) => {
    try {
      const response = await fetch(`${STRAPI_URL}${apiPath}`, { headers: strapiHeaders() });
      if (!response.ok) throw new Error(`${response.status} ${response.statusText}`);
      collectUploads((await response.json()).data, uploads);
    } catch (error) {
      errors.push(`${STRAPI_URL}${apiPath}: ${error.message}`);
    }
  }));

  return uploads;
}

async function download({ source, file }) {
  const target = path.join(targetDir, file);
  // Strapi hashes upload filenames, so an existing file is already the right one.
  if (fs.existsSync(target)) return false;

  const response = await fetch(source);
  if (!response.ok) throw new Error(`${response.status} ${response.statusText}`);

  const tmp = `${target}.part`;
  fs.writeFileSync(tmp, Buffer.from(await response.arrayBuffer()));
  fs.renameSync(tmp, target);
  return true;
}

// Write the case snapshot. On failure, a build aborts; dev keeps the previous snapshot if there is one.
async function fetchCases() {
  try {
    const response = await fetch(CASES_URL);
    if (!response.ok) throw new Error(`${response.status} ${response.statusText}`);
    const json = await response.json();
    if (!Array.isArray(json?.data)) throw new Error("response has no data array");
    fs.mkdirSync(path.dirname(casesFile), { recursive: true });
    fs.writeFileSync(`${casesFile}.part`, JSON.stringify(json));
    fs.renameSync(`${casesFile}.part`, casesFile);
    console.log(`fetch-media: ${json.data.length} cases → public/data/cases.json (${CASES_URL})`);
  } catch (error) {
    errors.push(`${CASES_URL}: ${error.message}${fs.existsSync(casesFile) ? " (keeping previous snapshot)" : ""}`);
  }
}

const [uploads] = await Promise.all([fetchContent(), fetchCases()]);
fs.mkdirSync(targetDir, { recursive: true });

let downloaded = 0;
await Promise.all([...uploads.values()].map(async (upload) => {
  try {
    if (await download(upload)) downloaded += 1;
  } catch (error) {
    errors.push(`${upload.source}: ${error.message}`);
  }
}));

// Don't ship files that the content no longer references. Skip pruning if content requests failed,
// because then the list of references is incomplete.
let removed = 0;
if (!errors.some((error) => error.startsWith(STRAPI_URL))) {
  for (const file of fs.readdirSync(targetDir)) {
    if (!uploads.has(file)) {
      fs.rmSync(path.join(targetDir, file));
      removed += 1;
    }
  }
}

console.log(`fetch-media: ${uploads.size} referenced, ${downloaded} downloaded, ${removed} removed (${STRAPI_URL})`);

if (errors.length > 0) {
  console.error(`fetch-media: ${errors.length} failed:\n${errors.map((error) => `  - ${error}`).join("\n")}`);
  if (!dev) process.exit(1);
}
