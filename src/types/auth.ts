export type ServiceAccessLevel = "full" | "read_only" | "hide" | number;

/** 
 * Controls default access & visibility for a service in the registry. 
 */
export type ServiceVisibility = ServiceAccessLevel;

export type BillingStatus =
    | "active"
    | "trial"
    | "pending"
    | "inactive"
    | "paid_upfront";

/**
 * Metadata stored in Supabase for a specific service access.
 */
export interface UserServiceAccess {
    access_level: ServiceAccessLevel;
    granted_at: string;
    billing_status?: BillingStatus;
}

/**
 * The standard PhantomDeck user object, derived from Supabase Auth.
 */
export interface AuthUser {
    id: string;
    email: string;
    role: "super_admin" | "client";
    app_metadata: {
        services: Record<string, UserServiceAccess>;
    };
    user_metadata: {
        full_name?: string;
        [key: string]: any;
    };
}

/**
 * Resolved access state for a service, used by UI components.
 */
export interface ServiceAccess {
    /** Whether the service should be visible in the navigation */
    canSee: boolean;
    /** Whether the user can actually interact with the service */
    canUse: boolean;
    /** The specific access level (full/read_only/hide/number) */
    accessLevel: ServiceAccessLevel;
}
