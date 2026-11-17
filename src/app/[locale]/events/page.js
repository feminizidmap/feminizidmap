import "@/app/cards.css";
import PageHeader from "@/app/PageHeader";
import { getEvents } from "@/services/api";
import { formatDate } from "@/app/caseFormat";
import { getDictionary } from "@/i18n";

function dateLabel(event) {
  const start = formatDate(event.start_date);
  const end = formatDate(event.end_date);
  const range = end && end !== start ? `${start} – ${end}` : start;
  // Strapi times come as "HH:mm:ss.SSS".
  const time = event.start_time ? event.start_time.slice(0, 5) : null;
  return [range, time].filter(Boolean).join(", ");
}

function EventList({ events }) {
  return <ul className="list-unstyled card-list">
    {events.map((event) => (
      <li key={event.documentId} className="card-item">
        <div className="card-meta">
          <span className="card-badge">{dateLabel(event)}</span>
          {event.place && <span className="card-badge card-badge-muted">{event.place}</span>}
          {event.tags?.map((tag) => <span key={tag.id} className="card-badge card-badge-muted">{tag.label}</span>)}
        </div>
        {event.link ? (
          <a href={event.link} target="_blank" rel="noopener noreferrer" className="purple fs-3 fw-bold text-decoration-none card-title">
            {event.event_title}
          </a>
        ) : (
          <span className="purple fs-3 fw-bold card-title">{event.event_title}</span>
        )}
        {event.sessions?.length > 0 && (
          <ul className="fs-5 card-text">
            {event.sessions.map((session) => <li key={session.id}>{session.text}</li>)}
          </ul>
        )}
      </li>
    ))}
  </ul>;
}

export default async function Page({ params: { locale } }) {
  const t = getDictionary(locale).events;
  let events = [];

  try {
    events = await getEvents(locale);
  } catch (error) {
    console.error("Failed to load events", error);
  }

  // Static export: "today" is the build date, so the upcoming/past split only updates on rebuild.
  const today = new Date().toISOString().slice(0, 10);
  const isUpcoming = (event) => (event.end_date || event.start_date) >= today;
  // The API sorts by start_date descending; upcoming events read better soonest-first.
  const upcoming = events.filter(isUpcoming).reverse();
  const past = events.filter((event) => !isUpcoming(event));

  return <>
    <PageHeader locale={locale} title={t.title} lead={t.lead} />
    <main className="page-body">
    <section className="mb-5">
      <h2 className="purple fw-bold">{t.upcoming}</h2>
      {upcoming.length === 0 ? <p className="fs-4">{t.noUpcoming}</p> : <EventList events={upcoming} />}
    </section>
    {past.length > 0 && (
      <section>
        <h2 className="purple fw-bold">{t.past}</h2>
        <EventList events={past} />
      </section>
    )}
    </main>
  </>
}
