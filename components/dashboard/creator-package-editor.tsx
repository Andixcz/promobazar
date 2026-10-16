"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";

import {
  createCreatorPackage,
  updateCreatorPackage,
} from "@/app/dashboard/actions";
import { PackageCardPreview } from "@/components/dashboard/package-card-preview";
import { PackageShowcaseField } from "@/components/dashboard/package-showcase-field";
import { ProfileSettingsSection } from "@/components/dashboard/profile-settings-section";
import { Button, buttonVariants } from "@/components/ui/button";
import { FieldSelect } from "@/components/ui/field-select";
import { FormField } from "@/components/ui/form-field";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  DELIVERY_OPTIONS,
  PACKAGE_FORMATS,
  PACKAGE_LICENSE_OPTIONS,
} from "@/lib/dashboard/categories";
import {
  DEFAULT_PACKAGE_EDITOR_VALUES,
  type PackagePreviewFields,
} from "@/lib/dashboard/package-display";
import { dashboardPackagesListPath } from "@/lib/dashboard/package-paths";
import { cn } from "@/lib/utils";
import type { creatorPackage } from "@/lib/db/schema";

type PackageRow = typeof creatorPackage.$inferSelect;

function toEditorValues(pkg?: PackageRow | null): PackagePreviewFields {
  if (!pkg) return { ...DEFAULT_PACKAGE_EDITOR_VALUES };
  return {
    name: pkg.name,
    format: pkg.format,
    deliveryDays: pkg.deliveryDays,
    revisions: pkg.revisions,
    licenseDays: pkg.licenseDays,
    priceCzk: pkg.priceCzk,
    description: pkg.description,
    showcaseUrls: pkg.showcaseUrls ?? [],
    bannerUrl: pkg.bannerUrl ?? null,
  };
}

export function CreatorPackageEditor({
  mode,
  packageId,
  initial,
}: {
  mode: "create" | "edit";
  packageId?: string;
  initial?: PackageRow | null;
}) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [fields, setFields] = useState<PackagePreviewFields>(() =>
    toEditorValues(initial),
  );

  function patch<K extends keyof PackagePreviewFields>(
    key: K,
    value: PackagePreviewFields[K],
  ) {
    setFields((current) => ({ ...current, [key]: value }));
  }

  function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);

    startTransition(async () => {
      const result =
        mode === "edit" && packageId
          ? await updateCreatorPackage(packageId, fields)
          : await createCreatorPackage(fields);

      if (!result.ok) {
        setError(result.error);
        return;
      }

      router.push(dashboardPackagesListPath());
      router.refresh();
    });
  }

  const saveLabel =
    mode === "edit"
      ? pending
        ? "Ukládám…"
        : "Uložit změny"
      : pending
        ? "Vytvářím…"
        : "Přidat balíček";

  const sectionDescription =
    mode === "edit"
      ? "Změny uvidí značky hned. Už zaplacené objednávky si drží původní cenu a název."
      : "Zobrazí se na tvém veřejném profilu v tržišti.";

  return (
    <div
      className="min-w-0 xl:grid xl:grid-cols-[minmax(0,1fr)_17.5rem] xl:items-start xl:gap-8"
    >
      <div className="min-w-0">
        <form
          id="creator-package-editor"
          className="space-y-6"
          onSubmit={onSubmit}
        >
          <ProfileSettingsSection title="Balíček" description={sectionDescription}>
            <FormField label="Název" htmlFor="pkg-name">
              <Input
                id="pkg-name"
                name="name"
                required
                minLength={3}
                maxLength={120}
                value={fields.name}
                onChange={(event) => patch("name", event.target.value)}
                placeholder="Instagram Reel balíček"
              />
            </FormField>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <FormField label="Formát" htmlFor="format">
                <FieldSelect
                  id="format"
                  name="format"
                  value={fields.format}
                  options={PACKAGE_FORMATS}
                  onValueChange={(value) => patch("format", value)}
                />
              </FormField>
              <FormField label="Doručení" htmlFor="deliveryDays">
                <FieldSelect
                  id="deliveryDays"
                  name="deliveryDays"
                  value={String(fields.deliveryDays)}
                  options={DELIVERY_OPTIONS.map((d) => ({
                    value: String(d.value),
                    label: d.label,
                  }))}
                  onValueChange={(value) => patch("deliveryDays", Number(value))}
                />
              </FormField>
            </div>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <FormField label="Revize" htmlFor="revisions">
                <Input
                  id="revisions"
                  name="revisions"
                  type="number"
                  min={0}
                  max={5}
                  required
                  value={fields.revisions}
                  onChange={(event) =>
                    patch("revisions", Number(event.target.value))
                  }
                />
              </FormField>
              <FormField label="Cena (Kč)" htmlFor="priceCzk">
                <Input
                  id="priceCzk"
                  name="priceCzk"
                  type="number"
                  min={100}
                  max={500000}
                  step={1}
                  required
                  value={fields.priceCzk || ""}
                  onChange={(event) =>
                    patch("priceCzk", Number(event.target.value))
                  }
                  placeholder="2500"
                />
              </FormField>
            </div>

            <FormField label="Licence pro reklamu" htmlFor="licenseDays">
              <FieldSelect
                id="licenseDays"
                name="licenseDays"
                value={fields.licenseDays}
                options={PACKAGE_LICENSE_OPTIONS}
                onValueChange={(value) => patch("licenseDays", value)}
              />
            </FormField>

            <FormField label="Popis" htmlFor="description">
              <Textarea
                id="description"
                name="description"
                rows={4}
                required
                minLength={10}
                maxLength={2000}
                value={fields.description}
                onChange={(event) => patch("description", event.target.value)}
                className="min-h-[88px]"
                placeholder="Co je v balíčku, práva k reklamě…"
              />
            </FormField>

          </ProfileSettingsSection>

          <ProfileSettingsSection
            title="Ukázky"
            description="Fotky do galerie balíčku. Banner je hlavní obrázek na kartě v tržišti."
          >
            <PackageShowcaseField
              showcaseUrls={fields.showcaseUrls}
              bannerUrl={fields.bannerUrl}
              disabled={pending}
              onChange={({ showcaseUrls, bannerUrl }) => {
                setFields((current) => ({
                  ...current,
                  showcaseUrls,
                  bannerUrl,
                }));
              }}
            />
            <div className="border-t border-white/[0.08] pt-4 xl:hidden">
              <p className="mb-3 text-[11px] font-medium uppercase tracking-wide text-mist">
                Náhled v tržišti
              </p>
              <PackageCardPreview fields={fields} hideHeader />
            </div>
          </ProfileSettingsSection>

          {error ? (
            <p className="text-sm text-destructive" role="alert">{error}</p>
          ) : null}

          <div
            className="flex flex-col-reverse gap-2 border-t border-white/[0.08] pt-4 sm:flex-row sm:justify-end"
          >
            <Link
              href={dashboardPackagesListPath()}
              className={cn(
                buttonVariants({ variant: "ghost" }),
                "w-full justify-center sm:w-auto",
              )}
            >
              Zrušit
            </Link>
            <Button
              type="submit"
              disabled={pending}
              className="w-full sm:w-auto sm:min-w-[8rem]"
            >
              {saveLabel}
            </Button>
          </div>
        </form>
      </div>

      <aside className="hidden min-w-0 xl:block">
        <div className="sticky top-8">
          <PackageCardPreview fields={fields} />
        </div>
      </aside>
    </div>
  );
}
