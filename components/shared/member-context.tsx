"use client";

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

import { authClient } from "@/lib/auth-client";
import type { MemberRole } from "@/lib/db/app-schema";

type LandingMemberContextValue = {
  isPending: boolean;
  isAuthenticated: boolean;
  isCreator: boolean;
  role: MemberRole | null;
  email: string | null;
};

const LandingMemberContext = createContext<LandingMemberContextValue | null>(
  null,
);

async function fetchMemberRole(): Promise<MemberRole | null> {
  try {
    const res = await fetch("/api/me/member-role", { credentials: "include" });
    if (!res.ok) return null;
    const data = (await res.json()) as { role: MemberRole | null };
    return data.role ?? null;
  } catch {
    return null;
  }
}

/** Better Auth session + role pro marketing stránky (CreatorGate, header). */
export function MemberProvider({ children }: { children: ReactNode }) {
  const { data: session, isPending: sessionPending } = authClient.useSession();
  const [role, setRole] = useState<MemberRole | null>(null);
  const [rolePending, setRolePending] = useState(false);

  useEffect(() => {
    if (sessionPending) return;

    const userId = session?.user?.id;
    if (!userId) {
      setRole(null);
      return;
    }

    let cancelled = false;
    setRolePending(true);
    void fetchMemberRole()
      .then((nextRole) => {
        if (!cancelled) setRole(nextRole);
      })
      .finally(() => {
        if (!cancelled) setRolePending(false);
      });

    return () => {
      cancelled = true;
    };
  }, [sessionPending, session?.user?.id]);

  const value = useMemo<LandingMemberContextValue>(() => {
    const isPending = sessionPending || (Boolean(session?.user) && rolePending);
    return {
      isPending,
      isAuthenticated: Boolean(session?.user),
      isCreator: role === "creator",
      role,
      email: session?.user?.email ?? null,
    };
  }, [sessionPending, session?.user, rolePending, role]);

  return (
    <LandingMemberContext.Provider value={value}>
      {children}
    </LandingMemberContext.Provider>
  );
}

export function useMember() {
  const ctx = useContext(LandingMemberContext);
  if (!ctx) {
    throw new Error("useMember requires MemberProvider");
  }
  return ctx;
}

/** @deprecated Use `useMember` / `MemberProvider`. */
export const useLandingMember = useMember;
export const LandingMemberProvider = MemberProvider;
