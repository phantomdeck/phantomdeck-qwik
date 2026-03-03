import { component$, Slot, type PropsOf } from "@builder.io/qwik";
import { cn } from "../../utils/cn";

/**
 * Cyber Pro Card System
 * Modular surfaces with high-end glassmorphism and tailwind v4 grouping.
 */

export const Card = component$<PropsOf<"div"> & { size?: "default" | "sm" }>(
    ({ size = "default", ...props }) => {
        return (
            <div
                {...props}
                data-slot="card"
                data-size={size}
                class={cn(
                    "glass-card group/card flex flex-col gap-4 overflow-hidden rounded-xl py-4 text-sm transition-all duration-300 hover:shadow-2xl hover:shadow-primary/5",
                    "data-[size=sm]:gap-3 data-[size=sm]:py-3",
                    props.class
                )}
            >
                <Slot />
            </div>
        );
    }
);

export const CardHeader = component$<PropsOf<"div">>(({ ...props }) => {
    return (
        <div
            {...props}
            data-slot="card-header"
            class={cn(
                "flex flex-col gap-1.5 px-6 group-data-[size=sm]/card:px-4 shrink-0",
                props.class
            )}
        >
            <Slot />
        </div>
    );
});

export const CardTitle = component$<PropsOf<"h3">>(({ ...props }) => {
    return (
        <h3
            {...props}
            data-slot="card-title"
            class={cn(
                "text-lg font-semibold leading-none tracking-tight text-foreground group-data-[size=sm]/card:text-base",
                props.class
            )}
        >
            <Slot />
        </h3>
    );
});

export const CardDescription = component$<PropsOf<"p">>(({ ...props }) => {
    return (
        <p
            {...props}
            data-slot="card-description"
            class={cn("text-xs text-muted-foreground leading-relaxed", props.class)}
        >
            <Slot />
        </p>
    );
});

export const CardAction = component$<PropsOf<"div">>(({ ...props }) => {
    return (
        <div
            {...props}
            data-slot="card-action"
            class={cn(
                "absolute right-6 top-6 group-data-[size=sm]/card:right-4 group-data-[size=sm]/card:top-4",
                props.class
            )}
        >
            <Slot />
        </div>
    );
});

export const CardContent = component$<PropsOf<"div">>(({ ...props }) => {
    return (
        <div
            {...props}
            data-slot="card-content"
            class={cn(
                "px-6 pt-0 group-data-[size=sm]/card:px-4 flex-1",
                props.class
            )}
        >
            <Slot />
        </div>
    );
});

export const CardFooter = component$<PropsOf<"div">>(({ ...props }) => {
    return (
        <div
            {...props}
            data-slot="card-footer"
            class={cn(
                "flex items-center p-6 pt-0 group-data-[size=sm]/card:p-4 border-t border-border/50 bg-white/[0.01]",
                props.class
            )}
        >
            <Slot />
        </div>
    );
});
