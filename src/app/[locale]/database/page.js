import "./page.css";
import CasesList from "./CasesList";
import PageHeader from "@/app/PageHeader";
import { getCases } from "@/services/api";

async function getData() {
  return getCases();
}

export default async function Page({ params: { locale } }) {
  const data = await getData();

  return <>
    <PageHeader locale={locale} variant="compact" />
    <main className="page-body">
      <CasesList cases={data} />
    </main>
  </>
}
