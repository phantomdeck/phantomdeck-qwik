import { component$, type PropsOf } from "@builder.io/qwik";
import { cn } from "../../utils/cn";

/**
 * Cyber Pro Separator
 * Minimal, data-orientation-aware layout divider.
 */

export interface SeparatorProps extends PropsOf<"div"> {
    orientation?: "horizontal" | "vertical";
    decorative?: boolean;
}

export const Separator = component$<SeparatorProps>(({
    orientation = "horizontal",
    decorative = true,
    ...props
}) => {
    return (
        <div
            {...props}
            data-slot="separator"
            data-orientation={orientation}
            aria-orientation={orientation === "vertical" ? "vertical" : undefined}
            role={decorative ? "none" : "separator"}
            class={cn(
                "bg-border shrink-0 transition-colors duration-300",
                orientation === "horizontal" ? "h-px w-full" : "h-full w-px self-stretch",
                props.class
            )}
        />
    );
});
