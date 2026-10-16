"use client";

import Link from "next/link";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { FormField } from "@/components/ui/form-field";
import { Input } from "@/components/ui/input";
import { authClient } from "@/lib/auth-client";
import {
  AUTH_LOGIN_PATH,
  AUTH_RESET_PASSWORD_PATH,
} from "@/lib/auth-routes";

export function ForgotPasswordForm() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [sent, setSent] = useState(false);
  const [pending, setPending] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setPending(true);

    const redirectTo = `${window.location.origin}${AUTH_RESET_PASSWORD_PATH}`;
    const { error: resetError } = await authClient.requestPasswordReset({
      email,
      redirectTo,
    });

    setPending(false);
    if (resetError) {
      setError(resetError.message ?? "Odeslání odkazu se nezdařilo.");
      return;
    }
    setSent(true);
  }

  if (sent) {
    return (
      <div className="space-y-4">
        <p className="text-sm text-zinc-200 leading-relaxed">
          Pokud účet s tímto e-mailem existuje, poslali jsme ti odkaz na
          obnovení hesla. Zkontroluj schránku i spam.
        </p>
        <Link
          href={AUTH_LOGIN_PATH}
          className="text-sm font-medium text-cyan hover:text-cyan/85"
        >
          Zpět na přihlášení
        </Link>
      </div>
    );
  }

  return (
    <form className="space-y-5" onSubmit={onSubmit}>
      <FormField label="E-mail" htmlFor="forgot-email">
        <Input
          id="forgot-email"
          type="email"
          autoComplete="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
      </FormField>
      {error ? (
        <p className="text-sm text-destructive" role="alert">{error}</p>
      ) : null}
      <Button type="submit" className="w-full" disabled={pending}>
        {pending ? "Odesílám…" : "Poslat odkaz"}
      </Button>
      <p className="text-center text-sm text-mist">
        <Link
          href={AUTH_LOGIN_PATH}
          className="text-cyan hover:text-cyan/85 font-medium"
        >
          Zpět na přihlášení
        </Link>
      </p>
    </form>
  );
}
