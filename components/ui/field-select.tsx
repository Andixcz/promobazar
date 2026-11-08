"use client";

import * as React from "react";
import { createPortal } from "react-dom";
import { ChevronDown } from "lucide-react";

import {
  dropdownOption,
  dropdownPanel,
  fieldControl,
  fieldControlSizeDefault,
  fieldControlSizeSm,
  fieldSelectTriggerExtras,
} from "@/lib/ui-surfaces";
import { cn } from "@/lib/utils";

/** Shodné s `duration-200` v `dropdownPanel` (`ui-surfaces.ts`). */
const DROPDOWN_TRANSITION_MS = 200;

export type FieldSelectOption = {
  value: string;
  label: string;
};

type FieldSelectProps = {
  name: string;
  id?: string;
  options: readonly FieldSelectOption[] | FieldSelectOption[];
  defaultValue?: string | number;
  value?: string | number;
  required?: boolean;
  disabled?: boolean;
  className?: string;
  size?: "default" | "sm";
  "aria-invalid"?: boolean;
  onValueChange?: (value: string) => void;
};

function FieldSelect({
  name,
  id,
  options,
  defaultValue,
  value: valueProp,
  required,
  disabled,
  className,
  size = "default",
  "aria-invalid": ariaInvalid,
  onValueChange,
}: FieldSelectProps) {
  const initial =
    defaultValue !== undefined
      ? String(defaultValue)
      : (options[0]?.value ?? "");

  const [open, setOpen] = React.useState(false);
  const [panelMounted, setPanelMounted] = React.useState(false);
  const [panelAnimOpen, setPanelAnimOpen] = React.useState(false);
  const [value, setValue] = React.useState(initial);
  const rootRef = React.useRef<HTMLDivElement>(null);
  const triggerRef = React.useRef<HTMLButtonElement>(null);
  const panelRef = React.useRef<HTMLDivElement>(null);
  const [panelRect, setPanelRect] = React.useState<{
    top: number;
    left: number;
    width: number;
  } | null>(null);

  const syncPanelRect = React.useCallback(() => {
    const el = triggerRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    setPanelRect({
      top: rect.bottom + 6,
      left: rect.left,
      width: rect.width,
    });
  }, []);

  React.useEffect(() => {
    if (valueProp === undefined) return;
    setValue(String(valueProp));
  }, [valueProp]);

  const panelReady = panelMounted && panelRect !== null;

  React.useLayoutEffect(() => {
    if (!open) {
      setPanelAnimOpen(false);
      const closeTimer = window.setTimeout(() => {
        setPanelMounted(false);
        setPanelRect(null);
      }, DROPDOWN_TRANSITION_MS);
      return () => window.clearTimeout(closeTimer);
    }

    syncPanelRect();
    setPanelMounted(true);
  }, [open, syncPanelRect]);

  React.useLayoutEffect(() => {
    if (!open || !panelReady) return;

    setPanelAnimOpen(false);
    const openFrame = requestAnimationFrame(() => {
      requestAnimationFrame(() => setPanelAnimOpen(true));
    });
    return () => cancelAnimationFrame(openFrame);
  }, [open, panelReady]);

  React.useEffect(() => {
    if (!panelMounted) return;
    syncPanelRect();
    window.addEventListener("scroll", syncPanelRect, true);
    window.addEventListener("resize", syncPanelRect);
    return () => {
      window.removeEventListener("scroll", syncPanelRect, true);
      window.removeEventListener("resize", syncPanelRect);
    };
  }, [panelMounted, syncPanelRect]);

  React.useEffect(() => {
    function onDocumentClick(event: MouseEvent) {
      const target = event.target as Node;
      if (
        rootRef.current?.contains(target) ||
        panelRef.current?.contains(target)
      ) {
        return;
      }
      setOpen(false);
    }
    document.addEventListener("click", onDocumentClick);
    return () => document.removeEventListener("click", onDocumentClick);
  }, []);

  const selected =
    options.find((o) => o.value === value) ?? options[0] ?? null;

  const listbox = (
    <div
      ref={panelRef}
      role="listbox"
      className={cn(
        dropdownPanel,
        "left-auto right-auto max-h-[min(280px,50vh)]",
        panelAnimOpen && "open",
      )}
      style={
        panelRect
          ? {
              position: "fixed",
              top: panelRect.top,
              left: panelRect.left,
              width: panelRect.width,
              zIndex: 300,
            }
          : undefined
      }
    >
      {options.map((option) => {
        const isActive = option.value === value;
        return (
          <button
            key={option.value}
            type="button"
            role="option"
            aria-selected={isActive}
            className={cn(
              dropdownOption,
              "w-full text-left",
              isActive && "active",
            )}
            onClick={(event) => {
              event.stopPropagation();
              setValue(option.value);
              onValueChange?.(option.value);
              setOpen(false);
            }}
          >
            {option.label}
          </button>
        );
      })}
    </div>
  );

  return (
    <div
      ref={rootRef}
      className={cn(
        "dd relative",
        open && "open z-[200]",
        className,
      )}
      data-value={value}
    >
      <input type="hidden" name={name} value={value} required={required} />
      <button
        ref={triggerRef}
        type="button"
        id={id}
        disabled={disabled}
        aria-expanded={open}
        aria-haspopup="listbox"
        aria-invalid={ariaInvalid}
        className={cn(
          fieldControl,
          size === "sm" ? fieldControlSizeSm : fieldControlSizeDefault,
          fieldSelectTriggerExtras,
        )}
        onClick={(event) => {
          event.stopPropagation();
          if (!disabled) setOpen((wasOpen) => !wasOpen);
        }}
      >
        <span className="dd-value truncate">
          {selected?.label ?? "Vyber"}
        </span>
        <ChevronDown
          className={cn(
            "dd-chevron size-3.5 shrink-0 text-mist transition-transform duration-200",
            open && "rotate-180",
          )}
          aria-hidden
        />
      </button>
      {panelMounted && panelRect && typeof document !== "undefined"
        ? createPortal(listbox, document.body)
        : null}
    </div>
  );
}

export { FieldSelect };
