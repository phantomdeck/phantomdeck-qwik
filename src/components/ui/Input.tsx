import { component$, type PropsOf } from "@builder.io/qwik";
import { cn } from "../../utils/cn";

/**
 * Cyber Pro Input
 * A surgical-grade, reactive text input for Phantom Intelligence.
 */

export const Input = component$<PropsOf<"input">>(({ ...props }) => {
    return (
        <input
            {...props}
            class={cn(
                "flex h-11 w-full rounded-xl border border-white/5 bg-white/[0.03] px-4 py-2 text-sm text-white shadow-sm transition-all focus-within:border-primary/40 focus-within:ring-1 focus-within:ring-primary/40 outline-none placeholder:text-muted-foreground/30 disabled:cursor-not-allowed disabled:opacity-50",
                props.class
            )}
        />
    );
});
