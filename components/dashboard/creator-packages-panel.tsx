"use client";

import { Package, Plus, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";

import {
  createCreatorPackage,
  deleteCreatorPackage,
} from "@/app/dashboard/actions";
import { Button } from "@/components/ui/button";
import { FormField } from "@/components/ui/form-field";
import { Input } from "@/components/ui/input";
import { Modal } from "@/components/ui/modal";
import { FieldSelect } from "@/components/ui/field-select";
import { Textarea } from "@/components/ui/textarea";
import {
  DELIVERY_OPTIONS,
  PACKAGE_FORMATS,
  PACKAGE_LICENSE_OPTIONS,
} from "@/lib/dashboard/categories";
import type { MemberProfileRow } from "@/lib/dashboard/profile-types";
import { resultCount, surface } from "@/lib/ui-surfaces";
import { cn } from "@/lib/utils";
import type { creatorPackage } from "@/lib/db/schema";

type PackageRow = typeof creatorPackage.$inferSelect;

export function CreatorPackagesPanel({
  profile,
  packages,
}: {
  profile: MemberProfileRow;
  packages: PackageRow[];
}) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);

  function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    const form = new FormData(e.currentTarget);
    startTransition(async () => {
      const result = await createCreatorPackage(profile.slug, {
        name: String(form.get("name") ?? ""),
        format: String(form.get("format") ?? "tiktok"),
        deliveryDays: Number(form.get("deliveryDays") ?? 7),
        revisions: Number(form.get("revisions") ?? 1),
        licenseDays: String(form.get("licenseDays") ?? "30"),
        priceCzk: Number(form.get("priceCzk") ?? 0),
        description: String(form.get("description") ?? ""),
      });
      if (!result.ok) {
        setError(result.error);
        return;
      }
      e.currentTarget.reset();
      setDialogOpen(false);
      router.refresh();
    });
  }

  function onDelete(id: string) {
    startTransition(async () => {
      await deleteCreatorPackage(profile.slug, id);
      router.refresh();
    });
  }

  return (
    <div className="space-y-0">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <span className={resultCount}>
          {packages.length === 0
            ? "Žádné balíčky"
            : `${packages.length} ${packages.length === 1 ? "balíček" : "balíčků"}`}
        </span>
        <Button type="button" size="sm" onClick={() => setDialogOpen(true)}>
          <Plus className="size-4" aria-hidden />
          Nový balíček
        </Button>
      </div>

      <div className={cn(surface, "mt-5 overflow-hidden")}>
        {packages.length === 0 ? (
          <div className="flex flex-col items-center px-6 py-16 text-center">
            <div className="mb-4 flex size-11 items-center justify-center rounded-sm border border-white/[0.1] bg-white/[0.03] text-mist">
              <Package className="size-5" strokeWidth={1.5} aria-hidden />
            </div>
            <p className="font-display text-base font-semibold text-white">
              Zatím nemáš žádné balíčky
            </p>
            <p className="mt-2 max-w-sm text-sm leading-relaxed text-mist">
              Přidej nabídku s cenou a formátem — značky ji uvidí na tvém profilu v tržišti.
            </p>
            <Button
              type="button"
              className="mt-6"
              size="sm"
              onClick={() => setDialogOpen(true)}
            >
              <Plus className="size-4" aria-hidden />
              Vytvořit balíček
            </Button>
          </div>
        ) : (
          <ul className="divide-y divide-white/[0.08]">
            {packages.map((pkg) => (
              <li
                key={pkg.id}
                className="flex items-start gap-3 px-5 py-4 transition-colors hover:bg-white/[0.02] md:px-6"
              >
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-start justify-between gap-2">
                    <p className="font-medium text-white">{pkg.name}</p>
                    <p className="text-sm font-semibold tabular-nums text-white">
                      {pkg.priceCzk.toLocaleString("cs-CZ")} Kč
                    </p>
                  </div>
                  <p className="mt-1 line-clamp-2 text-sm leading-relaxed text-zinc-200">
                    {pkg.description}
                  </p>
                  <p className="mt-2 text-xs text-mist">
                    {pkg.revisions} {pkg.revisions === 1 ? "revize" : "revize"}
                  </p>
                </div>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="shrink-0 text-mist hover:text-white"
                  disabled={pending}
                  onClick={() => onDelete(pkg.id)}
                  aria-label="Smazat balíček"
                >
                  <Trash2 className="size-4" />
                </Button>
              </li>
            ))}
          </ul>
        )}
      </div>

      <Modal
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        contentClassName="sm:max-w-lg"
        title="Nový balíček"
        description="Nastav cenu, formát a co balíček obsahuje. Zobrazí se na tvém veřejném profilu."
        footer={
          <Button type="submit" form="creator-package-form" disabled={pending}>
            {pending ? "Ukládám…" : "Přidat balíček"}
          </Button>
        }
      >
        <form className="space-y-4" onSubmit={onSubmit} id="creator-package-form">
          <FormField label="Název" htmlFor="pkg-name">
            <Input
              id="pkg-name"
              name="name"
              required
              placeholder="Instagram Reel balíček"
            />
          </FormField>
          <div className="grid gap-4 sm:grid-cols-2">
            <FormField label="Formát" htmlFor="format">
              <FieldSelect
                id="format"
                name="format"
                defaultValue="reel"
                options={PACKAGE_FORMATS}
              />
            </FormField>
            <FormField label="Doručení" htmlFor="deliveryDays">
              <FieldSelect
                id="deliveryDays"
                name="deliveryDays"
                defaultValue={7}
                options={DELIVERY_OPTIONS.map((d) => ({
                  value: String(d.value),
                  label: d.label,
                }))}
              />
            </FormField>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <FormField label="Revize" htmlFor="revisions">
              <Input
                id="revisions"
                name="revisions"
                type="number"
                min={0}
                max={5}
                defaultValue={1}
                required
              />
            </FormField>
            <FormField label="Cena (Kč)" htmlFor="priceCzk">
              <Input
                id="priceCzk"
                name="priceCzk"
                type="number"
                min={0}
                step={100}
                placeholder="2500"
                required
              />
            </FormField>
          </div>
          <FormField label="Licence pro reklamu" htmlFor="licenseDays">
            <FieldSelect
              id="licenseDays"
              name="licenseDays"
              defaultValue="30"
              options={PACKAGE_LICENSE_OPTIONS}
            />
          </FormField>
          <FormField label="Popis" htmlFor="description">
            <Textarea
              id="description"
              name="description"
              rows={3}
              required
              className="min-h-[88px]"
              placeholder="Co je v balíčku, práva k reklamě…"
            />
          </FormField>
          {error ? (
            <p className="text-xs text-error-soft" role="alert">{error}</p>
          ) : null}
        </form>
      </Modal>
    </div>
  );
}
