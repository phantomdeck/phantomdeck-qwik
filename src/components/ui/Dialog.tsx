import { component$, Slot, type PropsOf, useSignal, useVisibleTask$, $, type QRL } from "@builder.io/qwik";
import { cn } from "../../utils/cn";
import { LuX } from "@qwikest/icons/lucide";
import { Button } from "./Button";

/**
 * Cyber Pro Dialog System
 * Uses native <dialog> for focus trapping and accessibility.
 */

export interface DialogProps {
    show: boolean;
    onClose$?: QRL<() => void>;
    size?: "sm" | "md" | "lg" | "full";
}

export const Dialog = component$<DialogProps & PropsOf<"dialog">>(
    ({ show, onClose$, size = "md", ...props }) => {
        const dialogRef = useSignal<HTMLDialogElement>();

        // Sync show prop with native <dialog> showModal()
        // useVisibleTask$ ensures this only runs on the client where dialogRef is guaranteed to be a DOM node
        // eslint-disable-next-line qwik/no-use-visible-task
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

        const handleClose = $(() => {
            onClose$?.();
        });

        return (
            <dialog
                {...props}
                ref={dialogRef}
                onCancel$={handleClose}
                onClick$={(e) => {
                    // Close if clicking the backdrop (dialog background)
                    if (e.target === dialogRef.value) handleClose();
                }}
                class={cn(
                    "bg-transparent p-0 m-0 outline-none backdrop:bg-black/80 backdrop:backdrop-blur-sm group",
                    "fixed inset-0 z-50 flex items-center justify-center opacity-0 transition-opacity duration-300",
                    "open:opacity-100 open:pointer-events-auto pointer-events-none invisible open:visible",
                    "max-w-none max-h-none w-screen h-screen border-none",
                    props.class
                )}
            >
                <div
                    class={cn(
                        "glass-card relative flex flex-col overflow-hidden rounded-2xl shadow-2xl transition-all duration-300",
                        "scale-95 group-open:scale-100 translate-y-0",
                        size === "sm" && "w-full max-w-sm mx-4",
                        size === "md" && "w-full max-w-lg mx-4",
                        size === "lg" && "w-full max-w-3xl mx-4",
                        size === "full" && "w-full h-auto max-h-[96dvh] sm:w-[95vw] sm:h-[90vh] sm:max-w-7xl sm:mx-auto max-sm:rounded-none max-sm:border-none",
                    )}
                >
                    <Slot />
                    {/* Default Close Button */}
                    <button
                        type="button"
                        onClick$={handleClose}
                        class="absolute right-4 top-4 rounded-full p-2 text-muted-foreground hover:bg-white/5 hover:text-white transition-colors z-50"
                    >
                        <LuX class="size-4" />
                        <span class="sr-only">Close</span>
                    </button>
                </div>
            </dialog>
        );
    }
);

export const DialogHeader = component$<PropsOf<"div">>(({ ...props }) => (
    <div {...props} class={cn("flex flex-col gap-1.5 p-6 border-b border-white/5", props.class)}>
        <Slot />
    </div>
));

export const DialogTitle = component$<PropsOf<"h2">>(({ ...props }) => (
    <h2 {...props} class={cn("text-xl font-black italic tracking-tight text-white", props.class)}>
        <Slot />
    </h2>
));

export const DialogDescription = component$<PropsOf<"p">>(({ ...props }) => (
    <p {...props} class={cn("text-xs text-muted-foreground leading-relaxed", props.class)}>
        <Slot />
    </p>
));

export const DialogContent = component$<PropsOf<"div">>(({ ...props }) => (
    <div {...props} class={cn("p-6 flex-1 overflow-y-auto", props.class)}>
        <Slot />
    </div>
));

export const DialogFooter = component$<PropsOf<"div">>(({ ...props }) => (
    <div {...props} class={cn("flex items-center justify-end gap-3 p-6 bg-white/[0.02] border-t border-white/5 mt-auto", props.class)}>
        <Slot />
    </div>
));

/**
 * AlertDialog Variation
 * Simplified version for confirmation flows.
 */
export const AlertDialogHeader = component$<PropsOf<"div">>(({ ...props }) => (
    <div {...props} class={cn("flex flex-col items-center justify-center text-center gap-3 p-8 shrink-0 pb-2", props.class)}>
        <Slot />
    </div>
));

export const AlertDialogMedia = component$<PropsOf<"div">>(({ ...props }) => (
    <div {...props} class={cn("size-14 rounded-2xl bg-white/[0.03] border border-white/5 flex items-center justify-center text-primary/40 mb-2", props.class)}>
        <Slot />
    </div>
));

export const AlertDialogTitle = component$<PropsOf<"h2">>(({ ...props }) => (
    <h2 {...props} class={cn("text-2xl font-black italic tracking-tighter text-white uppercase", props.class)}>
        <Slot />
    </h2>
));

export const AlertDialogDescription = component$<PropsOf<"p">>(({ ...props }) => (
    <p {...props} class={cn("text-xs text-muted-foreground leading-relaxed px-4", props.class)}>
        <Slot />
    </p>
));

export const AlertDialogFooter = component$<PropsOf<"div">>(({ ...props }) => (
    <div {...props} class={cn("flex flex-col gap-2 p-8 sm:flex-row sm:justify-center border-none", props.class)}>
        <Slot />
    </div>
));

export const AlertDialogAction = component$<PropsOf<typeof Button>>(({ ...props }) => (
    <Button {...props} variant="default" class={cn("px-8 font-black uppercase italic", props.class)}>
        <Slot />
    </Button>
));

export const AlertDialogCancel = component$<PropsOf<typeof Button>>(({ ...props }) => (
    <Button {...props} variant="ghost" class={cn("px-8 font-black uppercase italic opacity-40 hover:opacity-100", props.class)}>
        <Slot />
    </Button>
));

export const AlertDialog = component$<DialogProps & PropsOf<"dialog">>(
    ({ show, onClose$, ...props }) => {
        return (
            <Dialog show={show} onClose$={onClose$} size="sm" {...props}>
                <Slot />
            </Dialog>
        );
    }
);
