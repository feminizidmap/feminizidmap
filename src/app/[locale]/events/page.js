import "./events.css";
import PageHeader from "@/app/PageHeader";
import { getEvents } from "@/services/api";
import { getDictionary } from "@/i18n";

const INTL_LOCALE = { de: "de-DE", en: "en-GB" };

// Strapi dates are "YYYY-MM-DD"; read them as UTC so the weekday never shifts.
function parseDate(value) {
  const match = /^(\d{4})-(\d{2})-(\d{2})/.exec(value || "");
  return match ? new Date(Date.UTC(+match[1], +match[2] - 1, +match[3])) : null;
}

function fmt(date, locale, options) {
  return new Intl.DateTimeFormat(INTL_LOCALE[locale] ?? locale, { timeZone: "UTC", ...options }).format(date);
}

function dateParts(event, locale) {
  const start = parseDate(event.start_date);
  const end = parseDate(event.end_date);
  const multiDay = end && end.getTime() !== start.getTime();
  const dayMonth = (date) => `${fmt(date, locale, { day: "2-digit" })}.${fmt(date, locale, { month: "2-digit" })}.`;
  const weekday = (date) => fmt(date, locale, { weekday: "short" }).replace(".", "");
  // Strapi times come as "HH:mm:ss.SSS".
  const time = event.start_time ? event.start_time.slice(0, 5) : null;

  return {
    year: start.getUTCFullYear(),
    day: fmt(start, locale, { day: "numeric" }),
    monthYear: fmt(start, locale, { month: "short", year: "numeric" }).replace(".", ""),
    weekdayLong: fmt(start, locale, { weekday: "long" }),
    short: multiDay ? `${fmt(start, locale, { day: "2-digit" })}.–${dayMonth(end)}` : dayMonth(start),
    weekdayShort: multiDay ? `${weekday(start)}–${weekday(end)}` : weekday(start),
    time,
  };
}

function PinIcon({ size = 16 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M12 21s-7-6.2-7-11.5A7 7 0 0 1 19 9.5C19 14.8 12 21 12 21z" />
      <circle cx="12" cy="9.5" r="2.5" />
    </svg>
  );
}

function Sessions({ sessions }) {
  if (!sessions?.length) return null;
  return (
    <ul className="event-sessions">
      {sessions.map((session) => <li key={session.id}>{session.text}</li>)}
    </ul>
  );
}

function Tags({ tags }) {
  return tags?.map((tag) => <span key={tag.id} className="t-tag">{tag.label}</span>);
}

function EventTitle({ event, className }) {
  return event.link ? (
    <a href={event.link} target="_blank" rel="noopener noreferrer" className={className}>{event.event_title}</a>
  ) : (
    <span className={className}>{event.event_title}</span>
  );
}

function UpcomingEvent({ event, locale }) {
  const d = dateParts(event, locale);
  return (
    <article className="event-featured">
      <div className="event-featured-date">
        <span className="event-featured-day">{d.day}</span>
        <span className="t-kicker">{d.monthYear}</span>
        <span className="event-featured-weekday">{[d.weekdayLong, d.time].filter(Boolean).join(", ")}</span>
      </div>
      <div className="event-featured-body">
        {event.tags?.length > 0 && <div className="event-tags"><Tags tags={event.tags} /></div>}
        <h3 className="event-featured-title"><EventTitle event={event} /></h3>
        {event.place && <p className="event-place"><PinIcon size={18} />{event.place}</p>}
        <Sessions sessions={event.sessions} />
      </div>
    </article>
  );
}

function PastEvent({ event, locale, t }) {
  const d = dateParts(event, locale);
  return (
    <li className="event-row">
      <div className="event-row-date">
        <span className="event-row-day">{d.short}</span>
        <span className="t-kicker">{d.weekdayShort}</span>
      </div>
      <div className="event-row-body">
        <EventTitle event={event} className="event-row-title" />
        <div className="event-row-meta">
          {event.place && <span className="event-place"><PinIcon size={15} />{event.place}</span>}
          <Tags tags={event.tags} />
        </div>
        <Sessions sessions={event.sessions} />
      </div>
      {event.link && (
        <a href={event.link} target="_blank" rel="noopener noreferrer" className="event-row-link" aria-label={`${t.eventPage}: ${event.event_title}`}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M7 17L17 7M9 7h8v8" /></svg>
        </a>
      )}
    </li>
  );
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
  const valid = events.filter((event) => parseDate(event.start_date));
  const isUpcoming = (event) => (event.end_date || event.start_date) >= today;
  // The API sorts by start_date descending; upcoming events read better soonest-first.
  const upcoming = valid.filter(isUpcoming).reverse();
  const past = valid.filter((event) => !isUpcoming(event));

  const years = [];
  for (const event of past) {
    const year = parseDate(event.start_date).getUTCFullYear();
    if (years.at(-1)?.year !== year) years.push({ year, events: [] });
    years.at(-1).events.push(event);
  }

  return <>
    <PageHeader locale={locale} title={t.title} lead={t.lead} />
    <main className="page-body">
      <section className="events-section" aria-labelledby="upcoming-title">
        <div className="section-head">
          <h2 id="upcoming-title" className="t-section">{t.upcoming}</h2>
          {upcoming.length > 0 && <span className="t-kicker section-count">{upcoming.length === 1 ? t.oneDate : `${upcoming.length} ${t.dates}`}</span>}
        </div>
        {upcoming.length === 0 ? (
          <p className="events-empty">{t.noUpcoming}</p>
        ) : (
          <div className="event-featured-list">
            {upcoming.map((event) => <UpcomingEvent key={event.documentId} event={event} locale={locale} />)}
          </div>
        )}
      </section>

      {years.length > 0 && (
        <section className="events-section events-section-past" aria-labelledby="past-title">
          <div className="section-head section-head-split">
            <h2 id="past-title" className="t-section">{t.past}</h2>
            <nav className="year-jump" aria-label={t.years}>
              {years.map(({ year }) => <a key={year} href={`#year-${year}`}>{year}</a>)}
            </nav>
          </div>
          <div className="event-years">
            {years.map(({ year, events: yearEvents }) => (
              <div key={year} id={`year-${year}`} className="event-year">
                <h3 className="event-year-title">{year}</h3>
                <ol className="event-rows">
                  {yearEvents.map((event) => <PastEvent key={event.documentId} event={event} locale={locale} t={t} />)}
                </ol>
              </div>
            ))}
          </div>
        </section>
      )}
    </main>
  </>
}
