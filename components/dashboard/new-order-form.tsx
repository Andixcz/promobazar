"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";

import { payForCustomOffer, payForPackage } from "@/app/dashboard/order-actions";
import { ProfileSettingsSection } from "@/components/dashboard/profile-settings-section";
import { Button } from "@/components/ui/button";
import { FieldSelect } from "@/components/ui/field-select";
import { FormField } from "@/components/ui/form-field";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import type { OrderablePackage } from "@/lib/dashboard/orders-server";

export function NewOrderForm({ packages }: { packages: OrderablePackage[] }) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [mode, setMode] = useState<"package" | "custom">("package");

  function go(url: string) {
    router.refresh();
    window.location.assign(url);
  }

  return (
    <ProfileSettingsSection title="Nová objednávka">
      <div className="flex gap-2">
        <Button
          type="button"
          size="sm"
          variant={mode === "package" ? "default" : "outline"}
          onClick={() => setMode("package")}
        >
          Balíček
        </Button>
        <Button
          type="button"
          size="sm"
          variant={mode === "custom" ? "default" : "outline"}
          onClick={() => setMode("custom")}
        >
          Vlastní nabídka
        </Button>
      </div>

      {mode === "package" ? (
        <form
          className="space-y-4"
          onSubmit={(event) => {
            event.preventDefault();
            setError(null);
            const form = new FormData(event.currentTarget);
            startTransition(async () => {
              const result = await payForPackage({
                packageId: String(form.get("packageId") ?? ""),
                brief: String(form.get("brief") ?? ""),
              });
              if (!result.ok) {
                setError(result.error);
                return;
              }
              go(result.url);
            });
          }}
        >
          {packages.length === 0 ? (
            <p className="text-sm text-mist">Žádný balíček k objednání.</p>
          ) : (
            <FormField label="Balíček" htmlFor="order-package">
              <FieldSelect
                id="order-package"
                name="packageId"
                required
                options={packages.map((item) => ({
                  value: item.id,
                  label: `${item.creatorName}, ${item.name}, ${item.priceCzk.toLocaleString("cs-CZ")} Kč`,
                }))}
              />
            </FormField>
          )}
          <FormField label="Zadání" htmlFor="order-brief">
            <Textarea id="order-brief" name="brief" rows={4} required minLength={10} placeholder="Co má video ukázat" />
          </FormField>
          <div className="flex justify-end">
            <Button type="submit" disabled={pending || packages.length === 0}>
              Zaplatit
            </Button>
          </div>
        </form>
      ) : (
        <form
          className="space-y-4"
          onSubmit={(event) => {
            event.preventDefault();
            setError(null);
            const form = new FormData(event.currentTarget);
            startTransition(async () => {
              const result = await payForCustomOffer({
                creatorSlug: String(form.get("creatorSlug") ?? ""),
                title: String(form.get("title") ?? ""),
                amountCzk: Number(form.get("amountCzk") ?? 0),
                deliveryDays: Number(form.get("deliveryDays") ?? 7),
                brief: String(form.get("brief") ?? ""),
              });
              if (!result.ok) {
                setError(result.error);
                return;
              }
              go(result.url);
            });
          }}
        >
          <FormField label="Profil tvůrce" htmlFor="creator-slug">
            <Input id="creator-slug" name="creatorSlug" required placeholder="jana-novak" />
          </FormField>
          <FormField label="Název zakázky" htmlFor="custom-title">
            <Input id="custom-title" name="title" required minLength={3} maxLength={120} />
          </FormField>
          <div className="grid gap-4 sm:grid-cols-2">
            <FormField label="Částka (Kč)" htmlFor="custom-amount">
              <Input id="custom-amount" name="amountCzk" type="number" min={100} max={500000} step={1} required />
            </FormField>
            <FormField label="Doručení (dny)" htmlFor="custom-days">
              <Input id="custom-days" name="deliveryDays" type="number" min={1} max={60} step={1} defaultValue={7} required />
            </FormField>
          </div>
          <FormField label="Zadání" htmlFor="custom-brief">
            <Textarea id="custom-brief" name="brief" rows={4} required minLength={10} placeholder="Co má video ukázat" />
          </FormField>
          <div className="flex justify-end">
            <Button type="submit" disabled={pending}>
              Zaplatit
            </Button>
          </div>
        </form>
      )}

      {error ? (
        <p className="text-xs text-error-soft" role="alert">
          {error}
        </p>
      ) : null}
    </ProfileSettingsSection>
  );
}
