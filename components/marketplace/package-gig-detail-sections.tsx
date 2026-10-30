import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

import { MarkdownContent } from "@/components/ui/markdown-content";
import { Button } from "@/components/ui/button";
import type { PublicCreatorProfile } from "@/lib/marketplace/public-server";
import { creatorPublicPath } from "@/lib/marketplace/public-routes";
import { avatarPlaceholder, surface } from "@/lib/ui-surfaces";
import { cn } from "@/lib/utils";

type PackageGigAboutSectionProps = {
  description: string;
};

export function PackageGigAboutSection({
  description,
}: PackageGigAboutSectionProps) {
  const trimmed = description.trim();

  return (
    <section className={cn(surface, "overflow-hidden p-0")}>
      <div className="border-b border-white/[0.08] bg-white/[0.02] px-5 py-4 md:px-6">
        <h2 className="font-display text-lg font-semibold text-white">
          O balíčku
        </h2>
      </div>
      <div className="px-5 py-5 md:px-6 md:py-6">
        {trimmed ? (
          <MarkdownContent content={description} />
        ) : (
          <p className="text-sm leading-relaxed text-mist">
            Tvůrce zatím nepřidal popis balíčku.
          </p>
        )}
      </div>
    </section>
  );
}

type PackageGigSellerSectionProps = {
  creator: PublicCreatorProfile;
};

export function PackageGigSellerSection({
  creator,
}: PackageGigSellerSectionProps) {
  const profileHref = creatorPublicPath(creator.slug);
  const bio = creator.bio.trim();

  return (
    <section className={cn(surface, "overflow-hidden p-0")}>
      <div className="border-b border-white/[0.08] bg-white/[0.02] px-5 py-4 md:px-6">
        <h2 className="font-display text-lg font-semibold text-white">
          O tvůrci
        </h2>
      </div>

      <div className="p-5 md:p-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start">
          <Link
            href={profileHref}
            className="shrink-0 self-start rounded-full outline-none focus-visible:ring-2 focus-visible:ring-cyan/40"
          >
            <div
              className={cn(
                "size-16 overflow-hidden rounded-full border-2 border-cyan/35 ring-2 ring-void",
                !creator.avatarUrl && avatarPlaceholder,
              )}
            >
              {creator.avatarUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={creator.avatarUrl}
                  alt=""
                  className="size-full object-cover"
                />
              ) : (
                <span className="flex size-full items-center justify-center font-display text-lg font-bold">
                  {creator.initials}
                </span>
              )}
            </div>
          </Link>

          <div className="min-w-0 flex-1 space-y-3">
            <div>
              <Link
                href={profileHref}
                className="font-display text-lg font-semibold text-white hover:text-cyan"
              >
                {creator.displayName}
              </Link>
              <p className="mt-1 text-sm text-mist">{creator.categoryLabel}</p>
            </div>

            {bio ? (
              <MarkdownContent content={bio} />
            ) : (
              <p className="text-sm leading-relaxed text-mist">
                Tvůrce zatím nepřidal bio.
              </p>
            )}

            <Button variant="outline" size="sm" className="mt-1" asChild>
              <Link href={profileHref}>
                Profil a další balíčky
                <ArrowUpRight className="size-3.5" aria-hidden />
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
