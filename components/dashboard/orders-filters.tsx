import Link from "next/link";

import { Button, buttonVariants } from "@/components/ui/button";
import { FieldSelect } from "@/components/ui/field-select";
import { Input } from "@/components/ui/input";
import {
  orderStatusLabel,
  type MarketplaceOrderStatus,
} from "@/lib/dashboard/marketplace-order";
import { dashboardPath } from "@/lib/dashboard-routes";
import { marketplaceOrderStatusValues } from "@/lib/db/schema";

const orderStatusFilterOptions = [
  { value: "", label: "Všechny stavy" },
  ...marketplaceOrderStatusValues.map((value) => ({
    value,
    label: orderStatusLabel(value),
  })),
];

/** GET formulář — filtr žije v URL (?q=&stav=), stránka se vrací na 1. */
export function OrdersFilters({
  q,
  status,
}: {
  q: string;
  status?: MarketplaceOrderStatus;
}) {
  return (
    <form
      method="get"
      action={dashboardPath("objednavky")}
      role="search"
      className="mb-5 flex flex-col gap-2 sm:flex-row sm:items-center"
    >
      <label htmlFor="orders-q" className="sr-only">
        Hledat v objednávkách
      </label>
      <Input
        id="orders-q"
        name="q"
        type="search"
        size="sm"
        defaultValue={q}
        maxLength={100}
        placeholder="Hledat podle názvu, briefu nebo jména"
        className="sm:flex-1"
      />
      <label htmlFor="orders-stav" className="sr-only">
        Stav
      </label>
      <FieldSelect
        id="orders-stav"
        name="stav"
        size="sm"
        defaultValue={status ?? ""}
        options={orderStatusFilterOptions}
        className="sm:w-48"
      />
      <div className="flex gap-2">
        <Button type="submit" variant="outline">
          Hledat
        </Button>
        {q || status ? (
          <Link
            href={dashboardPath("objednavky")}
            className={buttonVariants({ variant: "ghost" })}
          >
            Zrušit
          </Link>
        ) : null}
      </div>
    </form>
  );
}
