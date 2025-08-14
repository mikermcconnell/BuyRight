import { createServerComponentClient, createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { Database } from './supabase';

// Server-side Supabase clients that use cookies from next/headers
export function createSupabaseRouteHandlerClient() {
  return createRouteHandlerClient<Database>({ cookies });
}

export function createSupabaseServerComponentClient() {
  return createServerComponentClient<Database>({ cookies });
}