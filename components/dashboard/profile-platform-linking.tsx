"use client";

import { useEffect, useState, useTransition } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Check } from "lucide-react";
import {
  siInstagram,
  siKick,
  siTiktok,
  siTwitch,
  siYoutube,
} from "simple-icons/icons";
import type { SimpleIcon as SimpleIconData } from "simple-icons";

import { disconnectCreatorPlatform } from "@/app/dashboard/actions";
import { SimpleIcon } from "@/components/auth/simple-icon";
import { ProfileSettingsSection } from "@/components/dashboard/profile-settings-section";
import { Button } from "@/components/ui/button";
import {
  CREATOR_PLATFORM_IDS,
  type CreatorPlatformId,
  type PlatformConnectionSummary,
  creatorPlatformLabel,
  isCreatorPlatformId,
  platformConnectApiPath,
} from "@/lib/dashboard/creator-platform";
import { cn } from "@/lib/utils";

const platformIcons: Record<CreatorPlatformId, SimpleIconData> = {
  twitch: siTwitch,
  kick: siKick,
  tiktok: siTiktok,
  instagram: siInstagram,
  youtube: siYoutube,
};

const LINK_ERROR_MESSAGES: Record<string, string> = {
  neplatna_platforma: "Tuto síť teď nelze propojit.",
  provider_neni_nastaven: "Propojení této sítě zatím není aktivní.",
  zruseno: "Propojení jsi zrušil u poskytovatele.",
  neplatny_stav: "Platnost odkazu vypršela. Zkus propojit znovu.",
  propojeni_se_nezdarilo:
    "Účet se nepodařilo propojit. Zkontroluj přihlášení u sítě a zkus to znovu.",
};

type ProfilePlatformLinkingProps = {
  configuredPlatforms: CreatorPlatformId[];
  connections: PlatformConnectionSummary[];
};

function platformRowState(
  enabled: boolean,
  connection: PlatformConnectionSummary | undefined,
) {
  if (connection) return "connected" as const;
  if (enabled) return "available" as const;
  return "soon" as const;
}

export function ProfilePlatformLinking({
  configuredPlatforms,
  connections,
}: ProfilePlatformLinkingProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [pending, startTransition] = useTransition();
  const [flash, setFlash] = useState<string | null>(null);
  const [unlinking, setUnlinking] = useState<CreatorPlatformId | null>(null);

  const connectionByPlatform = new Map(
    connections.map((c) => [c.platform, c]),
  );

  useEffect(() => {
    const linked = searchParams.get("platform_linked");
    const linkError = searchParams.get("platform_link_error");
    if (linked && isCreatorPlatformId(linked)) {
      setFlash(
        `${creatorPlatformLabel(linked)} účet je propojený.`,
      );
      router.replace("/dashboard/profil", { scroll: false });
    } else if (linkError) {
      setFlash(
        LINK_ERROR_MESSAGES[linkError] ??
          "Propojení účtu se nezdařilo.",
      );
      router.replace("/dashboard/profil", { scroll: false });
    }
  }, [searchParams, router]);

  useEffect(() => {
    if (!flash) return;
    const timer = window.setTimeout(() => setFlash(null), 4000);
    return () => window.clearTimeout(timer);
  }, [flash]);

  const configuredSet = new Set(configuredPlatforms);

  function onDisconnect(platform: CreatorPlatformId) {
    setUnlinking(platform);
    startTransition(async () => {
      const result = await disconnectCreatorPlatform(platform);
      setUnlinking(null);
      if (!result.ok) {
        setFlash(result.error);
        return;
      }
      setFlash(`${creatorPlatformLabel(platform)} účet byl odpojený.`);
      router.refresh();
    });
  }

  return (
    <ProfileSettingsSection
      title="Propojené účty"
      description="Jedním klikem doplníš handle do profilu."
    >
      {configuredPlatforms.length === 0 ? (
        <p className="text-sm leading-relaxed text-mist">
          Propojení přes síť zatím není dostupné.
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
        {CREATOR_PLATFORM_IDS.map((platform) => {
          const enabled = configuredSet.has(platform);
          const connection = connectionByPlatform.get(platform);
          const label = creatorPlatformLabel(platform);
          const icon = platformIcons[platform];
          const busy = pending && unlinking === platform;
          const state = platformRowState(enabled, connection);

          return (
            <li
              key={platform}
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
                  {connection ? (
                    <p className="truncate text-sm text-zinc-200">
                      @{connection.username.replace(/^@/, "")}
                    </p>
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
                ) : connection ? (
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    disabled={busy}
                    onClick={() => onDisconnect(platform)}
                  >
                    {busy ? "Odpojuji…" : "Odpojit"}
                  </Button>
                ) : (
                  <Button asChild size="sm">
                    <a href={platformConnectApiPath(platform)}>Propojit</a>
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
