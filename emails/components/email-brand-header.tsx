import { Img, Link, Section } from "@react-email/components";

import { emailLogoUrl, emailSiteUrl } from "@/emails/brand";
import { emailColors, emailFonts } from "@/emails/theme";

export function EmailBrandHeader() {
  const wordmarkStyle = {
    margin: 0,
    padding: 0,
    fontFamily: emailFonts.display,
    fontSize: "18px",
    lineHeight: "36px",
    fontWeight: 700,
    letterSpacing: "-0.02em",
    textTransform: "uppercase" as const,
    color: emailColors.foreground,
    whiteSpace: "nowrap" as const,
  };

  return (
    <Section style={{ margin: "0 0 20px" }}>
      <Link
        href={emailSiteUrl()}
        style={{ textDecoration: "none", color: "inherit", display: "block" }}
      >
        <table
          role="presentation"
          cellPadding={0}
          cellSpacing={0}
          border={0}
          style={{ borderCollapse: "collapse" }}
        >
          <tbody>
            <tr>
              <td
                style={{
                  width: "36px",
                  height: "36px",
                  verticalAlign: "middle",
                  paddingRight: "10px",
                }}
              >
                <Img
                  src={emailLogoUrl()}
                  alt=""
                  width={36}
                  height={36}
                  style={{
                    display: "block",
                    borderRadius: "8px",
                    border: 0,
                    outline: "none",
                  }}
                />
              </td>
              <td style={{ verticalAlign: "middle" }}>
                <p style={wordmarkStyle}>promobazar.cz</p>
              </td>
            </tr>
          </tbody>
        </table>
      </Link>
    </Section>
  );
}
