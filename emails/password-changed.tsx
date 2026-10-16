import { EmailButton } from "@/emails/components/email-button";
import { EmailCopy } from "@/emails/components/email-copy";
import { PromobazarLayout } from "@/emails/components/promobazar-layout";
import { emailSiteUrl } from "@/emails/brand";

export type PasswordChangedEmailProps = {
  name?: string | null;
};

export default function PasswordChangedEmail({ name }: PasswordChangedEmailProps) {
  const greeting = name?.trim() ? `Ahoj ${name.trim()},` : "Ahoj,";
  const loginUrl = `${emailSiteUrl()}/prihlaseni`;

  return (
    <PromobazarLayout
      preview="Heslo k účtu promobazar.cz bylo změněno"
      title="Heslo bylo změněno"
    >
      <EmailCopy>{greeting}</EmailCopy>
      <EmailCopy>
        Právě jsme uložili nové heslo k tvému účtu. Když jsi o změnu nežádal/a,
        co nejdřív si heslo obnov přes zapomenuté heslo a zkontroluj zabezpečení
        účtu.
      </EmailCopy>
      <EmailButton href={loginUrl}>Přihlásit se</EmailButton>
    </PromobazarLayout>
  );
}

PasswordChangedEmail.PreviewProps = {
  name: "Jana",
} satisfies PasswordChangedEmailProps;
