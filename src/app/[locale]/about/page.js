import "@/app/cards.css";
import BlocksContent from "@/app/BlocksContent";
import { getAbout, getTeamMembers } from "@/services/api";
import { getDictionary } from "@/i18n";

function TeamSection({ members, t }) {
  const active = members.filter((member) => member.active);
  const previous = members.filter((member) => !member.active);

  return <section id="team" className="mt-5">
    <h2 className="purple display-4 fw-bold">{t.title}</h2>
    {active.length === 0 ? (
      <p className="fs-4">{t.unavailable}</p>
    ) : (
      <ul className="list-unstyled card-grid">
        {active.map((member) => (
          <li key={member.documentId} className="card-item">
            <h3 className="purple fs-3 fw-bold card-title">{member.name}</h3>
            {member.text && <p className="fs-5 card-text card-text-preline">{member.text}</p>}
          </li>
        ))}
      </ul>
    )}
    {previous.length > 0 && (
      <div className="mt-5">
        <h3 className="purple fw-bold">{t.thanks}</h3>
        <p className="fs-4">{previous.map((member) => member.name).join(" · ")}</p>
      </div>
    )}
  </section>;
}

export default async function Page({ params: { locale } }) {
  const t = getDictionary(locale);
  const [aboutResult, teamResult] = await Promise.allSettled([getAbout(locale), getTeamMembers(locale)]);

  if (aboutResult.status === "rejected") console.error("Failed to load about content", aboutResult.reason);
  if (teamResult.status === "rejected") console.error("Failed to load team members", teamResult.reason);

  const about = aboutResult.status === "fulfilled" ? aboutResult.value : null;
  const members = teamResult.status === "fulfilled" ? teamResult.value : [];

  return <main>
    <h1 className="purple display-1 fw-bold">{about?.title || t.about.title}</h1>
    {about?.content ? <BlocksContent content={about.content} /> : <p className="fs-3">{t.about.fallbackText}</p>}
    <TeamSection members={members} t={t.team} />
  </main>
}
