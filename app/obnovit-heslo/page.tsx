import type { Metadata } from "next";
import { Suspense } from "react";

import { AuthPageShell } from "@/components/auth/auth-page-shell";
import { ResetPasswordForm } from "@/components/auth/reset-password-form";
import { SiteShell } from "@/components/shared/site-shell";

export const metadata: Metadata = {
  title: "Obnovení hesla",
  description: "Nastavení nového hesla k účtu promobazar.cz",
};

export default function ResetPasswordPage() {
  return (
    <SiteShell>
      <AuthPageShell
        title="Nové heslo"
        description="Zvol si nové heslo pro přihlášení e-mailem."
      >
        <Suspense fallback={<p className="text-sm text-mist">Načítám formulář…</p>}>
          <ResetPasswordForm />
        </Suspense>
      </AuthPageShell>
    </SiteShell>
  );
}
