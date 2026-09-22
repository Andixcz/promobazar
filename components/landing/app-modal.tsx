"use client";

import { legacyInvoke } from "@/lib/legacy-bridge";

export function AppModal() {
  return (
    <div
      id="modal"
      className="fixed inset-0 z-50 hidden items-center justify-center p-4 bg-[rgba(4,3,8,0.72)] backdrop-blur-[6px]"
    >
      <div
        className="bg-gradient-to-b from-white/[0.08] to-white/[0.03] border border-white/[0.12] backdrop-blur-[14px] rounded-3xl max-w-2xl w-full max-h-[88vh] overflow-y-auto relative"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          onClick={() => legacyInvoke("closeModal")}
          className="absolute top-5 right-5 w-9 h-9 rounded-full bg-gradient-to-b from-white/[0.055] to-white/[0.02] border border-white/[0.09] backdrop-blur-[10px] flex items-center justify-center hover:bg-white/10 transition z-10"
        >
          ✕
        </button>
        <div id="modal-content" className="p-8 md:p-10" />
      </div>
    </div>
  );
}
