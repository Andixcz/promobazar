import { EmailButton } from "@/emails/components/email-button";
import { EmailCopy } from "@/emails/components/email-copy";
import { PromobazarLayout } from "@/emails/components/promobazar-layout";
import { emailSiteUrl } from "@/emails/brand";

export type WelcomeEmailProps = {
  name?: string | null;
};

export default function WelcomeEmail({ name }: WelcomeEmailProps) {
  const greeting = name?.trim() ? `Ahoj ${name.trim()},` : "Ahoj,";
  const dashboardUrl = `${emailSiteUrl()}/dashboard/profil`;

  return (
    <PromobazarLayout
      preview="E-mail je potvrzený, vítej na promobazar.cz"
      title="Vítej na promobazar.cz"
    >
      <EmailCopy>{greeting}</EmailCopy>
      <EmailCopy>
        Tvůj e-mail je potvrzený. Můžeš nastavit profil, balíčky nebo poptávky
        a začít používat tržiště tvůrců a značek.
      </EmailCopy>
      <EmailButton href={dashboardUrl}>Otevřít dashboard</EmailButton>
    </PromobazarLayout>
  );
}

WelcomeEmail.PreviewProps = {
  name: "Jana",
} satisfies WelcomeEmailProps;
