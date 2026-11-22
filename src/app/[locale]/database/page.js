import "@/app/[locale]/map/filters.css";
import "./page.css";
import CasesList from "./CasesList";
import PageHeader from "@/app/PageHeader";
import { getMonth } from "@/app/[locale]/map/filterUtils";
import { getDictionary } from "@/i18n";
import { readCasesSnapshot } from "@/services/cases-snapshot";

const INTL_LOCALE = { de: "de-DE", en: "en-GB" };

// Period covered by the data: earliest to latest crime month, e.g. "Januar 2023 – Dezember 2024".
function periodLabel(cases, locale) {
  const months = cases.map(getMonth).filter((month) => month !== null);
  if (months.length === 0) return null;

  const fmt = new Intl.DateTimeFormat(INTL_LOCALE[locale] ?? locale, { month: "long", year: "numeric", timeZone: "UTC" });
  const label = (month) => fmt.format(Date.UTC(Math.floor(month / 12), month % 12, 1));
  const from = Math.min(...months);
  const to = Math.max(...months);
  return from === to ? label(from) : `${label(from)} – ${label(to)}`;
}

export default async function Page({ params: { locale } }) {
  // Same build snapshot as the map (public/data/cases.json).
  const data = await readCasesSnapshot();
  const t = getDictionary(locale).database;
  const period = periodLabel(data?.data ?? [], locale);

  return <>
    <PageHeader locale={locale} title={t.title} lead={t.lead} />
    <main className="page-body">
      {period && (
        <p className="database-intro">
          <strong>{t.period}:</strong> {period}. {t.moreData}
        </p>
      )}
      <CasesList cases={data} />
    </main>
  </>
}
