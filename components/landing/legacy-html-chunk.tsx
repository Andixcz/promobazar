type LegacyHtmlChunkProps = {
  html: string;
};

/** Server-only HTML z legacy migrace — nepatří do client bundle. */
export function LegacyHtmlChunk({ html }: LegacyHtmlChunkProps) {
  return <div dangerouslySetInnerHTML={{ __html: html }} suppressHydrationWarning />;
}
