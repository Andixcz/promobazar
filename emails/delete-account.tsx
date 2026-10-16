import { EmailButton } from "@/emails/components/email-button";
import { EmailCopy } from "@/emails/components/email-copy";
import { EmailFallbackLink } from "@/emails/components/email-fallback-link";
import { PromobazarLayout } from "@/emails/components/promobazar-layout";

export type DeleteAccountEmailProps = {
  name?: string | null;
  deleteUrl: string;
};

export default function DeleteAccountEmail({
  name,
  deleteUrl,
}: DeleteAccountEmailProps) {
  const greeting = name?.trim() ? `Ahoj ${name.trim()},` : "Ahoj,";

  return (
    <PromobazarLayout
      preview="Potvrzení smazání účtu na promobazar.cz"
      title="Smazání účtu"
    >
      <EmailCopy>{greeting}</EmailCopy>
      <EmailCopy>
        Dostali jsme žádost o trvalé smazání účtu na promobazar.cz. Pokud jsi o
        smazání žádal/a ty, potvrď ho tlačítkem. Po potvrzení se profil a data
        odstraní a nelze je vrátit.
      </EmailCopy>
      <EmailButton href={deleteUrl}>Potvrdit smazání účtu</EmailButton>
      <EmailFallbackLink href={deleteUrl} />
    </PromobazarLayout>
  );
}

DeleteAccountEmail.PreviewProps = {
  name: "Jana",
  deleteUrl: "https://promobazar.cz/api/auth/delete-user/callback?token=preview",
} satisfies DeleteAccountEmailProps;
