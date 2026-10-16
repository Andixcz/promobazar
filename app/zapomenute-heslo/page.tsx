import type { Metadata } from "next";

import { AuthPageShell } from "@/components/auth/auth-page-shell";
import { ForgotPasswordForm } from "@/components/auth/forgot-password-form";
import { LandingShell } from "@/components/landing/landing-shell";

export const metadata: Metadata = {
  title: "Zapomenuté heslo — promobazar.cz",
  description: "Obnovení hesla k účtu promobazar.cz",
};

export default function ForgotPasswordPage() {
  return (
    <LandingShell>
      <AuthPageShell
        title="Zapomenuté heslo"
        description="Zadej e-mail účtu. Pošleme ti odkaz na nastavení nového hesla."
      >
        <ForgotPasswordForm />
      </AuthPageShell>
    </LandingShell>
  );
}
