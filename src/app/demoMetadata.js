// Demo/preview builds (NEXT_PUBLIC_NOINDEX=true): keep search engines out and don't leak the
// (obscure) deployment URL to external sites via the Referer header.
export const demoMetadata =
  process.env.NEXT_PUBLIC_NOINDEX === "true"
    ? { robots: { index: false, follow: false }, referrer: "no-referrer" }
    : {};
