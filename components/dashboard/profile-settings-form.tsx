"use client";

import { useCallback, useEffect, useState, useTransition } from "react";
import { useRouter } from "next/navigation";

import { saveProfileSettings, saveMemberRole } from "@/app/dashboard/actions";
import { ProfileBadges } from "@/components/dashboard/profile-badges";
import { ProfileMarketplacePreview } from "@/components/dashboard/profile-marketplace-preview";
import { ProfileMediaHeader } from "@/components/dashboard/profile-media-header";
import { ProfileSettingsSection } from "@/components/dashboard/profile-settings-section";
import { Button } from "@/components/ui/button";
import { FormField } from "@/components/ui/form-field";
import { Input } from "@/components/ui/input";
import { FieldSelect } from "@/components/ui/field-select";
import { Textarea } from "@/components/ui/textarea";
import { MARKETPLACE_CATEGORIES } from "@/lib/dashboard/categories";
import { roleLabel } from "@/lib/dashboard/profile-display";
import type {
  DashboardBadge,
  MemberProfileRow,
} from "@/lib/dashboard/profile-types";
import type { MemberRole } from "@/lib/db/schema";
import { switcherActive } from "@/lib/ui-surfaces";
import { cn } from "@/lib/utils";

const BIO_MAX = 500;

type ProfileSettingsFormProps = {
  profile: MemberProfileRow;
  email: string;
  badges: DashboardBadge[];
};

type PreviewState = {
  displayName: string;
  bio: string;
  category: string;
  socialTiktok: string;
  socialInstagram: string;
  socialYoutube: string;
};

function readPreviewFromForm(form: HTMLFormElement): PreviewState {
  return {
    displayName: String(form.get("displayName") ?? ""),
    bio: String(form.get("bio") ?? ""),
    category: String(form.get("category") ?? "fitness"),
    socialTiktok: String(form.get("socialTiktok") ?? ""),
    socialInstagram: String(form.get("socialInstagram") ?? ""),
    socialYoutube: String(form.get("socialYoutube") ?? ""),
  };
}

function previewFromProfile(profile: MemberProfileRow): PreviewState {
  return {
    displayName: profile.displayName ?? "",
    bio: profile.bio ?? "",
    category: profile.category ?? "fitness",
    socialTiktok: profile.socialTiktok ?? "",
    socialInstagram: profile.socialInstagram ?? "",
    socialYoutube: profile.socialYoutube ?? "",
  };
}

export function ProfileSettingsForm({
  profile,
  email,
  badges,
}: ProfileSettingsFormProps) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [dirty, setDirty] = useState(false);
  const [formKey, setFormKey] = useState(0);
  const [bioLength, setBioLength] = useState((profile.bio ?? "").length);
  const [media, setMedia] = useState<{
    avatarUrl?: string;
    bannerUrl?: string;
  }>({});
  const [preview, setPreview] = useState<PreviewState>(() =>
    previewFromProfile(profile),
  );

  const saveBarOpen = dirty || pending || Boolean(error) || Boolean(message);

  useEffect(() => {
    if (!message) return;
    const timer = window.setTimeout(() => setMessage(null), 2800);
    return () => window.clearTimeout(timer);
  }, [message]);

  const portfolio = [...(profile.portfolioUrls ?? []), "", "", ""].slice(0, 3);

  const syncPreview = useCallback((form: HTMLFormElement) => {
    setPreview(readPreviewFromForm(form));
    setDirty(true);
  }, []);

  function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setMessage(null);
    const form = new FormData(e.currentTarget);
    const portfolioUrls = [0, 1, 2].map((i) =>
      String(form.get(`portfolio-${i}`) ?? "").trim(),
    );

    startTransition(async () => {
      const result = await saveProfileSettings(profile.slug, {
        displayName: String(form.get("displayName") ?? ""),
        bio: String(form.get("bio") ?? ""),
        category: String(form.get("category") ?? profile.category ?? "fitness"),
        socialTiktok: String(form.get("socialTiktok") ?? ""),
        socialInstagram: String(form.get("socialInstagram") ?? ""),
        socialYoutube: String(form.get("socialYoutube") ?? ""),
        portfolioUrls,
        avatarUrl: media.avatarUrl,
        bannerUrl: media.bannerUrl,
      });
      if (!result.ok) {
        setError(result.error);
        return;
      }
      setMessage("Změny uloženy.");
      setDirty(false);
      router.refresh();
    });
  }

  function discardChanges() {
    setFormKey((k) => k + 1);
    setDirty(false);
    setError(null);
    setMessage(null);
    setMedia({});
    setPreview(previewFromProfile(profile));
    setBioLength((profile.bio ?? "").length);
  }

  function onRoleChange(role: MemberRole) {
    startTransition(async () => {
      const result = await saveMemberRole(profile.slug, role);
      if (!result.ok) setError(result.error);
      else router.refresh();
    });
  }

  const previewProps = {
    profile,
    email,
    badges,
    ...preview,
    avatarUrl: media.avatarUrl ?? profile.avatarUrl,
    bannerUrl: media.bannerUrl ?? profile.bannerUrl,
  };

  return (
    <>
      <div className="lg:grid lg:grid-cols-[minmax(0,1fr)_minmax(280px,320px)] lg:items-start lg:gap-8">
        <div
          key={formKey}
          className={cn("space-y-6", saveBarOpen ? "pb-28 lg:pb-32" : "pb-6")}
        >
          <ProfileMediaHeader
            profile={profile}
            email={email}
            displayName={preview.displayName}
            onMediaChange={(next) => {
              setMedia((m) => ({ ...m, ...next }));
              setDirty(true);
            }}
            onDirty={() => setDirty(true)}
          />

          <div className="lg:hidden">
            <ProfileMarketplacePreview {...previewProps} />
          </div>

          <form
            id="profile-settings-form"
            className="space-y-6"
            onSubmit={onSubmit}
            onInput={(e) => syncPreview(e.currentTarget)}
          >
            <ProfileSettingsSection
              title="Typ účtu"
              description="Tvůrce nebo značka v tržišti."
            >
              <div className="flex flex-wrap gap-2">
                {(["creator", "brand"] as MemberRole[]).map((role) => (
                  <Button
                    key={role}
                    type="button"
                    variant="outline"
                    size="sm"
                    disabled={pending}
                    className={cn(profile.role === role && switcherActive)}
                    onClick={() => onRoleChange(role)}
                  >
                    {roleLabel(role)}
                  </Button>
                ))}
              </div>
            </ProfileSettingsSection>

            <ProfileSettingsSection
              title="Veřejný profil"
              description="Jméno, obor a bio na veřejném profilu."
            >
              <FormField label="Zobrazované jméno" htmlFor="displayName">
                <Input
                  id="displayName"
                  name="displayName"
                  defaultValue={profile.displayName ?? ""}
                  placeholder={
                    profile.role === "creator"
                      ? "Jana K."
                      : "Jméno / název značky"
                  }
                />
              </FormField>

              <FormField label="Obor" htmlFor="category">
                <FieldSelect
                  id="category"
                  name="category"
                  defaultValue={profile.category ?? "fitness"}
                  options={MARKETPLACE_CATEGORIES}
                  onValueChange={() => {
                    const el = document.getElementById(
                      "profile-settings-form",
                    ) as HTMLFormElement | null;
                    if (el) syncPreview(el);
                  }}
                />
              </FormField>

              <FormField label="Bio" htmlFor="bio">
                <div className="space-y-1.5">
                  <div className="flex justify-end">
                    <span
                      className={cn(
                        "text-[11px] tabular-nums text-mist",
                        bioLength > BIO_MAX && "text-error-soft",
                      )}
                    >
                      {bioLength}/{BIO_MAX}
                    </span>
                  </div>
                  <Textarea
                    id="bio"
                    name="bio"
                    rows={5}
                    maxLength={BIO_MAX}
                    defaultValue={profile.bio ?? ""}
                    className="min-h-[140px]"
                    placeholder={
                      profile.role === "creator"
                        ? "Kdo jsi, jaký obsah tvoříš a s jakými značkami chceš spolupracovat…"
                        : "Co děláte, koho hledáte a jak probíhá spolupráce…"
                    }
                    onChange={(e) => {
                      setBioLength(e.target.value.length);
                      setDirty(true);
                    }}
                  />
                </div>
              </FormField>
            </ProfileSettingsSection>

            {profile.role === "creator" ? (
              <ProfileSettingsSection
                title="Sociální sítě a portfolio"
                description="Sítě a odkazy na ukázky."
              >
                <div className="grid gap-4 sm:grid-cols-2">
                  <FormField label="TikTok" htmlFor="socialTiktok">
                    <Input
                      id="socialTiktok"
                      name="socialTiktok"
                      defaultValue={profile.socialTiktok ?? ""}
                      placeholder="@handle"
                    />
                  </FormField>
                  <FormField label="Instagram" htmlFor="socialInstagram">
                    <Input
                      id="socialInstagram"
                      name="socialInstagram"
                      defaultValue={profile.socialInstagram ?? ""}
                      placeholder="@handle"
                    />
                  </FormField>
                </div>
                <FormField label="YouTube" htmlFor="socialYoutube">
                  <Input
                    id="socialYoutube"
                    name="socialYoutube"
                    defaultValue={profile.socialYoutube ?? ""}
                    placeholder="@handle nebo kanál"
                  />
                </FormField>
                <div className="space-y-3 border-t border-white/[0.08] pt-4">
                  <p className="text-sm font-medium text-white">
                    Portfolio · ukázky práce
                  </p>
                  {portfolio.map((url, idx) => (
                    <FormField
                      key={idx}
                      label={`Odkaz ${idx + 1}`}
                      htmlFor={`portfolio-${idx}`}
                    >
                      <Input
                        id={`portfolio-${idx}`}
                        name={`portfolio-${idx}`}
                        type="url"
                        defaultValue={url}
                        placeholder="https://…"
                      />
                    </FormField>
                  ))}
                </div>
              </ProfileSettingsSection>
            ) : null}

            <ProfileSettingsSection
              title="Odznaky"
              description="Získané podle aktivity v tržišti."
            >
              <ProfileBadges badges={badges} />
            </ProfileSettingsSection>
          </form>
        </div>

        <aside className="hidden lg:block">
          <div className="sticky top-8 space-y-4">
            <ProfileMarketplacePreview {...previewProps} />
          </div>
        </aside>
      </div>

      {saveBarOpen ? (
        <div
          className={cn(
            "pointer-events-none fixed inset-x-0 bottom-0 z-40 flex justify-center px-4 pb-5 pt-3",
            "lg:pl-[248px]",
          )}
          role="region"
          aria-label="Uložení profilu"
        >
          <div
            className={cn(
              "pointer-events-auto flex w-full max-w-3xl flex-col gap-3 rounded-md border border-white/[0.12] bg-ink px-4 py-3",
              "shadow-[0_12px_48px_-12px_rgba(0,0,0,0.75)] sm:flex-row sm:items-center sm:justify-between sm:gap-4",
            )}
          >
            <p
              className={cn(
                "min-w-0 text-sm font-medium leading-snug",
                error
                  ? "text-error-soft"
                  : message
                    ? "text-cyan"
                    : "text-white",
              )}
              role={error ? "alert" : undefined}
            >
              {error
                ? error
                : message
                  ? message
                  : "Pozor, máš neuložené změny."}
            </p>
            <div className="flex shrink-0 items-center gap-2 sm:justify-end">
              {dirty && !pending ? (
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="text-mist hover:text-white"
                  onClick={discardChanges}
                >
                  Zahodit
                </Button>
              ) : null}
              <Button
                type="submit"
                form="profile-settings-form"
                size="sm"
                disabled={pending || (!dirty && !error)}
                className="min-w-[7.5rem]"
              >
                {pending ? "Ukládám…" : "Uložit změny"}
              </Button>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}
