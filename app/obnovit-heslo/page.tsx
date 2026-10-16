import type { Metadata } from "next";
import { Suspense } from "react";

import { AuthPageShell } from "@/components/auth/auth-page-shell";
import { ResetPasswordForm } from "@/components/auth/reset-password-form";
import { LandingShell } from "@/components/landing/landing-shell";

export const metadata: Metadata = {
  title: "Obnovení hesla — promobazar.cz",
  description: "Nastavení nového hesla k účtu promobazar.cz",
};

export default function ResetPasswordPage() {
  return (
    <LandingShell>
      <AuthPageShell
        title="Nové heslo"
        description="Zvol si nové heslo pro přihlášení e-mailem."
      >
        <Suspense fallback={<p className="text-sm text-mist">Načítám formulář…</p>}>
          <ResetPasswordForm />
        </Suspense>
      </AuthPageShell>
    </LandingShell>
  );
}
