import { EmailButton } from "@/emails/components/email-button";
import { EmailCopy } from "@/emails/components/email-copy";
import { EmailFallbackLink } from "@/emails/components/email-fallback-link";
import { PromobazarLayout } from "@/emails/components/promobazar-layout";

export type ChangeEmailVerifyEmailProps = {
  name?: string | null;
  newEmail: string;
  verifyUrl: string;
};

export default function ChangeEmailVerifyEmail({
  name,
  newEmail,
  verifyUrl,
}: ChangeEmailVerifyEmailProps) {
  const greeting = name?.trim() ? `Ahoj ${name.trim()},` : "Ahoj,";

  return (
    <PromobazarLayout
      preview="Ověř nový e-mail na promobazar.cz"
      title="Ověření nového e-mailu"
    >
      <EmailCopy>{greeting}</EmailCopy>
      <EmailCopy>
        Dokonči změnu přihlašovacího e-mailu na{" "}
        <strong style={{ color: "#f2f0fa" }}>{newEmail}</strong>. Klikni na
        tlačítko a adresu aktivujeme.
      </EmailCopy>
      <EmailButton href={verifyUrl}>Ověřit nový e-mail</EmailButton>
      <EmailFallbackLink href={verifyUrl} />
    </PromobazarLayout>
  );
}

ChangeEmailVerifyEmail.PreviewProps = {
  name: "Jana",
  newEmail: "nova@email.cz",
  verifyUrl: "https://promobazar.cz/api/auth/verify-email?token=preview",
} satisfies ChangeEmailVerifyEmailProps;
