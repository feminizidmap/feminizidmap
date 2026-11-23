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
const REPORT_YEARS = 2;
const REPORT_LOCALES = ["de", "en"];

// A report file whose title names a press release ("Pressemitteilung", "Press release").
const isPressRelease = (entry) => /press/i.test(entry.title ?? "");

// Row 1, identical in both locales: every file of the two newest report years, newest year first.
// Within a year: the reports (German, then English), then the press releases. At most four cards.
// Reports are localized in Strapi, so both locales are fetched; a locale without a file for a year
// (e.g. no English 2024 report) simply adds nothing.
function reportCards({ reportsByLocale, t }) {
  const entries = REPORT_LOCALES.flatMap((lang) =>
    (reportsByLocale[lang] ?? []).flatMap((report) =>
      (report.report_files ?? [])
        .filter((entry) => entry.file?.url)
        .map((entry) => ({ lang, report, entry, press: isPressRelease(entry) }))
    )
  );
  const years = [...new Set(entries.map((item) => item.report.report_year).filter(Boolean))]
    .sort((a, b) => b - a)
    .slice(0, REPORT_YEARS);

  return years
    .flatMap((year) => {
      const ofYear = entries.filter((item) => item.report.report_year === year);
      return [...ofYear.filter((item) => !item.press), ...ofYear.filter((item) => item.press)];
    })
    .slice(0, CARD_COUNT)
    .map(({ lang, report, entry, press }) => ({
      key: `report-${lang}-${entry.id ?? entry.file.url}`,
      kicker: `${press ? t.pressKicker : t.reportKicker} ${report.report_year}`,
      lang,
      title: press ? entry.title : report.title,
      href: entry.file.url,
      download: true,
      cta: t.download,
    }));
}

// Row 2: the four newest publications that have a link, from every category.
function publicationCards({ publications, t }) {
  return sortByYearDesc(publications)
    .map((item) => ({ item, url: item.links?.find((link) => link.url)?.url }))
    .filter(({ url }) => url)
    .slice(0, CARD_COUNT)
    .map(({ item, url }) => ({
      key: `publication-${item.documentId}`,
      kicker: [item.tags?.[0]?.label, publicationYear(item)].filter(Boolean).join(" · "),
      title: item.title,
      small: true,
      href: url,
      external: true,
      cta: t.open,
    }));
}

function CardGrid({ cards, publication = false }) {
  return (
    <div className="home-cards">
      {cards.map((card) => (
        <a
          key={card.key}
          href={card.href}
          className={publication ? "home-card home-card-publication" : "home-card"}
          {...(card.lang ? { hrefLang: card.lang } : {})}
          {...(card.download ? { download: true } : {})}
          {...(card.external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
        >
          <span className="t-kicker home-card-kicker">
            {card.kicker}
            {card.lang && <span className="home-card-lang">{card.lang.toUpperCase()}</span>}
          </span>
          <span className={card.small ? "home-card-title home-card-title-small" : "home-card-title"}>{card.title}</span>
          <span className="home-card-cta">{card.cta} <ArrowIcon download={card.download} /></span>
        </a>
      ))}
    </div>
  );
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
  const [homeResult, eventsResult, reportsDeResult, reportsEnResult, publicationsResult] = await Promise.allSettled([
    getHome(locale),
    getEvents(locale),
    getReports("de"),
    getReports("en"),
    getPublications(),
  ]);
  if (homeResult.status === "rejected") console.error("Failed to load home content", homeResult.reason);
  if (eventsResult.status === "rejected") console.error("Failed to load events", eventsResult.reason);
  for (const result of [reportsDeResult, reportsEnResult]) {
    if (result.status === "rejected") console.error("Failed to load reports", result.reason);
  }
  if (publicationsResult.status === "rejected") console.error("Failed to load publications", publicationsResult.reason);

  const home = homeResult.status === "fulfilled" ? homeResult.value : null;
  const event = nextEvent(eventsResult.status === "fulfilled" ? eventsResult.value : []);
  const text = (home?.content ?? []).filter((block) => !linkOnly(block));
  const settled = (result) => (result.status === "fulfilled" ? result.value : []);
  const reports = reportCards({ reportsByLocale: { de: settled(reportsDeResult), en: settled(reportsEnResult) }, t });
  const publications = publicationCards({ publications: settled(publicationsResult), t });
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
        {reports.length > 0 && <>
          <h3 className="home-cards-title">{t.reportsRow}</h3>
          <CardGrid cards={reports} />
        </>}
        {publications.length > 0 && <>
          <h3 className="home-cards-title">{t.publicationsRow}</h3>
          <CardGrid cards={publications} publication />
        </>}
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
