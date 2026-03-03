import { component$, $, type QRL } from "@builder.io/qwik";
import { server$ } from "@builder.io/qwik-city";
import { LuMenu, LuLogOut, LuBell } from "@qwikest/icons/lucide";
import { Button } from "~/components/ui/Button";
import { createSupabaseServerClient } from "~/lib/supabase/server";

interface HeaderProps {
    title?: string;
    userName?: string;
    userInitial?: string;
    onToggleSidebar$?: QRL<() => void>;
}

/**
 * Server-side logout bypass.
 * Signs out the identity on the lattice server.
 */
export const logoutServer = server$(async function () {
    const supabase = createSupabaseServerClient(this);
    const { error } = await supabase.auth.signOut();
    if (error) {
        return { success: false };
    }
    return { success: true };
});

export const Header = component$<HeaderProps>(
    ({
        title = "Dashboard",
        userName = "Operator",
        userInitial = "?",
        onToggleSidebar$,
    }) => {
        const handleLogout = $(async () => {
            const result = await logoutServer();
            if (result.success) {
                // assign is sometimes more reliable on mobile webviews than href
                window.location.assign("/login");
            }
        });

        return (
            <header class="flex h-16 w-full items-center justify-between border-b border-white/5 bg-background px-6 lg:px-10">
                <div class="flex items-center gap-4">
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick$={$(() => onToggleSidebar$?.())}
                        class="lg:hidden"
                    >
                        <LuMenu class="size-5" />
                    </Button>
                    <h1 class="text-lg font-black italic tracking-tight text-white uppercase">{title}</h1>
                </div>

                <div class="flex items-center gap-6">
                    <div class="hidden sm:flex items-center">
                        <Button variant="ghost" size="icon" class="text-muted-foreground hover:text-white">
                            <LuBell class="size-5" />
                        </Button>
                    </div>

                    <div class="flex items-center gap-3">
                        <div class="hidden sm:flex flex-col items-end">
                            <span class="text-[11px] font-bold uppercase tracking-wider text-white italic">{userName}</span>
                            <span class="text-[9px] font-mono text-muted-foreground uppercase opacity-50">Online</span>
                        </div>

                        <div class="size-9 flex items-center justify-center rounded-lg border border-white/10 bg-white/5 font-black italic text-primary text-sm">
                            {userInitial}
                        </div>

                        <Button
                            variant="ghost"
                            size="icon"
                            onClick$={handleLogout}
                            class="text-muted-foreground hover:text-destructive"
                        >
                            <LuLogOut class="size-4" />
                        </Button>
                    </div>
                </div>
            </header>
        );
    },
);
