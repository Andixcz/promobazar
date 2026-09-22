"use client";

import { MessageCircleIcon, XIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import { legacyInvoke } from "@/lib/legacy-bridge";

export function ChatWidget() {
  return (
    <div id="chat-widget" className="fixed bottom-5 right-5 z-50 hidden">
      <div
        id="chat-widget-drawer"
        className="pb-glass-panel rounded-2xl absolute bottom-[70px] right-0 w-[360px] max-w-[90vw] max-h-[70vh] flex flex-col overflow-hidden opacity-0 pointer-events-none translate-y-3 scale-[0.98] transition-all duration-200 [&.open]:opacity-100 [&.open]:translate-y-0 [&.open]:scale-100 [&.open]:pointer-events-auto"
      >
        <div className="flex items-center justify-between px-4 py-3.5 border-b border-white/10 shrink-0">
          <p id="chat-widget-title" className="font-semibold text-sm truncate pr-2">
            Zprávy
          </p>
          <Button
            type="button"
            variant="outline"
            size="icon"
            className="size-7"
            onClick={() => legacyInvoke("toggleChatWidget")}
            aria-label="Zavřít chat"
          >
            <XIcon className="size-3.5" aria-hidden />
          </Button>
        </div>
        <div id="chat-widget-body" className="flex-1 overflow-y-auto p-3" />
      </div>
      <Button
        type="button"
        id="chat-widget-bubble"
        variant="default"
        size="icon"
        className="relative size-14 text-2xl"
        onClick={() => legacyInvoke("toggleChatWidget")}
        title="Zprávy"
      >
        <span id="chat-widget-avatar" className="flex items-center justify-center">
          <MessageCircleIcon className="size-6" aria-hidden />
        </span>
        <span id="chat-widget-badge" className="absolute -top-0.5 -right-0.5 flex h-[18px] min-w-[18px] items-center justify-center rounded-full bg-magenta px-1 text-[10px] font-bold text-white hidden">
          0
        </span>
      </Button>
    </div>
  );
}
