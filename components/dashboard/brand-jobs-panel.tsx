"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { ClipboardList, Plus } from "lucide-react";

import { createBrandJob } from "@/app/dashboard/actions";
import { Button } from "@/components/ui/button";
import { FormField } from "@/components/ui/form-field";
import { Input } from "@/components/ui/input";
import { Modal } from "@/components/ui/modal";
import { FieldSelect } from "@/components/ui/field-select";
import { MarkdownContent } from "@/components/ui/markdown-content";
import { MarkdownTextarea } from "@/components/ui/markdown-textarea";
import { categoryLabel, MARKETPLACE_CATEGORIES } from "@/lib/dashboard/categories";
import type { MemberProfileRow } from "@/lib/dashboard/profile-types";
import { resultCount, surface } from "@/lib/ui-surfaces";
import { cn } from "@/lib/utils";
import type { brandJobPost } from "@/lib/db/schema";

type JobRow = typeof brandJobPost.$inferSelect;

function formatJobDate(value: Date) {
  return value.toLocaleDateString("cs-CZ", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export function BrandJobsPanel({
  profile,
  jobs,
}: {
  profile: MemberProfileRow;
  jobs: JobRow[];
}) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [jobFormKey, setJobFormKey] = useState(0);

  function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    const form = new FormData(e.currentTarget);
    startTransition(async () => {
      const result = await createBrandJob(profile.slug, {
        title: String(form.get("title") ?? ""),
        category: String(form.get("category") ?? "fitness"),
        budgetCzk: Number(form.get("budgetCzk") ?? 0),
        description: String(form.get("description") ?? ""),
      });
      if (!result.ok) {
        setError(result.error);
        return;
      }
      e.currentTarget.reset();
      setDialogOpen(false);
      setJobFormKey((k) => k + 1);
      router.refresh();
    });
  }

  return (
    <div className="space-y-0">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <span className={resultCount}>
          {jobs.length === 0
            ? "Žádné poptávky"
            : `${jobs.length} ${jobs.length === 1 ? "poptávka" : "poptávek"}`}
        </span>
        <Button type="button" size="sm" onClick={() => setDialogOpen(true)}>
          <Plus className="size-4" aria-hidden />
          Nová poptávka
        </Button>
      </div>

      <div className={cn(surface, "mt-5 overflow-hidden")}>
        {jobs.length === 0 ? (
          <div className="flex flex-col items-center px-6 py-16 text-center">
            <div className="mb-4 flex size-11 items-center justify-center rounded-sm border border-white/[0.1] bg-white/[0.03] text-mist">
              <ClipboardList className="size-5" strokeWidth={1.5} aria-hidden />
            </div>
            <p className="font-display text-base font-semibold text-white">
              Zatím nemáš žádnou poptávku
            </p>
            <p className="mt-2 max-w-sm text-sm leading-relaxed text-mist">
              Publikuj první zakázku — tvůrci ji najdou v tržišti na hlavní stránce.
            </p>
            <Button
              type="button"
              className="mt-6"
              size="sm"
              onClick={() => setDialogOpen(true)}
            >
              <Plus className="size-4" aria-hidden />
              Vytvořit poptávku
            </Button>
          </div>
        ) : (
          <ul className="divide-y divide-white/[0.08]">
            {jobs.map((job) => (
              <li
                key={job.id}
                className="px-5 py-4 transition-colors hover:bg-white/[0.02] md:px-6"
              >
                <div className="flex flex-wrap items-start justify-between gap-3 gap-y-1">
                  <div className="min-w-0">
                    <p className="font-medium text-white">{job.title}</p>
                    <p className="mt-1 text-xs text-mist">
                      {categoryLabel(job.category)} · {formatJobDate(job.createdAt)}
                    </p>
                  </div>
                  <p className="text-sm font-semibold tabular-nums text-white">
                    {job.budgetCzk.toLocaleString("cs-CZ")} Kč
                  </p>
                </div>
                <MarkdownContent
                  content={job.description}
                  className="mt-2 max-h-[4.5rem] overflow-hidden"
                />
              </li>
            ))}
          </ul>
        )}
      </div>

      <Modal
        open={dialogOpen}
        onOpenChange={(open) => {
          setDialogOpen(open);
          if (!open) setJobFormKey((k) => k + 1);
        }}
        contentClassName="sm:max-w-2xl"
        title="Nová poptávka"
        description="Vyplň zadání a rozpočet. Po publikaci se zakázka zobrazí tvůrcům v tržišti."
        footer={
          <Button type="submit" form="brand-job-form" disabled={pending}>
            {pending ? "Publikuji…" : "Publikovat"}
          </Button>
        }
      >
        <form
          key={jobFormKey}
          className="space-y-4"
          onSubmit={onSubmit}
          id="brand-job-form"
        >
          <FormField label="Název" htmlFor="job-title">
            <Input
              id="job-title"
              name="title"
              required
              placeholder="TikToker na 3 videa / měsíc"
            />
          </FormField>
          <div className="grid gap-4 sm:grid-cols-2">
            <FormField label="Obor" htmlFor="job-category">
              <FieldSelect
                id="job-category"
                name="category"
                defaultValue="fitness"
                options={MARKETPLACE_CATEGORIES}
              />
            </FormField>
            <FormField label="Rozpočet (Kč)" htmlFor="job-budget">
              <Input
                id="job-budget"
                name="budgetCzk"
                type="number"
                min={0}
                step={500}
                placeholder="8000"
                required
              />
            </FormField>
          </div>
          <FormField
            label="Popis zadání"
            htmlFor="job-description"
            hint="Stručně popiš formát, tón, termíny a co má tvůrce dodat. V náhledu uvidíš, jak to uvidí tvůrci."
          >
            <MarkdownTextarea
              id="job-description"
              name="description"
              rows={10}
              required
              placeholder={`## Co dodat\n- 3× TikTok (15–30 s), česky\n- Produkt pošleme poštou\n\n**Tón:** autentický, ne reklamní\n**Termín:** do 14 dní od zaslání produktu`}
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
