import { component$, Slot, type PropsOf } from "@builder.io/qwik";
import { cn } from "../../utils/cn";

/**
 * Cyber Pro Popover System
 * Built on the NATIVE browser Popover API.
 * High performance, zero Javascript for core positioning/toggling.
 */

export const Popover = component$<PropsOf<"div">>(({ id, ...props }) => {
    return (
        <div
            {...props}
            id={id}
            popover="auto"
            class={cn(
                "bg-transparent p-0 border-none outline-none shadow-none m-0",
                "animate-in fade-in zoom-in-95 duration-200",
                // Using native popover-opening pseudo-class for transitions
                "[:popover-open]:opacity-100 opacity-0 transition-opacity",
                props.class
            )}
        >
            <div class="glass-card rounded-xl shadow-2xl overflow-hidden min-w-[240px] border-white/10">
                <Slot />
            </div>
        </div>
    );
});

export const PopoverTrigger = component$<PropsOf<"button"> & { popovertarget: string }>(
    ({ popovertarget, ...props }) => {
        return (
            <button
                {...props}
                popovertarget={popovertarget}
                class={cn(
                    "inline-flex items-center justify-center cursor-pointer",
                    props.class
                )}
            >
                <Slot />
            </button>
        );
    }
);

export const PopoverHeader = component$<PropsOf<"div">>(({ ...props }) => (
    <div {...props} class={cn("flex flex-col gap-1 p-4 border-b border-white/5 bg-white/[0.02]", props.class)}>
        <Slot />
    </div>
));

export const PopoverTitle = component$<PropsOf<"h4">>(({ ...props }) => (
    <h4 {...props} class={cn("text-sm font-black italic tracking-tight text-white uppercase", props.class)}>
        <Slot />
    </h4>
));

export const PopoverDescription = component$<PropsOf<"p">>(({ ...props }) => (
    <p {...props} class={cn("text-[10px] text-muted-foreground leading-tight italic", props.class)}>
        <Slot />
    </p>
));

export const PopoverContent = component$<PropsOf<"div">>(({ ...props }) => (
    <div {...props} class={cn("p-4", props.class)}>
        <Slot />
    </div>
));
