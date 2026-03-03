import type { ServiceConfig } from "../../types/service";

/**
 * Node Master: Access Control Config
 * Internal service for identity and permission orchestration.
 */

const config: ServiceConfig = {
    id: "access-control",
    name: "Access Control",
    type: "internal",
    enabled: true,
    visibility: "hide", // Default to hidden for non-admins
    ui: {
        icon: "Shield",
        route: "/services/access-control",
    },
    ad: {
        description: "Centralized identity and permission management for the entire Phantom Intelligence ecosystem.",
        contactText: "Contact master node for identity delegation protocol."
    }
};

export default config;
