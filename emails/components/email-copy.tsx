import { Text } from "@react-email/components";
import type { CSSProperties, ReactNode } from "react";

import { emailColors, emailFonts } from "@/emails/theme";

const base: CSSProperties = {
  margin: "0 0 14px",
  fontSize: "15px",
  lineHeight: "24px",
  color: emailColors.mist,
  fontFamily: emailFonts.body,
};

export function EmailCopy({ children }: { children: ReactNode }) {
  return <Text style={base}>{children}</Text>;
}

export function EmailMuted({ children }: { children: ReactNode }) {
  return (
    <Text
      style={{
        ...base,
        marginBottom: 0,
        fontSize: "13px",
        lineHeight: "20px",
        fontFamily: emailFonts.mono,
        wordBreak: "break-all",
      }}
    >
      {children}
    </Text>
  );
}
