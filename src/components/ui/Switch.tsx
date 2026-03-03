import { component$, type PropsOf, useSignal } from "@builder.io/qwik";
import { cn } from "../../utils/cn";

/**
 * Cyber Pro Switch
 * High-performance toggle for session-state switches.
 */

export interface SwitchProps extends PropsOf<"input"> {
    checked?: boolean;
}

export const Switch = component$<SwitchProps>(({ checked, ...props }) => {
    const inputRef = useSignal<HTMLInputElement>();

    return (
        <div
            class={cn(
                "relative h-6 w-11 shrink-0 cursor-pointer items-center rounded-full border border-white/5 bg-white/[0.03] transition-all focus-within:ring-2 focus-within:ring-primary/20",
                checked && "bg-primary border-primary/20 shadow-[0_0_12px_rgba(var(--primary-rgb),0.2)]",
                props.disabled && "cursor-not-allowed opacity-50",
                props.class
            )}
            onClick$={() => !props.disabled && inputRef.value?.click()}
        >
            <input
                {...props}
                ref={inputRef}
                type="checkbox"
                checked={checked}
                class="sr-only"
            />
            {/* Thumb */}
            <div
                class={cn(
                    "absolute left-1 top-1 h-3.5 w-3.5 rounded-full bg-white/40 border border-white/10 transition-all duration-300",
                    checked && "translate-x-5 bg-white scale-110 shadow-lg shadow-white/20"
                )}
            />
        </div>
    );
});
