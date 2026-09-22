import { redirect } from "next/navigation";

/** Kompatibilita s dřívějším Netlify redirectem `/auth/callback` → index. */
export default function AuthCallbackPage() {
  redirect("/");
}
