"use client";

import { ExternalLink, Eye } from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState, useTransition } from "react";

import {
  createCreatorPackage,
  updateCreatorPackage,
} from "@/app/dashboard/actions";
import { DashboardFeedbackFlash } from "@/components/dashboard/dashboard-feedback-flash";
import { PackageCardPreview } from "@/components/dashboard/package-card-preview";
import { PackageShowcaseField } from "@/components/dashboard/package-showcase-field";
import { PackagePreviewVideo } from "@/components/marketplace/package-preview-video";
import { ProfileSettingsSection } from "@/components/dashboard/profile-settings-section";
import { Button, buttonVariants } from "@/components/ui/button";
import { FieldSelect } from "@/components/ui/field-select";
import { FormField } from "@/components/ui/form-field";
import { Input } from "@/components/ui/input";
import { MarkdownTextarea } from "@/components/ui/markdown-textarea";
import {
  DELIVERY_OPTIONS,
  PACKAGE_FORMATS,
  PACKAGE_LICENSE_OPTIONS,
} from "@/lib/dashboard/categories";
import {
  DEFAULT_PACKAGE_EDITOR_VALUES,
  type PackagePreviewFields,
} from "@/lib/dashboard/package-display";
import {
  PackageStatusBadge,
  packageStatusDetail,
  packageStatusDotClass,
  packageStatusHeadline,
  packagePublicPreviewQuery,
} from "@/components/dashboard/package-status-badge";
import {
  dashboardPackageEditPath,
  dashboardPackagesListPath,
  packagePublicPath,
} from "@/lib/dashboard/package-paths";
import { packageSaveSuccessMessage } from "@/lib/dashboard/package-save-feedback";
import { surface } from "@/lib/ui-surfaces";
import { cn } from "@/lib/utils";
import type { creatorPackage, CreatorPackageStatus } from "@/lib/db/schema";

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
    previewVideoUrl: pkg.previewVideoUrl ?? "",
  };
}

export function CreatorPackageEditor({
  mode,
  packageId,
  initial,
  creatorSlug,
}: {
  mode: "create" | "edit";
  packageId?: string;
  initial?: PackageRow | null;
  creatorSlug: string;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [pending, startTransition] = useTransition();
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [fields, setFields] = useState<PackagePreviewFields>(() =>
    toEditorValues(initial),
  );
  const status = initial?.status ?? "draft";

  const feedbackOpen = pending || Boolean(message) || Boolean(error);

  useEffect(() => {
    if (!message) return;
    const timer = window.setTimeout(() => setMessage(null), 3200);
    return () => window.clearTimeout(timer);
  }, [message]);

  useEffect(() => {
    if (searchParams.get("ulozeno") !== "1") return;
    setMessage(packageSaveSuccessMessage("create", "draft", "draft"));
    setError(null);
    router.replace(pathname);
  }, [pathname, router, searchParams]);

  function patch<K extends keyof PackagePreviewFields>(
    key: K,
    value: PackagePreviewFields[K],
  ) {
    setFields((current) => ({ ...current, [key]: value }));
  }

  function save(nextStatus: CreatorPackageStatus) {
    const previousStatus = status;
    setError(null);
    setMessage(null);
    startTransition(async () => {
      const payload = { ...fields, status: nextStatus };

      if (mode === "edit" && packageId) {
        const result = await updateCreatorPackage(packageId, payload);
        if (!result.ok) {
          setError(result.error);
          return;
        }
        setMessage(
          packageSaveSuccessMessage("edit", previousStatus, nextStatus),
        );
        router.refresh();
        return;
      }

      const result = await createCreatorPackage(payload);
      if (!result.ok) {
        setError(result.error);
        return;
      }
      router.push(`${dashboardPackageEditPath(result.id)}?ulozeno=1`);
      router.refresh();
    });
  }

  function openLivePreview() {
    if (!packageId) {
      setError("Nejdřív ulož koncept. Náhled je až u existujícího balíčku.");
      return;
    }
    const href = packagePublicPath(
      creatorSlug,
      packageId,
      packagePublicPreviewQuery(status),
    );
    window.open(href, "_blank", "noopener,noreferrer");
  }

  return (
    <div
      className={cn(
        "min-w-0 xl:grid xl:grid-cols-[minmax(0,1fr)_17.5rem] xl:items-start xl:gap-8",
        feedbackOpen ? "pb-24 lg:pb-28" : undefined,
      )}
    >
      <div className="min-w-0 space-y-4">
        {mode === "edit" ? (
          <div
            className={cn(
              surface,
              "flex flex-col gap-4 px-5 py-4 sm:flex-row sm:items-center sm:justify-between md:px-6",
            )}
          >
            <div className="flex min-w-0 items-start gap-3">
              <span
                className={cn(
                  "mt-2 size-2 shrink-0 rounded-full",
                  packageStatusDotClass(status),
                )}
                aria-hidden
              />
              <div className="min-w-0 space-y-1">
                <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
                  <p className="font-display text-sm font-semibold text-white">
                    {packageStatusHeadline(status)}
                  </p>
                  <PackageStatusBadge status={status} />
                </div>
                <p className="text-sm leading-relaxed text-mist">
                  {packageStatusDetail(status)}
                </p>
              </div>
            </div>
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="w-full shrink-0 sm:w-auto"
              disabled={pending || !packageId}
              onClick={openLivePreview}
            >
              <Eye className="size-3.5" aria-hidden />
              Živý náhled
              <ExternalLink className="size-3" aria-hidden />
            </Button>
          </div>
        ) : (
          <p className="text-sm text-mist">
            Po prvním uložení uvidíš stav balíčku a živý náhled stránky gigu.
          </p>
        )}

        <form
          id="creator-package-editor"
          className="space-y-6"
          onSubmit={(event) => {
            event.preventDefault();
            save(status);
          }}
        >
          <ProfileSettingsSection
            title="Balíček"
            description="Název, cena, formát a popis, které uvidí zákazníci v tržišti."
          >
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

            <FormField
              label="Popis"
              htmlFor="description"
              hint="Markdown: nadpisy, seznamy, tučné, odkazy"
            >
              <MarkdownTextarea
                id="description"
                name="description"
                rows={8}
                required
                minLength={10}
                maxLength={2000}
                value={fields.description}
                onValueChange={(value) => patch("description", value)}
                placeholder="Co je v balíčku, co značka dostane, jak probíhá spolupráce…"
              />
            </FormField>
          </ProfileSettingsSection>

          <ProfileSettingsSection
            title="Ukázky"
            description="Galerie na stránce balíčku. Banner je náhled v gridu."
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
            <FormField
              label="Odkaz na ukázkové video"
              htmlFor="previewVideoUrl"
              hint="YouTube se na stránce balíčku přehraje přímo. Jiné hostitele otevřou odkaz."
            >
              <Input
                id="previewVideoUrl"
                name="previewVideoUrl"
                type="url"
                inputMode="url"
                maxLength={500}
                value={fields.previewVideoUrl}
                onChange={(event) =>
                  patch("previewVideoUrl", event.target.value)
                }
                placeholder="https://www.youtube.com/watch?v=…"
              />
            </FormField>
            {fields.previewVideoUrl.trim() ? (
              <PackagePreviewVideo url={fields.previewVideoUrl.trim()} />
            ) : null}
            <div className="border-t border-white/[0.08] pt-4 xl:hidden">
              <PackageCardPreview fields={fields} hideHeader showLivePreviewHint={false} />
            </div>
          </ProfileSettingsSection>

          <div className="flex flex-col gap-2 border-t border-white/[0.08] pt-4 sm:flex-row sm:flex-wrap sm:justify-end">
            <Link
              href={dashboardPackagesListPath()}
              className={cn(
                buttonVariants({ variant: "ghost" }),
                "w-full justify-center sm:mr-auto sm:w-auto",
              )}
            >
              Zpět na seznam
            </Link>
            <Button
              type="button"
              variant="outline"
              disabled={pending}
              className="w-full sm:w-auto"
              onClick={() => save(status)}
            >
              {pending
                ? "Ukládám…"
                : status === "draft"
                  ? "Uložit koncept"
                  : "Uložit"}
            </Button>
            {status === "published" ? (
              <Button
                type="button"
                variant="outline"
                disabled={pending}
                className="w-full sm:w-auto"
                onClick={() => save("private")}
              >
                {pending ? "Ukládám…" : "Deaktivovat"}
              </Button>
            ) : status === "private" ? (
              <Button
                type="button"
                disabled={pending}
                className="w-full sm:w-auto sm:min-w-[8rem]"
                onClick={() => save("published")}
              >
                {pending ? "Ukládám…" : "Znovu aktivovat"}
              </Button>
            ) : (
              <Button
                type="button"
                disabled={pending}
                className="w-full sm:w-auto sm:min-w-[8rem]"
                onClick={() => save("published")}
              >
                {pending ? "Ukládám…" : "Publikovat"}
              </Button>
            )}
          </div>
        </form>
      </div>

      <aside className="hidden min-w-0 xl:block">
        <div className="sticky top-8">
          <PackageCardPreview fields={fields} showLivePreviewHint />
        </div>
      </aside>

      <DashboardFeedbackFlash
        message={message}
        error={error}
        pending={pending}
        pendingLabel="Ukládám balíček…"
        ariaLabel="Uložení balíčku"
      />
    </div>
  );
}
