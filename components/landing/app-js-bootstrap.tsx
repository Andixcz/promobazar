/** Prázdný seed — skutečný seznam doplní `SocialProvidersBootstrap` z API. */
export function AppJsBootstrap() {
  return (
    <script
      dangerouslySetInnerHTML={{
        __html: "window.__PB_SOCIAL_PROVIDERS__=[];",
      }}
    />
  );
}
