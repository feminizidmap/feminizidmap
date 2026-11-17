import Link from "next/link";
import "./publications.css";
import PageHeader from "@/app/PageHeader";
import { getPublications, getReports } from "@/services/api";
import { formatDate } from "@/app/caseFormat";
import { getDictionary, localePath } from "@/i18n";

const STRAPI_URL = process.env.NEXT_PUBLIC_STRAPI_URL || "";

// First link to a PDF inside a Strapi blocks field.
function findPdfLink(blocks) {
  for (const block of blocks ?? []) {
    if (block.type === "link" && /\.pdf($|\?)/i.test(block.url || "")) return block.url;
    const nested = findPdfLink(block.children);
    if (nested) return nested;
  }
  return null;
}

// The report PDF for the page's locale: a `pdf` media field if the report has one
// (Strapi localizes it per locale), otherwise the first PDF linked in the report text.
function reportPdf(report) {
  const url = report.pdf?.url;
  if (url) return url.startsWith("http") ? url : `${STRAPI_URL}${url}`;
  return findPdfLink(report.content);
}

function DownloadIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M12 4v12M6 10l6 6 6-6M5 20h14" />
    </svg>
  );
}

function ReportCard({ report, locale, t }) {
  const pdf = reportPdf(report);
  // The data year is part of the title ("… 2023"); fall back to the publication year.
  const year = /(\d{4})\s*$/.exec(report.title || "")?.[1] ?? report.date?.slice(0, 4);

  return (
    <article className="report-card">
      {year && <span className="report-year">{year}</span>}
      <div className="report-body">
        {formatDate(report.date) && <span className="report-date">{t.published} {formatDate(report.date)}</span>}
        <h3 className="report-title">
          <Link href={localePath(locale, `/reports/${report.documentId}`)}>{report.title}</Link>
        </h3>
      </div>
      {pdf ? (
        <a className="report-download" href={pdf} download hrefLang={locale}>
          <span>
            <span className="report-download-label">{t.download}</span>
            <span className="report-download-meta">{t.pdfMeta}</span>
          </span>
          <DownloadIcon />
        </a>
      ) : (
        <Link className="report-download" href={localePath(locale, `/reports/${report.documentId}`)}>
          <span className="report-download-label">{t.readReport}</span>
          <span aria-hidden="true">→</span>
        </Link>
      )}
    </article>
  );
}

function PublicationRow({ item }) {
  // Titles start with "Author (YYYY)."; show that year in its own column.
  const year = /\((\d{4})/.exec(item.title || "")?.[1];
  return (
    <li className="pub-row">
      <span className="pub-year">{year}</span>
      <span className="pub-type">{item.tags?.[0] && <span className="t-tag">{item.tags[0].label}</span>}</span>
      <p className="pub-text">{item.title}</p>
      <ul className="pub-links">
        {item.links?.map((link) => (
          <li key={link.id}>
            <a href={link.url} target="_blank" rel="noopener noreferrer">
              {link.name || link.url}
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M7 17L17 7M9 7h8v8" /></svg>
            </a>
          </li>
        ))}
      </ul>
    </li>
  );
}

function PublicationGroup({ title, items }) {
  return (
    <div className="pub-group">
      <h3 className="pub-group-title">{title}</h3>
      <ol className="pub-rows">
        {items.map((item) => <PublicationRow key={item.documentId} item={item} />)}
      </ol>
    </div>
  );
}

function settledValue(result, label) {
  if (result.status === "fulfilled") return result.value;
  console.error(`Failed to load ${label}`, result.reason);
  return [];
}

export default async function Page({ params: { locale } }) {
  const t = getDictionary(locale).publications;
  const [reportsResult, publicationsResult] = await Promise.allSettled([getReports(locale), getPublications()]);
  const reports = settledValue(reportsResult, "reports");
  const publications = settledValue(publicationsResult, "publications");

  const project = publications.filter((item) => item.project_related);
  const further = publications.filter((item) => !item.project_related);

  return <>
    <PageHeader locale={locale} title={t.title} lead={t.lead} />
    <main className="page-body">
      <section id="reports" className="pub-section" aria-labelledby="reports-title">
        <h2 id="reports-title" className="t-section pub-section-title">{t.reports}</h2>
        {reports.length === 0 ? (
          <p className="pub-empty">{t.reportsEmpty}</p>
        ) : (
          <div className="report-list">
            {reports.map((report) => <ReportCard key={report.documentId} report={report} locale={locale} t={t} />)}
          </div>
        )}
      </section>

      <section id="publications" className="pub-section pub-section-lg" aria-labelledby="publications-title">
        <h2 id="publications-title" className="t-section pub-section-title">{t.other}</h2>
        {publications.length === 0 && <p className="pub-empty">{t.empty}</p>}
        <div className="pub-groups">
          {project.length > 0 && <PublicationGroup title={t.project} items={project} />}
          {further.length > 0 && <PublicationGroup title={t.further} items={further} />}
        </div>
      </section>
    </main>
  </>
}
