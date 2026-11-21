import PageHeader from "@/app/PageHeader";
import FaqAccordion from "@/app/FaqAccordion";
import { getFaq } from "@/services/api";
import { getDictionary } from "@/i18n";

export default async function Page({ params: { locale } }) {
  const t = getDictionary(locale);
  let page = null;

  try {
    page = await getFaq(locale);
  } catch (error) {
    console.error(`Failed to load "faq" content (${locale})`, error);
  }

  return <>
    <PageHeader locale={locale} title={page?.title || t.pages.faq} />
    <main className="page-body page-body-text">
      {page?.content ? (
        <FaqAccordion content={page.content} countLabel={t.faq.count} />
      ) : (
        <p className="prose">{t.common.unavailable}</p>
      )}
      <aside className="faq-contact">
        <div>
          <h2 className="faq-contact-title">{t.faq.missing}</h2>
          <p>{t.faq.write}</p>
        </div>
        <a href="mailto:info@feminizidmap.org" className="faq-contact-link">info@feminizidmap.org</a>
      </aside>
    </main>
  </>
}
