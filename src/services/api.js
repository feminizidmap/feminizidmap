const CASES_URL = process.env.NEXT_PUBLIC_CASES_URL || "https://api.feminizidmap.org/cases";
const STRAPI_URL = process.env.NEXT_PUBLIC_STRAPI_URL || "https://api.feminizidmap.org";

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
async function getPage(endpoint, locale) {
  const data = await strapiGet(`${endpoint}?locale=${locale}`);

  return data ? { title: data.title ?? null, content: data.content ?? null } : null;
}

export async function getHome(locale) {
  return (await getPage("/api/home", locale))?.content ?? null;
}

export function getAbout(locale) {
  return getPage("/api/about", locale);
}

export function getFaq(locale) {
  return getPage("/api/faq", locale);
}

export function getImprint(locale) {
  return getPage("/api/imprint", locale);
}

export function getDataprotection(locale) {
  return getPage("/api/dataprotection", locale);
}

export async function getReports(locale) {
  return (await strapiGet(`/api/reports?locale=${locale}&sort=date:desc&pagination[pageSize]=100`)) ?? [];
}

export function getReport(documentId, locale) {
  return strapiGet(`/api/reports/${documentId}?locale=${locale}`, { allowNotFound: true });
}

export async function getTeamMembers(locale) {
  return (await strapiGet(`/api/team-members?locale=${locale}&sort=name:asc&pagination[pageSize]=100`)) ?? [];
}

export async function getEvents(locale) {
  return (await strapiGet(`/api/event-items?locale=${locale}&populate=*&sort=start_date:desc&pagination[pageSize]=100`)) ?? [];
}

// Publications are not localized.
export async function getPublications() {
  return (await strapiGet("/api/publication-items?populate=*&pagination[pageSize]=100")) ?? [];
}
