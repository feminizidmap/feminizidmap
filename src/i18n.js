// Site locales. Each locale is a statically exported route prefix (/de/…, /en/…).
// The map and database UIs are still German-only; this covers site chrome and content pages.
export const locales = ["de", "en"];
export const defaultLocale = "de";

const dictionaries = {
  de: {
    meta: {
      description: "Ein Rechercheprojekt zu Femi(ni)ziden in Deutschland",
    },
    nav: {
      home: "START",
      about: "ÜBER UNS",
      map: "KARTE",
      events: "VERANSTALTUNGEN",
      publications: "PUBLIKATIONEN",
      faq: "FAQ",
      language: "Sprache",
    },
    footer: {
      imprint: "Impressum",
      dataprotection: "Datenschutz",
    },
    common: {
      unavailable: "Dieser Inhalt ist gerade nicht verfügbar.",
    },
    pages: {
      faq: "Fragen und Antworten",
      imprint: "Impressum",
      dataprotection: "Datenschutzhinweise",
    },
    home: {
      fallbackTitle: "Ein Rechercheprojekt zu Femi(ni)ziden in Deutschland",
      fallbackText: [
        "Wir dokumentieren alle Tötungen von Frauen* durch Männer in Deutschland und entwickeln eine Online-Datenbank zu Femi(ni)ziden, der Tötung von Frauen*, weil sie Frauen* sind.",
        "Lies mehr über das Projekt und die Definitionen von Femi(ni)ziden.",
      ],
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
    events: {
      title: "Veranstaltungen",
      upcoming: "Nächste Veranstaltungen",
      past: "Vergangene Veranstaltungen",
      noUpcoming: "Keine zukünftigen Veranstaltungen geplant.",
    },
    publications: {
      title: "Publikationen",
      reports: "Reports",
      reportsEmpty: "Noch keine Reports verfügbar.",
      other: "Veröffentlichungen",
      project: "Gemeinsame Veröffentlichungen des Teams",
      further: "Weitere Veröffentlichungen",
      empty: "Noch keine Veröffentlichungen verfügbar.",
    },
  },
  en: {
    meta: {
      description: "A research project on femi(ni)cides in Germany",
    },
    nav: {
      home: "HOME",
      about: "ABOUT",
      map: "MAP",
      events: "EVENTS",
      publications: "PUBLICATIONS",
      faq: "FAQ",
      language: "Language",
    },
    footer: {
      imprint: "Imprint",
      dataprotection: "Data protection",
    },
    common: {
      unavailable: "This content is not available right now.",
    },
    pages: {
      faq: "FAQ",
      imprint: "Imprint",
      dataprotection: "Data protection",
    },
    home: {
      fallbackTitle: "A research project on femi(ni)cides in Germany",
      fallbackText: [
        "We document all murders of women* by men in Germany and we develop an online database on femi(ni)cide, the killing of women* because they are women*.",
        "Read more about the project and the definitions of femi(ni)cides.",
      ],
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
    events: {
      title: "Events",
      upcoming: "Upcoming events",
      past: "Past events",
      noUpcoming: "No upcoming events.",
    },
    publications: {
      title: "Publications",
      reports: "Reports",
      reportsEmpty: "No reports available yet.",
      other: "Other publications",
      project: "Project publications",
      further: "Further contributions",
      empty: "No publications available yet.",
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

// Swap the locale prefix of a pathname, e.g. "/de/reports/abc" -> "/en/reports/abc".
export function switchLocalePath(pathname, locale) {
  const rest = (pathname || "/").replace(/^\/(de|en)(?=\/|$)/, "");
  return localePath(locale, rest || "/");
}
