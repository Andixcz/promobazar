import type React from "react";

import { avatarPlaceholder } from "@/lib/ui-surfaces";
import { cn } from "@/lib/utils";

type UserAvatarProps = {
  src?: string | null;
  initials: string;
  className?: string;
} & Pick<React.ComponentProps<"span">, "aria-hidden">;

/** Kulatý avatar: fotka nebo iniciály na aqua gradientu. */
export function UserAvatar({
  src,
  initials,
  className,
  "aria-hidden": ariaHidden,
}: UserAvatarProps) {
  return (
    <span
      aria-hidden={ariaHidden}
      className={cn(
        "inline-flex shrink-0 items-center justify-center overflow-hidden rounded-full font-display font-bold",
        !src && avatarPlaceholder,
        className,
      )}
    >
      {src ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={src} alt="" className="size-full object-cover" />
      ) : (
        initials
      )}
    </span>
  );
}
