import { component$, type PropsOf, useSignal } from "@builder.io/qwik";
import { cn } from "../../utils/cn";

/**
 * Cyber Pro Checkbox
 * Surgical-grade toggle for truth-values.
 */

export interface CheckboxProps extends PropsOf<"input"> {
    checked?: boolean;
}

export const Checkbox = component$<CheckboxProps>(({ checked, ...props }) => {
    const inputRef = useSignal<HTMLInputElement>();

    return (
        <div
            class={cn(
                "relative flex h-5 w-5 shrink-0 items-center justify-center rounded-md border border-white/10 bg-white/[0.03] transition-all hover:border-primary/40",
                checked && "bg-primary border-primary shadow-[0_0_12px_rgba(var(--primary-rgb),0.2)]",
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
            {checked && (
                <svg
                    class="h-3.5 w-3.5 text-primary-foreground stroke-[3]"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                >
                    <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        d="M5 13l4 4L19 7"
                    />
                </svg>
            )}
        </div>
    );
});
