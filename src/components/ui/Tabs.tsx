import {
    component$,
    Slot,
    type PropsOf,
    createContextId,
    useContext,
    useContextProvider,
    useStore,
    $
} from "@builder.io/qwik";
import { cn } from "../../utils/cn";

/**
 * Cyber Pro Tabs System
 * Refactored to use a Store for bulletproof reactivity.
 */

export interface TabsStore {
    activeId: string;
}

export const TabsContext = createContextId<TabsStore>('tabs-context');

export const Tabs = component$<PropsOf<"div"> & { defaultValue: string }>(
    ({ defaultValue, ...props }) => {
        // Stores are better for shared state in Qwik components
        const state = useStore<TabsStore>({ activeId: defaultValue });
        useContextProvider(TabsContext, state);

        return (
            <div {...props} class={cn("flex flex-col gap-6", props.class)}>
                <Slot />
            </div>
        );
    }
);

export const TabsList = component$<PropsOf<"div"> & { variant?: "default" | "line" }>(
    ({ variant = "default", ...props }) => {
        return (
            <div
                {...props}
                class={cn(
                    "inline-flex h-11 items-center justify-start rounded-xl p-1 text-muted-foreground transition-all duration-300 isolate z-10",
                    variant === "default" && "bg-white/[0.03] border border-white/5",
                    variant === "line" && "bg-transparent border-none gap-6 rounded-none h-auto",
                    props.class
                )}
            >
                <Slot />
            </div>
        );
    }
);

export const TabsTrigger = component$<PropsOf<"button"> & { value: string }>(
    ({ value, ...props }) => {
        const state = useContext(TabsContext);

        // Explicitly track the active state
        const isActive = state.activeId === value;

        const handleClick = $(() => {
            state.activeId = value;
        });

        return (
            <button
                {...props}
                type="button"
                preventdefault:click
                onClick$={handleClick}
                class={cn(
                    "inline-flex items-center justify-center whitespace-nowrap rounded-lg px-4 py-2 text-sm font-bold tracking-tight transition-all duration-300 cursor-pointer overflow-hidden relative group/btn outline-none",
                    isActive
                        ? "bg-primary text-primary-foreground shadow-lg shadow-primary/20 scale-[1.02] z-20"
                        : "hover:bg-white/5 hover:text-white opacity-60 hover:opacity-100 z-10",
                    props.class
                )}
            >
                <Slot />
                {/* Underline for non-primary variants */}
                {isActive && !String(props.class).includes('bg-primary') && (
                    <div class="absolute bottom-0 h-0.5 bg-primary w-full animate-in fade-in" />
                )}
            </button>
        );
    }
);

export const TabsContent = component$<{ value: string } & PropsOf<"div">>(
    ({ value, ...props }) => {
        const state = useContext(TabsContext);

        if (state.activeId !== value) return null;

        return (
            <div
                {...props}
                class={cn(
                    "animate-in fade-in slide-in-from-bottom-2 duration-300 flex-1",
                    props.class
                )}
            >
                <Slot />
            </div>
        );
    }
);
