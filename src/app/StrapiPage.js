import BlocksContent from "./BlocksContent";

// Server component for Strapi single types with `title` + blocks `content`.
export default async function StrapiPage({ load, fallbackTitle }) {
  let page = null;

  try {
    page = await load();
  } catch (error) {
    console.error(`Failed to load "${fallbackTitle}" content`, error);
  }

  return <main>
    <h1 className="purple display-1 fw-bold">{page?.title || fallbackTitle}</h1>
    {page?.content ? (
      <BlocksContent content={page.content} />
    ) : (
      <p className="fs-3">This content is not available right now.</p>
    )}
  </main>
}
