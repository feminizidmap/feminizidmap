import "@/app/[locale]/map/filters.css";
import "./page.css";
import CasesList from "./CasesList";
import PageHeader from "@/app/PageHeader";
import { getDictionary } from "@/i18n";
import { getCases } from "@/services/api";

async function getData() {
  return getCases();
}

export default async function Page({ params: { locale } }) {
  const data = await getData();
  const t = getDictionary(locale).database;

  return <>
    <PageHeader locale={locale} title={t.title} lead={t.lead} />
    <main className="page-body">
      <CasesList cases={data} />
    </main>
  </>
}
