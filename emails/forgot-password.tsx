import { EmailButton } from "@/emails/components/email-button";
import { EmailCopy } from "@/emails/components/email-copy";
import { EmailFallbackLink } from "@/emails/components/email-fallback-link";
import { PromobazarLayout } from "@/emails/components/promobazar-layout";

export type ForgotPasswordEmailProps = {
  name?: string | null;
  resetUrl: string;
};

export default function ForgotPasswordEmail({
  name,
  resetUrl,
}: ForgotPasswordEmailProps) {
  const greeting = name?.trim() ? `Ahoj ${name.trim()},` : "Ahoj,";

  return (
    <PromobazarLayout
      preview="Odkaz na nové heslo k účtu promobazar.cz"
      title="Zapomenuté heslo"
    >
      <EmailCopy>{greeting}</EmailCopy>
      <EmailCopy>
        Požádal/a jsi o obnovení hesla. Klikni na tlačítko a zvol si nové heslo.
        Když jsi o změnu nežádal/a, tento e-mail ignoruj.
      </EmailCopy>
      <EmailButton href={resetUrl}>Nastavit nové heslo</EmailButton>
      <EmailFallbackLink href={resetUrl} />
    </PromobazarLayout>
  );
}

ForgotPasswordEmail.PreviewProps = {
  name: "Jana",
  resetUrl: "https://promobazar.cz/obnovit-heslo?token=preview",
} satisfies ForgotPasswordEmailProps;
