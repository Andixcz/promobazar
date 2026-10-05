import { createAuthClient } from "better-auth/react";

/** V prohlížeči vždy stejný origin — jinak Doppler/prod `NEXT_PUBLIC_APP_URL` rozbije login na localhostu. */
function getAuthClientBaseUrl() {
  if (typeof window !== "undefined") {
    return window.location.origin;
  }
  return process.env.NEXT_PUBLIC_APP_URL;
}

export const authClient = createAuthClient({
  baseURL: getAuthClientBaseUrl(),
});
