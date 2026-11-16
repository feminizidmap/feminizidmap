import StrapiPage from "@/app/StrapiPage";
import { getFaq } from "@/services/api";

export default function Page({ params: { locale } }) {
  return <StrapiPage load={getFaq} locale={locale} pageKey="faq" />;
}
