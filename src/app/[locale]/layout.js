import 'bootstrap/dist/css/bootstrap.css';
import { Alegreya, IBM_Plex_Mono, Schibsted_Grotesk } from "next/font/google";
import { notFound } from "next/navigation";
import "@/app/globals.css";
import LayoutShell from "@/app/LayoutShell";
import { demoMetadata } from "@/app/demoMetadata";
import { getDictionary, locales } from "@/i18n";

// Alegreya and Schibsted Grotesk stand in for the old site's Blanco (serif) and Stabil (grotesk).
const serif = Alegreya({ subsets: ["latin"], style: ["normal", "italic"], variable: "--font-serif-face" });
const sans = Schibsted_Grotesk({ subsets: ["latin"], variable: "--font-sans-face" });
const mono = IBM_Plex_Mono({ subsets: ["latin"], weight: ["400", "500"], variable: "--font-mono-face" });

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export function generateMetadata({ params: { locale } }) {
  return {
    title: "FeminizidMap.org",
    description: getDictionary(locale).meta.description,
    ...demoMetadata,
  };
}

// Don't set `dynamicParams = false` here: with output: "export", Next 14's dev server
// rejects such routes ("missing generateStaticParams()"). Unknown locales 404 instead.
export default function RootLayout({ children, params: { locale } }) {
  if (!locales.includes(locale)) notFound();

  return (
    <html lang={locale} className={`${serif.variable} ${sans.variable} ${mono.variable}`}>
      <body>
        <LayoutShell locale={locale}>{children}</LayoutShell>
      </body>
    </html>
  );
}
