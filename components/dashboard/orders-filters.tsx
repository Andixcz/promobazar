"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

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

export function OrdersFilters({
  q,
  status,
}: {
  q: string;
  status?: MarketplaceOrderStatus;
}) {
  const router = useRouter();
  const [query, setQuery] = useState(q);
  const [statusValue, setStatusValue] = useState(status ?? "");

  useEffect(() => {
    setQuery(q);
    setStatusValue(status ?? "");
  }, [q, status]);

  function applyFilters(nextQ: string, nextStatus: string) {
    const params = new URLSearchParams();
    const trimmed = nextQ.trim().slice(0, 100);
    if (trimmed) params.set("q", trimmed);
    if (nextStatus) params.set("stav", nextStatus);
    const suffix = params.toString();
    router.push(
      suffix ? `${dashboardPath("objednavky")}?${suffix}` : dashboardPath("objednavky"),
    );
  }

  return (
    <form
      role="search"
      className="mb-5 flex flex-col gap-2 sm:flex-row sm:items-center"
      onSubmit={(event) => {
        event.preventDefault();
        applyFilters(query, statusValue);
      }}
    >
      <label htmlFor="orders-q" className="sr-only">
        Hledat v objednávkách
      </label>
      <Input
        id="orders-q"
        name="q"
        type="search"
        size="sm"
        value={query}
        maxLength={100}
        placeholder="Hledat podle názvu, briefu nebo jména"
        className="sm:flex-1"
        onChange={(event) => setQuery(event.target.value)}
      />
      <label htmlFor="orders-stav" className="sr-only">
        Stav
      </label>
      <FieldSelect
        id="orders-stav"
        name="stav"
        size="sm"
        value={statusValue}
        options={orderStatusFilterOptions}
        className="sm:w-48"
        onValueChange={setStatusValue}
      />
      <div className="flex gap-2">
        <Button type="submit" variant="outline">
          Hledat
        </Button>
        {q || status ? (
          <Link
            href={dashboardPath("objednavky")}
            className={buttonVariants({ variant: "ghost" })}
            onClick={() => {
              setQuery("");
              setStatusValue("");
            }}
          >
            Zrušit
          </Link>
        ) : null}
      </div>
    </form>
  );
}
