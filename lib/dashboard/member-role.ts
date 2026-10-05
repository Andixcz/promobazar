import type { MemberRole } from "@/lib/db/schema";
import { memberRoleValues } from "@/lib/db/schema";

export const SELECTABLE_MEMBER_ROLES: MemberRole[] = [...memberRoleValues];

export function isMemberRole(value: string): value is MemberRole {
  return (memberRoleValues as readonly string[]).includes(value);
}

export function roleLabel(role: MemberRole): string {
  switch (role) {
    case "creator":
      return "Tvůrce";
    case "brand":
      return "Značka / E-shop";
    case "buyer":
      return "Nakupující";
  }
}

/** OAuth propojení sociálních sítí (tvůrce + značka). */
export function canUsePlatformLinking(role: MemberRole): boolean {
  return role === "creator" || role === "brand";
}

export function showsPortfolioInProfile(role: MemberRole): boolean {
  return role === "creator";
}

export function showsMarketplaceCategory(role: MemberRole): boolean {
  return role !== "buyer";
}
