'use client'

import { useState } from 'react';
import { Container, Nav, Navbar, NavbarBrand, NavbarToggle, NavbarCollapse } from 'react-bootstrap';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { getDictionary, localePath, locales, switchLocalePath } from '@/i18n';

const NAV_ITEMS = [
  ["home", "/"],
  ["about", "/about"],
  ["map", "/map"],
  ["reports", "/reports"],
  ["events", "/events"],
  ["publications", "/publications"],
  ["team", "/team"],
  ["faq", "/faq"],
];

export default function Navigation({ locale }) {
  const [expanded, setExpanded] = useState(false);
  const pathname = usePathname();
  const t = getDictionary(locale).nav;
  const close = () => setExpanded(false);

  return (
    <Navbar expanded={expanded} expand="lg" className='mt-3'>
      <Container>
        <NavbarBrand as={Link} className="d-flex" href={localePath(locale)}>
          <div style={{ width: "50vw" }} className='d-inline-block d-lg-none'>
            <Image alt="FeminizidMap.org" src="/title.svg" className="float-start w-100 h-auto" width={0} height={0} />
          </div>
        </NavbarBrand>
        <NavbarToggle onClick={() => setExpanded(!expanded)} aria-controls="basic-navbar-nav" />
        <NavbarCollapse id="basic-navbar-nav">
          <Nav className="justify-content-between align-items-center text-center w-100">
            {NAV_ITEMS.map(([key, path]) => (
              <Link key={key} onClick={close} className="nav-link fs-2" href={localePath(locale, path)}>{t[key]}</Link>
            ))}
            <div className="locale-switch fs-4" role="group" aria-label={t.language}>
              {locales.map((code) => (
                <Link
                  key={code}
                  onClick={close}
                  href={switchLocalePath(pathname, code)}
                  hrefLang={code}
                  lang={code}
                  aria-current={code === locale ? "true" : undefined}
                  className={code === locale ? "locale-link active" : "locale-link"}
                >
                  {code.toUpperCase()}
                </Link>
              ))}
            </div>
          </Nav>
        </NavbarCollapse>
      </Container>
    </Navbar>
  );
};
