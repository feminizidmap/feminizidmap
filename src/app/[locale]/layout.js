import 'bootstrap/dist/css/bootstrap.css';
import { Inter } from "next/font/google";
import { notFound } from "next/navigation";
import "@/app/globals.css";
import LayoutShell from "@/app/LayoutShell";
import { getDictionary, locales } from "@/i18n";

const inter = Inter({ subsets: ["latin"] });

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export function generateMetadata({ params: { locale } }) {
  return {
    title: "FeminizidMap.org",
    description: getDictionary(locale).meta.description,
  };
}

// Don't set `dynamicParams = false` here: with output: "export", Next 14's dev server
// rejects such routes ("missing generateStaticParams()"). Unknown locales 404 instead.
export default function RootLayout({ children, params: { locale } }) {
  if (!locales.includes(locale)) notFound();

  return (
    <html lang={locale}>
      <body className={inter.className}>
        <LayoutShell locale={locale}>{children}</LayoutShell>
      </body>
    </html>
  );
}
