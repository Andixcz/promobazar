"use client";

import * as React from "react";

import { MarkdownContent } from "@/components/ui/markdown-content";
import { Textarea } from "@/components/ui/textarea";
import { fieldControl, fieldControlSizeDefault } from "@/lib/ui-surfaces";
import { cn } from "@/lib/utils";

const editorBoxClass = cn(
  fieldControl,
  fieldControlSizeDefault,
  "min-h-[200px] resize-y overflow-y-auto text-[0.8125rem] leading-relaxed",
);

type MarkdownTextareaProps = Omit<
  React.ComponentProps<typeof Textarea>,
  "value" | "defaultValue" | "onChange"
> & {
  defaultValue?: string;
  value?: string;
  onValueChange?: (value: string) => void;
};

function MarkdownTextarea({
  className,
  defaultValue = "",
  value: valueProp,
  onValueChange,
  ...props
}: MarkdownTextareaProps) {
  const [internal, setInternal] = React.useState(defaultValue);
  const [mode, setMode] = React.useState<"write" | "preview">("write");

  const value = valueProp ?? internal;

  function update(next: string) {
    if (valueProp === undefined) setInternal(next);
    onValueChange?.(next);
  }

  return (
    <div className="space-y-2">
      <div className="flex flex-wrap items-center gap-2 text-xs">
        <button
          type="button"
          className={cn(
            "rounded-sm px-2 py-1 font-medium transition-colors",
            mode === "write"
              ? "bg-white/[0.1] text-white"
              : "text-mist hover:text-white",
          )}
          onClick={() => setMode("write")}
        >
          Psát
        </button>
        <button
          type="button"
          className={cn(
            "rounded-sm px-2 py-1 font-medium transition-colors",
            mode === "preview"
              ? "bg-white/[0.1] text-white"
              : "text-mist hover:text-white",
          )}
          onClick={() => setMode("preview")}
        >
          Náhled
        </button>
      </div>
      {mode === "write" ? (
        <Textarea
          {...props}
          value={value}
          onChange={(event) => update(event.target.value)}
          className={cn(editorBoxClass, "font-mono", className)}
        />
      ) : (
        <div
          className={cn(
            editorBoxClass,
            !value.trim() && "text-mist",
            className,
          )}
        >
          {value.trim() ? (
            <MarkdownContent content={value} />
          ) : (
            "Náhled se zobrazí, až něco napíšeš."
          )}
        </div>
      )}
    </div>
  );
}

export { MarkdownTextarea };
