"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { FormField } from "@/components/ui/form-field";
import { Input } from "@/components/ui/input";
import { authClient } from "@/lib/auth-client";
import { AUTH_FORGOT_PASSWORD_PATH, AUTH_LOGIN_PATH } from "@/lib/auth-routes";

export function ResetPasswordForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  const invalid = searchParams.get("error") === "INVALID_TOKEN";

  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  if (invalid || !token) {
    return (
      <div className="space-y-4">
        <p className="text-sm text-destructive" role="alert">
          Odkaz na obnovení hesla je neplatný nebo už vypršel.
        </p>
        <Link
          href={AUTH_FORGOT_PASSWORD_PATH}
          className="text-sm font-medium text-cyan hover:text-cyan/85"
        >
          Poslat nový odkaz
        </Link>
      </div>
    );
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setPending(true);

    const { error: resetError } = await authClient.resetPassword({
      newPassword: password,
      token: token ?? undefined,
    });

    setPending(false);
    if (resetError) {
      setError(resetError.message ?? "Heslo se nepodařilo změnit.");
      return;
    }
    router.push(AUTH_LOGIN_PATH);
    router.refresh();
  }

  return (
    <form className="space-y-5" onSubmit={onSubmit}>
      <FormField label="Nové heslo" htmlFor="reset-password">
        <Input
          id="reset-password"
          type="password"
          autoComplete="new-password"
          required
          minLength={8}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
      </FormField>
      {error ? (
        <p className="text-sm text-destructive" role="alert">{error}</p>
      ) : null}
      <Button type="submit" className="w-full" disabled={pending}>
        {pending ? "Ukládám…" : "Uložit nové heslo"}
      </Button>
    </form>
  );
}
