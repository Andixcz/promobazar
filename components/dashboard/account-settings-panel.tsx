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
    <div className="space-y-6">
      <ProfileSettingsSection title="E-mail" description="Adresa pro přihlášení.">
        <FormField label="Aktuální e-mail" htmlFor="account-email-current">
          <Input
            id="account-email-current"
            type="email"
            value={email}
            disabled
            readOnly
          />
        </FormField>
        <FormField label="Nový e-mail" htmlFor="account-email-new">
          <Input
            id="account-email-new"
            type="email"
            placeholder="novy@email.cz"
            disabled
            autoComplete="email"
          />
        </FormField>
        <div className="flex justify-end border-t border-white/[0.08] pt-4">
          <Button type="button" variant="outline" size="sm" disabled>
            Ověřit změnu
          </Button>
        </div>
      </ProfileSettingsSection>

      <ProfileSettingsSection title="Heslo" description="Přihlášení e-mailem.">
        <FormField label="Nové heslo" htmlFor="account-password-new">
          <Input
            id="account-password-new"
            type="password"
            disabled
            placeholder="••••••••"
            autoComplete="new-password"
          />
        </FormField>
        <div className="flex justify-end border-t border-white/[0.08] pt-4">
          <Button type="button" variant="outline" size="sm" disabled>
            Změnit heslo
          </Button>
        </div>
      </ProfileSettingsSection>
    </div>
  );
}
