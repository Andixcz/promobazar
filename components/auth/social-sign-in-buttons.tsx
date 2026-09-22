"use client";

import { siDiscord, siGoogle } from "simple-icons/icons";

import { Button } from "@/components/ui/button";
import { SimpleIcon } from "@/components/auth/simple-icon";
import { authClient } from "@/lib/auth-client";
import type { SocialAuthProviderId } from "@/lib/auth-social";
import { getEnabledSocialAuthProviders } from "@/lib/auth-social";
import { cn } from "@/lib/utils";

const providerMeta: Record<
  SocialAuthProviderId,
  { label: string; icon: typeof siGoogle }
> = {
  google: { label: "Google", icon: siGoogle },
  discord: { label: "Discord", icon: siDiscord },
};

type SocialSignInButtonsProps = {
  callbackUrl: string;
  disabled?: boolean;
  onError?: (message: string | null) => void;
  className?: string;
};

export function SocialSignInButtons({
  callbackUrl,
  disabled,
  onError,
  className,
}: SocialSignInButtonsProps) {
  const providers = getEnabledSocialAuthProviders();
  if (providers.length === 0) return null;

  async function signInWith(provider: SocialAuthProviderId) {
    onError?.(null);
    const { error } = await authClient.signIn.social({
      provider,
      callbackURL: callbackUrl,
    });
    if (error) {
      onError?.(error.message ?? "Přihlášení přes sociální síť se nezdařilo.");
    }
  }

  return (
    <div className={cn("space-y-2", className)}>
      <p className="text-center text-xs font-medium uppercase tracking-wide text-mist">
        nebo
      </p>
      {providers.map((id) => {
        const { label, icon } = providerMeta[id];
        return (
          <Button
            key={id}
            type="button"
            variant="outline"
            className="w-full gap-2"
            disabled={disabled}
            onClick={() => signInWith(id)}
          >
            <SimpleIcon icon={icon} title={label} />
            Pokračovat přes {label}
          </Button>
        );
      })}
    </div>
  );
}
