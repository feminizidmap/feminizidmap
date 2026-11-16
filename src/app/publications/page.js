import "../cards.css";
import { getPublications } from "../../services/api";

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

export default async function Page() {
  let publications = [];

  try {
    publications = await getPublications();
  } catch (error) {
    console.error("Failed to load publications", error);
  }

  const project = publications.filter((item) => item.project_related);
  const further = publications.filter((item) => !item.project_related);

  return <main>
    <h1 className="purple display-1 fw-bold">Publications</h1>
    {publications.length === 0 && <p className="fs-3">No publications available yet.</p>}
    {project.length > 0 && (
      <section className="mb-5">
        <h2 className="purple fw-bold">Project publications</h2>
        <PublicationList items={project} />
      </section>
    )}
    {further.length > 0 && (
      <section>
        <h2 className="purple fw-bold">Further contributions</h2>
        <PublicationList items={further} />
      </section>
    )}
  </main>
}
