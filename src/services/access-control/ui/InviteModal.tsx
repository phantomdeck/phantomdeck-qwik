import { component$, type Signal, useSignal, $ } from "@builder.io/qwik";
import {
    Dialog,
    DialogContent,
} from "../../../components/ui/Dialog";
import { Button } from "../../../components/ui/Button";
import { Input } from "../../../components/ui/Input";
// Removed unused imports from Field
import { LuSend, LuUserPlus, LuHistory, LuCircleDot, LuShield, LuRefreshCw } from "@qwikest/icons/lucide";
import { safeServices } from "../../config";
import { Switch } from "../../../components/ui/Switch";
import { cn } from "../../../utils/cn";

/**
 * Tactical Invite Engine v2.1
 * Refined to match the "Old Project" structural patterns while maintaining "Cyber Pro" aesthetics.
 * Ensures centered layout and tabbed control matrix.
 */

interface InviteModalProps {
    showSig: Signal<boolean>;
}

export const InviteModal = component$<InviteModalProps>(({ showSig }) => {
    const activeTab = useSignal<"invite" | "pending">("invite");
    const email = useSignal("");
    const isSubmitting = useSignal(false);

    // Mock pending invites for visual perfection
    const pendingInvites = useSignal([
        { id: "1", email: "operator_01@node.io", status: "PENDING", date: "2024-03-01" },
        { id: "2", email: "alpha_lead@void.net", status: "PENDING", date: "2024-02-28" },
    ]);

    const handleSendInvite = $(async () => {
        isSubmitting.value = true;
        await new Promise(resolve => setTimeout(resolve, 1500));
        isSubmitting.value = false;
        showSig.value = false;
        email.value = "";
    });

    return (
        <Dialog show={showSig.value} onClose$={$(() => (showSig.value = false))} size="lg">
            <DialogContent class="p-0 overflow-hidden flex flex-col bg-background/95 backdrop-blur-xl">
                {/* Tactical Tabs - Structural Match */}
                <div class="flex border-b border-white/5 bg-white/[0.02] p-1">
                    <button
                        onClick$={$(() => activeTab.value = "invite")}
                        class={cn(
                            "flex-1 flex items-center justify-center gap-2 py-4 text-[10px] font-black uppercase italic tracking-[0.2em] transition-all border-b-2",
                            activeTab.value === "invite" ? "border-primary text-primary bg-primary/5" : "border-transparent text-muted-foreground/40 hover:text-white hover:bg-white/5"
                        )}
                    >
                        <LuUserPlus class="size-3.5" />
                        NEW_INVITATION
                    </button>
                    <button
                        onClick$={$(() => activeTab.value = "pending")}
                        class={cn(
                            "flex-1 flex items-center justify-center gap-2 py-4 text-[10px] font-black uppercase italic tracking-[0.2em] transition-all border-b-2",
                            activeTab.value === "pending" ? "border-primary text-primary bg-primary/5" : "border-transparent text-muted-foreground/40 hover:text-white hover:bg-white/5"
                        )}
                    >
                        <LuHistory class="size-3.5" />
                        PENDING_SIGNALS
                    </button>
                </div>

                {activeTab.value === "invite" ? (
                    <div class="p-8 space-y-10 animate-in fade-in slide-in-from-bottom-2 duration-500">
                        <div class="space-y-2">
                            <div class="flex items-center gap-2 opacity-50 mb-1">
                                <LuShield class="size-3 text-primary" />
                                <span class="text-[9px] font-black tracking-[0.3em] uppercase">IDENTITY_DELEGATION_PROTOCOL</span>
                            </div>
                            <p class="text-xs text-muted-foreground/60 italic leading-relaxed">
                                Set initial access levels for the new node identity. Transmition will initiate upon commitment.
                            </p>
                        </div>

                        <div class="space-y-6">
                            <div class="space-y-2">
                                <label class="text-[10px] font-black uppercase tracking-widest text-muted-foreground/60 italic ml-1">Target_Identity_Email</label>
                                <Input
                                    type="email"
                                    placeholder="operator@lattice.io"
                                    value={email.value}
                                    onInput$={(e: any) => (email.value = (e.target as HTMLInputElement).value)}
                                    class="bg-white/[0.03] border-white/5 h-14 focus:border-primary/50 text-base font-mono"
                                />
                            </div>

                            <div class="space-y-4">
                                <h4 class="font-mono text-[9px] font-black uppercase tracking-[0.4em] text-muted-foreground/30 italic px-1">LATTICE_PERMISSION_MATRIX</h4>
                                <div class="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-[30vh] overflow-y-auto pr-2 custom-scrollbar">
                                    {safeServices.map((service: any) => (
                                        <div key={service.id} class="flex items-center justify-between p-4 rounded-2xl border border-white/5 bg-white/[0.02] hover:bg-white/[0.04] transition-colors group">
                                            <div class="flex flex-col">
                                                <span class="text-sm font-black italic text-white uppercase tracking-tight group-hover:text-primary transition-colors">{service.name}</span>
                                                <span class="text-[9px] font-mono text-muted-foreground/40 uppercase tracking-widest">SID: {service.id}</span>
                                            </div>
                                            <Switch class="scale-90" />
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        <div class="pt-6 flex flex-col sm:flex-row items-center gap-4">
                            <Button
                                variant="glass"
                                onClick$={$(() => (showSig.value = false))}
                                class="w-full sm:w-auto px-8 h-14 uppercase font-black italic tracking-widest text-[11px] opacity-40 hover:opacity-100"
                            >
                                ABORT_LINK
                            </Button>
                            <Button
                                onClick$={handleSendInvite}
                                disabled={!email.value.includes("@") || isSubmitting.value}
                                class="w-full sm:flex-1 font-black uppercase italic tracking-[0.2em] h-14 shadow-primary/20 bg-primary text-primary-foreground"
                            >
                                {isSubmitting.value ? (
                                    <span class="flex items-center gap-3">
                                        <LuRefreshCw class="size-4 animate-spin" />
                                        TRANSMITTING...
                                    </span>
                                ) : (
                                    <span class="flex items-center gap-3"><LuSend class="size-4" /> COMMIT_INVITATION</span>
                                )}
                            </Button>
                        </div>
                    </div>
                ) : (
                    <div class="p-8 space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-500 min-h-[400px]">
                        <div class="flex items-center justify-between px-2">
                            <h3 class="text-[10px] font-black uppercase tracking-[0.4em] text-muted-foreground/30 italic">Active_Lattice_Signals</h3>
                            <span class="bg-primary/10 text-primary text-[9px] font-black px-3 py-1 rounded-xl uppercase italic border border-primary/20 shadow-lg shadow-primary/10">{pendingInvites.value.length} TOTAL_PENDING</span>
                        </div>

                        <div class="rounded-3xl border border-white/5 bg-white/[0.01] overflow-hidden flex-1">
                            <table class="w-full border-collapse">
                                <thead>
                                    <tr class="bg-white/[0.03] border-b border-white/5">
                                        <th class="px-8 py-5 text-left text-[10px] font-black uppercase tracking-widest text-muted-foreground italic">Node_Identity</th>
                                        <th class="px-8 py-5 text-left text-[10px] font-black uppercase tracking-widest text-muted-foreground italic">Status</th>
                                        <th class="px-8 py-5 text-right text-[10px] font-black uppercase tracking-widest text-muted-foreground italic">Sync_Time</th>
                                    </tr>
                                </thead>
                                <tbody class="divide-y divide-white/5">
                                    {pendingInvites.value.length === 0 ? (
                                        <tr>
                                            <td colSpan={3} class="py-32 text-center">
                                                <LuCircleDot class="size-8 mx-auto mb-4 text-muted-foreground/10" />
                                                <p class="text-[10px] font-black uppercase tracking-[0.4em] text-muted-foreground/20 italic">No active signals detected.</p>
                                            </td>
                                        </tr>
                                    ) : (
                                        pendingInvites.value.map((invite) => (
                                            <tr key={invite.id} class="hover:bg-white/[0.02] transition-colors group cursor-pointer">
                                                <td class="px-8 py-5">
                                                    <span class="text-sm font-black italic text-white uppercase tracking-tight group-hover:text-primary transition-colors">{invite.email}</span>
                                                </td>
                                                <td class="px-8 py-5">
                                                    <div class="flex items-center gap-2 text-[10px] font-black italic text-accent uppercase animate-pulse">
                                                        <LuCircleDot class="size-3" /> {invite.status}
                                                    </div>
                                                </td>
                                                <td class="px-8 py-5 text-right">
                                                    <span class="text-[10px] font-mono text-muted-foreground/40 tabular-nums uppercase">{invite.date}</span>
                                                </td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}
            </DialogContent>
        </Dialog>
    );
});
