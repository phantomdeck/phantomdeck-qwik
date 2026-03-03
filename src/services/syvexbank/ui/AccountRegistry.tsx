import { component$, useSignal, useResource$, Resource, $ } from "@builder.io/qwik";
import { getBankAccounts, deleteBankAccount } from "../handlers/index";
import type { GeneralAccount } from "../types";
import { Button } from "../../../components/ui/Button";
import {
    LuLayers,
    LuPlus,
    LuEraser,
    LuBuilding,
    LuActivity,
    LuHistory,
    LuGlobe
} from "@qwikest/icons/lucide";
import { cn } from "../../../utils/cn";
import { GeneralAccountModal } from "./GeneralAccountModal";

export const AccountRegistry = component$(() => {
    const refreshTrigger = useSignal(0);
    const showModal = useSignal(false);

    const accountsResource = useResource$<GeneralAccount[]>(async ({ track }) => {
        track(refreshTrigger);
        return await getBankAccounts();
    });

    const handleDelete = $(async (id: string, name: string) => {
        if (!confirm(`Are you sure you want to delete account node "${name}"?`)) return;
        try {
            await deleteBankAccount(id);
            refreshTrigger.value++;
        } catch (err) {
            console.error("Scale-Down Failed:", err);
            alert("Institutional Protocol: Delete failed.");
        }
    });

    return (
        <div class="space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-700">
            {/* Control Strip */}
            <div class="flex items-center justify-between">
                <div class="flex items-center gap-3 opacity-30">
                    <LuGlobe class="size-3" />
                    <span class="text-[9px] font-black uppercase tracking-[0.4em] italic text-primary">Bank Accounts</span>
                </div>
                <Button
                    onClick$={() => showModal.value = true}
                    class="h-12 px-8 font-black uppercase italic tracking-[0.2em] shadow-primary/20 bg-primary/20 text-primary hover:bg-primary/30 w-full sm:w-auto"
                >
                    <LuPlus class="size-4 mr-2" />
                    Add Account
                </Button>
            </div>

            {/* Matrix Grid */}
            <Resource
                value={accountsResource}
                onPending={() => (
                    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 opacity-40 animate-pulse">
                        {[1, 2, 3].map(i => (
                            <div key={i} class="h-48 rounded-3xl bg-white/5 border border-white/5" />
                        ))}
                    </div>
                )}
                onResolved={(accounts) => (
                    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {accounts.length === 0 ? (
                            <div class="col-span-full py-32 text-center rounded-3xl border border-white/5 bg-white/[0.01]">
                                <LuLayers class="size-12 mx-auto mb-4 text-muted-foreground/10" />
                                <p class="text-[10px] font-black uppercase tracking-[0.4em] text-muted-foreground/20 italic">No bank accounts found.</p>
                            </div>
                        ) : (
                            accounts.map((acc) => (
                                <div key={acc.id} class="glass-card p-6 border border-white/5 bg-white/[0.01] hover:bg-white/[0.03] transition-all group relative overflow-hidden">
                                    {/* Background Decor */}
                                    <div class="absolute -right-10 -bottom-10 size-40 rounded-full bg-primary/5 blur-3xl group-hover:bg-primary/10 transition-colors opacity-40" />

                                    <header class="flex items-start justify-between mb-6">
                                        <div class="size-12 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary shadow-lg shadow-primary/10">
                                            <LuBuilding class="size-5" />
                                        </div>
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            class="opacity-20 hover:text-destructive hover:opacity-100 transition-all -mr-2"
                                            onClick$={() => handleDelete(acc.id, acc.full_name)}
                                        >
                                            <LuEraser class="size-4" />
                                        </Button>
                                    </header>

                                    <div class="space-y-1">
                                        <h3 class="text-lg font-black italic text-white uppercase tracking-tight group-hover:text-primary transition-colors">{acc.full_name}</h3>
                                        <p class="text-[9px] font-mono text-accent/60 uppercase tracking-widest font-black italic">{acc.bank_name}</p>
                                    </div>

                                    <div class="mt-6 pt-6 border-t border-white/5 grid grid-cols-2 gap-4">
                                        <div class="space-y-1">
                                            <p class="text-[8px] font-mono text-muted-foreground/30 uppercase tracking-widest">Type</p>
                                            <p class="text-[11px] font-black italic text-white/50 uppercase">{acc.type}</p>
                                        </div>
                                        <div class="space-y-1 text-right">
                                            <p class="text-[8px] font-mono text-muted-foreground/30 uppercase tracking-widest">Account No.</p>
                                            <p class="text-[11px] font-mono font-bold text-white/80 tabular-nums">{acc.account_number}</p>
                                        </div>
                                    </div>

                                    <footer class="mt-6 flex items-center justify-end">
                                        <button class="flex items-center gap-1.5 text-[9px] font-black italic uppercase tracking-widest text-muted-foreground/40 hover:text-white transition-opacity">
                                            <LuHistory class="size-3" /> History
                                        </button>
                                    </footer>
                                </div>
                            ))
                        )}
                    </div>
                )}
            />

            <GeneralAccountModal
                show={showModal.value}
                onClose$={$(() => showModal.value = false)}
                onSuccess$={$(() => refreshTrigger.value++)}
            />
        </div>
    );
});
