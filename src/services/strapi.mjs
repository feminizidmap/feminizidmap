// Shared by the app (src/services/api.js) and scripts/fetch-media.mjs, so it is plain ESM
// without Next.js aliases.

export const STRAPI_URL = process.env.NEXT_PUBLIC_STRAPI_URL || "https://backend.feminizidmap.org";

// Read-only Strapi API token for the build (prod only lets content requests through with one).
// Deliberately not NEXT_PUBLIC_: Next only inlines NEXT_PUBLIC_ variables into browser code, so
// the token stays on the build machine. Without it (local Strapi, public role) no header is sent.
export function strapiHeaders() {
  const token = process.env.STRAPI_API_TOKEN;
  return token ? { Authorization: `Bearer ${token}` } : {};
}

// Headers for the case dataset request, with its own token (CASES_API_TOKEN, e.g. find on cases-public-preview),
// separate from the website content token. Only sent if the cases come from our own Strapi (a demo build reading
// backend.feminizidmap.org/api/cases-public-preview directly), never to api.feminizidmap.org or any other host.
export function casesHeaders(casesUrl) {
  const token = process.env.CASES_API_TOKEN;
  if (!token) return {};
  try {
    return new URL(casesUrl).host === new URL(STRAPI_URL).host ? { Authorization: `Bearer ${token}` } : {};
  } catch {
    return {};
  }
}

// Strapi REST paths the site renders. scripts/fetch-media.mjs scans these for uploads.
export const CONTENT_PATHS = {
  home: (locale) => `/api/home?locale=${locale}`,
  about: (locale) => `/api/about?locale=${locale}`,
  faq: (locale) => `/api/faq?locale=${locale}`,
  // Imprint, data protection and publications are not localized.
  imprint: () => "/api/imprint",
  dataprotection: () => "/api/dataprotection",
  // populate=* does not reach the media inside the report_files component.
  reports: (locale) => `/api/reports?locale=${locale}&populate[report_files][populate]=file&sort=report_year:desc&pagination[pageSize]=100`,
  teamMembers: (locale) => `/api/team-members?locale=${locale}&sort=name:asc&pagination[pageSize]=100`,
  events: (locale) => `/api/event-items?locale=${locale}&populate=*&sort=start_date:desc&pagination[pageSize]=100`,
  publications: () => "/api/publication-items?populate=*&pagination[pageSize]=100",
};

// Uploads are copied into the static site at /uploads (see scripts/fetch-media.mjs).
export const UPLOADS_DIR = "uploads";

const STRAPI_HOSTS = new Set([new URL(STRAPI_URL).host, "backend.feminizidmap.org", "api.feminizidmap.org"]);

// Strapi upload URL → { source: absolute download URL, file: filename on disk, href: path in the static site }.
// Returns null for anything that isn't a Strapi upload.
export function parseUpload(value) {
  if (typeof value !== "string" || !value.includes("/uploads/")) return null;

  let url;
  try {
    url = new URL(value, STRAPI_URL);
  } catch {
    return null;
  }

  const isRelative = value.startsWith("/uploads/");
  if (!isRelative && !STRAPI_HOSTS.has(url.host)) return null;
  if (!url.pathname.startsWith("/uploads/")) return null;

  // Strapi puts a hash in every upload filename, so the name is unique and the content never changes.
  const name = url.pathname.slice("/uploads/".length);
  if (!name || name.includes("/")) return null;

  return {
    source: isRelative ? `${STRAPI_URL}${url.pathname}` : `${url.origin}${url.pathname}`,
    file: decodeURIComponent(name),
    href: `/${UPLOADS_DIR}/${name}`,
  };
}

// All Strapi uploads referenced anywhere in an API response (media fields, formats, block links).
export function collectUploads(data, found = new Map()) {
  if (typeof data === "string") {
    const upload = parseUpload(data);
    if (upload) found.set(upload.file, upload);
  } else if (Array.isArray(data)) {
    data.forEach((item) => collectUploads(item, found));
  } else if (data && typeof data === "object") {
    Object.values(data).forEach((value) => collectUploads(value, found));
  }
  return found;
}

// Copy of an API response with every Strapi upload URL pointing at the static site's copy.
export function localizeUploads(data, basePath = "") {
  if (typeof data === "string") {
    const upload = parseUpload(data);
    return upload ? `${basePath}${upload.href}` : data;
  }
  if (Array.isArray(data)) return data.map((item) => localizeUploads(item, basePath));
  if (data && typeof data === "object") {
    return Object.fromEntries(Object.entries(data).map(([key, value]) => [key, localizeUploads(value, basePath)]));
  }
  return data;
}
