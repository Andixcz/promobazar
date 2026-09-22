"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { FormField } from "@/components/ui/form-field";
import { Input } from "@/components/ui/input";
import { SocialSignInButtons } from "@/components/auth/social-sign-in-buttons";
import { authClient } from "@/lib/auth-client";
import { AUTH_REGISTER_PATH } from "@/lib/auth-routes";
import { LANDING_FIRMS_PATH } from "@/lib/landing-routes";

export function SignInForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") ?? LANDING_FIRMS_PATH;

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setPending(true);
    const { error: signInError } = await authClient.signIn.email({
      email,
      password,
      callbackURL: callbackUrl,
    });
    setPending(false);
    if (signInError) {
      setError(signInError.message ?? "Přihlášení se nezdařilo.");
      return;
    }
    router.push(callbackUrl);
    router.refresh();
  }

  return (
    <form className="space-y-5" onSubmit={onSubmit}>
      <FormField label="E-mail" htmlFor="sign-in-email">
        <Input
          id="sign-in-email"
          type="email"
          autoComplete="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
      </FormField>
      <FormField label="Heslo" htmlFor="sign-in-password">
        <Input
          id="sign-in-password"
          type="password"
          autoComplete="current-password"
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
      </FormField>
      {error ? (
        <p className="text-sm text-destructive" role="alert">{error}</p>
      ) : null}
      <Button type="submit" className="w-full" disabled={pending}>
        {pending ? "Přihlašuji…" : "Přihlásit se"}
      </Button>
      <SocialSignInButtons
        callbackUrl={callbackUrl}
        disabled={pending}
        onError={(message) => setError(message || null)}
      />
      <p className="text-center text-sm text-mist">
        Nemáš účet?{" "}
        <Link
          href={AUTH_REGISTER_PATH}
          className="text-cyan hover:text-cyan/85 font-medium"
        >
          Registrace
        </Link>
      </p>
    </form>
  );
}
