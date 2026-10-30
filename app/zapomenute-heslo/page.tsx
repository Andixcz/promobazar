import type { Metadata } from "next";

import { AuthPageShell } from "@/components/auth/auth-page-shell";
import { ForgotPasswordForm } from "@/components/auth/forgot-password-form";
import { SiteShell } from "@/components/shared/site-shell";

export const metadata: Metadata = {
  title: "Zapomenuté heslo",
  description: "Obnovení hesla k účtu promobazar.cz",
};

export default function ForgotPasswordPage() {
  return (
    <SiteShell>
      <AuthPageShell
        title="Zapomenuté heslo"
        description="Zadej e-mail účtu. Pošleme ti odkaz na nastavení nového hesla."
      >
        <ForgotPasswordForm />
      </AuthPageShell>
    </SiteShell>
  );
}
