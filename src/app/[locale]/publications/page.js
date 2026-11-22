import "./publications.css";
import PageHeader from "@/app/PageHeader";
import { getPublications, getReports } from "@/services/api";
import { formatDate } from "@/app/caseFormat";
import { getDictionary } from "@/i18n";

// Files published with a report (report, press release, …), each with its own title.
// Upload URLs already point at the static site's copy (see services/api.js).
function reportFiles(report) {
  return (report.report_files ?? []).filter((entry) => entry.file?.url);
}

// "PDF" for PDFs, otherwise the file extension ("DOCX").
function fileKind(file) {
  if (file.mime === "application/pdf") return "PDF";
  return (file.ext || /\.([a-z0-9]+)$/i.exec(file.url)?.[1] || "").replace(".", "").toUpperCase();
}

function DownloadIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M12 4v12M6 10l6 6 6-6M5 20h14" />
    </svg>
  );
}

function ReportCard({ report, locale, t }) {
  const files = reportFiles(report);
  const released = formatDate(report.release_date);

  return (
    <article className="report-card">
      {report.report_year && <span className="report-year">{report.report_year}</span>}
      <div className="report-body">
        {released && <span className="report-date">{t.published} {released}</span>}
        <h3 className="report-title">{report.title}</h3>
      </div>
      {files.length > 0 && (
        <div className="report-downloads">
          {files.map((entry) => (
            <a key={entry.id} className="report-download" href={entry.file.url} download hrefLang={locale}>
              <span>
                <span className="report-download-label">{entry.title}</span>
                <span className="report-download-meta">{fileKind(entry.file)}</span>
              </span>
              <DownloadIcon />
            </a>
          ))}
        </div>
      )}
    </article>
  );
}

// Titles start with "Author (YYYY)."; the year is only in the title.
const publicationYear = (item) => /\((\d{4})/.exec(item.title || "")?.[1];

function PublicationRow({ item, t }) {
  const year = publicationYear(item);
  return (
    <li className="pub-row">
      <span className="pub-year">{year}</span>
      <span className="pub-type">{item.tags?.[0] && <span className="t-tag">{item.tags[0].label}</span>}</span>
      <p className="pub-text">{item.title}</p>
      <ul className="pub-links">
        {item.links?.map((link) => (
          <li key={link.id}>
            {/* Links carry no label (Strapi stores only the url); show the target in tooltip and aria-label. */}
            <a href={link.url} target="_blank" rel="noopener noreferrer" title={link.url} aria-label={`${t.link}: ${link.url}`}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M7 17L17 7M9 7h8v8" /></svg>
            </a>
          </li>
        ))}
      </ul>
    </li>
  );
}

function PublicationGroup({ title, items, t }) {
  return (
    <div className="pub-group">
      <h3 className="pub-group-title">{title}</h3>
      <ol className="pub-rows">
        {items.map((item) => <PublicationRow key={item.documentId} item={item} t={t} />)}
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
  // Newest first. Strapi returns publications in id order, and re-publishing an entry gives it a new id,
  // so without sorting an edited entry jumps to the end. Same year keeps the Strapi order (stable sort),
  // entries without a year go last.
  const publications = settledValue(publicationsResult, "publications")
    .slice()
    .sort((a, b) => (publicationYear(b) ?? 0) - (publicationYear(a) ?? 0));

  // One group per category, in the dictionary's order. Unknown/missing categories land in
  // "miscellaneous" so an entry never disappears because the frontend lacks its translation.
  const groups = Object.entries(t.categories).map(([key, title]) => ({ key, title, items: [] }));
  const fallback = groups.find((group) => group.key === "miscellaneous");
  for (const item of publications) {
    (groups.find((group) => group.key === item.category) ?? fallback).items.push(item);
  }

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
          {groups.filter((group) => group.items.length > 0).map((group) => (
            <PublicationGroup key={group.key} title={group.title} items={group.items} t={t} />
          ))}
        </div>
      </section>
    </main>
  </>
}
