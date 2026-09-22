"use client";

import { legacyInvoke } from "@/lib/legacy-bridge";

export function ChatWidget() {
  return (
    <div id="chat-widget" className="fixed bottom-5 right-5 z-50 hidden">
      <div
        id="chat-widget-drawer"
        className="bg-gradient-to-b from-white/[0.08] to-white/[0.03] border border-white/[0.12] backdrop-blur-[14px] rounded-2xl absolute bottom-[70px] right-0 w-[360px] max-w-[90vw] max-h-[70vh] flex flex-col overflow-hidden opacity-0 pointer-events-none translate-y-3 scale-[0.98] transition-all duration-200 [&.open]:opacity-100 [&.open]:translate-y-0 [&.open]:scale-100 [&.open]:pointer-events-auto"
      >
        <div className="flex items-center justify-between px-4 py-3.5 border-b border-white/10 shrink-0">
          <p id="chat-widget-title" className="font-semibold text-sm truncate pr-2">
            Zprávy
          </p>
          <button
            type="button"
            onClick={() => legacyInvoke("toggleChatWidget")}
            className="w-7 h-7 rounded-full bg-gradient-to-b from-white/[0.055] to-white/[0.02] border border-white/[0.09] backdrop-blur-[10px] flex items-center justify-center text-xs shrink-0 hover:bg-white/10 transition"
          >
            ✕
          </button>
        </div>
        <div id="chat-widget-body" className="flex-1 overflow-y-auto p-3" />
      </div>
      <button
        type="button"
        id="chat-widget-bubble"
        className="flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-brand-indigo to-brand-purple text-2xl shadow-[0_12px_32px_-8px_rgba(99,102,241,0.65)] transition-transform hover:scale-[1.06] hover:shadow-[0_16px_40px_-6px_rgba(99,102,241,0.8)] relative"
        onClick={() => legacyInvoke("toggleChatWidget")}
        title="Zprávy"
      >
        <span id="chat-widget-avatar">💬</span>
        <span id="chat-widget-badge" className="absolute -top-0.5 -right-0.5 flex h-[18px] min-w-[18px] items-center justify-center rounded-full bg-magenta px-1 text-[10px] font-bold text-white hidden">
          0
        </span>
      </button>
    </div>
  );
}
