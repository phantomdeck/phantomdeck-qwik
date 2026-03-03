import { component$, Slot, type PropsOf, useSignal, useTask$, useVisibleTask$, $, type QRL } from "@builder.io/qwik";
import { cn } from "../../utils/cn";
import { LuX } from "@qwikest/icons/lucide";
import { Button } from "./Button";

/**
 * Cyber Pro Sheet System
 * High-fidelity slide-over component.
 * Uses native <dialog> for surgical focus management and accessibility.
 */

export interface SheetProps {
    show: boolean;
    onClose$?: QRL<() => void>;
    side?: "top" | "right" | "bottom" | "left";
    size?: "md" | "lg" | "xl";
}

export const Sheet = component$<SheetProps & PropsOf<"dialog">>(
    ({ show, onClose$, side = "right", size = "md", ...props }) => {
        const dialogRef = useSignal<HTMLDialogElement>();

        const handleClose = $(() => {
            onClose$?.();
        });

        // Sync show prop with native <dialog> showModal()
        // useVisibleTask$ ensures this only runs on the client where dialogRef is guaranteed to be a DOM node
        useVisibleTask$(({ track }) => {
            const isOpen = track(() => show);
            if (dialogRef.value) {
                if (isOpen && !dialogRef.value.open) {
                    dialogRef.value.showModal();
                    document.body.style.overflow = "hidden";
                } else if (!isOpen && dialogRef.value.open) {
                    dialogRef.value.close();
                    document.body.style.overflow = "";
                }
            }
        });

        return (
            <dialog
                ref={dialogRef}
                onCancel$={handleClose}
                onClick$={(e) => {
                    // Close on backdrop click
                    if (e.target === dialogRef.value) handleClose();
                }}
                class={cn(
                    "bg-transparent p-0 m-0 outline-none backdrop:bg-black/60 backdrop:backdrop-blur-md group",
                    "fixed inset-0 z-50 flex opacity-0 open:opacity-100 transition-all duration-500 ease-out",
                    "open:pointer-events-auto pointer-events-none invisible open:visible",
                    "max-w-none max-h-none w-screen h-screen border-none",
                    side === "right" && "justify-end",
                    side === "left" && "justify-start",
                    side === "top" && "items-start",
                    side === "bottom" && "items-end",
                    props.class
                )}
            >
                <div
                    class={cn(
                        "glass-card relative flex h-full w-full flex-col bg-background/95 shadow-2xl transition-all duration-500",
                        // Side-specific sizing & rounding
                        side === "right" && cn(
                            "h-full w-full translate-x-full group-open:translate-x-0 border-l border-white/5",
                            size === "md" && "max-w-md",
                            size === "lg" && "max-w-xl",
                            size === "xl" && "max-w-3xl"
                        ),
                        side === "left" && cn(
                            "h-full w-full translate-x-full group-open:translate-x-0 border-r border-white/5",
                            size === "md" && "max-w-md",
                            size === "lg" && "max-w-xl",
                            size === "xl" && "max-w-3xl"
                        ),
                        side === "top" && "h-auto w-full max-h-[80vh] -translate-y-full group-open:translate-y-0 border-b border-white/5",
                        side === "bottom" && "h-auto w-full max-h-[80vh] translate-y-full group-open:translate-y-0 border-t border-white/5",

                        "p-8",
                        props.class
                    )}
                >
                    {/* Close Trigger */}
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick$={handleClose}
                        class="absolute right-6 top-6 z-50 opacity-40 hover:opacity-100 transition-opacity"
                    >
                        <LuX class="size-6" />
                        <span class="sr-only">Close</span>
                    </Button>

                    <Slot />
                </div>
            </dialog>
        );
    }
);

export const SheetHeader = component$<PropsOf<"div">>(({ ...props }) => (
    <div {...props} class={cn("flex flex-col gap-2 pb-8", props.class)}>
        <Slot />
    </div>
));

export const SheetTitle = component$<PropsOf<"h2">>(({ ...props }) => (
    <h2 {...props} class={cn("text-3xl font-black italic tracking-tighter text-white uppercase", props.class)}>
        <Slot />
    </h2>
));

export const SheetDescription = component$<PropsOf<"p">>(({ ...props }) => (
    <p {...props} class={cn("text-sm text-muted-foreground/60 leading-relaxed italic", props.class)}>
        <Slot />
    </p>
));

export const SheetContent = component$<PropsOf<"div">>(({ ...props }) => (
    <div {...props} class={cn("flex-1 overflow-y-auto pr-4 -mr-4 custom-scrollbar", props.class)}>
        <Slot />
    </div>
));

export const SheetFooter = component$<PropsOf<"div">>(({ ...props }) => (
    <div {...props} class={cn("flex flex-col gap-3 pt-10 sm:flex-row sm:justify-end mt-auto", props.class)}>
        <Slot />
    </div>
));
