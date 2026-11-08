"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

import { AccountLoginMethods } from "@/components/dashboard/account-login-methods";
import { ProfileSettingsSection } from "@/components/dashboard/profile-settings-section";
import { Button } from "@/components/ui/button";
import { FormField } from "@/components/ui/form-field";
import { Input } from "@/components/ui/input";
import { authClient } from "@/lib/auth-client";
import type { SocialAuthProviderId } from "@/lib/auth-social";
import { AUTH_FORGOT_PASSWORD_PATH } from "@/lib/auth-routes";
import { dashboardPath } from "@/lib/dashboard-routes";
import { LANDING_FIRMS_PATH } from "@/lib/landing-routes";
import { cn } from "@/lib/utils";

type AccountSettingsPanelProps = {
  email: string;
  emailVerified: boolean;
  hasCredential: boolean;
  accounts: { id: string; providerId: string }[];
  configuredSocialProviders: SocialAuthProviderId[];
  deleteBlockReason?: string | null;
};

export function AccountSettingsPanel({
  email,
  emailVerified,
  hasCredential,
  accounts,
  configuredSocialProviders,
  deleteBlockReason = null,
}: AccountSettingsPanelProps) {
  const router = useRouter();
  const settingsUrl = dashboardPath("nastaveni");

  const [newEmail, setNewEmail] = useState("");
  const [emailMessage, setEmailMessage] = useState<string | null>(null);
  const [emailError, setEmailError] = useState<string | null>(null);
  const [emailPending, setEmailPending] = useState(false);

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [revokeOtherSessions, setRevokeOtherSessions] = useState(true);
  const [passwordMessage, setPasswordMessage] = useState<string | null>(null);
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [passwordPending, setPasswordPending] = useState(false);

  const [deletePassword, setDeletePassword] = useState("");
  const [deleteError, setDeleteError] = useState<string | null>(null);
  const [deleteMessage, setDeleteMessage] = useState<string | null>(null);
  const [deletePending, setDeletePending] = useState(false);

  const [verifyPending, setVerifyPending] = useState(false);

  async function onResendVerification() {
    setVerifyPending(true);
    setEmailError(null);
    const callbackURL =
      typeof window !== "undefined"
        ? `${window.location.origin}${settingsUrl}`
        : settingsUrl;
    const { error } = await authClient.sendVerificationEmail({
      email,
      callbackURL,
    });
    setVerifyPending(false);
    if (error) {
      setEmailError(error.message ?? "Ověřovací e-mail se neodeslal.");
      return;
    }
    setEmailMessage("Ověřovací e-mail jsme poslali znovu. Zkontroluj schránku.");
  }

  async function onChangeEmail(e: React.FormEvent) {
    e.preventDefault();
    setEmailError(null);
    setEmailMessage(null);
    setEmailPending(true);

    const callbackURL =
      typeof window !== "undefined"
        ? `${window.location.origin}${settingsUrl}`
        : settingsUrl;

    const { error } = await authClient.changeEmail({
      newEmail: newEmail.trim(),
      callbackURL,
    });

    setEmailPending(false);
    if (error) {
      setEmailError(error.message ?? "Změnu e-mailu se nepodařilo zahájit.");
      return;
    }
    setNewEmail("");
    setEmailMessage(
      "Poslali jsme e-maily s potvrzením. Dokonči změnu podle instrukcí v obou schránkách.",
    );
    router.refresh();
  }

  async function onChangePassword(e: React.FormEvent) {
    e.preventDefault();
    setPasswordError(null);
    setPasswordMessage(null);
    setPasswordPending(true);

    const { error } = await authClient.changePassword({
      currentPassword,
      newPassword,
      revokeOtherSessions,
    });

    setPasswordPending(false);
    if (error) {
      setPasswordError(error.message ?? "Heslo se nepodařilo změnit.");
      return;
    }
    setCurrentPassword("");
    setNewPassword("");
    setPasswordMessage("Heslo je uložené. Na e-mail jsme poslali potvrzení.");
  }

  async function onDeleteAccount(e: React.FormEvent) {
    e.preventDefault();
    if (deleteBlockReason) {
      return;
    }
    setDeleteError(null);
    setDeleteMessage(null);
    setDeletePending(true);

    const callbackURL =
      typeof window !== "undefined" ? `${window.location.origin}${LANDING_FIRMS_PATH}` : "/";

    const { error } = await authClient.deleteUser({
      callbackURL,
      ...(hasCredential ? { password: deletePassword } : {}),
    });

    setDeletePending(false);
    if (error) {
      setDeleteError(error.message ?? "Smazání účtu se nepodařilo zahájit.");
      return;
    }
    setDeletePassword("");
    setDeleteMessage(
      "Poslali jsme e-mail s odkazem na potvrzení smazání účtu. Dokud ho nepotvrdíš, účet zůstává aktivní.",
    );
  }

  return (
    <div className="space-y-8">
      <AccountLoginMethods
        email={email}
        hasCredential={hasCredential}
        accounts={accounts}
        configuredSocialProviders={configuredSocialProviders}
      />

      <ProfileSettingsSection title="E-mail" description="Adresa pro přihlášení.">
        {!emailVerified ? (
          <div
            className="rounded-md border border-cyan/30 bg-cyan/10 px-4 py-3 text-sm text-zinc-200"
            role="status"
          >
            <p>E-mail zatím není ověřený. Bez ověření nemusí fungovat všechny funkce účtu.</p>
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="mt-3"
              disabled={verifyPending}
              onClick={onResendVerification}
            >
              {verifyPending ? "Odesílám…" : "Poslat ověřovací e-mail znovu"}
            </Button>
          </div>
        ) : null}

        <form className="space-y-4" onSubmit={onChangeEmail}>
          <FormField label="Aktuální e-mail" htmlFor="account-email-current">
            <Input
              id="account-email-current"
              type="email"
              value={email}
              disabled
              readOnly
            />
          </FormField>
          <FormField label="Nový e-mail" htmlFor="account-email-new">
            <Input
              id="account-email-new"
              type="email"
              placeholder="novy@email.cz"
              autoComplete="email"
              required
              value={newEmail}
              onChange={(e) => setNewEmail(e.target.value)}
            />
          </FormField>
          {emailError ? (
            <p className="text-sm text-destructive" role="alert">{emailError}</p>
          ) : null}
          {emailMessage ? (
            <p className="text-sm text-cyan" role="status">{emailMessage}</p>
          ) : null}
          <div className="flex justify-end border-t border-white/[0.08] pt-4">
            <Button type="submit" variant="outline" size="sm" disabled={emailPending}>
              {emailPending ? "Odesílám…" : "Ověřit změnu"}
            </Button>
          </div>
        </form>
      </ProfileSettingsSection>

      <ProfileSettingsSection title="Heslo" description="Přihlášení e-mailem.">
        {hasCredential ? (
          <form className="space-y-4" onSubmit={onChangePassword}>
            <FormField label="Aktuální heslo" htmlFor="account-password-current">
              <Input
                id="account-password-current"
                type="password"
                autoComplete="current-password"
                required
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
              />
            </FormField>
            <FormField label="Nové heslo" htmlFor="account-password-new">
              <Input
                id="account-password-new"
                type="password"
                autoComplete="new-password"
                required
                minLength={8}
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
              />
            </FormField>
            <div className="flex items-center gap-2">
              <input
                id="account-revoke-sessions"
                type="checkbox"
                checked={revokeOtherSessions}
                onChange={(e) => setRevokeOtherSessions(e.target.checked)}
                className="size-4 rounded border-white/20 bg-panel accent-cyan"
              />
              <label htmlFor="account-revoke-sessions" className="text-sm text-mist">
                Odhlásit ostatní zařízení
              </label>
            </div>
            {passwordError ? (
              <p className="text-sm text-destructive" role="alert">{passwordError}</p>
            ) : null}
            {passwordMessage ? (
              <p className="text-sm text-cyan" role="status">{passwordMessage}</p>
            ) : null}
            <div className="flex flex-wrap items-center justify-between gap-3 border-t border-white/[0.08] pt-4">
              <Link
                href={AUTH_FORGOT_PASSWORD_PATH}
                className="text-xs font-medium text-mist hover:text-cyan"
              >
                Zapomenuté heslo?
              </Link>
              <Button type="submit" variant="outline" size="sm" disabled={passwordPending}>
                {passwordPending ? "Ukládám…" : "Změnit heslo"}
              </Button>
            </div>
          </form>
        ) : (
          <div className="space-y-3 text-sm text-zinc-200">
            <p>
              K účtu nemáš nastavené heslo (přihlašuješ se jinak). Nové heslo si nastavíš
              přes zapomenuté heslo na e-mail účtu.
            </p>
            <Link
              href={AUTH_FORGOT_PASSWORD_PATH}
              className="inline-flex text-sm font-medium text-cyan hover:text-cyan/85"
            >
              Nastavit heslo přes e-mail
            </Link>
          </div>
        )}
      </ProfileSettingsSection>

      <ProfileSettingsSection
        title="Smazání účtu"
        description="Trvalé odstranění profilu a dat. Akce nejde vrátit."
      >
        <form
          className={cn(
            "space-y-4 rounded-xl border border-rose/25 bg-rose/[0.06] p-5",
          )}
          onSubmit={onDeleteAccount}
        >
          <p className="text-sm text-zinc-200">
            Po potvrzení v e-mailu se účet smaže včetně profilu v tržišti.
          </p>
          {deleteBlockReason ? (
            <p className="text-sm text-rose" role="alert">
              {deleteBlockReason}
              {deleteBlockReason.includes("objednávk") ? (
                <>
                  {" "}
                  <Link
                    href={dashboardPath("objednavky")}
                    className="font-medium text-rose underline underline-offset-2 hover:text-rose/85"
                  >
                    Objednávky
                  </Link>
                </>
              ) : null}
            </p>
          ) : null}
          {hasCredential ? (
            <FormField label="Heslo pro potvrzení" htmlFor="account-delete-password">
              <Input
                id="account-delete-password"
                type="password"
                autoComplete="current-password"
                required
                value={deletePassword}
                onChange={(e) => setDeletePassword(e.target.value)}
              />
            </FormField>
          ) : (
            <p className="text-sm text-mist">
              Přihlašuješ se přes Google nebo Discord? Klikni na Smazat účet. Na{" "}
              <span className="text-zinc-200">{email}</span> pošleme odkaz k potvrzení. Heslo
              nepotřebuješ.
            </p>
          )}
          {deleteError ? (
            <p className="text-sm text-rose" role="alert">
              {deleteError}
            </p>
          ) : null}
          {deleteMessage ? (
            <p className="text-sm text-cyan" role="status">{deleteMessage}</p>
          ) : null}
          <div className="flex justify-end border-t border-rose/15 pt-4">
            <Button
              type="submit"
              variant="destructive"
              size="sm"
              disabled={
                Boolean(deleteBlockReason) ||
                deletePending ||
                (hasCredential && deletePassword.trim().length === 0)
              }
            >
              {deletePending ? "Odesílám…" : "Smazat účet"}
            </Button>
          </div>
        </form>
      </ProfileSettingsSection>
    </div>
  );
}
