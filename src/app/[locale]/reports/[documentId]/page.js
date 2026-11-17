import { notFound } from "next/navigation";
import PageHeader from "@/app/PageHeader";
import BlocksContent from "@/app/BlocksContent";
import { getReport, getReports } from "@/services/api";
import { formatDate } from "@/app/caseFormat";

export async function generateStaticParams({ params: { locale } }) {
  let reports = [];

  try {
    reports = await getReports(locale);
  } catch (error) {
    console.error("Failed to load reports", error);
  }

  // output: 'export' requires at least one static path per dynamic route, even
  // when there are no reports yet; this id never matches a real document and
  // falls through to notFound() below.
  if (reports.length === 0) {
    return [{ documentId: "none" }];
  }

  return reports.map((report) => ({ documentId: report.documentId }));
}

export default async function Page({ params }) {
  let report = null;

  try {
    report = await getReport(params.documentId, params.locale);
  } catch (error) {
    console.error("Failed to load report", error);
  }

  if (!report) {
    notFound();
  }

  return <>
    <PageHeader locale={params.locale} title={report.title} lead={formatDate(report.date)} />
    <main className="page-body">
      <BlocksContent content={report.content} />
    </main>
  </>
}
