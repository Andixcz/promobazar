import type { Metadata } from "next";
import { Suspense } from "react";

import { AuthPageShell } from "@/components/auth/auth-page-shell";
import { SignUpForm } from "@/components/auth/sign-up-form";
import { LandingShell } from "@/components/landing/landing-shell";
export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Registrace | promobazar.cz",
  description: "Vytvoř si účet na promobazar.cz",
};

export default function RegisterPage() {
  return (
    <LandingShell>
      <AuthPageShell
        title="Registrace"
        description="Zvol typ účtu a vyplň registrační formulář. Profil tvůrce je zdarma."
      >
        <Suspense fallback={<p className="text-sm text-mist">Načítám formulář…</p>}>
          <SignUpForm />
        </Suspense>
      </AuthPageShell>
    </LandingShell>
  );
}
