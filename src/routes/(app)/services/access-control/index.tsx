import { component$, useSignal, useResource$, Resource, $ } from "@builder.io/qwik";
import type { DocumentHead } from "@builder.io/qwik-city";
import { getSystemUsers } from "../../../../services/access-control/handlers/users";
import { UserList } from "../../../../services/access-control/ui/UserList";
import { ManageSheet } from "../../../../services/access-control/ui/ManageSheet";
import { InviteModal } from "../../../../services/access-control/ui/InviteModal";
import { LuShield, LuUserPlus, LuActivity, LuRefreshCw } from "@qwikest/icons/lucide";
import { Button } from "../../../../components/ui/Button";
import type { AuthUser } from "../../../../types/auth";
import { safeServices } from "../../../../services/config";

export default component$(() => {
    const selectedUser = useSignal<AuthUser | null>(null);
    const isSheetOpen = useSignal(false);
    const isInviteOpen = useSignal(false);

    const usersResource = useResource$<AuthUser[]>(async ({ track }) => {
        track(isInviteOpen); // Refresh when invite modal is used (optional)
        return await getSystemUsers();
    });

    const handleManageUser = $((user: AuthUser) => {
        selectedUser.value = user;
        isSheetOpen.value = true;
    });

    return (
        <div class="space-y-12 animate-in fade-in slide-in-from-bottom-2 duration-500">
            {/* Header / Sub-Dashboard */}
            <header class="flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div class="space-y-1.5 flex flex-col">
                    <div class="flex items-center gap-2 mb-2">
                        <div class="size-2 rounded-full bg-primary animate-pulse" />
                        <span class="text-[9px] font-black uppercase tracking-[0.4em] text-muted-foreground/40 italic">LATTICE_NODE_MASTER</span>
                    </div>
                    <h1 class="text-4xl sm:text-5xl font-black italic tracking-tighter text-white uppercase">
                        ACCESS_CONTROL
                    </h1>
                    <p class="text-xs sm:text-sm text-muted-foreground font-mono tracking-widest uppercase opacity-40 italic">
                        Node Permissions / Identity Delegation / Permission Matrix
                    </p>
                </div>

                <Button
                    onClick$={$(() => (isInviteOpen.value = true))}
                    class="h-12 px-8 font-black uppercase italic tracking-[0.2em] shadow-primary/20"
                >
                    <LuUserPlus class="size-4 mr-2" />
                    DELEGATE_NODE
                </Button>
            </header>

            {/* Quick Metrics */}
            <div class="grid grid-cols-1 sm:grid-cols-3 gap-6">
                <div class="glass-card p-6 border border-white/5 space-y-2 group transition-all hover:bg-white/[0.03]">
                    <div class="flex items-center justify-between opacity-40 group-hover:opacity-100 transition-opacity">
                        <span class="text-[9px] font-black uppercase tracking-widest text-muted-foreground">TOTAL_NODES</span>
                        <LuShield class="size-3 text-primary" />
                    </div>
                    <Resource
                        value={usersResource}
                        onPending={() => <div class="h-8 w-12 bg-white/5 rounded animate-pulse" />}
                        onResolved={(users) => <p class="text-3xl font-black italic text-white uppercase">{users.length}</p>}
                    />
                </div>
                <div class="glass-card p-6 border border-white/5 space-y-2 group transition-all hover:bg-white/[0.03]">
                    <div class="flex items-center justify-between opacity-40 group-hover:opacity-100 transition-opacity">
                        <span class="text-[9px] font-black uppercase tracking-widest text-muted-foreground">ENABLED_MODULES</span>
                        <LuActivity class="size-3 text-accent" />
                    </div>
                    <p class="text-3xl font-black italic text-white uppercase">{safeServices.length}</p>
                </div>
                <div class="glass-card p-6 border border-white/5 space-y-2 group transition-all hover:bg-white/[0.03]">
                    <div class="flex items-center justify-between opacity-40 group-hover:opacity-100 transition-opacity">
                        <span class="text-[9px] font-black uppercase tracking-widest text-muted-foreground">LATTICE_STATUS</span>
                        <div class="size-2 rounded-full bg-success shadow-[0_0_8px_rgba(var(--color-success),0.5)]" />
                    </div>
                    <p class="text-3xl font-black italic text-white uppercase tracking-tighter">SECURED</p>
                </div>
            </div>

            {/* User Directory */}
            <div class="space-y-4">
                <div class="flex items-center gap-3 opacity-30">
                    <LuShield class="size-3" />
                    <span class="text-[9px] font-black uppercase tracking-[0.4em] italic">IDENTITY_REGISTRY_DATABASE</span>
                </div>

                <Resource
                    value={usersResource}
                    onPending={() => (
                        <div class="flex flex-col items-center justify-center p-24 text-center">
                            <LuRefreshCw class="size-12 animate-spin text-primary/20 mb-4" />
                            <p class="text-[10px] font-black uppercase tracking-[0.4em] text-muted-foreground/30 animate-pulse">Scanning_Lattice_Protocol...</p>
                        </div>
                    )}
                    onResolved={(users) => (
                        <div class="animate-in fade-in slide-in-from-bottom-4 duration-700 delay-300">
                            <UserList users={users} onManage$={handleManageUser} />
                        </div>
                    )}
                />
            </div>

            {/* Overlays */}
            <InviteModal showSig={isInviteOpen} />
            <ManageSheet showSig={isSheetOpen} userSig={selectedUser} />
        </div>
    );
});

export const head: DocumentHead = {
    title: "ACCESS_CONTROL | PhantomDeck Intelligence",
    meta: [
        {
            name: "description",
            content: "Centralized identity and permission management for the Phantom Intelligence ecosystem.",
        },
    ],
};
