// apps/web/src/utils/supabase/client.ts
import { createBrowserClient } from '@supabase/ssr';

export function createClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  // Next.js automatically loads .env files from project root, so ensure .env.web is renamed to .env.local or .env for Next.js if needed.

  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error('Supabase environment variables are not set.');
  }

  return createBrowserClient(supabaseUrl, supabaseAnonKey);
}