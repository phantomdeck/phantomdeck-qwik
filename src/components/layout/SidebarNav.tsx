import { component$, Slot } from "@builder.io/qwik";
import { Link, useLocation } from "@builder.io/qwik-city";
import { cn } from "~/utils/cn";

/**
 * Simplified Sidebar Navigation
 */

interface NavItemProps {
    href: string;
    label: string;
    class?: string;
}

export const SidebarNav = component$(() => {
    return (
        <nav class="flex h-full flex-col px-4 py-8">
            <ul class="flex-1 space-y-1 overflow-y-auto">
                <Slot />
            </ul>
        </nav>
    );
});

export const SidebarNavItem = component$<NavItemProps>(({ href, label, ...props }) => {
    const location = useLocation();

    const isActive = href === "/"
        ? location.url.pathname === "/"
        : location.url.pathname.startsWith(href);

    return (
        <li>
            <Link
                href={href}
                class={cn(
                    "flex h-10 w-full items-center gap-3 rounded-lg px-4 text-xs font-bold uppercase tracking-wider transition-colors",
                    isActive
                        ? "bg-primary/10 text-primary"
                        : "text-muted-foreground hover:bg-white/5 hover:text-white",
                    props.class
                )}
            >
                <div class={cn(
                    "flex size-4 items-center justify-center",
                    isActive ? "text-primary" : "opacity-40"
                )}>
                    <Slot name="icon" />
                </div>
                <span>{label}</span>
            </Link>
        </li>
    );
});

export const SidebarNavHeading = component$((props: { label: string }) => {
    return (
        <li class="pb-1 pt-6 px-4">
            <span class="text-[10px] font-black uppercase tracking-widest text-muted-foreground/30">
                {props.label}
            </span>
        </li>
    );
});
