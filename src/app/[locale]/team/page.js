import "@/app/cards.css";
import { getTeamMembers } from "@/services/api";
import { getDictionary } from "@/i18n";

export default async function Page({ params: { locale } }) {
  const t = getDictionary(locale).team;
  let members = [];

  try {
    members = await getTeamMembers(locale);
  } catch (error) {
    console.error("Failed to load team members", error);
  }

  const active = members.filter((member) => member.active);
  const previous = members.filter((member) => !member.active);

  return <main>
    <h1 className="purple display-1 fw-bold">{t.title}</h1>
    {active.length === 0 ? (
      <p className="fs-3">{t.unavailable}</p>
    ) : (
      <ul className="list-unstyled card-grid">
        {active.map((member) => (
          <li key={member.documentId} className="card-item">
            <h2 className="purple fs-3 fw-bold card-title">{member.name}</h2>
            {member.text && <p className="fs-5 card-text card-text-preline">{member.text}</p>}
          </li>
        ))}
      </ul>
    )}
    {previous.length > 0 && (
      <section className="mt-5">
        <h2 className="purple fw-bold">{t.thanks}</h2>
        <p className="fs-4">{previous.map((member) => member.name).join(" · ")}</p>
      </section>
    )}
  </main>
}
