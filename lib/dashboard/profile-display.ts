import { initialsFromName } from "@/lib/dashboard/slug";
import type { MemberProfileRow } from "@/lib/dashboard/profile-types";
export { roleLabel } from "@/lib/dashboard/member-role";

export function profileInitials(
  profile: MemberProfileRow,
  email: string,
): string {
  return initialsFromName(profile.displayName ?? "", email);
}
