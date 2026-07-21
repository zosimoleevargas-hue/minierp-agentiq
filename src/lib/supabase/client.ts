import { createClient } from "@supabase/supabase-js";
import type { Database } from "./types";

export function createSupabaseClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !key) {
    throw new Error(
      "Missing NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_ANON_KEY. " +
      "Create a .env.local file based on .env.example",
    );
  }

  return createClient<Database>(url, key);
}
