import { component$, Slot, type PropsOf, useSignal, useTask$, $, type QRL } from "@builder.io/qwik";
import { cn } from "../../utils/cn";

/**
 * Cyber Pro Drawer System
 * Native <dialog> logic with bottom-slide-in styling.
 */

export interface DrawerProps {
    show: boolean;
    onClose$?: QRL<() => void>;
    side?: "bottom" | "top" | "left" | "right";
}

export const Drawer = component$<DrawerProps & PropsOf<"dialog">>(
    ({ show, onClose$, side = "bottom", ...props }) => {
        const dialogRef = useSignal<HTMLDialogElement>();

        const handleClose = $(() => {
            onClose$?.();
        });

        useTask$(({ track }) => {
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
                    if (e.target === dialogRef.value) handleClose();
                }}
                class={cn(
                    "bg-transparent p-0 outline-none backdrop:bg-black/60 backdrop:backdrop-blur-sm",
                    "fixed inset-0 z-50 flex opacity-0 open:opacity-100 transition-opacity duration-300",
                    side === "bottom" && "items-end justify-center",
                    side === "top" && "items-start justify-center",
                    side === "left" && "items-center justify-start",
                    side === "right" && "items-center justify-end",
                    props.class
                )}
            >
                <div
                    class={cn(
                        "glass-card relative flex flex-col bg-background shadow-2xl transition-all duration-300",
                        // Responsive sizing based on side
                        (side === "bottom" || side === "top") && "w-full max-h-[85vh] rounded-t-3xl p-6",
                        (side === "left" || side === "right") && "h-full w-full max-w-sm rounded-[0] p-6",

                        // Animation States
                        side === "bottom" && "translate-y-full open:translate-y-0",
                        side === "top" && "-translate-y-full open:translate-y-0",
                        side === "left" && "-translate-x-full open:translate-x-0",
                        side === "right" && "translate-x-full open:translate-x-0"
                    )}
                >
                    {side === "bottom" && (
                        <div class="mx-auto h-1.5 w-12 shrink-0 rounded-full bg-white/10 mb-6" />
                    )}
                    <Slot />
                </div>
            </dialog>
        );
    }
);

export const DrawerHeader = component$<PropsOf<"div">>(({ ...props }) => (
    <div {...props} class={cn("flex flex-col gap-1.5 pb-4", props.class)}><Slot /></div>
));

export const DrawerTitle = component$<PropsOf<"h2">>(({ ...props }) => (
    <h2 {...props} class={cn("text-xl font-black italic text-white tracking-tight", props.class)}><Slot /></h2>
));

export const DrawerDescription = component$<PropsOf<"p">>(({ ...props }) => (
    <p {...props} class={cn("text-xs text-muted-foreground leading-relaxed italic", props.class)}><Slot /></p>
));

export const DrawerContent = component$<PropsOf<"div">>(({ ...props }) => (
    <div {...props} class={cn("flex-1 overflow-y-auto px-1", props.class)}><Slot /></div>
));

export const DrawerFooter = component$<PropsOf<"div">>(({ ...props }) => (
    <div {...props} class={cn("flex flex-col gap-2 pt-6 sm:flex-row sm:justify-end", props.class)}><Slot /></div>
));
