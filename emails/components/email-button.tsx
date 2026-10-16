import { Link, Section } from "@react-email/components";
import type { CSSProperties } from "react";

import { emailColors, emailFonts } from "@/emails/theme";

type EmailButtonProps = {
  href: string;
  children: string;
};

export function EmailButton({ href, children }: EmailButtonProps) {
  const style: CSSProperties = {
    display: "block",
    width: "100%",
    boxSizing: "border-box",
    margin: 0,
    padding: "12px 22px",
    borderRadius: "6px",
    backgroundColor: emailColors.cyan,
    color: emailColors.ink,
    fontFamily: emailFonts.body,
    fontSize: "14px",
    fontWeight: 600,
    textDecoration: "none",
    textAlign: "center",
  };

  return (
    <Section style={{ marginTop: "20px", marginBottom: "20px" }}>
      <Link href={href} style={style}>
        {children}
      </Link>
    </Section>
  );
}
