import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { Database, isSupabaseAvailable } from './supabase';

// Environment variables with fallback
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder-key';

// Server-side Supabase clients that use cookies from next/headers
export function createSupabaseRouteHandlerClient() {
  // Note: This function should only be called during request handling,
  // not during build time. The caller should check isSupabaseAvailable() first.
  const cookieStore = cookies();
  
  return createServerClient<Database>(supabaseUrl, supabaseAnonKey, {
    cookies: {
      get(name: string) {
        return cookieStore.get(name)?.value;
      },
      set(name: string, value: string, options: any) {
        cookieStore.set({ name, value, ...options });
      },
      remove(name: string, options: any) {
        cookieStore.set({ name, value: '', ...options });
      },
    },
  });
}

export function createSupabaseServerComponentClient() {
  // Note: This function should only be called during request handling,
  // not during build time. The caller should check isSupabaseAvailable() first.
  const cookieStore = cookies();
  
  return createServerClient<Database>(supabaseUrl, supabaseAnonKey, {
    cookies: {
      get(name: string) {
        return cookieStore.get(name)?.value;
      },
      set(name: string, value: string, options: any) {
        cookieStore.set({ name, value, ...options });
      },
      remove(name: string, options: any) {
        cookieStore.set({ name, value: '', ...options });
      },
    },
  });
}