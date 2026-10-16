import { EmailButton } from "@/emails/components/email-button";
import { EmailCopy } from "@/emails/components/email-copy";
import { EmailFallbackLink } from "@/emails/components/email-fallback-link";
import { PromobazarLayout } from "@/emails/components/promobazar-layout";

export type ChangeEmailConfirmEmailProps = {
  name?: string | null;
  newEmail: string;
  confirmUrl: string;
};

export default function ChangeEmailConfirmEmail({
  name,
  newEmail,
  confirmUrl,
}: ChangeEmailConfirmEmailProps) {
  const greeting = name?.trim() ? `Ahoj ${name.trim()},` : "Ahoj,";

  return (
    <PromobazarLayout
      preview="Potvrzení změny e-mailu na promobazar.cz"
      title="Změna e-mailu"
    >
      <EmailCopy>{greeting}</EmailCopy>
      <EmailCopy>
        Na účtu promobazar.cz chceme změnit přihlašovací e-mail na{" "}
        <strong style={{ color: "#f2f0fa" }}>{newEmail}</strong>. Pokud jsi o
        změnu žádal/a ty, potvrď ji tlačítkem níže.
      </EmailCopy>
      <EmailButton href={confirmUrl}>Potvrdit změnu e-mailu</EmailButton>
      <EmailFallbackLink href={confirmUrl} />
    </PromobazarLayout>
  );
}

ChangeEmailConfirmEmail.PreviewProps = {
  name: "Jana",
  newEmail: "nova@email.cz",
  confirmUrl: "https://promobazar.cz/api/auth/verify-email?token=preview",
} satisfies ChangeEmailConfirmEmailProps;
