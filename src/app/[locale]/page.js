import Link from "next/link";
import "./home.css";
import BlocksContent from "@/app/BlocksContent";
import PageHeader from "@/app/PageHeader";
import { blocksToText } from "@/app/caseFormat";
import { getEvents, getHome } from "@/services/api";
import { getDictionary, localePath } from "@/i18n";

// A paragraph that holds nothing but one link ("Download our report …") becomes a card.
function linkOnly(block) {
  if (block.type !== "paragraph") return null;
  const parts = block.children.filter((child) => child.type === "link" || child.text?.trim());
  return parts.length === 1 && parts[0].type === "link" ? parts[0] : null;
}

function splitContent(content) {
  const text = [];
  const links = [];
  for (const block of content ?? []) {
    const link = linkOnly(block);
    if (link) links.push({ url: link.url, label: blocksToText(link).trim() });
    else text.push(block);
  }
  return { text, links };
}

function ArrowIcon({ download }) {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d={download ? "M12 4v12M6 10l6 6 6-6M5 20h14" : "M5 12h14M13 6l6 6-6 6"} />
    </svg>
  );
}

function nextEvent(events) {
  const today = new Date().toISOString().slice(0, 10);
  return events.filter((event) => (event.end_date || event.start_date) >= today).at(-1) ?? null;
}

export default async function Page({ params: { locale } }) {
  const dict = getDictionary(locale);
  const t = dict.home;
  const [homeResult, eventsResult] = await Promise.allSettled([getHome(locale), getEvents(locale)]);
  if (homeResult.status === "rejected") console.error("Failed to load home content", homeResult.reason);
  if (eventsResult.status === "rejected") console.error("Failed to load events", eventsResult.reason);

  const home = homeResult.status === "fulfilled" ? homeResult.value : null;
  const event = nextEvent(eventsResult.status === "fulfilled" ? eventsResult.value : []);
  const { text, links } = splitContent(home?.content);
  const date = event && new Date(`${event.start_date}T00:00:00Z`);
  const intl = locale === "en" ? "en-GB" : "de-DE";
  const fmt = (options) => new Intl.DateTimeFormat(intl, { timeZone: "UTC", ...options }).format(date);

  return <>
    <PageHeader locale={locale} variant="home" title={home?.title || t.fallbackTitle} />
    <main>
      <section className="home-intro">
        {text.length > 0 ? (
          <BlocksContent content={text} className="home-lead" />
        ) : (
          <div className="prose home-lead">{t.fallbackText.map((p) => <p key={p}>{p}</p>)}</div>
        )}
        <Link href={localePath(locale, "/about")} className="home-more">{t.more} <ArrowIcon /></Link>
      </section>

      <section className="home-section" aria-labelledby="home-downloads">
        <h2 id="home-downloads" className="home-section-title">{t.downloads}</h2>
        <div className="home-cards">
          {links.map((link) => {
            const pdf = /\.pdf($|\?)/i.test(link.url);
            return (
              <a key={link.url} href={link.url} className="home-card" {...(pdf ? { download: true } : {})}>
                <span className="t-kicker">{pdf ? "PDF" : t.link}</span>
                <span className="home-card-title">{link.label}</span>
                <span className="home-card-cta">{pdf ? t.download : t.open} <ArrowIcon download={pdf} /></span>
              </a>
            );
          })}
          <Link href={localePath(locale, "/publications")} className="home-card">
            <span className="t-kicker">{t.archive}</span>
            <span className="home-card-title">{t.archiveTitle}</span>
            <span className="home-card-cta">{t.open} <ArrowIcon /></span>
          </Link>
        </div>
      </section>

      <section className="home-map" aria-labelledby="home-map-title">
        <div className="home-map-inner">
          <div className="home-map-text">
            <span className="t-kicker">{t.mapKicker}</span>
            <h2 id="home-map-title" className="home-map-title">{dict.map.title}</h2>
            <p>{t.mapText}</p>
          </div>
          <Link href={localePath(locale, "/map")} className="home-map-cta">{t.mapCta} <ArrowIcon /></Link>
        </div>
      </section>

      {event && (
        <section className="home-section home-section-last" aria-labelledby="home-event-title">
          <div className="home-section-head">
            <h2 id="home-event-title" className="home-section-title">{t.nextEvent}</h2>
            <Link href={localePath(locale, "/events")} className="home-more">{t.allEvents} →</Link>
          </div>
          <article className="home-event">
            <div className="home-event-date">
              <span className="home-event-day">{fmt({ day: "numeric" })}</span>
              <span className="t-kicker">{fmt({ month: "short", year: "numeric" }).replace(".", "")} · {fmt({ weekday: "short" }).replace(".", "")}</span>
            </div>
            <div className="home-event-body">
              {event.tags?.length > 0 && <div>{event.tags.map((tag) => <span key={tag.id} className="t-tag">{tag.label}</span>)}</div>}
              <h3 className="home-event-title">{event.event_title}</h3>
              {event.place && <p className="home-event-place">{event.place}</p>}
            </div>
          </article>
        </section>
      )}
    </main>
  </>
}
