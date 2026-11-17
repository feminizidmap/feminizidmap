"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import SiteFooter from "./SiteFooter";
import { getDictionary, localePath, switchLocalePath } from "@/i18n";

export default function LayoutShell({ children, locale }) {
  const pathname = usePathname();
  const t = getDictionary(locale).nav;
  const isFixedHeightRoute = pathname === localePath(locale, "/map");
  const otherLocale = locale === "de" ? "en" : "de";

  return (
    <div className={`site-shell${isFixedHeightRoute ? " site-shell-fixed" : ""}`}>
      {/* Black rail with the vertical language link, as on the old site. */}
      <aside className="site-rail">
        <Link href={switchLocalePath(pathname, otherLocale)} hrefLang={otherLocale} lang={otherLocale} className="site-rail-link">
          {t.otherVersion}
        </Link>
        <span className="site-rail-note" aria-hidden="true">{t.railNote}</span>
      </aside>
      <div className="site-main">
        <div className="site-content">{children}</div>
        {!isFixedHeightRoute && <SiteFooter locale={locale} />}
      </div>
    </div>
  );
}
