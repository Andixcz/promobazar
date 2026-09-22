"use client";

import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

import { cn } from "@/lib/utils";

/** Vzhled vykresleného Markdownu (dark UI). */
export const markdownBodyClass =
  "markdown-body text-sm leading-relaxed text-zinc-200 [&_p]:mb-2 [&_p:last-child]:mb-0 [&_ul]:my-2 [&_ul]:list-disc [&_ul]:pl-5 [&_ol]:my-2 [&_ol]:list-decimal [&_ol]:pl-5 [&_li]:my-0.5 [&_strong]:font-semibold [&_strong]:text-white [&_em]:text-zinc-100 [&_a]:text-cyan [&_a]:underline-offset-2 hover:[&_a]:underline [&_h2]:mt-3 [&_h2]:mb-1.5 [&_h2]:font-display [&_h2]:text-base [&_h2]:font-semibold [&_h2]:text-white [&_h3]:mt-2 [&_h3]:mb-1 [&_h3]:text-sm [&_h3]:font-semibold [&_h3]:text-white [&_blockquote]:my-2 [&_blockquote]:border-l-2 [&_blockquote]:border-white/20 [&_blockquote]:pl-3 [&_blockquote]:text-mist [&_code]:rounded-sm [&_code]:bg-white/[0.08] [&_code]:px-1 [&_code]:py-0.5 [&_code]:text-[0.8125rem] [&_pre]:my-2 [&_pre]:overflow-x-auto [&_pre]:rounded-sm [&_pre]:border [&_pre]:border-white/[0.08] [&_pre]:bg-white/[0.04] [&_pre]:p-3 [&_pre_code]:bg-transparent [&_pre_code]:p-0";

type MarkdownContentProps = {
  content: string;
  className?: string;
};

function MarkdownContent({ content, className }: MarkdownContentProps) {
  const trimmed = content.trim();
  if (!trimmed) return null;

  return (
    <div className={cn(markdownBodyClass, className)}>
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          a: ({ href, children }) => (
            <a
              href={href}
              target="_blank"
              rel="noopener noreferrer"
            >
              {children}
            </a>
          ),
        }}
      >
        {trimmed}
      </ReactMarkdown>
    </div>
  );
}

export { MarkdownContent };
