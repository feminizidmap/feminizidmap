import { CONTENT_PATHS, STRAPI_URL, localizeUploads } from "./strapi.mjs";

const CASES_URL = process.env.NEXT_PUBLIC_CASES_URL || "https://api.feminizidmap.org/cases";
const BASE_PATH = process.env.NEXT_PUBLIC_BASE_PATH || "";

export async function getCases() {
  const response = await fetch(CASES_URL);

  if (!response.ok) {
    throw new Error(`API error: ${response.status} ${response.statusText}`);
  }

  return response.json();
}

// GET a Strapi REST path and return its `data`. Returns null on 404 when `allowNotFound` is set.
// Upload URLs are rewritten to the copies in the static site (scripts/fetch-media.mjs).
async function strapiGet(path, { allowNotFound = false } = {}) {
  const response = await fetch(`${STRAPI_URL}${path}`);

  if (allowNotFound && response.status === 404) {
    return null;
  }

  if (!response.ok) {
    throw new Error(`API error: ${response.status} ${response.statusText}`);
  }

  const { data } = await response.json();

  return data ? localizeUploads(data, BASE_PATH) : null;
}

// Single type with `title` + blocks `content` (home, about, faq, imprint, ...).
async function getPage(path) {
  const data = await strapiGet(path);

  return data ? { title: data.title ?? null, content: data.content ?? null } : null;
}

export function getHome(locale) {
  return getPage(CONTENT_PATHS.home(locale));
}

export function getAbout(locale) {
  return getPage(CONTENT_PATHS.about(locale));
}

export function getFaq(locale) {
  return getPage(CONTENT_PATHS.faq(locale));
}

// Imprint and data protection are not localized (German only).
export function getImprint() {
  return getPage(CONTENT_PATHS.imprint());
}

export function getDataprotection() {
  return getPage(CONTENT_PATHS.dataprotection());
}

export async function getReports(locale) {
  return (await strapiGet(CONTENT_PATHS.reports(locale))) ?? [];
}


export async function getTeamMembers(locale) {
  return (await strapiGet(CONTENT_PATHS.teamMembers(locale))) ?? [];
}

export async function getEvents(locale) {
  return (await strapiGet(CONTENT_PATHS.events(locale))) ?? [];
}

// Publications are not localized.
export async function getPublications() {
  return (await strapiGet(CONTENT_PATHS.publications())) ?? [];
}
