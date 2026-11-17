import BlocksContent from "./BlocksContent";
import PageHeader from "./PageHeader";
import { getDictionary } from "@/i18n";

// Server component for Strapi single types with `title` + blocks `content`.
// `pageKey` selects the fallback title from the dictionary (`pages.<pageKey>`).
export default async function StrapiPage({ load, locale, pageKey }) {
  const t = getDictionary(locale);
  let page = null;

  try {
    page = await load(locale);
  } catch (error) {
    console.error(`Failed to load "${pageKey}" content (${locale})`, error);
  }

  return <>
    <PageHeader locale={locale} title={page?.title || t.pages[pageKey]} />
    <main className="page-body">
      {page?.content ? (
        <BlocksContent content={page.content} />
      ) : (
        <p className="fs-3">{t.common.unavailable}</p>
      )}
    </main>
  </>
}
