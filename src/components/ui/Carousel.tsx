import { component$, Slot, type PropsOf } from "@builder.io/qwik";
import { cn } from "../../utils/cn";

/**
 * Cyber Pro Carousel System
 * 100% Native CSS Scroll Snap implementation. 
 * High performance, zero Javascript for the core scrolling logic.
 */

export const Carousel = component$<PropsOf<"div">>(({ ...props }) => {
    return (
        <div
            {...props}
            class={cn("relative w-full group/carousel", props.class)}
        >
            <Slot />
        </div>
    );
});

export const CarouselContent = component$<PropsOf<"div">>(({ ...props }) => {
    return (
        <div
            {...props}
            class={cn(
                "flex overflow-x-auto scroll-smooth snap-x snap-mandatory gap-4 pb-4 no-scrollbar border-none outline-none",
                "mask-fade-edges", // Visual polish
                props.class
            )}
            style={{
                scrollbarWidth: 'none',
                msOverflowStyle: 'none',
            }}
        >
            <Slot />
        </div>
    );
});

export const CarouselItem = component$<PropsOf<"div">>(({ ...props }) => {
    return (
        <div
            {...props}
            class={cn(
                "min-w-0 shrink-0 grow-0 basis-full snap-center snap-always",
                "sm:basis-1/2 lg:basis-1/3 p-1",
                props.class
            )}
        >
            <Slot />
        </div>
    );
});

/**
 * Native Navigator Utilities
 * Since we are using CSS Snap, we can just scroll the container 
 * horizontally with basic JS logic if needed, but the scrollbar/swipe works natively.
 */
