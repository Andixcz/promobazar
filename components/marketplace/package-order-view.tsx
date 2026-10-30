import Link from "next/link";

import { PackageOrderCheckoutForm } from "@/components/marketplace/package-order-checkout-form";
import {
  creatorPublicPath,
  packagePublicPath,
} from "@/lib/marketplace/public-routes";
import { marketplacePageShell } from "@/lib/marketplace/public-layout";
import type {
  PublicCreatorProfile,
  PublicPackageRow,
} from "@/lib/marketplace/public-server";

type PackageOrderViewProps = {
  creator: PublicCreatorProfile;
  pkg: PublicPackageRow;
};

export function PackageOrderView({ creator, pkg }: PackageOrderViewProps) {
  const gigHref = packagePublicPath(creator.slug, pkg.id);

  return (
    <div className={marketplacePageShell}>
      <nav className="mb-6 text-sm text-mist md:mb-8">
        <Link href={creatorPublicPath(creator.slug)} className="hover:text-white">
          {creator.displayName}
        </Link>
        <span className="mx-2">/</span>
        <Link href={gigHref} className="hover:text-white">
          {pkg.name}
        </Link>
        <span className="mx-2">/</span>
        <span className="text-white">Objednávka</span>
      </nav>

      <PackageOrderCheckoutForm creator={creator} pkg={pkg} />
    </div>
  );
}
