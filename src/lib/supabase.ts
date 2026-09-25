import { createBrowserClient, createServerClient } from '@supabase/ssr';
import { createClient } from '@supabase/supabase-js';
import { cookies } from 'next/headers';

const url = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const key = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!;

export function browserDb() { return createBrowserClient(url, key); }
export function publicDb() { return createClient(url, key, { auth: { autoRefreshToken: false, persistSession: false } }); }
export async function serverDb() {
  const jar = await cookies();
  return createServerClient(url, key, { cookies: {
    getAll: () => jar.getAll(),
    setAll: values => { try { values.forEach(({ name, value, options }) => jar.set(name, value, options)); } catch { /* Server Component */ } }
  }});
}
export function adminDb() {
  if (!process.env.SUPABASE_SERVICE_ROLE_KEY) throw new Error('Supabase não configurado');
  return createClient(url, process.env.SUPABASE_SERVICE_ROLE_KEY, { auth: { autoRefreshToken: false, persistSession: false }});
}
export async function currentUser() { const db = await serverDb(); const { data } = await db.auth.getUser(); return data.user; }

