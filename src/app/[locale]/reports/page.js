import Link from "next/link";
import "@/app/cards.css";
import { getReports } from "@/services/api";
import { formatDate, teaser } from "@/app/caseFormat";
import { getDictionary, localePath } from "@/i18n";

export default async function Page({ params: { locale } }) {
  const t = getDictionary(locale).reports;
  let reports = [];

  try {
    reports = await getReports(locale);
  } catch (error) {
    console.error("Failed to load reports", error);
  }

  return <main>
    <h1 className="purple display-1 fw-bold">{t.title}</h1>
    {reports.length === 0 ? (
      <p className="fs-3">{t.empty}</p>
    ) : (
      <ul className="list-unstyled card-list">
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
      </ul>
    )}
  </main>
}
