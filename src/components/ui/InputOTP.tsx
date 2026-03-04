import { component$, Slot, type PropsOf, useSignal, useTask$, type Signal, type QRL } from "@builder.io/qwik";
import { cn } from "../../utils/cn";

/**
 * Cyber Pro Input OTP System
 * A surgical-grade, accessible OTP input built for Qwik.
 * Replicates the Radix/Shadcn pattern with 100% native reactivity.
 */

export interface InputOTPProps extends PropsOf<"div"> {
    maxLength: number;
    value: Signal<string>;
    onComplete$?: QRL<(value: string) => void>;
}

export const InputOTP = component$<InputOTPProps>(
    ({ maxLength, value, onComplete$, ...props }) => {
        const inputRef = useSignal<HTMLInputElement>();
        const isFocused = useSignal(false);

        // Sync completion
        useTask$(({ track }) => {
            const current = track(() => value.value);
            if (current.length === maxLength) {
                onComplete$?.(current);
            }
        });

        return (
            <div
                {...props}
                class={cn("relative flex items-center justify-center gap-2", props.class)}
                onClick$={() => inputRef.value?.focus()}
            >
                {/* Hidden Input Layer */}
                <input
                    ref={inputRef}
                    type="text"
                    inputMode="numeric"
                    pattern="\d*"
                    maxLength={maxLength}
                    value={value.value}
                    onInput$={(e) => {
                        const val = (e.target as HTMLInputElement).value.replace(/\D/g, "");
                        value.value = val;
                    }}
                    onFocus$={() => (isFocused.value = true)}
                    onBlur$={() => (isFocused.value = false)}
                    class="absolute inset-0 opacity-0 cursor-default"
                    autoFocus
                />

                {/* Visual Slots Container */}
                <div class="flex items-center gap-2 select-none pointer-events-none">
                    <Slot />
                </div>
            </div>
        );
    }
);

export const InputOTPGroup = component$<PropsOf<"div">>(({ ...props }) => (
    <div {...props} class={cn("flex items-center", props.class)}>
        <Slot />
    </div>
));

export interface InputOTPSlotProps extends PropsOf<"div"> {
    index: number;
    value: Signal<string>;
    isFocused?: Signal<boolean>;
}

export const InputOTPSlot = component$<InputOTPSlotProps>(
    ({ index, value, ...props }) => {
        const char = value.value[index] || "";
        // We check if this slot is the "active" one (where the cursor is)
        // For simplicity in this modular approach, we rely on the parent's focused state
        // but the individual slot knows if it's the next one to be filled.
        const isActive = value.value.length === index;

        return (
            <div
                {...props}
                data-active={isActive}
                class={cn(
                    "relative flex h-12 w-10 items-center justify-center border-y border-r border-white/10 bg-white/[0.02] text-sm font-black transition-all first:rounded-l-xl first:border-l last:rounded-r-xl",
                    isActive && "ring-2 ring-primary/40 border-primary/40 z-10 scale-105 shadow-lg shadow-primary/10",
                    props.class
                )}
            >
                <span class={cn("text-white", !char && "opacity-20")}>{char || "·"}</span>
                {isActive && (
                    <div class="absolute inset-0 flex items-center justify-center animate-caret-blink">
                        <div class="h-4 w-px bg-primary shadow-[0_0_8px_var(--primary)]" />
                    </div>
                )}
            </div>
        );
    }
);

export const InputOTPSeparator = component$((props: PropsOf<"div">) => (
    <div {...props} class={cn("flex items-center justify-center px-2", props.class)}>
        <div class="h-1 w-1 rounded-full bg-white/20" />
    </div>
));
