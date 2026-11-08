import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { Suspense } from "react";

import { AuthPageShell } from "@/components/auth/auth-page-shell";
import { SignUpForm } from "@/components/auth/sign-up-form";
import { SiteShell } from "@/components/shared/site-shell";
import { getServerSession } from "@/lib/auth-session";
import { DASHBOARD_HOME_PATH } from "@/lib/dashboard-routes";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Registrace",
  description: "Vytvoř si účet na promobazar.cz",
};

export default async function RegisterPage() {
  const session = await getServerSession();
  if (session?.user) {
    redirect(DASHBOARD_HOME_PATH);
  }

  return (
    <SiteShell>
      <AuthPageShell
        title="Registrace"
        description="Zvol typ účtu a vyplň registrační formulář. Profil tvůrce je zdarma."
      >
        <Suspense fallback={<p className="text-sm text-mist">Načítám formulář…</p>}>
          <SignUpForm />
        </Suspense>
      </AuthPageShell>
    </SiteShell>
  );
}
