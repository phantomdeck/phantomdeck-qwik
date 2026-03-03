import { createBrowserClient } from 'supabase-auth-helpers-qwik';

/**
 * Creates a browser-side client for Supabase.
 * Uses environment variables for configuration.
 */
export const supabaseClient = createBrowserClient(
    import.meta.env.PUBLIC_SUPABASE_URL,
    import.meta.env.PUBLIC_SUPABASE_ANON_KEY
);
