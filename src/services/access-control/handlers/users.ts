import { server$ } from "@builder.io/qwik-city";
import { adminAuth } from "../../../lib/supabase/admin";
import type { AuthUser } from "../../../types/auth";

/**
 * Node Master: Fetch Identity Registry
 * High-fidelity server-side handler for fetching the system user directory.
 */
export const getSystemUsers = server$(async () => {
    try {
        const { data: { users }, error } = await adminAuth.listUsers();

        if (error) {
            console.error("[ACCESS_CONTROL] Error fetching users:", error);
            return [];
        }

        // Surgical Transformation to AuthUser type
        const transformedUsers: AuthUser[] = (users || []).map((user) => ({
            id: user.id,
            email: user.email!,
            role: user.app_metadata?.role ?? "client",
            app_metadata: {
                services: user.app_metadata?.services ?? {},
            },
            user_metadata: {
                full_name: user.user_metadata?.full_name,
            },
        }));

        return transformedUsers;
    } catch (err) {
        console.error("[ACCESS_CONTROL] Critical handler failure:", err);
        return [];
    }
});
