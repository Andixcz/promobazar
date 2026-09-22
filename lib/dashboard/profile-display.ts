import { initialsFromName } from "@/lib/dashboard/slug";
import type { MemberProfileRow } from "@/lib/dashboard/profile-types";
import type { MemberRole } from "@/lib/db/schema";

export function roleLabel(role: MemberRole): string {
  return role === "creator" ? "Tvůrce" : "Značka / E-shop";
}

export function profileInitials(
  profile: MemberProfileRow,
  email: string,
): string {
  return initialsFromName(profile.displayName ?? "", email);
}
