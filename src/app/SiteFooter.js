import Link from "next/link";
import { getDictionary, localePath } from "@/i18n";

// rapidmail subscribe endpoint, taken verbatim from the old Hugo site's newsletter embed.
// Plain form POST on purpose: no rapidmail script or CSS is loaded on page view.
const NEWSLETTER_ACTION = "https://t9b52f32b.emailsys2a.net/257/1224/6167fe5def/subscribe/form.html?_g=1780318406";

export default function SiteFooter({ locale }) {
  const t = getDictionary(locale).footer;

  return (
    <footer className="site-footer">
      <div className="site-footer-grid">
        <div className="site-footer-contact">
          <div className="site-footer-block">
            <h2 className="t-kicker">{t.reportCaseTitle}</h2>
            <p>{t.reportCase}</p>
            <a href="mailto:feminizidalerts@web.de" className="site-footer-mail">feminizidalerts@web.de</a>
          </div>
          <div className="site-footer-block">
            <h2 className="t-kicker">{t.contactTitle}</h2>
            <p>{t.contact}</p>
            <a href="mailto:info@feminizidmap.org" className="site-footer-mail">info@feminizidmap.org</a>
          </div>
        </div>

        <section className="newsletter" aria-labelledby="newsletter-title">
          <h2 id="newsletter-title" className="newsletter-title">{t.newsletterTitle}</h2>
          <p className="newsletter-text">{t.newsletterText}</p>
          <form className="newsletter-form" method="post" action={NEWSLETTER_ACTION} target="_blank">
            <label htmlFor="newsletter-email" className="t-kicker">{t.emailLabel}</label>
            <div className="newsletter-row">
              <input
                type="email"
                name="email"
                id="newsletter-email"
                className="newsletter-input"
                placeholder={t.emailPlaceholder}
                autoComplete="email"
                required
              />
              <button type="submit" className="newsletter-button">{t.subscribe}</button>
            </div>
          </form>
          <p className="newsletter-note">{t.newsletterNote}</p>
        </section>
      </div>

      <div className="site-footer-bottom">
        <span className="site-logo" aria-hidden="true">FEMINIZID<br />MAP.<br />ORG</span>
        <nav className="site-footer-legal" aria-label={t.legal}>
          <Link href={localePath(locale, "/imprint")}>{t.imprint}</Link>
          <Link href={localePath(locale, "/dataprotection")}>{t.dataprotection}</Link>
        </nav>
      </div>
    </footer>
  );
}
