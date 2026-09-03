import { createBrowserClient } from "@supabase/ssr";

/**
 * Supabase browser client — used in Client Components and server actions.
 * Reads env vars at runtime (not build time) so the build doesn't fail
 * when Supabase isn't configured yet.
 */
export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  );
}
