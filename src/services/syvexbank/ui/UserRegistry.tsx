import { component$, useSignal, useResource$, Resource, $, type QRL } from "@builder.io/qwik";
import { Link } from "@builder.io/qwik-city";
import { getBankUsers, deleteBankUser, blockBankUser } from "../handlers/index";
import type { BankUser } from "../types";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "../../../components/ui/Table";
import { Button } from "../../../components/ui/Button";
import {
    LuUser,
    LuLock,
    LuShield,
    LuActivity,
    LuMoreVertical,
    LuHistory,
    LuUserPlus,
    LuEraser,
    LuRefreshCw,
    LuShieldCheck,
    LuSettings2,
} from "@qwikest/icons/lucide";
import { cn } from "../../../utils/cn";
import { Badge } from "../../../components/ui/Badge";
import { UserModal } from "./UserModal";

// --- Tactical Actions Dropdown (Viewport Fixed) ---
export const ActionsDropdown = component$<{
    user: BankUser;
    onManage$: QRL<() => void>;
    onToggleBlock$: QRL<() => void>;
    onDelete$: QRL<() => void>;
}>(({ user, onManage$, onToggleBlock$, onDelete$ }) => {
    const isOpen = useSignal(false);
    const triggerRef = useSignal<HTMLButtonElement>();
    const pos = useSignal({ top: 0, left: 0 });

    const toggleMenu = $(() => {
        if (!isOpen.value && triggerRef.value) {
            const rect = triggerRef.value.getBoundingClientRect();
            // Position fixed menu below the button, aligned to the right
            pos.value = {
                top: rect.bottom + 8,
                left: rect.right - 224
            };
        }
        isOpen.value = !isOpen.value;
    });

    return (
        <div class="relative inline-block">
            <button
                ref={triggerRef}
                onClick$={toggleMenu}
                class="p-2 rounded-xl hover:bg-white/5 transition-colors opacity-40 hover:opacity-100 outline-none"
            >
                <LuMoreVertical class="size-4 text-white" />
            </button>

            {isOpen.value && (
                <>
                    {/* Viewport Overlay */}
                    <div
                        class="fixed inset-0 z-[100]"
                        onClick$={() => isOpen.value = false}
                    />
                    {/* Fixed Positioning Menu */}
                    <div
                        style={{
                            position: 'fixed',
                            top: `${pos.value.top}px`,
                            left: `${pos.value.left}px`,
                        }}
                        class="z-[101] w-56 animate-in fade-in zoom-in-95 duration-200"
                    >
                        <div class="glass-card rounded-2xl shadow-3xl overflow-hidden border border-white/10 bg-background/95 backdrop-blur-3xl shadow-black/80">
                            <div class="p-2 space-y-1">
                                <button
                                    onClick$={() => { isOpen.value = false; onManage$(); }}
                                    class="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-[10px] font-black uppercase italic tracking-widest text-muted-foreground hover:bg-white/5 hover:text-white transition-all group"
                                >
                                    <LuSettings2 class="size-3.5 group-hover:scale-110 transition-transform text-accent" /> Edit Profile
                                </button>
                                <Link
                                    href={`/services/syvexbank/users/${user.id}/transactions`}
                                    class="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-[10px] font-black uppercase italic tracking-widest text-muted-foreground hover:bg-white/5 hover:text-white transition-all group"
                                >
                                    <LuHistory class="size-3.5 group-hover:scale-110 transition-transform text-accent" /> Transactions
                                </Link>
                                <button
                                    onClick$={() => { isOpen.value = false; onToggleBlock$(); }}
                                    class={cn(
                                        "w-full flex items-center gap-3 px-4 py-3 rounded-xl text-[10px] font-black uppercase italic tracking-widest transition-all group",
                                        user.is_blocked ? "text-success hover:bg-success/5" : "text-warning hover:bg-warning/5"
                                    )}
                                >
                                    {user.is_blocked ? <LuShieldCheck class="size-3.5" /> : <LuShield class="size-3.5" />}
                                    {user.is_blocked ? "Unblock User" : "Block User"}
                                </button>
                                <div class="h-px bg-white/5 my-1 mx-2" />
                                <button
                                    onClick$={() => { isOpen.value = false; onDelete$(); }}
                                    class="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-[10px] font-black uppercase italic tracking-widest text-destructive hover:bg-destructive/10 transition-all group"
                                >
                                    <LuEraser class="size-3.5 group-hover:rotate-12 transition-transform" /> Delete Account
                                </button>
                            </div>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
});

export const UserRegistry = component$(() => {
    const refreshTrigger = useSignal(0);

    // UI State for Modals
    const showUserModal = useSignal(false);
    const selectedUser = useSignal<BankUser | null>(null);

    const usersResource = useResource$<BankUser[]>(async ({ track }) => {
        track(refreshTrigger);
        return await getBankUsers();
    });

    const openManage = $((user: BankUser | null) => {
        selectedUser.value = user;
        showUserModal.value = true;
    });

    const handleDelete = $(async (user: BankUser) => {
        if (!confirm(`Are you sure you want to delete account "${user.full_name}"?`)) return;
        try {
            await deleteBankUser(user.id);
            refreshTrigger.value++;
        } catch (err) {
            console.error("Purge Failed:", err);
            alert("Delete failed. Check node connectivity.");
        }
    });

    const toggleBlock = $(async (user: BankUser) => {
        const nowBlocked = !user.is_blocked;
        try {
            await blockBankUser(user.id, nowBlocked, nowBlocked ? "ADMIN_MANUAL_HALT" : "");
            refreshTrigger.value++;
        } catch (err) {
            console.error("Restriction Failed:", err);
            alert("Access update failed.");
        }
    });

    return (
        <div class="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-700">
            {/* Control Strip */}
            <div class="flex items-center justify-between">
                <div class="flex items-center gap-2 opacity-30">
                    <LuUser class="size-3 text-accent" />
                    <span class="text-[9px] font-black uppercase tracking-[0.4em] italic">User List</span>
                </div>
                <Button
                    onClick$={() => openManage(null)}
                    class="h-12 px-8 font-black uppercase italic tracking-[0.15em] shadow-accent/20 bg-accent text-accent-foreground w-full sm:w-auto hover:bg-accent/90"
                >
                    <LuUserPlus class="size-4 mr-2" />
                    Add User
                </Button>
            </div>

            {/* Matrix Table */}
            <Resource
                value={usersResource}
                onPending={() => (
                    <div class="flex flex-col items-center justify-center p-32 text-center rounded-3xl border border-white/5 bg-white/[0.01]">
                        <LuRefreshCw class="size-12 animate-spin text-accent/20 mb-4" />
                        <p class="text-[10px] font-black uppercase tracking-[0.4em] text-muted-foreground/30 animate-pulse">Syncing Users...</p>
                    </div>
                )}
                onResolved={(users) => {
                    return (
                        <div class="rounded-3xl border border-white/5 bg-white/[0.01]">
                            <Table>
                                <TableHeader>
                                    <TableRow class="bg-white/[0.02]">
                                        <TableHead class="pl-8">User</TableHead>
                                        <TableHead class="hidden md:table-cell">Password</TableHead>
                                        <TableHead class="hidden lg:table-cell">Transaction PIN</TableHead>
                                        <TableHead>Status</TableHead>
                                        <TableHead class="text-right pr-8">Actions</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {users.length === 0 ? (
                                        <TableRow>
                                            <TableCell colSpan={5} class="h-64 text-center">
                                                <LuUser class="size-8 mx-auto mb-4 text-muted-foreground/10" />
                                                <p class="text-[10px] font-black uppercase tracking-[0.4em] text-muted-foreground/20 italic">No nodes detected.</p>
                                            </TableCell>
                                        </TableRow>
                                    ) : (
                                        users.map(user => (
                                            <TableRow
                                                key={user.id}
                                                onClick$={() => openManage(user)}
                                                class="hover:bg-white/[0.02] transition-colors group cursor-pointer border-white/5"
                                            >
                                                <TableCell class="pl-8 py-5">
                                                    <div class="flex items-center gap-4">
                                                        <div class="size-10 rounded-xl bg-gradient-to-br from-white/10 to-transparent border border-white/10 flex items-center justify-center text-xs font-black italic text-white shadow-xl group-hover:from-accent/20 transition-all">
                                                            {user.full_name[0].toUpperCase()}
                                                        </div>
                                                        <div class="flex flex-col">
                                                            <span class="text-sm font-black italic text-white uppercase tracking-tight group-hover:text-accent transition-colors">{user.full_name}</span>
                                                            <span class="text-[9px] font-mono text-muted-foreground/30 uppercase tracking-widest">{user.email}</span>
                                                        </div>
                                                    </div>
                                                </TableCell>
                                                <TableCell class="hidden md:table-cell py-5">
                                                    <div class="flex items-center gap-2 text-[10px] font-mono text-muted-foreground/40 italic">
                                                        <LuLock class="size-3 text-accent/40" />
                                                        <span class="tracking-tighter opacity-30 group-hover:opacity-100 transition-opacity">{user.password_hash || "********"}</span>
                                                    </div>
                                                </TableCell>
                                                <TableCell class="hidden lg:table-cell py-5">
                                                    <div class="flex items-center gap-2 text-[10px] font-black italic text-accent tracking-[0.2em] opacity-40 group-hover:opacity-100 transition-opacity">
                                                        <LuShield class="size-3" /> {user.transaction_pin || "—"}
                                                    </div>
                                                </TableCell>
                                                <TableCell class="py-5">
                                                    {user.is_blocked ? (
                                                        <Badge variant="destructive" class="px-3 py-1 bg-destructive/10 border-destructive/20 text-[9px] font-black italic">Blocked</Badge>
                                                    ) : (
                                                        <Badge variant="accent" class="px-3 py-1 bg-accent/10 border-accent/20 text-[9px] font-black italic">Active</Badge>
                                                    )}
                                                </TableCell>
                                                <TableCell class="text-right pr-8 py-5">
                                                    <div onClick$={(e) => e.stopPropagation()}>
                                                        <ActionsDropdown
                                                            user={user}
                                                            onManage$={() => openManage(user)}
                                                            onToggleBlock$={() => toggleBlock(user)}
                                                            onDelete$={() => handleDelete(user)}
                                                        />
                                                    </div>
                                                </TableCell>
                                            </TableRow>
                                        ))
                                    )}
                                </TableBody>
                            </Table>
                        </div>
                    );
                }}
            />

            {/* Tactical Modals */}

            <UserModal
                show={showUserModal.value}
                user={selectedUser.value}
                onClose$={$(() => showUserModal.value = false)}
                onSuccess$={$(() => refreshTrigger.value++)}
            />
        </div>
    );
});
