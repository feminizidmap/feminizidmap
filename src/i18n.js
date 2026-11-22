// Site locales. Each locale is a statically exported route prefix (/de/…, /en/…).
// The map and database UIs are still German-only; this covers site chrome and content pages.
export const locales = ["de", "en"];
export const defaultLocale = "de";

const dictionaries = {
  de: {
    meta: {
      description: "Monitoringstelle für Femi(ni)zide in Deutschland e.V.",
    },
    nav: {
      home: "Start",
      about: "Über uns",
      map: "Karte",
      database: "Datenbank",
      events: "Veranstaltungen",
      publications: "Publikationen",
      faq: "FAQ",
      language: "Sprache",
      label: "Hauptnavigation",
      openMenu: "Menü öffnen",
      closeMenu: "Menü schließen",
      otherVersion: "English Version",
      railNote: "Femi(ni)zide in Deutschland",
    },
    footer: {
      imprint: "Impressum",
      dataprotection: "Datenschutz",
      legal: "Rechtliches",
      reportCaseTitle: "Fall melden",
      contactTitle: "Kontakt",
      emailPlaceholder: "name@beispiel.de",
      reportCase: "Wenn ihr zur Dokumentation beitragen wollt, indem ihr uns einen Fall meldet, schreibt an unsere E-Mail-Adresse:",
      contact: "Wenn ihr mit uns zusammenarbeiten und euch vernetzen wollt, für Feedback zur Karte oder uns für andere Zwecke kontaktieren möchtet, könnt ihr dies über unsere E-Mail-Adresse tun:",
      newsletterTitle: "Newsletter",
      newsletterText: "Abonniert unseren zweimonatlichen Newsletter mit Informationen zu unseren Daten, Einblicken in Fälle und Neuigkeiten über uns als Organisation.",
      emailLabel: "E-Mail-Adresse",
      subscribe: "Abonnieren",
      newsletterNote: "Die Bestätigung öffnet sich in einem neuen Tab. Bitte bestätigt danach den Link in der E-Mail.",
    },
    common: {
      unavailable: "Dieser Inhalt ist gerade nicht verfügbar.",
    },
    faq: {
      count: "Fragen zum Projekt",
      missing: "Eure Frage ist nicht dabei?",
      write: "Schreibt uns – wir antworten so schnell wir können.",
    },
    pages: {
      faq: "Fragen und Antworten",
      imprint: "Impressum",
      dataprotection: "Datenschutzhinweise",
    },
    home: {
      fallbackTitle: "Monitoringstelle für Femi(ni)zide in Deutschland e.V.",
      fallbackText: [
        "Wir dokumentieren alle Tötungen von Frauen* durch Männer in Deutschland und entwickeln eine Online-Datenbank zu Femi(ni)ziden, der Tötung von Frauen*, weil sie Frauen* sind.",
        "Lies mehr über das Projekt und die Definitionen von Femi(ni)ziden.",
      ],
      more: "Mehr über das Projekt",
      downloads: "Publikationen & Presse",
      download: "Herunterladen",
      open: "Ansehen",
      reportKicker: "Jahresbericht",
      allPublications: "Alle Publikationen",
      mapKicker: "Datenbank",
      mapText: "Alle dokumentierten Fälle auf einer Karte – mit Filtern und Details zu jedem Fall.",
      mapCta: "Zur Karte",
      nextEvent: "Nächste Veranstaltung",
      allEvents: "Alle Veranstaltungen",
    },
    about: {
      title: "Über uns",
      fallbackText:
        "Wir dokumentieren alle Femi(ni)zide und Tötungsdelikte an Frauen* sowie Mädchen* in Deutschland. Der Begriff Femi(ni)zid bezieht sich auf Tötungen von Frauen* und Mädchen* durch Männer. Diese finden im Kontext hierarchischer Machtverhältnisse statt, in denen die getöteten Subjekte – Frauen*/Mädchen* – eine untergeordnete Position innerhalb der Machtstruktur einnehmen. Es geht nicht um eine Tötung nach Geschlecht, also eine rein oberflächliche terminologische Differenzierung zwischen Tötungen von Männern einerseits und Femi(ni)ziden an Frauen* andererseits. Wir erkennen an, dass unsere Arbeit von Feminicidio.net inspiriert und unterstützt wurde.",
    },
    team: {
      title: "Team",
      unavailable: "Informationen zum Team sind gerade nicht verfügbar.",
      thanks: "Wir bedanken uns bei unseren ehemaligen Kollaborateur:innen",
    },
    map: {
      title: "Karte der Fälle",
      lead: "Alle dokumentierten Fälle auf einer Karte.",
    },
    database: {
      title: "Datenbank der Fälle",
      lead: "Alle dokumentierten Fälle als durchsuchbare Liste – mit Filtern und Details zu jedem Fall.",
    },
    // Period note above map and database (CasesPeriodNote)
    casesData: {
      period: "Zeitraum",
      moreData: "Daten für Fälle weiterer Jahre (2019 bis heute) sind auf Anfrage verfügbar.",
    },
    events: {
      title: "Veranstaltungen",
      lead: "Vorträge, Workshops und Diskussionen, bei denen wir unsere Daten und unsere Arbeit vorstellen.",
      upcoming: "Demnächst",
      past: "Vergangene Veranstaltungen",
      noUpcoming: "Keine zukünftigen Veranstaltungen geplant.",
      oneDate: "1 Termin",
      dates: "Termine",
      years: "Jahre",
      eventPage: "Zur Veranstaltungsseite",
    },
    publications: {
      title: "Publikationen",
      lead: "Unsere Reports, Artikel, Interviews und Vorträge zu Femi(ni)ziden in Deutschland.",
      reports: "Jahresberichte zu Femi(ni)ziden in Deutschland",
      reportsEmpty: "Noch keine Reports verfügbar.",
      published: "Veröffentlicht am",
      other: "Veröffentlichungen",
      // Keyed by the Strapi `category` enum value; key order = order on the page.
      categories: {
        feminizidmap_team: "Gemeinsame Veröffentlichungen des Teams",
        external_using_our_data: "Externe Publikationen mit Nutzung von Feminizidmap-Daten",
        miscellaneous: "Weitere Veröffentlichungen",
      },
      empty: "Noch keine Veröffentlichungen verfügbar.",
      link: "Link",
    },
  },
  en: {
    meta: {
      description: "Monitoring Center for Femi(ni)cides in Germany e.V.",
    },
    nav: {
      home: "Home",
      about: "About",
      map: "Map",
      database: "Database",
      events: "Events",
      publications: "Publications",
      faq: "FAQ",
      language: "Language",
      label: "Main navigation",
      openMenu: "Open menu",
      closeMenu: "Close menu",
      otherVersion: "Deutsche Version",
      railNote: "Femi(ni)cides in Germany",
    },
    footer: {
      imprint: "Imprint",
      dataprotection: "Data protection",
      legal: "Legal",
      reportCaseTitle: "Report a case",
      contactTitle: "Contact",
      emailPlaceholder: "name@example.org",
      reportCase: "If you want to contribute to the documentation by reporting a case, you can report it to our email:",
      contact: "If you think that you can and want to collaborate, if you want to network with us, for feedback on the map or for any other purposes, you can contact us at our email:",
      newsletterTitle: "Newsletter",
      newsletterText: "You can subscribe to our bi-monthly newsletter with information on our data, insights into cases and updates on us as an organization.",
      emailLabel: "Email address",
      subscribe: "Subscribe",
      newsletterNote: "The confirmation opens in a new tab. Please then click the activation link in the email.",
    },
    common: {
      unavailable: "This content is not available right now.",
    },
    faq: {
      count: "questions about the project",
      missing: "Your question isn’t here?",
      write: "Write to us – we’ll answer as soon as we can.",
    },
    pages: {
      faq: "FAQ",
      imprint: "Imprint",
      dataprotection: "Data protection",
    },
    home: {
      fallbackTitle: "Monitoring Center for Femi(ni)cides in Germany e.V.",
      fallbackText: [
        "We document all murders of women* by men in Germany and we develop an online database on femi(ni)cide, the killing of women* because they are women*.",
        "Read more about the project and the definitions of femi(ni)cides.",
      ],
      more: "More about the project",
      downloads: "Publications & press",
      download: "Download",
      open: "View",
      reportKicker: "Annual report",
      allPublications: "All publications",
      mapKicker: "Database",
      mapText: "All documented cases on one map – with filters and details on every case.",
      mapCta: "Go to the map",
      nextEvent: "Next event",
      allEvents: "All events",
    },
    about: {
      title: "About us",
      fallbackText:
        "We document all femi(ni)cides and killings of women* and girls* in Germany. Femi(ni)cide is intended to apply to certain killings of women* and girls* by men, those which occur in a context of a hierarchical power relationships where the subjects, women*/girls*, are placed on one side of that power structure, that of the subordinated; it is not meant to simply differentiate killings by the sex of the victims, distinguishing between homicides for males and femi(ni)cides for females. You can find more information on these concepts below. We acknowledge that we were inspired and helped by the work of Feminicidio.net.",
    },
    team: {
      title: "Team",
      unavailable: "Team information is not available right now.",
      thanks: "We want to thank our previous collaborators",
    },
    map: {
      title: "Map of cases",
      lead: "All documented cases on one map.",
    },
    database: {
      title: "Case database",
      lead: "All documented cases as a searchable list – with filters and details on every case.",
    },
    casesData: {
      period: "Period",
      moreData: "Data on cases from further years (2019 to today) is available on request.",
    },
    events: {
      title: "Events",
      lead: "Talks, workshops and discussions where we present our data and our work.",
      upcoming: "Upcoming",
      past: "Past events",
      noUpcoming: "No upcoming events.",
      oneDate: "1 date",
      dates: "dates",
      years: "Years",
      eventPage: "Go to event page",
    },
    publications: {
      title: "Publications",
      lead: "Our reports, articles, interviews and talks on femi(ni)cides in Germany.",
      reports: "Annual reports on femi(ni)cides in Germany",
      reportsEmpty: "No reports available yet.",
      published: "Published",
      other: "Other publications",
      categories: {
        feminizidmap_team: "Publications by the Feminizidmap team",
        external_using_our_data: "External publications using Feminizidmap data",
        miscellaneous: "Further publications",
      },
      empty: "No publications available yet.",
      link: "Link",
    },
  },
};

export function getDictionary(locale) {
  return dictionaries[locale] ?? dictionaries[defaultLocale];
}

// "/faq" -> "/de/faq"; "/" -> "/de"
export function localePath(locale, path = "/") {
  return path === "/" ? `/${locale}` : `/${locale}${path}`;
}

// Swap the locale prefix of a pathname, e.g. "/de/faq" -> "/en/faq".
export function switchLocalePath(pathname, locale) {
  const rest = (pathname || "/").replace(/^\/(de|en)(?=\/|$)/, "");
  return localePath(locale, rest || "/");
}
