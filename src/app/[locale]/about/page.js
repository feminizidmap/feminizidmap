import PageHeader from "@/app/PageHeader";
import BlocksContent from "@/app/BlocksContent";
import { getAbout, getTeamMembers } from "@/services/api";
import { getDictionary } from "@/i18n";

function TeamSection({ members, t }) {
  const active = members.filter((member) => member.active);
  const previous = members.filter((member) => !member.active);

  return <section id="team" className="team" aria-labelledby="team-title">
    <h2 id="team-title" className="t-section team-title">{t.title}</h2>
    {active.length === 0 ? (
      <p className="prose">{t.unavailable}</p>
    ) : (
      <ul className="team-grid">
        {active.map((member) => (
          <li key={member.documentId} className="team-member">
            <h3 className="team-name">{member.name}</h3>
            {member.text && <p className="team-bio">{member.text}</p>}
          </li>
        ))}
      </ul>
    )}
    {previous.length > 0 && (
      <div className="team-previous">
        <h3 className="t-kicker">{t.thanks}</h3>
        <p>{previous.map((member) => member.name).join(" · ")}</p>
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

  return <>
    <PageHeader locale={locale} title={about?.title || t.about.title} />
    <main className="page-body page-body-text">
      {about?.content ? <BlocksContent content={about.content} className="prose-about" /> : <p className="prose">{t.about.fallbackText}</p>}
      <TeamSection members={members} t={t.team} />
    </main>
  </>
}
