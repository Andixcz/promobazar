import type { Metadata } from "next";
import { Suspense } from "react";

import { AuthPageShell } from "@/components/auth/auth-page-shell";
import { SignInForm } from "@/components/auth/sign-in-form";
import { LandingShell } from "@/components/landing/landing-shell";
import { listConfiguredSocialAuthProviders } from "@/lib/auth-social-server";

export const metadata: Metadata = {
  title: "Přihlášení | promobazar.cz",
  description: "Přihlášení do účtu promobazar.cz",
};

export default function LoginPage() {
  const socialProviders = listConfiguredSocialAuthProviders();

  return (
    <LandingShell>
      <AuthPageShell
        title="Přihlášení"
        description="E-mail a heslo. Nebo přihlášení přes Google nebo Discord."
      >
        <Suspense fallback={<p className="text-sm text-mist">Načítám formulář…</p>}>
          <SignInForm socialProviders={socialProviders} />
        </Suspense>
      </AuthPageShell>
    </LandingShell>
  );
}
