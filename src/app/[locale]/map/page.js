import Map from "./map";
import PageHeader from "@/app/PageHeader";
import { getDictionary } from "@/i18n";
import "./page.css";

export default function Page({ params: { locale } }) {
  return (
    <>
    <PageHeader locale={locale} variant="compact" title={getDictionary(locale).map.title} />
    <main className="map-page-main">
      <Map />
    </main>
    </>
  );
}
