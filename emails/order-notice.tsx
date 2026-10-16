import { EmailButton } from "@/emails/components/email-button";
import { EmailCopy } from "@/emails/components/email-copy";
import { PromobazarLayout } from "@/emails/components/promobazar-layout";

export type OrderNoticeProps = {
  title: string;
  preview: string;
  paragraphs: string[];
  actionHref?: string;
  actionLabel?: string;
};

export default function OrderNotice({
  title,
  preview,
  paragraphs,
  actionHref,
  actionLabel,
}: OrderNoticeProps) {
  return (
    <PromobazarLayout preview={preview} title={title}>
      {paragraphs.map((paragraph) => (
        <EmailCopy key={paragraph}>{paragraph}</EmailCopy>
      ))}
      {actionHref && actionLabel ? (
        <EmailButton href={actionHref}>{actionLabel}</EmailButton>
      ) : null}
    </PromobazarLayout>
  );
}

OrderNotice.PreviewProps = {
  title: "Nová zakázka",
  preview: "Máš novou zakázku.",
  paragraphs: ["Máš novou zakázku. Na přijetí máš 48 hodin."],
  actionHref: "https://promobazar.cz/dashboard/objednavky",
  actionLabel: "Otevřít objednávky",
} satisfies OrderNoticeProps;
