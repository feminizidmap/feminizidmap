import Navigation from "./Navigation";

// Purple header band with the hands illustration, as on the old site.
// variant "home": tall hero; "page": subpages; "map": slim bar on phones so the map gets the height.
// `note`: optional extra line below the lead (e.g. the data period on map and database).
export default function PageHeader({ locale, title, lead, note, variant = "page" }) {
  return (
    <header className={`page-header page-header-${variant}`}>
      <Navigation locale={locale} />
      {(title || lead) && (
        <div className="page-header-text">
          {title && <h1 className="page-header-title">{title}</h1>}
          {lead && <p className="page-header-lead">{lead}</p>}
          {note}
        </div>
      )}
    </header>
  );
}
