import BlocksContent from "@/app/BlocksContent";
import { getAbout } from "@/services/api";
import { getDictionary } from "@/i18n";

export default async function Page({ params: { locale } }) {
  let content = null;

  try {
    content = await getAbout(locale);
  } catch (error) {
    console.error("Failed to load about content", error);
  }

  if (!content) {
    return <main>
      <p className="fs-3">{getDictionary(locale).about.fallbackText}</p>
    </main>
  }

  return <main>
    <BlocksContent content={content} />
  </main>
}
