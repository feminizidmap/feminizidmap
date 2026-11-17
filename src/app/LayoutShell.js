"use client";

import { Container } from "react-bootstrap";
import { usePathname } from "next/navigation";
import Navigation from "./Navigation";
import Image from "next/image";
import SiteFooter from "./SiteFooter";
import { localePath } from "@/i18n";

export default function LayoutShell({ children, locale }) {
  const pathname = usePathname();
  const isFixedHeightRoute = pathname === localePath(locale, "/map");

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
      {!isFixedHeightRoute && <SiteFooter locale={locale} />}
    </div>
  );
}
