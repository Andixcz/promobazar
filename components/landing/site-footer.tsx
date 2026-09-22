"use client";

import type { MouseEvent, ReactNode } from "react";
import Link from "next/link";

import { BrandMark } from "@/components/ui/brand-mark";
import { goToJobBoardBrowse } from "@/lib/landing-nav";
import { landingHref, LANDING_FIRMS_PATH } from "@/lib/landing-routes";
import { scrollToSection } from "@/lib/scroll-to-section";
import { sectionX, surface } from "@/lib/ui-surfaces";
import { cn } from "@/lib/utils";

const headingClass =
  "mb-4 font-body text-[11px] font-medium uppercase tracking-wide text-cyan";

const linkClass =
  "text-sm text-zinc-200 transition-colors hover:text-white";

const socialLinks = [
  {
    href: "https://www.instagram.com/promobazar.cz/",
    label: "Instagram",
  },
  {
    href: "https://www.linkedin.com/company/promobazar/",
    label: "LinkedIn",
  },
] as const;

function FooterLink({
  href,
  children,
  onClick,
}: {
  href: string;
  children: ReactNode;
  onClick?: (e: MouseEvent<HTMLAnchorElement>) => void;
}) {
  return (
    <a href={href} onClick={onClick} className={linkClass}>
      {children}
    </a>
  );
}

function FooterColumn({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) {
  return (
    <div>
      <p className={headingClass}>{title}</p>
      <ul className="flex flex-col gap-3">{children}</ul>
    </div>
  );
}

export function SiteFooter() {
  return (
    <footer className={cn(sectionX, "py-8")}>
      <div className={cn("mx-auto max-w-7xl p-8 md:p-10 lg:p-12", surface)}>
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-12 lg:gap-8">
          <div className="sm:col-span-2 lg:col-span-5">
            <Link href={LANDING_FIRMS_PATH} className="inline-flex items-center gap-2.5">
              <BrandMark />
            </Link>
            <p className="mt-5 max-w-sm text-sm leading-relaxed text-zinc-200">
              Propojujeme značky s tvůrci, kteří umí prodat. Vyber promo, nastav rozpočet a plať
              v klidu. Peníze držíme v úschově, dokud nebudeš s výsledkem spokojený.
            </p>
            <a
              href="mailto:podpora@promobazar.cz"
              className="mt-5 inline-block text-sm font-medium text-cyan transition-colors hover:text-cyan/85"
            >
              podpora@promobazar.cz
            </a>
          </div>

          <div className="lg:col-span-7">
            <div className="grid gap-10 sm:grid-cols-3">
              <FooterColumn title="Pro značky">
                <li>
                  <FooterLink href={landingHref("firms", "marketplace")}>
                    Tržiště tvůrců
                  </FooterLink>
                </li>
                <li>
                  <FooterLink
                    href={landingHref("firms", "job-board")}
                    onClick={(e) => {
                      e.preventDefault();
                      goToJobBoardBrowse();
                    }}
                  >
                    Poptávky
                  </FooterLink>
                </li>
                <li>
                  <FooterLink href={landingHref("firms", "cenik")}>Ceník</FooterLink>
                </li>
                <li>
                  <FooterLink href={landingHref("firms", "jak-to-funguje")}>
                    Jak to funguje
                  </FooterLink>
                </li>
              </FooterColumn>

              <FooterColumn title="Pro tvůrce">
                <li>
                  <FooterLink href={landingHref("creators", "propojeni")}>
                    Propojení profilu
                  </FooterLink>
                </li>
                <li>
                  <FooterLink href={landingHref("creators", "balicky")}>
                    Balíčky
                  </FooterLink>
                </li>
                <li>
                  <FooterLink href={landingHref("creators", "creator-pro")}>
                    Creator PRO
                  </FooterLink>
                </li>
              </FooterColumn>

              <FooterColumn title="Společnost">
                <li>
                  <FooterLink href="#faq">Časté otázky</FooterLink>
                </li>
                <li>
                  <FooterLink
                    href={landingHref("firms", "kontakt")}
                    onClick={(e) => {
                      e.preventDefault();
                      scrollToSection("kontakt");
                    }}
                  >
                    Kontakt
                  </FooterLink>
                </li>
                <li>
                  <FooterLink href="#">Ochrana údajů</FooterLink>
                </li>
                <li>
                  <span
                    className="cursor-default text-sm text-white/35"
                    title="Chystáme se, děkujeme za trpělivost"
                  >
                    Obchodní podmínky
                  </span>
                </li>
              </FooterColumn>
            </div>
          </div>
        </div>

        <div
          className="mt-12 flex flex-col gap-4 border-t border-white/10 pt-8 text-xs text-mist md:flex-row md:items-center md:justify-between"
        >
          <p>© {new Date().getFullYear()} promobazar.cz. Všechna práva vyhrazena.</p>
          <div className="flex flex-wrap items-center gap-x-5 gap-y-1">
            {socialLinks.map(({ href, label }) => (
              <a
                key={label}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                className={cn(linkClass, "text-xs")}
              >
                {label}
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
