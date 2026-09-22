"use client";

import { ProfileSettingsSection } from "@/components/dashboard/profile-settings-section";
import { Button } from "@/components/ui/button";
import { FormField } from "@/components/ui/form-field";
import { Input } from "@/components/ui/input";

type AccountSettingsPanelProps = {
  email: string;
};

export function AccountSettingsPanel({ email }: AccountSettingsPanelProps) {
  return (
    <div className="mx-auto max-w-xl space-y-6">
      <ProfileSettingsSection title="E-mail" description="Adresa pro přihlášení.">
        <FormField label="Aktuální e-mail">
          <Input type="email" value={email} disabled />
        </FormField>
        <FormField label="Nový e-mail">
          <div className="flex flex-col gap-2 sm:flex-row">
            <Input
              type="email"
              placeholder="novy@email.cz"
              disabled
              className="flex-1 opacity-60"
            />
            <Button type="button" variant="outline" disabled className="shrink-0">
              Ověřit změnu
            </Button>
          </div>
        </FormField>
      </ProfileSettingsSection>

      <ProfileSettingsSection title="Heslo" description="Přihlášení e-mailem.">
        <FormField label="Nové heslo">
          <Input type="password" disabled placeholder="••••••••" className="opacity-60" />
        </FormField>
        <Button type="button" variant="outline" disabled>
          Změnit heslo
        </Button>
      </ProfileSettingsSection>
    </div>
  );
}
