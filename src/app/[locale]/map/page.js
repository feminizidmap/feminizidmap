import Map from "./map";
import CasesPeriodNote from "@/app/CasesPeriodNote";
import PageHeader from "@/app/PageHeader";
import { getDictionary } from "@/i18n";
import { readCasesSnapshot } from "@/services/cases-snapshot";
import "./filters.css";
import "./page.css";

export default async function Page({ params: { locale } }) {
  const t = getDictionary(locale).map;
  // The map loads the same snapshot in the browser; here it only provides the period.
  const data = await readCasesSnapshot();

  return (
    <>
    <PageHeader
      locale={locale}
      variant="map"
      title={t.title}
      lead={t.lead}
      note={<CasesPeriodNote cases={data?.data} locale={locale} />}
    />
    <main className="map-page-main">
      <Map />
    </main>
    </>
  );
}
