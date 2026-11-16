import StrapiPage from "@/app/StrapiPage";
import { getDataprotection } from "@/services/api";

export default function Page({ params: { locale } }) {
  return <StrapiPage load={getDataprotection} locale={locale} pageKey="dataprotection" />;
}
