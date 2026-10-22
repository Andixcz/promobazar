import type { Metadata } from "next";
import { Suspense } from "react";

import { AuthPageShell } from "@/components/auth/auth-page-shell";
import { SignUpForm } from "@/components/auth/sign-up-form";
import { LandingShell } from "@/components/landing/landing-shell";
import { listConfiguredSocialAuthProviders } from "@/lib/auth-social-server";

export const metadata: Metadata = {
  title: "Registrace | promobazar.cz",
  description: "Vytvoř si účet na promobazar.cz",
};

export default function RegisterPage() {
  const socialProviders = listConfiguredSocialAuthProviders();

  return (
    <LandingShell>
      <AuthPageShell
        title="Registrace"
        description="Zvol typ účtu. Pak e-mail a heslo, nebo Google / Discord. Profil tvůrce je zdarma."
      >
        <Suspense fallback={<p className="text-sm text-mist">Načítám formulář…</p>}>
          <SignUpForm socialProviders={socialProviders} />
        </Suspense>
      </AuthPageShell>
    </LandingShell>
  );
}
