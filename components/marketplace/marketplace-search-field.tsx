"use client";

import { useEffect, useState } from "react";
import { Search } from "lucide-react";

import { FormField } from "@/components/ui/form-field";
import { Input } from "@/components/ui/input";

const QUERY_DEBOUNCE_MS = 280;

type MarketplaceSearchFieldProps = {
  value: string;
  onDebouncedChange: (query: string) => void;
  id?: string;
  label?: string;
  showLabel?: boolean;
};

export function MarketplaceSearchField({
  value,
  onDebouncedChange,
  id = "marketplace-query",
  label = "Hledej balíček nebo tvůrce",
  showLabel = true,
}: MarketplaceSearchFieldProps) {
  const [draft, setDraft] = useState(value);

  useEffect(() => {
    setDraft(value);
  }, [value]);

  useEffect(() => {
    const handle = window.setTimeout(() => {
      if (draft !== value) onDebouncedChange(draft);
    }, QUERY_DEBOUNCE_MS);
    return () => window.clearTimeout(handle);
  }, [draft, value, onDebouncedChange]);

  const field = (
    <div className="relative">
      <Search
        className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-mist"
        aria-hidden
      />
      <Input
        id={id}
        type="search"
        name="q"
        value={draft}
        placeholder="např. TikTok, Reels, fitness, jméno tvůrce…"
        className="pl-9"
        autoComplete="off"
        enterKeyHint="search"
        onChange={(e) => setDraft(e.target.value)}
      />
    </div>
  );

  if (!showLabel) {
    return field;
  }

  return (
    <FormField label={label} htmlFor={id}>
      {field}
    </FormField>
  );
}
