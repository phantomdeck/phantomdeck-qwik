import accessControlConfig from "./access-control/config";
import syvexbankConfig from "./syvexbank/config";

/**
 * Service Registry Engine
 * Phantom Intelligence Orchestration
 * To register a new node service, import its config and add it below.
 */

export const services = [
    accessControlConfig,
    syvexbankConfig,
] as const;

/**
 * A serializable version of the registry for use in components/loaders.
 * Purges non-serializable QRLs for high-fidelity state jumps.
 */
export const safeServices = services.map((s) => ({
    id: s.id,
    name: s.name,
    type: s.type,
    enabled: s.enabled,
    visibility: s.visibility,
    ui: {
        icon: s.ui.icon,
        route: s.ui.route,
    },
    ad: s.ad,
}));

export type RegisteredService = (typeof services)[number];
export type ServiceId = RegisteredService["id"];
