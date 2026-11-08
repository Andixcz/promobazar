"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Check, Mail } from "lucide-react";
import { siDiscord, siGoogle } from "simple-icons/icons";
import type { SimpleIcon as SimpleIconData } from "simple-icons";

import { SimpleIcon } from "@/components/auth/simple-icon";
import { ProfileSettingsSection } from "@/components/dashboard/profile-settings-section";
import { Button } from "@/components/ui/button";
import { authClient } from "@/lib/auth-client";
import type { SocialAuthProviderId } from "@/lib/auth-social";
import { dashboardPath } from "@/lib/dashboard-routes";
import { cn } from "@/lib/utils";

type LinkedAccount = {
  id: string;
  providerId: string;
};

type LoginMethodId = "credential" | SocialAuthProviderId;

const SOCIAL_ORDER: SocialAuthProviderId[] = ["google", "discord"];

const socialMeta: Record<
  SocialAuthProviderId,
  { label: string; icon: SimpleIconData }
> = {
  google: { label: "Google", icon: siGoogle },
  discord: { label: "Discord", icon: siDiscord },
};

function loginMethods(
  configuredSocialProviders: SocialAuthProviderId[],
  accounts: LinkedAccount[],
): LoginMethodId[] {
  const linkedSocial = new Set(
    accounts
      .map((account) => account.providerId)
      .filter((id): id is SocialAuthProviderId => id === "google" || id === "discord"),
  );
  const configured = new Set(configuredSocialProviders);
  const methods: LoginMethodId[] = ["credential"];
  for (const id of SOCIAL_ORDER) {
    if (configured.has(id) || linkedSocial.has(id)) {
      methods.push(id);
    }
  }
  return methods;
}

type AccountLoginMethodsProps = {
  email: string;
  hasCredential: boolean;
  accounts: LinkedAccount[];
  configuredSocialProviders: SocialAuthProviderId[];
};

export function AccountLoginMethods({
  email,
  hasCredential,
  accounts,
  configuredSocialProviders,
}: AccountLoginMethodsProps) {
  const router = useRouter();
  const settingsUrl = dashboardPath("nastaveni");
  const [pending, startTransition] = useTransition();
  const [unlinkingId, setUnlinkingId] = useState<string | null>(null);
  const [flash, setFlash] = useState<string | null>(null);
  const [linking, setLinking] = useState<SocialAuthProviderId | null>(null);

  const accountByProvider = new Map(
    accounts.map((account) => [account.providerId, account]),
  );
  const canUnlinkSocial = accounts.length > 1;
  const configuredSet = new Set(configuredSocialProviders);
  const methods = loginMethods(configuredSocialProviders, accounts);

  async function onLink(provider: SocialAuthProviderId) {
    setFlash(null);
    setLinking(provider);
    const callbackURL =
      typeof window !== "undefined"
        ? `${window.location.origin}${settingsUrl}`
        : settingsUrl;
    const { error } = await authClient.linkSocial({
      provider,
      callbackURL,
    });
    setLinking(null);
    if (error) {
      setFlash(error.message ?? "Propojení přihlášení se nezdařilo.");
      return;
    }
    router.refresh();
  }

  function onUnlink(accountId: string, label: string) {
    setFlash(null);
    setUnlinkingId(accountId);
    startTransition(async () => {
      const { error } = await authClient.unlinkAccount({ accountId });
      setUnlinkingId(null);
      if (error) {
        setFlash(error.message ?? "Odpojení se nezdařilo.");
        return;
      }
      setFlash(`${label} přihlášení bylo odpojené.`);
      router.refresh();
    });
  }

  return (
    <ProfileSettingsSection
      title="Přihlášení"
      description="Způsoby, jak se přihlašuješ k účtu."
    >
      {configuredSocialProviders.length === 0 ? (
        <p className="text-sm leading-relaxed text-mist">
          Kromě e-mailu zatím nemáš k dispozici další přihlášení přes síť.
        </p>
      ) : null}
      {flash ? (
        <p
          className="rounded-lg border border-cyan/25 bg-cyan/10 px-3 py-2.5 text-sm leading-relaxed text-zinc-200"
          role="status"
        >
          {flash}
        </p>
      ) : null}
      <ul className="space-y-2">
        {methods.map((method) => {
          if (method === "credential") {
            const connected = hasCredential;
            return (
              <li
                key="credential"
                className={cn(
                  "flex flex-col gap-3 rounded-lg border px-4 py-3.5 sm:flex-row sm:items-center sm:justify-between",
                  connected
                    ? "border-cyan/30 bg-cyan/[0.06]"
                    : "border-white/[0.08] bg-white/[0.02]",
                )}
              >
                <div className="flex min-w-0 items-center gap-3">
                  <span
                    className={cn(
                      "flex size-10 shrink-0 items-center justify-center rounded-lg",
                      connected
                        ? "bg-cyan/15 text-cyan"
                        : "bg-white/[0.06] text-white",
                    )}
                    aria-hidden
                  >
                    <Mail className="size-[18px]" strokeWidth={2} />
                  </span>
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <p className="text-sm font-medium text-white">E-mail a heslo</p>
                      {connected ? (
                        <span className="inline-flex items-center gap-1 rounded-sm bg-cyan/15 px-1.5 py-0.5 text-[10px] font-medium uppercase tracking-wide text-cyan">
                          <Check className="size-3" strokeWidth={2.5} aria-hidden />
                          Propojeno
                        </span>
                      ) : null}
                    </div>
                    {connected ? (
                      <p className="truncate text-sm text-zinc-200">{email}</p>
                    ) : (
                      <p className="text-sm text-mist">
                        Zatím bez hesla. Nastav ho v sekci níže.
                      </p>
                    )}
                  </div>
                </div>
              </li>
            );
          }

          const { label, icon } = socialMeta[method];
          const linked = accountByProvider.get(method);
          const enabled = configuredSet.has(method);
          const busy =
            (pending && linked && unlinkingId === linked.id) || linking === method;
          const state = linked ? "connected" : enabled ? "available" : "soon";

          return (
            <li
              key={method}
              className={cn(
                "flex flex-col gap-3 rounded-lg border px-4 py-3.5 sm:flex-row sm:items-center sm:justify-between",
                state === "connected" && "border-cyan/30 bg-cyan/[0.06]",
                state === "available" && "border-white/[0.08] bg-white/[0.02]",
                state === "soon" && "border-white/[0.05] bg-white/[0.015]",
              )}
            >
              <div className="flex min-w-0 items-center gap-3">
                <span
                  className={cn(
                    "flex size-10 shrink-0 items-center justify-center rounded-lg",
                    state === "connected" && "bg-cyan/15 text-cyan",
                    state === "available" && "bg-white/[0.06] text-white",
                    state === "soon" && "bg-white/[0.04] text-mist/55",
                  )}
                  aria-hidden
                >
                  <SimpleIcon icon={icon} title={label} className="size-[18px]" />
                </span>
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <p className="text-sm font-medium text-white">{label}</p>
                    {state === "connected" ? (
                      <span className="inline-flex items-center gap-1 rounded-sm bg-cyan/15 px-1.5 py-0.5 text-[10px] font-medium uppercase tracking-wide text-cyan">
                        <Check className="size-3" strokeWidth={2.5} aria-hidden />
                        Propojeno
                      </span>
                    ) : null}
                  </div>
                  {state === "connected" ? (
                    <p className="text-sm text-zinc-200">Přihlášení přes {label}</p>
                  ) : state === "available" ? (
                    <p className="text-sm text-mist">Zatím nepropojeno</p>
                  ) : (
                    <p className="text-sm text-mist/80">Připravujeme</p>
                  )}
                </div>
              </div>
              <div className="flex shrink-0 items-center sm:pl-2">
                {state === "soon" ? (
                  <span className="text-xs text-mist/70">Není k dispozici</span>
                ) : linked ? (
                  canUnlinkSocial ? (
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      disabled={busy}
                      onClick={() => onUnlink(linked.id, label)}
                    >
                      {busy ? "Odpojuji…" : "Odpojit"}
                    </Button>
                  ) : (
                    <span className="max-w-[12rem] text-right text-xs leading-snug text-mist">
                      Poslední způsob přihlášení nelze odpojit
                    </span>
                  )
                ) : (
                  <Button
                    type="button"
                    size="sm"
                    disabled={busy}
                    onClick={() => onLink(method)}
                  >
                    {busy ? "Přesměrovávám…" : "Propojit"}
                  </Button>
                )}
              </div>
            </li>
          );
        })}
      </ul>
    </ProfileSettingsSection>
  );
}
