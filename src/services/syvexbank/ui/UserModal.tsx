import { component$, useSignal, useTask$, $, type QRL } from "@builder.io/qwik";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from "../../../components/ui/Sheet";
import { createBankUser, updateBankUser } from "../handlers/index";
import type { BankUser } from "../types";
import { LuUser, LuLock, LuShieldAlert, LuSave, LuShieldQuestion, LuActivity } from "@qwikest/icons/lucide";
import { Button } from "../../../components/ui/Button";
import { Input } from "../../../components/ui/Input";
import { cn } from "../../../utils/cn";

interface UserModalProps {
    show: boolean;
    user: BankUser | null;
    onClose$: QRL<() => void>;
    onSuccess$: QRL<() => void>;
}

const blank = () => ({
    full_name: "",
    email: "",
    password_hash: "",
    transaction_pin: "1234",
    address: "",
    currency: "USD",
    language: "English",
    savings_balance: 0,
    current_balance: 0,
    is_blocked: false,
    block_reason: "",
    block_description: "",
});

export const UserModal = component$<UserModalProps>(({ show, user, onClose$, onSuccess$ }) => {
    const form = useSignal(blank());
    const isSubmitting = useSignal(false);
    const errorMsg = useSignal("");

    useTask$(({ track }) => {
        track(() => show);
        if (!show) return;

        if (user) {
            const savings = user.accounts?.find((a) => a.type === "Savings");
            const current = user.accounts?.find((a) => a.type === "Current");
            form.value = {
                full_name: user.full_name ?? "",
                email: user.email ?? "",
                password_hash: user.password_hash ?? "",
                transaction_pin: user.transaction_pin ?? "",
                address: user.address ?? "",
                currency: user.settings?.currency ?? "USD",
                language: user.settings?.language ?? "English",
                savings_balance: savings?.balance ?? 0,
                current_balance: current?.balance ?? 0,
                is_blocked: user.is_blocked ?? false,
                block_reason: user.block_info?.reason ?? "",
                block_description: user.block_info?.description ?? "",
            };
        } else {
            form.value = blank();
        }
        errorMsg.value = "";
    });

    const submit = $(async () => {
        isSubmitting.value = true;
        errorMsg.value = "";
        try {
            // Mapping back to the handler format
            const payload = { ...form.value };

            if (user) {
                await updateBankUser(user.id, payload as any);
            } else {
                await createBankUser(payload as any);
            }
            onSuccess$();
            onClose$();
        } catch (e: unknown) {
            errorMsg.value = e instanceof Error ? e.message : "Unknown error";
        } finally {
            isSubmitting.value = false;
        }
    });

    const isEdit = !!user;

    return (
        <Sheet show={show} onClose$={onClose$} side="right" size="lg">
            <SheetContent class="flex flex-col h-full bg-background/95 backdrop-blur-xl border-l border-white/5 p-0">
                <SheetHeader class="p-8 border-b border-white/5 bg-white/[0.02]">
                    <div class="flex items-center gap-5">
                        <div class="size-14 rounded-2xl bg-gradient-to-br from-accent/20 to-transparent border border-accent/20 flex items-center justify-center text-xl font-black italic text-white shadow-2xl">
                            {form.value.full_name?.charAt(0)?.toUpperCase() || "?"}
                        </div>
                        <div class="space-y-1">
                            <SheetTitle class="text-2xl font-black italic tracking-tighter uppercase text-white">
                                {isEdit ? "Edit User" : "Add User"}
                            </SheetTitle>
                            <SheetDescription class="text-[10px] font-mono text-muted-foreground/40 uppercase tracking-[0.2em] italic">
                                {isEdit ? `User ID: ${user?.id.slice(0, 12)}...` : "Create a new bank account"}
                            </SheetDescription>
                        </div>
                    </div>
                </SheetHeader>

                <div class="flex-1 overflow-y-auto p-8 space-y-10 custom-scrollbar">
                    {errorMsg.value && (
                        <div class="p-4 rounded-2xl bg-destructive/10 border border-destructive/20 text-destructive text-xs font-black italic uppercase animate-in shake duration-300">
                            {errorMsg.value}
                        </div>
                    )}

                    {/* Personal Matrix */}
                    <div class="space-y-6">
                        <div class="flex items-center gap-3 opacity-30">
                            <LuUser class="size-3 text-accent" />
                            <span class="text-[9px] font-black uppercase tracking-[0.4em] italic text-white">Personal Information</span>
                        </div>
                        <div class="grid grid-cols-1 gap-6">
                            <div class="space-y-2">
                                <label class="text-[10px] font-black uppercase tracking-widest text-muted-foreground/60 italic ml-1">Full Name</label>
                                <Input
                                    placeholder="Enter full name"
                                    value={form.value.full_name}
                                    onInput$={(e) => (form.value = { ...form.value, full_name: (e.target as HTMLInputElement).value })}
                                />
                            </div>
                            <div class="space-y-2">
                                <label class="text-[10px] font-black uppercase tracking-widest text-muted-foreground/60 italic ml-1">Email Address</label>
                                <Input
                                    type="email"
                                    placeholder="identity@syvex.io"
                                    value={form.value.email}
                                    onInput$={(e) => (form.value = { ...form.value, email: (e.target as HTMLInputElement).value })}
                                />
                            </div>
                            <div class="space-y-2">
                                <label class="text-[10px] font-black uppercase tracking-widest text-muted-foreground/60 italic ml-1">Address</label>
                                <Input
                                    placeholder="Physical Location"
                                    value={form.value.address}
                                    onInput$={(e) => (form.value = { ...form.value, address: (e.target as HTMLInputElement).value })}
                                />
                            </div>
                        </div>
                    </div>

                    {/* Security Gate */}
                    <div class="space-y-6">
                        <div class="flex items-center gap-3 opacity-30">
                            <LuLock class="size-3 text-accent" />
                            <span class="text-[9px] font-black uppercase tracking-[0.4em] italic text-white">Security</span>
                        </div>
                        <div class="grid grid-cols-2 gap-6">
                            <div class="space-y-2">
                                <label class="text-[10px] font-black uppercase tracking-widest text-muted-foreground/60 italic ml-1">{isEdit ? "Update Password" : "Password"}</label>
                                <Input
                                    placeholder={isEdit ? "Leave empty to keep current" : "Secure Password"}
                                    value={form.value.password_hash}
                                    onInput$={(e) => (form.value = { ...form.value, password_hash: (e.target as HTMLInputElement).value })}
                                />
                            </div>
                            <div class="space-y-2 text-center">
                                <label class="text-[10px] font-black uppercase tracking-widest text-muted-foreground/60 italic ml-1">Transaction PIN</label>
                                <Input
                                    maxLength={4}
                                    placeholder="0000"
                                    class="text-center font-mono tracking-[0.5em] text-accent font-black text-lg"
                                    value={form.value.transaction_pin}
                                    onInput$={(e) => (form.value = { ...form.value, transaction_pin: (e.target as HTMLInputElement).value })}
                                />
                            </div>
                        </div>
                    </div>

                    {/* Ledger Control */}
                    <div class="space-y-6">
                        <div class="flex items-center gap-3 opacity-30">
                            <LuShieldQuestion class="size-3 text-accent" />
                            <span class="text-[9px] font-black uppercase tracking-[0.4em] italic text-white">Balances</span>
                        </div>
                        <div class="grid grid-cols-2 gap-6 p-6 rounded-3xl bg-white/[0.02] border border-white/5">
                            <div class="space-y-2">
                                <label class="text-[10px] font-black uppercase tracking-widest text-muted-foreground/40 italic ml-1">Savings Balance</label>
                                <Input
                                    type="number"
                                    class="text-success font-black tabular-nums"
                                    value={form.value.savings_balance.toString()}
                                    onInput$={(e) => (form.value = { ...form.value, savings_balance: Number((e.target as HTMLInputElement).value) })}
                                />
                            </div>
                            <div class="space-y-2">
                                <label class="text-[10px] font-black uppercase tracking-widest text-muted-foreground/40 italic ml-1">Current Balance</label>
                                <Input
                                    type="number"
                                    class="text-accent font-black tabular-nums"
                                    value={form.value.current_balance.toString()}
                                    onInput$={(e) => (form.value = { ...form.value, current_balance: Number((e.target as HTMLInputElement).value) })}
                                />
                            </div>
                        </div>
                    </div>

                    {/* Restriction Matrix */}
                    <div class={cn(
                        "p-8 rounded-3xl transition-all duration-500",
                        form.value.is_blocked ? "bg-destructive/10 border border-destructive/20 shadow-[0_0_30px_rgba(var(--color-destructive),0.05)]" : "bg-white/[0.01] border border-white/5 opacity-40 hover:opacity-70"
                    )}>
                        <label class="flex items-center gap-4 cursor-pointer group">
                            <div class="relative flex items-center">
                                <input
                                    type="checkbox"
                                    class="peer sr-only"
                                    checked={form.value.is_blocked}
                                    onChange$={(e) => (form.value = { ...form.value, is_blocked: (e.target as HTMLInputElement).checked })}
                                />
                                <div class="size-6 rounded-lg border-2 border-white/10 peer-checked:border-destructive peer-checked:bg-destructive transition-all flex items-center justify-center">
                                    {form.value.is_blocked && <LuShieldAlert class="size-4 text-white animate-in zoom-in duration-300" />}
                                </div>
                            </div>
                            <span class={cn(
                                "text-xs font-black uppercase italic tracking-widest transition-colors",
                                form.value.is_blocked ? "text-destructive" : "text-muted-foreground group-hover:text-white"
                            )}>
                                {form.value.is_blocked ? "User is Blocked" : "Block User Account"}
                            </span>
                        </label>

                        {form.value.is_blocked && (
                            <div class="mt-6 space-y-4 animate-in slide-in-from-top-2 duration-500">
                                <div class="space-y-2">
                                    <label class="text-[9px] font-black uppercase text-destructive/60 tracking-widest italic ml-1">Reason</label>
                                    <Input
                                        placeholder="Reason for blocking..."
                                        class="bg-destructive/5 border-destructive/10 focus:border-destructive/30"
                                        value={form.value.block_reason}
                                        onInput$={(e) => (form.value = { ...form.value, block_reason: (e.target as HTMLInputElement).value })}
                                    />
                                </div>
                                <div class="space-y-2">
                                    <label class="text-[9px] font-black uppercase text-destructive/60 tracking-widest italic ml-1">Notes</label>
                                    <textarea
                                        rows={3}
                                        placeholder="Internal notes..."
                                        class="w-full bg-destructive/5 border border-destructive/10 rounded-2xl p-4 text-xs font-black uppercase italic tracking-widest text-white focus:outline-none focus:border-destructive/30 transition-all resize-none"
                                        value={form.value.block_description}
                                        onInput$={(e) => (form.value = { ...form.value, block_description: (e.target as HTMLTextAreaElement).value })}
                                    />
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                <div class="p-8 bg-white/[0.02] border-t border-white/5 flex gap-4">
                    <Button
                        variant="glass"
                        class="flex-1 h-14 font-black uppercase italic tracking-widest opacity-40 hover:opacity-100"
                        onClick$={onClose$}
                    >
                        Cancel
                    </Button>
                    <Button
                        class="flex-1 h-14 font-black uppercase italic tracking-[0.2em] bg-accent text-accent-foreground shadow-lg shadow-accent/20"
                        disabled={isSubmitting.value}
                        onClick$={submit}
                    >
                        {isSubmitting.value ? (
                            <LuActivity class="size-4 animate-spin" />
                        ) : (
                            <><LuSave class="size-4 mr-2" /> Save Changes</>
                        )}
                    </Button>
                </div>
            </SheetContent>
        </Sheet>
    );
});
