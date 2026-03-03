import { component$, useSignal, $ } from "@builder.io/qwik";
import { LuActivity } from "@qwikest/icons/lucide";
import { UserRegistry } from "./UserRegistry";
import { AccountRegistry } from "./AccountRegistry";
import { cn } from "../../../utils/cn";

import { useLayoutData } from "../../../routes/(app)/layout";

export const SyvexBankUI = component$(() => {
    const layoutData = useLayoutData();
    const isAdmin = layoutData.value.user.role === "super_admin";
    const activeView = useSignal<"users" | "accounts">("users");

    const tabs = isAdmin ? (["users", "accounts"] as const) : (["users"] as const);

    return (
        <div class="space-y-10 animate-in fade-in slide-in-from-bottom-2 duration-500">
            {/* Tactical Navigation */}
            <header class="flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div class="space-y-1.5 flex flex-col">
                    <div class="flex items-center gap-2 mb-2">
                        <div class="size-2 rounded-full bg-accent animate-pulse" />
                        <span class="text-[9px] font-black uppercase tracking-[0.4em] text-muted-foreground/40 italic flex items-center gap-2">
                            Syvex Bank <LuActivity class="size-2" />
                        </span>
                    </div>
                    <h1 class="text-4xl sm:text-5xl font-black italic tracking-tighter text-white uppercase">
                        Syvex Bank
                    </h1>
                    <p class="text-xs sm:text-sm text-muted-foreground font-mono tracking-widest uppercase opacity-40 italic">
                        Manage users, accounts, and transaction history
                    </p>
                </div>

                <div class="flex bg-white/5 p-1 rounded-2xl border border-white/5 self-start">
                    {tabs.map((view) => (
                        <button
                            key={view}
                            onClick$={$(() => activeView.value = view)}
                            class={cn(
                                "px-6 py-2 rounded-xl text-[10px] font-black uppercase italic tracking-widest transition-all",
                                activeView.value === view ? "bg-accent text-accent-foreground shadow-lg shadow-accent/20" : "text-muted-foreground/40 hover:text-white"
                            )}
                        >
                            {view.toUpperCase()}
                        </button>
                    ))}
                </div>
            </header>

            {activeView.value === "users" && <UserRegistry />}
            {isAdmin && activeView.value === "accounts" && <AccountRegistry />}
        </div>
    );
});
