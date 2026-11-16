const CASES_URL = process.env.NEXT_PUBLIC_CASES_URL || "https://api.feminizidmap.org/cases";
const STRAPI_URL = process.env.NEXT_PUBLIC_STRAPI_URL || "https://api.feminizidmap.org";

// Strapi's default locale is "de"; the site is English, so localized types are requested explicitly.
const LOCALE = "en";

export async function getCases() {
  const response = await fetch(CASES_URL);

  if (!response.ok) {
    throw new Error(`API error: ${response.status} ${response.statusText}`);
  }

  return response.json();
}

// GET a Strapi REST path and return its `data`. Returns null on 404 when `allowNotFound` is set.
async function strapiGet(path, { allowNotFound = false } = {}) {
  const response = await fetch(`${STRAPI_URL}${path}`);

  if (allowNotFound && response.status === 404) {
    return null;
  }

  if (!response.ok) {
    throw new Error(`API error: ${response.status} ${response.statusText}`);
  }

  const { data } = await response.json();

  return data ?? null;
}

// Single type with `title` + blocks `content` (home, about, faq, imprint, ...).
async function getPage(endpoint) {
  const data = await strapiGet(`${endpoint}?locale=${LOCALE}`);

  return data ? { title: data.title ?? null, content: data.content ?? null } : null;
}

export async function getHome() {
  return (await getPage("/api/home"))?.content ?? null;
}

export async function getAbout() {
  return (await getPage("/api/about"))?.content ?? null;
}

export function getFaq() {
  return getPage("/api/faq");
}

export function getImprint() {
  return getPage("/api/imprint");
}

export function getDataprotection() {
  return getPage("/api/dataprotection");
}

export async function getReports() {
  return (await strapiGet(`/api/reports?locale=${LOCALE}&sort=date:desc&pagination[pageSize]=100`)) ?? [];
}

export function getReport(documentId) {
  return strapiGet(`/api/reports/${documentId}?locale=${LOCALE}`, { allowNotFound: true });
}

export async function getTeamMembers() {
  return (await strapiGet(`/api/team-members?locale=${LOCALE}&sort=name:asc&pagination[pageSize]=100`)) ?? [];
}

export async function getEvents() {
  return (await strapiGet(`/api/event-items?locale=${LOCALE}&populate=*&sort=start_date:desc&pagination[pageSize]=100`)) ?? [];
}

// Publications are not localized.
export async function getPublications() {
  return (await strapiGet("/api/publication-items?populate=*&pagination[pageSize]=100")) ?? [];
}
