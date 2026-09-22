type StaticHtmlChunkProps = {
  html: string;
};

/** Server-only HTML — nepatří do client bundle. */
export function StaticHtmlChunk({ html }: StaticHtmlChunkProps) {
  return <div dangerouslySetInnerHTML={{ __html: html }} suppressHydrationWarning />;
}
