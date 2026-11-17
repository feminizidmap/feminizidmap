import Link from "next/link";
import { Container } from "react-bootstrap";
import { getDictionary, localePath } from "@/i18n";

// rapidmail subscribe endpoint, taken verbatim from the old Hugo site's newsletter embed.
// Plain form POST on purpose: no rapidmail script or CSS is loaded on page view.
const NEWSLETTER_ACTION = "https://t9b52f32b.emailsys2a.net/257/1224/6167fe5def/subscribe/form.html?_g=1780318406";

export default function SiteFooter({ locale }) {
  const t = getDictionary(locale).footer;

  return (
    <Container as="footer" className="site-footer py-4 mb-3">
      <div className="site-footer-contact">
        <p>{t.reportCase} <a href="mailto:feminizidalerts@web.de">feminizidalerts@web.de</a></p>
        <p>{t.contact} <a href="mailto:info@feminizidmap.org">info@feminizidmap.org</a></p>
      </div>

      <section className="newsletter my-4" aria-labelledby="newsletter-title">
        <h2 id="newsletter-title" className="fs-4 fw-bold">{t.newsletterTitle}</h2>
        <p>{t.newsletterText}</p>
        <form className="newsletter-form" method="post" action={NEWSLETTER_ACTION} target="_blank">
          <label htmlFor="newsletter-email" className="visually-hidden">{t.emailLabel}</label>
          <input
            type="email"
            name="email"
            id="newsletter-email"
            className="newsletter-input"
            placeholder={t.emailLabel}
            autoComplete="email"
            required
          />
          <button type="submit" className="newsletter-button">{t.subscribe}</button>
        </form>
        <p className="newsletter-note">{t.newsletterNote}</p>
      </section>

      <nav className="site-footer-legal">
        <Link href={localePath(locale, "/imprint")}>{t.imprint}</Link>
        <span aria-hidden="true"> · </span>
        <Link href={localePath(locale, "/dataprotection")}>{t.dataprotection}</Link>
      </nav>
    </Container>
  );
}
