"use client";

import { useEffect, useState, useTransition } from "react";
import { useRouter, useSearchParams } from "next/navigation";
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
        <p className="text-sm font-medium text-cyan" role="status">
          {flash}
        </p>
      ) : null}
      <ul className="space-y-3">
        {CREATOR_PLATFORM_IDS.map((platform) => {
          const enabled = configuredSet.has(platform);
          const connection = connectionByPlatform.get(platform);
          const label = creatorPlatformLabel(platform);
          const icon = platformIcons[platform];
          const busy = pending && unlinking === platform;

          return (
            <li
              key={platform}
              className={cn(
                "flex flex-col gap-3 rounded-sm border border-white/[0.08] bg-white/[0.02] px-4 py-3 sm:flex-row sm:items-center sm:justify-between",
              )}
            >
              <div className="flex min-w-0 items-center gap-3">
                <span
                  className="flex size-9 shrink-0 items-center justify-center rounded-sm bg-white/[0.06] text-white"
                  aria-hidden
                >
                  <SimpleIcon icon={icon} title={label} className="size-4" />
                </span>
                <div className="min-w-0">
                  <p className="text-sm font-medium text-white">{label}</p>
                  {connection ? (
                    <p className="truncate text-sm text-mist">
                      @{connection.username.replace(/^@/, "")}
                    </p>
                  ) : enabled ? (
                    <p className="text-sm text-mist">Není propojeno</p>
                  ) : (
                    <p className="text-sm text-mist">Brzy dostupné</p>
                  )}
                </div>
              </div>
              <div className="flex shrink-0 items-center gap-2">
                {!enabled ? (
                  <Button type="button" variant="outline" size="sm" disabled>
                    Propojit
                  </Button>
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
                  <Button asChild variant="outline" size="sm">
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
