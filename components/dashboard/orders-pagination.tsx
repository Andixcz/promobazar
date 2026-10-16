import Link from "next/link";

import { buttonVariants } from "@/components/ui/button";
import type { MarketplaceOrderStatus } from "@/lib/dashboard/marketplace-order";
import { dashboardPath } from "@/lib/dashboard-routes";
import { cn } from "@/lib/utils";

function pageHref(page: number, q: string, status?: MarketplaceOrderStatus) {
  const params = new URLSearchParams();
  if (q) params.set("q", q);
  if (status) params.set("stav", status);
  if (page > 1) params.set("strana", String(page));
  const query = params.toString();
  return query ? `${dashboardPath("objednavky")}?${query}` : dashboardPath("objednavky");
}

export function OrdersPagination({
  page,
  pageCount,
  q,
  status,
}: {
  page: number;
  pageCount: number;
  q: string;
  status?: MarketplaceOrderStatus;
}) {
  if (pageCount <= 1) return null;
  const linkClass = buttonVariants({ variant: "outline", size: "sm" });
  const disabledClass = cn(linkClass, "pointer-events-none opacity-55");

  return (
    <nav
      aria-label="Stránkování objednávek"
      className="mt-5 flex items-center justify-between gap-3"
    >
      {page > 1 ? (
        <Link href={pageHref(page - 1, q, status)} className={linkClass} rel="prev">
          Předchozí
        </Link>
      ) : (
        <span className={disabledClass} aria-disabled="true">
          Předchozí
        </span>
      )}
      <span className="text-xs text-mist tabular-nums">
        Strana {page} z {pageCount}
      </span>
      {page < pageCount ? (
        <Link href={pageHref(page + 1, q, status)} className={linkClass} rel="next">
          Další
        </Link>
      ) : (
        <span className={disabledClass} aria-disabled="true">
          Další
        </span>
      )}
    </nav>
  );
}
