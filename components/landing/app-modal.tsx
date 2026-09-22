"use client";

import { XIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import { invokeAppGlobal } from "@/lib/app-global";
import { glassPanel, modalScrim } from "@/lib/ui-surfaces";
import { cn } from "@/lib/utils";

export function AppModal() {
  return (
    <div
      id="modal"
      className={cn(
        "fixed inset-0 z-50 hidden items-center justify-center p-4",
        modalScrim,
      )}
    >
      <div
        className={cn(
          "relative max-h-[88vh] w-full max-w-2xl overflow-y-auto rounded-3xl",
          glassPanel,
        )}
        onClick={(e) => e.stopPropagation()}
      >
        <Button
          type="button"
          variant="outline"
          size="icon"
          onClick={() => invokeAppGlobal("closeModal")}
          className="absolute top-5 right-5 z-10"
          aria-label="Zavřít"
        >
          <XIcon className="size-4" aria-hidden />
        </Button>
        <div id="modal-content" className="p-8 md:p-10" />
      </div>
    </div>
  );
}
