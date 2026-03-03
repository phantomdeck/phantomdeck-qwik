import type { ServiceAccess } from "./auth";

/**
 * Service Configuration Types
 * Phantom Intelligence Orchestration
 */

export type ServiceType = "internal" | "external";

export interface ServiceAd {
    description: string;
    longDescription?: string;
    features?: string[];
    demoUrl?: string;
    teaserImage?: string;
    contactText?: string;
}

export interface ServiceConfig {
    id: string;
    name: string;
    type: ServiceType;
    enabled: boolean;
    visibility: "full" | "read_only" | "hide" | number;
    ui: {
        icon: string;
        route: string;
    };
    ad?: ServiceAd;
}

export interface ServiceWithAccess extends ServiceConfig {
    access: ServiceAccess;
}
