import Link from "next/link";
import PageHeader from "@/app/PageHeader";
import "@/app/cards.css";
import { getPublications, getReports } from "@/services/api";
import { formatDate, teaser } from "@/app/caseFormat";
import { getDictionary, localePath } from "@/i18n";

function ReportList({ reports, locale }) {
  return <ul className="list-unstyled card-list">
    {reports.map((report) => (
      <li key={report.documentId} className="card-item">
        <div className="card-meta">
          <span className="card-badge">{formatDate(report.date)}</span>
        </div>
        <Link href={localePath(locale, `/reports/${report.documentId}`)} className="purple fs-3 fw-bold text-decoration-none card-title">
          {report.title}
        </Link>
        {teaser(report.content) && <p className="fs-5 card-text">{teaser(report.content)}</p>}
      </li>
    ))}
  </ul>;
}

function PublicationList({ items }) {
  return <ul className="list-unstyled card-list">
    {items.map((item) => (
      <li key={item.documentId} className="card-item">
        {item.tags?.length > 0 && (
          <div className="card-meta">
            {item.tags.map((tag) => <span key={tag.id} className="card-badge">{tag.label}</span>)}
          </div>
        )}
        <p className="fs-5 fw-bold card-text">{item.title}</p>
        {item.links?.length > 0 && (
          <ul className="card-links fs-5">
            {item.links.map((link) => (
              <li key={link.id}>
                <a href={link.url} target="_blank" rel="noopener noreferrer" className="purple">
                  {link.name || link.url}
                </a>
              </li>
            ))}
          </ul>
        )}
      </li>
    ))}
  </ul>;
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
    <section id="reports" className="mb-5">
      <h2 className="purple fw-bold">{t.reports}</h2>
      {reports.length === 0 ? <p className="fs-4">{t.reportsEmpty}</p> : <ReportList reports={reports} locale={locale} />}
    </section>
    <section id="publications">
      <h2 className="purple fw-bold">{t.other}</h2>
      {publications.length === 0 && <p className="fs-4">{t.empty}</p>}
      {project.length > 0 && (
        <section className="mb-4">
          <h3 className="purple fw-bold">{t.project}</h3>
          <PublicationList items={project} />
        </section>
      )}
      {further.length > 0 && (
        <section>
          <h3 className="purple fw-bold">{t.further}</h3>
          <PublicationList items={further} />
        </section>
      )}
    </section>
    </main>
  </>
}
