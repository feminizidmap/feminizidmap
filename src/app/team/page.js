import "../cards.css";
import { getTeamMembers } from "../../services/api";

export default async function Page() {
  let members = [];

  try {
    members = await getTeamMembers();
  } catch (error) {
    console.error("Failed to load team members", error);
  }

  const active = members.filter((member) => member.active);
  const previous = members.filter((member) => !member.active);

  return <main>
    <h1 className="purple display-1 fw-bold">Team</h1>
    {active.length === 0 ? (
      <p className="fs-3">Team information is not available right now.</p>
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
        <h2 className="purple fw-bold">We want to thank our previous collaborators</h2>
        <p className="fs-4">{previous.map((member) => member.name).join(" · ")}</p>
      </section>
    )}
  </main>
}
