import StrapiPage from "@/app/StrapiPage";
import { getImprint } from "@/services/api";

export default function Page({ params: { locale } }) {
  return <StrapiPage load={getImprint} locale={locale} pageKey="imprint" />;
}
