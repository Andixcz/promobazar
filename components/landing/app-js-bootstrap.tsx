import { listConfiguredSocialAuthProviders } from "@/lib/auth-social-server";

/** Runtime config pro `public/app.js` (OAuth tlačítka v modalu). */
export function AppJsBootstrap() {
  const providers = listConfiguredSocialAuthProviders();
  const json = JSON.stringify(providers).replace(/</g, "\\u003c");

  return (
    <script
      dangerouslySetInnerHTML={{
        __html: `window.__PB_SOCIAL_PROVIDERS__=${json};`,
      }}
    />
  );
}
