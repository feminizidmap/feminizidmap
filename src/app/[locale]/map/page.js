import Map from "./map";
import PageHeader from "@/app/PageHeader";
import { getDictionary } from "@/i18n";
import "./filters.css";
import "./page.css";

export default function Page({ params: { locale } }) {
  return (
    <>
    <PageHeader locale={locale} variant="map" title={getDictionary(locale).map.title} lead={getDictionary(locale).map.lead} />
    <main className="map-page-main">
      <Map />
    </main>
    </>
  );
}
