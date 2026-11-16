"use client";

import { Container } from "react-bootstrap";
import { usePathname } from "next/navigation";
import Navigation from "./Navigation";
import Image from "next/image";
import Link from "next/link";
import { getDictionary, localePath } from "@/i18n";

export default function LayoutShell({ children, locale }) {
  const pathname = usePathname();
  const isFixedHeightRoute = pathname === localePath(locale, "/map");
  const t = getDictionary(locale).footer;

  return (
    <div
      className={`d-flex flex-column site-shell${
        isFixedHeightRoute ? " site-shell-fixed" : ""
      }`}
    >
      <Container>
        <Image
          alt="FeminizidMap.org"
          src="/title.svg"
          className="pt-3 d-none d-lg-block w-100 h-auto"
          width={0}
          height={0}
        />
        <Navigation locale={locale} />
      </Container>
      <Container className="d-flex flex-column flex-grow-1 my-4 site-content">
        {children}
      </Container>
      {!isFixedHeightRoute && (
        <Container as="footer" className="site-footer py-3 mb-3">
          <Link href={localePath(locale, "/imprint")}>{t.imprint}</Link>
          <span aria-hidden="true"> · </span>
          <Link href={localePath(locale, "/dataprotection")}>{t.dataprotection}</Link>
        </Container>
      )}
    </div>
  );
}
