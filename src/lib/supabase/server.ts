import { createServerClient } from 'supabase-auth-helpers-qwik';
import type { RequestEventBase } from '@builder.io/qwik-city';

/**
 * Creates a Supabase client for server-side operations (Loaders/Actions).
 * Handles automatic cookie management for authentication.
 */
export function createSupabaseServerClient(event: RequestEventBase) {
    const isDev = event.env.get("NODE_ENV") === "development";
    // Force secure: false for all HTTP (especially local IP) access
    const isHttps = event.url.protocol === 'https:';
    const secure = !isDev && isHttps;

    return createServerClient(
        event.env.get("PUBLIC_SUPABASE_URL")!,
        event.env.get("PUBLIC_SUPABASE_ANON_KEY")!,
        event,
        {
            cookieOptions: {
                secure,
                sameSite: 'lax',
                path: '/',
                maxAge: 60 * 60 * 24 * 30, // 30 days
                domain: '',
            }
        }
    );
}
