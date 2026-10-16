import { Link } from "@react-email/components";

import { EmailCopy, EmailMuted } from "@/emails/components/email-copy";
import { emailColors } from "@/emails/theme";

type EmailFallbackLinkProps = {
  href: string;
};

export function EmailFallbackLink({ href }: EmailFallbackLinkProps) {
  return (
    <>
      <EmailCopy>
        Odkaz je platný omezenou dobu. Když tlačítko nefunguje, zkopíruj adresu
        do prohlížeče:
      </EmailCopy>
      <EmailMuted>
        <Link href={href} style={{ color: emailColors.cyan }}>
          {href}
        </Link>
      </EmailMuted>
    </>
  );
}
