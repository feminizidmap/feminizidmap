import PageHeader from "@/app/PageHeader";
import BlocksContent from "@/app/BlocksContent";
import { getHome } from "@/services/api";
import { getDictionary } from "@/i18n";

export default async function Page({ params: { locale } }) {
  let content = null;

  try {
    content = await getHome(locale);
  } catch (error) {
    console.error("Failed to load home content", error);
  }

  if (!content) {
    const t = getDictionary(locale).home;

    return <>
      <PageHeader locale={locale} variant="home" title={t.fallbackTitle} />
      <main className="page-body">
        {t.fallbackText.map((text) => <p key={text} className="fs-3">{text}</p>)}
      </main>
    </>
  }

  return <>
    <PageHeader locale={locale} variant="home" title={getDictionary(locale).home.fallbackTitle} />
    <main className="page-body">
      <BlocksContent content={content} />
    </main>
  </>
}
