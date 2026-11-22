import { demoMetadata } from "@/app/demoMetadata";
import { defaultLocale } from "@/i18n";

// Separate root layout for "/" only: the static export has no server-side redirects,
// so "/" forwards to the default locale with a meta refresh.
const target = `${process.env.NEXT_PUBLIC_BASE_PATH || ""}/${defaultLocale}`;

export const metadata = {
  title: "FeminizidMap.org",
  ...demoMetadata,
};

export default function RootLayout({ children }) {
  return (
    <html lang={defaultLocale}>
      <head>
        <meta httpEquiv="refresh" content={`0; url=${target}`} />
      </head>
      <body>{children}</body>
    </html>
  );
}
