import { EmailButton } from "@/emails/components/email-button";
import { EmailCopy } from "@/emails/components/email-copy";
import { EmailFallbackLink } from "@/emails/components/email-fallback-link";
import { PromobazarLayout } from "@/emails/components/promobazar-layout";

export type VerifyEmailProps = {
  name?: string | null;
  verifyUrl: string;
};

export default function VerifyEmail({ name, verifyUrl }: VerifyEmailProps) {
  const greeting = name?.trim() ? `Ahoj ${name.trim()},` : "Ahoj,";

  return (
    <PromobazarLayout
      preview="Potvrď e-mail a dokonči registraci na promobazar.cz"
      title="Potvrzení e-mailu"
    >
      <EmailCopy>{greeting}</EmailCopy>
      <EmailCopy>
        Děkujeme za registraci na promobazar.cz. Klikni na tlačítko níže a
        potvrď svůj e-mail. Pak můžeš pokračovat v nastavení profilu a v
        tržišti.
      </EmailCopy>
      <EmailButton href={verifyUrl}>Potvrdit e-mail</EmailButton>
      <EmailFallbackLink href={verifyUrl} />
    </PromobazarLayout>
  );
}

VerifyEmail.PreviewProps = {
  name: "Jana",
  verifyUrl: "https://promobazar.cz/api/auth/verify-email?token=preview",
} satisfies VerifyEmailProps;
