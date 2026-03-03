import { safeServices } from "../services/config";
import type { AuthUser, ServiceAccessLevel, ServiceAccess } from "../types/auth";

/**
 * Tactical Service Access Resolver
 * Phantom Intelligence Orchestration
 * 
 * Logic Level Selection:
 * 1. SUPREME_ADMIN bypass
 * 2. USER_OVERRIDE (Supabase metadata)
 * 3. SERVICE_DEFAULT (Static config)
 */
export function getServiceAccess(user: AuthUser, serviceId: string): ServiceAccess {
    const service = safeServices.find((s) => s.id === serviceId);

    // DECOMMISSIONED or UNKNOWN service - Treat as invisible
    if (!service || !service.enabled) {
        return { canSee: false, canUse: false, accessLevel: "hide" };
    }

    // SUPREME_ADMIN: Universal lattice access
    if (user.role === "super_admin") {
        return { canSee: true, canUse: true, accessLevel: "full" };
    }

    // USER_OVERRIDE: Specific identity-level permissions from the database
    const userAccess = user.app_metadata.services[serviceId];
    if (userAccess) {
        const { access_level } = userAccess;
        const isHidden = access_level === "hide";

        return {
            canSee: !isHidden,
            canUse: !isHidden,
            accessLevel: access_level,
        };
    }

    // SERVICE_DEFAULT: Reverting to local registry defaults
    const defaultLevel = service.visibility as ServiceAccessLevel;
    const isHidden = defaultLevel === "hide";

    return {
        canSee: !isHidden,
        canUse: !isHidden,
        accessLevel: defaultLevel,
    };
}

/**
 * Returns the collection of services visible to the current identity.
 */
export function getVisibleServices(user: AuthUser) {
    return safeServices
        .filter((s) => s.enabled)
        .map((s) => ({ ...s, access: getServiceAccess(user, s.id) }))
        .filter((s) => s.access.canSee);
}

/**
 * Deterministic bypass check.
 */
export function canUseService(user: AuthUser, serviceId: string): boolean {
    return getServiceAccess(user, serviceId).canUse;
}

/**
 * Interprets the refined access level for target nodes.
 */
export function getAccessLevel(user: AuthUser, serviceId: string): ServiceAccessLevel {
    return getServiceAccess(user, serviceId).accessLevel;
}
