import { createClient } from '@supabase/supabase-js';

/**
 * Node Master: Supabase Admin Client
 * SECURE: This uses the SERVICE_ROLE_KEY which bypasses RLS.
 * This client must only be used within Qwik server primitives (server$, routeLoader$, etc).
 */

const supabaseUrl = import.meta.env.PUBLIC_SUPABASE_URL || (typeof process !== 'undefined' ? process.env.PUBLIC_SUPABASE_URL : undefined);
const serviceRoleKey = import.meta.env.SUPABASE_SERVICE_ROLE_KEY || (typeof process !== 'undefined' ? process.env.SUPABASE_SERVICE_ROLE_KEY : undefined);

if (!supabaseUrl) throw new Error('Missing PUBLIC_SUPABASE_URL');
if (!serviceRoleKey) throw new Error('Missing SUPABASE_SERVICE_ROLE_KEY');

export const supabaseAdmin = createClient(
    supabaseUrl,
    serviceRoleKey,
    {
        auth: {
            autoRefreshToken: false,
            persistSession: false
        }
    }
);

export const adminAuth = supabaseAdmin.auth.admin;
