"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { FormField } from "@/components/ui/form-field";
import { Input } from "@/components/ui/input";
import { RegisterRoleField } from "@/components/auth/register-role-field";
import { SocialSignInButtons } from "@/components/auth/social-sign-in-buttons";
import { authClient } from "@/lib/auth-client";
import { AUTH_LOGIN_PATH } from "@/lib/auth-routes";
import {
  buildRegisterCallbackUrl,
  isAuthRegisterRole,
  type AuthRegisterRole,
} from "@/lib/auth-register";
import type { SocialAuthProviderId } from "@/lib/auth-social";

type SignUpFormProps = {
  socialProviders?: SocialAuthProviderId[];
};

export function SignUpForm({ socialProviders }: SignUpFormProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const roleParam = searchParams.get("role");
  const [memberRole, setMemberRole] = useState<AuthRegisterRole>(
    isAuthRegisterRole(roleParam) ? roleParam : "creator",
  );
  const callbackUrl =
    searchParams.get("callbackUrl") ?? buildRegisterCallbackUrl(memberRole);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setPending(true);
    const { error: signUpError } = await authClient.signUp.email({
      name,
      email,
      password,
      callbackURL: callbackUrl,
    });
    setPending(false);
    if (signUpError) {
      setError(signUpError.message ?? "Registrace se nezdařila.");
      return;
    }
    router.push(callbackUrl);
    router.refresh();
  }

  return (
    <form className="space-y-5" onSubmit={onSubmit}>
      <RegisterRoleField
        value={memberRole}
        onChange={setMemberRole}
        disabled={pending}
      />
      <FormField label="Jméno" htmlFor="sign-up-name">
        <Input
          id="sign-up-name"
          type="text"
          autoComplete="name"
          required
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
      </FormField>
      <FormField label="E-mail" htmlFor="sign-up-email">
        <Input
          id="sign-up-email"
          type="email"
          autoComplete="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
      </FormField>
      <div>
        <FormField label="Heslo" htmlFor="sign-up-password">
          <Input
            id="sign-up-password"
            type="password"
            autoComplete="new-password"
            minLength={8}
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </FormField>
        <p className="mt-1.5 text-xs text-mist">Minimálně 8 znaků.</p>
      </div>
      {error ? (
        <p className="text-sm text-destructive" role="alert">{error}</p>
      ) : null}
      <Button type="submit" className="w-full" disabled={pending}>
        {pending ? "Vytvářím účet…" : "Vytvořit účet"}
      </Button>
      <SocialSignInButtons
        callbackUrl={callbackUrl}
        providers={socialProviders}
        intent="sign-up"
        disabled={pending}
        onError={(message) => setError(message || null)}
      />
      <p className="text-center text-sm text-mist">
        Už máš účet?{" "}
        <Link
          href={AUTH_LOGIN_PATH}
          className="text-cyan hover:text-cyan/85 font-medium"
        >
          Přihlásit se
        </Link>
      </p>
    </form>
  );
}
