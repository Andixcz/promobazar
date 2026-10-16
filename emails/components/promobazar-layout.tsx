import {
  Body,
  Container,
  Head,
  Heading,
  Html,
  Link,
  Preview,
  Section,
  Text,
} from "@react-email/components";
import type { ReactNode } from "react";

import { emailSiteUrl } from "@/emails/brand";
import { EmailBrandHeader } from "@/emails/components/email-brand-header";
import { emailColors, emailFonts } from "@/emails/theme";

type PromobazarLayoutProps = {
  preview: string;
  title: string;
  children: ReactNode;
};

export function PromobazarLayout({
  preview,
  title,
  children,
}: PromobazarLayoutProps) {
  const year = new Date().getFullYear();

  return (
    <Html lang="cs">
      <Head />
      <Preview>{preview}</Preview>
      <Body
        style={{
          backgroundColor: emailColors.void,
          margin: 0,
          padding: "40px 16px",
          fontFamily: emailFonts.body,
        }}
      >
        <Container style={{ maxWidth: 520, margin: "0 auto" }}>
          <EmailBrandHeader />

          <Section
            style={{
              backgroundColor: emailColors.panel,
              border: `1px solid ${emailColors.border}`,
              borderRadius: "10px",
              padding: "28px 24px",
            }}
          >
            <Heading
              as="h1"
              style={{
                margin: "0 0 16px",
                fontFamily: emailFonts.display,
                fontSize: "22px",
                lineHeight: "28px",
                fontWeight: 700,
                color: emailColors.foreground,
              }}
            >
              {title}
            </Heading>
            {children}
          </Section>

          <Text
            style={{
              margin: "20px 0 0",
              fontSize: "12px",
              lineHeight: "18px",
              color: emailColors.mist,
            }}
          >
            Tento e-mail jsi dostal/a kvůli účtu na{" "}
            <Link
              href={emailSiteUrl()}
              style={{ color: emailColors.cyan, textDecoration: "none" }}
            >
              promobazar.cz
            </Link>
            . Pokud jsi akci nevyžádal/a, můžeš ho ignorovat.
          </Text>
          <Text
            style={{
              margin: "8px 0 0",
              fontSize: "11px",
              color: emailColors.mist,
              opacity: 0.85,
            }}
          >
            © {year} promobazar.cz
          </Text>
        </Container>
      </Body>
    </Html>
  );
}
