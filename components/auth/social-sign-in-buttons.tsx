"use client";

import { siDiscord, siGoogle } from "simple-icons/icons";

import { Button } from "@/components/ui/button";
import { SimpleIcon } from "@/components/auth/simple-icon";
import { authClient } from "@/lib/auth-client";
import type { SocialAuthProviderId } from "@/lib/auth-social";
import { resolveSocialAuthProviders } from "@/lib/auth-social";
import { cn } from "@/lib/utils";

const providerMeta: Record<
  SocialAuthProviderId,
  { label: string; icon: typeof siGoogle }
> = {
  google: { label: "Google", icon: siGoogle },
  discord: { label: "Discord", icon: siDiscord },
};

type SocialAuthIntent = "sign-in" | "sign-up";

type SocialSignInButtonsProps = {
  callbackUrl: string;
  /** Ze serveru (`listConfiguredSocialAuthProviders`); bez toho platí `NEXT_PUBLIC_*`. */
  providers?: SocialAuthProviderId[];
  intent?: SocialAuthIntent;
  disabled?: boolean;
  onError?: (message: string | null) => void;
  className?: string;
};

export function SocialSignInButtons({
  callbackUrl,
  providers: providersFromServer,
  intent = "sign-in",
  disabled,
  onError,
  className,
}: SocialSignInButtonsProps) {
  const providers = resolveSocialAuthProviders(providersFromServer);
  if (providers.length === 0) return null;

  const isSignUp = intent === "sign-up";

  async function signInWith(provider: SocialAuthProviderId) {
    onError?.(null);
    const { error } = await authClient.signIn.social({
      provider,
      callbackURL: callbackUrl,
      ...(isSignUp ? { requestSignUp: true } : {}),
    });
    if (error) {
      onError?.(
        error.message ??
          (isSignUp
            ? "Registrace přes sociální síť se nezdařila."
            : "Přihlášení přes sociální síť se nezdařilo."),
      );
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
            {isSignUp ? `Zaregistrovat se přes ${label}` : `Pokračovat přes ${label}`}
          </Button>
        );
      })}
    </div>
  );
}
