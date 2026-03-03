import { component$, type PropsOf } from "@builder.io/qwik";
import { cn } from "../../utils/cn";

/**
 * Cyber Pro Skeleton
 * Pulsing loading state with surgical-grade aesthetics.
 */

export const Skeleton = component$<PropsOf<"div">>(({ ...props }) => {
    return (
        <div
            {...props}
            data-slot="skeleton"
            class={cn(
                "bg-white/[0.03] animate-pulse rounded-lg",
                "border border-white/5", // Subtle edge for the cyber look
                props.class
            )}
        />
    );
});
