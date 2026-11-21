import "@/app/[locale]/map/filters.css";
import "./page.css";
import CasesList from "./CasesList";
import PageHeader from "@/app/PageHeader";
import { getDictionary } from "@/i18n";
import { readCasesSnapshot } from "@/services/cases-snapshot";

export default async function Page({ params: { locale } }) {
  // Same build snapshot as the map (public/data/cases.json).
  const data = await readCasesSnapshot();
  const t = getDictionary(locale).database;

  return <>
    <PageHeader locale={locale} title={t.title} lead={t.lead} />
    <main className="page-body">
      <CasesList cases={data} />
    </main>
  </>
}
