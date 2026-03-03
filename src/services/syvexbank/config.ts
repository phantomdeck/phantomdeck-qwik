import type { ServiceConfig } from "../../types/service";

/**
 * Node Entity: SyvexBank Terminal Config
 * External financial orchestration service.
 */

const config: ServiceConfig = {
    id: "syvexbank",
    name: "SyvexBank Terminal",
    type: "external",
    enabled: true,
    visibility: "read_only", // Default to teaser mode
    ui: {
        icon: "Bank",
        route: "/services/syvexbank",
    },
    ad: {
        description: "Professional core banking administrative terminal. Manage capital flow, verify transactions, and monitor fraud alerts.",
        longDescription: "A direct integration with the SyvexBank core. This terminal allows nodes to monitor real-time liquidity, resolve pending loans, and audit customer risk profiles.",
        features: ["Liquidity Terminal", "Transaction Audit", "Risk Management"],
        contactText: "Contact banking director for access bypass protocol."
    }
};

export default config;
