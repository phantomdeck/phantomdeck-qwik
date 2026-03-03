import type { RequestEventBase } from "@builder.io/qwik-city";
import { createSupabaseServerClient } from "../lib/supabase/server";
import type { AuthUser } from "../types/auth";

export * from "../types/auth";

/**
 * Retrieves the current authenticated user from Supabase.
 * Maps Supabase metadata to the specialized PhantomDeck AuthUser type.
 */
export async function getUser(
    requestEv: RequestEventBase,
): Promise<AuthUser | null> {
    const supabase = createSupabaseServerClient(requestEv);
    const {
        data: { user },
    } = await supabase.auth.getUser();

    if (!user) return null;

    return {
        id: user.id,
        email: user.email!,
        role: (user.app_metadata?.role as any) ?? "client",
        app_metadata: {
            services: (user.app_metadata?.services as any) ?? {},
        },
        user_metadata: {
            full_name: user.user_metadata?.full_name,
        },
    };
}
