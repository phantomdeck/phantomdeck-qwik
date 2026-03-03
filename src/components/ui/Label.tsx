import { component$, Slot, type PropsOf } from "@builder.io/qwik";
import { cn } from "../../utils/cn";

/**
 * Cyber Pro Label
 * Simple, accessible label with built-in disabled states.
 */

export const Label = component$<PropsOf<"label">>(({ ...props }) => {
    return (
        <label
            {...props}
            data-slot="label"
            class={cn(
                "text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 group-data-[disabled=true]:opacity-50 select-none transition-opacity duration-200 cursor-pointer flex items-center gap-2",
                props.class
            )}
        >
            <Slot />
        </label>
    );
});
