import { component$ } from "@builder.io/qwik";
import { Toaster as SonnerToaster } from "qwik-sonner";

/**
 * Cyber Pro Toast System
 * Powered by qwik-sonner.
 * Styled with surgical-grade glassmorphism tokens.
 */

export { toast } from "qwik-sonner";

export const Toaster = component$(() => {
    return (
        <SonnerToaster
            theme="dark"
            position="bottom-right"
            toastOptions={{
                classes: {
                    toast: "glass-card border border-white/5 shadow-2xl rounded-2xl p-4 flex gap-3 min-w-[320px] transition-all duration-300",
                    title: "text-sm font-black italic tracking-tight text-white uppercase",
                    description: "text-xs text-muted-foreground/60 italic leading-relaxed",
                    actionButton: "bg-primary text-primary-foreground font-black px-4 py-2 rounded-lg text-xs uppercase",
                    cancelButton: "bg-white/5 text-muted-foreground font-black px-4 py-2 rounded-lg text-xs uppercase hover:bg-white/10",
                },
            }}
        />
    );
});
