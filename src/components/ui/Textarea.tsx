import { component$, type PropsOf } from "@builder.io/qwik";
import { cn } from "../../utils/cn";

/**
 * Cyber Pro Textarea
 * High-performance multiline input for telemetry logs and node metadata.
 */

export const Textarea = component$<PropsOf<"textarea">>(({ ...props }) => {
    return (
        <textarea
            {...props}
            class={cn(
                "flex min-h-[100px] w-full rounded-xl border border-white/5 bg-white/[0.03] px-4 py-3 text-sm text-white shadow-sm transition-all focus-within:border-primary/40 focus-within:ring-1 focus-within:ring-primary/40 outline-none placeholder:text-muted-foreground/30 disabled:cursor-not-allowed disabled:opacity-50",
                props.class
            )}
        />
    );
});
