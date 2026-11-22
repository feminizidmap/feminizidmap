import { getMonth } from "@/app/[locale]/map/filterUtils";
import { getDictionary } from "@/i18n";

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

// One line in the page header of map and database (PageHeader `note`): "Zeitraum: Januar 2023 – Dezember 2023. Daten für … auf Anfrage verfügbar."
// `cases` is the build snapshot (readCasesSnapshot().data). Renders nothing if no case has a valid date.
export default function CasesPeriodNote({ cases, locale }) {
  const period = periodLabel(cases ?? [], locale);
  if (!period) return null;
  const t = getDictionary(locale).casesData;

  return (
    <p className="page-header-note">
      <strong>{t.period}:</strong> {period}. {t.moreData}
    </p>
  );
}
