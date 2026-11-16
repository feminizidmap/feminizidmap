import Link from "next/link";
import "../cards.css";
import { getReports } from "../../services/api";
import { formatDate, teaser } from "../caseFormat";

export default async function Page() {
  let reports = [];

  try {
    reports = await getReports();
  } catch (error) {
    console.error("Failed to load reports", error);
  }

  return <main>
    <h1 className="purple display-1 fw-bold">Reports</h1>
    {reports.length === 0 ? (
      <p className="fs-3">No reports available yet.</p>
    ) : (
      <ul className="list-unstyled card-list">
        {reports.map((report) => (
          <li key={report.documentId} className="card-item">
            <div className="card-meta">
              <span className="card-badge">{formatDate(report.date)}</span>
            </div>
            <Link href={`/reports/${report.documentId}`} className="purple fs-3 fw-bold text-decoration-none card-title">
              {report.title}
            </Link>
            {teaser(report.content) && <p className="fs-5 card-text">{teaser(report.content)}</p>}
          </li>
        ))}
      </ul>
    )}
  </main>
}
