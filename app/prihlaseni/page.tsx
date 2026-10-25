import type { Metadata } from "next";
import { Suspense } from "react";

import { AuthPageShell } from "@/components/auth/auth-page-shell";
import { SignInForm } from "@/components/auth/sign-in-form";
import { LandingShell } from "@/components/landing/landing-shell";
export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Přihlášení | promobazar.cz",
  description: "Přihlášení do účtu promobazar.cz",
};

export default function LoginPage() {
  return (
    <LandingShell>
      <AuthPageShell
        title="Přihlášení"
        description="Zadej e-mail a heslo ke svému účtu."
      >
        <Suspense fallback={<p className="text-sm text-mist">Načítám formulář…</p>}>
          <SignInForm />
        </Suspense>
      </AuthPageShell>
    </LandingShell>
  );
}
