import Link from "next/link";
import "./home.css";
import BlocksContent from "@/app/BlocksContent";
import PageHeader from "@/app/PageHeader";
import { publicationYear, sortByYearDesc } from "@/app/publicationUtils";
import { getEvents, getHome, getPublications, getReports } from "@/services/api";
import { getDictionary, localePath } from "@/i18n";

// Paragraphs that hold nothing but one link were the old Hugo download links ("Download our report …").
// The cards below now come from reports and publications, so those paragraphs are left out of the text.
function linkOnly(block) {
  if (block.type !== "paragraph") return false;
  const parts = block.children.filter((child) => child.type === "link" || child.text?.trim());
  return parts.length === 1 && parts[0].type === "link";
}

const CARD_COUNT = 4;
const MAX_REPORT_CARDS = 2;

// Up to two newest reports, filled up with the newest non-report publications to four cards.
function downloadCards({ reports, publications, locale, t }) {
  const reportCards = reports.slice(0, MAX_REPORT_CARDS).map((report) => {
    const file = report.report_files?.find((entry) => entry.file?.url)?.file;
    return {
      key: `report-${report.documentId}`,
      kicker: [t.reportKicker, report.report_year].filter(Boolean).join(" "),
      title: report.title,
      href: file?.url ?? localePath(locale, "/publications#reports"),
      download: Boolean(file),
      cta: file ? t.download : t.open,
    };
  });

  const isReport = (item) => item.tags?.some((tag) => tag.label?.trim().toLowerCase() === "report");
  const publicationCards = sortByYearDesc(publications)
    .filter((item) => !isReport(item))
    .slice(0, CARD_COUNT - reportCards.length)
    .map((item) => {
      const url = item.links?.find((link) => link.url)?.url;
      return {
        key: `publication-${item.documentId}`,
        kicker: [item.tags?.[0]?.label, publicationYear(item)].filter(Boolean).join(" · "),
        title: item.title,
        small: true,
        href: url ?? localePath(locale, "/publications#publications"),
        external: Boolean(url),
        cta: t.open,
      };
    });

  return [...reportCards, ...publicationCards];
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
  const [homeResult, eventsResult, reportsResult, publicationsResult] = await Promise.allSettled([
    getHome(locale),
    getEvents(locale),
    getReports(locale),
    getPublications(),
  ]);
  if (homeResult.status === "rejected") console.error("Failed to load home content", homeResult.reason);
  if (eventsResult.status === "rejected") console.error("Failed to load events", eventsResult.reason);
  if (reportsResult.status === "rejected") console.error("Failed to load reports", reportsResult.reason);
  if (publicationsResult.status === "rejected") console.error("Failed to load publications", publicationsResult.reason);

  const home = homeResult.status === "fulfilled" ? homeResult.value : null;
  const event = nextEvent(eventsResult.status === "fulfilled" ? eventsResult.value : []);
  const text = (home?.content ?? []).filter((block) => !linkOnly(block));
  const cards = downloadCards({
    reports: reportsResult.status === "fulfilled" ? reportsResult.value : [],
    publications: publicationsResult.status === "fulfilled" ? publicationsResult.value : [],
    locale,
    t,
  });
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
        <div className="home-section-head">
          <h2 id="home-downloads" className="home-section-title">{t.downloads}</h2>
          <Link href={localePath(locale, "/publications")} className="home-more">{t.allPublications} →</Link>
        </div>
        {cards.length > 0 && (
          <div className="home-cards">
            {cards.map((card) => (
              <a
                key={card.key}
                href={card.href}
                className="home-card"
                {...(card.download ? { download: true } : {})}
                {...(card.external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
              >
                <span className="t-kicker">{card.kicker}</span>
                <span className={card.small ? "home-card-title home-card-title-small" : "home-card-title"}>{card.title}</span>
                <span className="home-card-cta">{card.cta} <ArrowIcon download={card.download} /></span>
              </a>
            ))}
          </div>
        )}
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
