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

    return <main>
      <h1 className="purple display-1 fw-bold">{t.fallbackTitle}</h1>
      {t.fallbackText.map((text) => <p key={text} className="fs-3">{text}</p>)}
    </main>
  }

  return <main>
    <BlocksContent content={content} />
  </main>
}
