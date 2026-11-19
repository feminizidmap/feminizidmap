'use client'

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { getDictionary, localePath, locales, switchLocalePath } from '@/i18n';

export const NAV_ITEMS = [
  ["publications", "/publications"],
  ["map", "/map"],
  ["database", "/database"],
  ["events", "/events"],
  ["about", "/about"],
  ["faq", "/faq"],
];

function isActive(pathname, locale, path) {
  const href = localePath(locale, path);
  return path === "/" ? pathname === href : pathname === href || pathname?.startsWith(`${href}/`);
}

function LocaleSwitch({ locale, pathname, label, onNavigate, className = "" }) {
  return (
    <div className={`locale-switch ${className}`} role="group" aria-label={label}>
      {locales.map((code) => (
        <Link
          key={code}
          onClick={onNavigate}
          href={switchLocalePath(pathname, code)}
          hrefLang={code}
          lang={code}
          aria-current={code === locale ? "true" : undefined}
          className={code === locale ? "locale-link active" : "locale-link"}
        >
          {code.toUpperCase()}
        </Link>
      ))}
    </div>
  );
}

// Logo, main navigation and language switch. Sits inside the purple page header;
// below 992px the links move into a full-screen black menu.
export default function Navigation({ locale }) {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const t = getDictionary(locale).nav;
  const close = () => setOpen(false);

  useEffect(() => {
    if (!open) return undefined;
    const onKey = (event) => event.key === "Escape" && close();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <div className="site-nav">
      <Link href={localePath(locale)} className="site-logo" aria-label="FeminizidMap.org">
        FEMINIZID<br />MAP.<br />ORG
      </Link>

      <div className="site-nav-desktop">
        <nav aria-label={t.label}>
          <ul className="site-nav-list">
            {NAV_ITEMS.map(([key, path]) => (
              <li key={key}>
                <Link
                  href={localePath(locale, path)}
                  aria-current={isActive(pathname, locale, path) ? "page" : undefined}
                  className="site-nav-link"
                >
                  {t[key]}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        <LocaleSwitch locale={locale} pathname={pathname} label={t.language} />
      </div>

      <button
        type="button"
        className="site-nav-toggle"
        aria-expanded={open}
        aria-controls="site-menu"
        aria-label={t.openMenu}
        onClick={() => setOpen(true)}
      >
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true"><path d="M4 7h16M4 12h16M4 17h16" /></svg>
      </button>

      {open && (
        <div id="site-menu" className="site-menu" role="dialog" aria-modal="true" aria-label={t.label}>
          <div className="site-menu-top">
            <Link href={localePath(locale)} onClick={close} className="site-logo">FEMINIZID<br />MAP.<br />ORG</Link>
            <button type="button" className="site-nav-toggle is-close" aria-label={t.closeMenu} onClick={close}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true"><path d="M6 6l12 12M18 6L6 18" /></svg>
            </button>
          </div>
          <nav aria-label={t.label}>
            <ul className="site-menu-list">
              {NAV_ITEMS.map(([key, path]) => (
                <li key={key}>
                  <Link
                    href={localePath(locale, path)}
                    onClick={close}
                    aria-current={isActive(pathname, locale, path) ? "page" : undefined}
                  >
                    {t[key]}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
          <LocaleSwitch locale={locale} pathname={pathname} label={t.language} onNavigate={close} className="is-menu" />
        </div>
      )}
    </div>
  );
}
