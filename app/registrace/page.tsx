import type { Metadata } from "next";
import { Suspense } from "react";

import { AuthPageShell } from "@/components/auth/auth-page-shell";
import { SignUpForm } from "@/components/auth/sign-up-form";
import { LandingShell } from "@/components/landing/landing-shell";

export const metadata: Metadata = {
  title: "Registrace | promobazar.cz",
  description: "Vytvoř si účet na promobazar.cz",
};

export default function RegisterPage() {
  return (
    <LandingShell>
      <AuthPageShell
        title="Registrace"
        description="Založ si účet a nastav profil. Registrace tvůrce je zdarma."
      >
        <Suspense fallback={<p className="text-sm text-mist">Načítám formulář…</p>}>
          <SignUpForm />
        </Suspense>
      </AuthPageShell>
    </LandingShell>
  );
}
