import { component$, useResource$, Resource, $, useSignal } from "@builder.io/qwik";
import { useLocation, Link, type DocumentHead } from "@builder.io/qwik-city";
import { getBankUser, getBankTransactions, deleteBankTransaction } from "~/services/syvexbank/handlers/index";
import {
    LuHistory,
    LuRefreshCw,
    LuArrowLeft,
    LuPlus,
    LuEraser,
    LuChevronRight,
    LuAlertCircle,
    LuPencil,
    LuTrendingUp,
    LuShieldAlert,
    LuBuilding2
} from "@qwikest/icons/lucide";
import { cn } from "~/utils/cn";
import { Badge } from "~/components/ui/Badge";
import { Button } from "~/components/ui/Button";
import { TransactionModal } from "~/services/syvexbank/ui/TransactionModal";
import type { BankTransaction, BankUser } from "~/services/syvexbank/types";

export default component$(() => {
    const loc = useLocation();
    const userId = loc.params.id;
    const refreshTrigger = useSignal(0);

    // UI state for Modal
    const showModal = useSignal(false);
    const selectedTransaction = useSignal<BankTransaction | null>(null);

    const dataResource = useResource$(async ({ track }) => {
        track(() => userId);
        track(() => refreshTrigger.value);
        const [user, transactions] = await Promise.all([
            getBankUser(userId),
            getBankTransactions(userId)
        ]);
        return { user, transactions };
    });

    const handleDelete = $(async (id: string) => {
        if (!confirm("Are you sure you want to delete this transaction record?")) return;
        try {
            await deleteBankTransaction(id);
            refreshTrigger.value++;
        } catch (err) {
            console.error("Mutation Failed:", err);
            alert("Delete operation rejected by security layer.");
        }
    });

    const openAdd = $(() => {
        selectedTransaction.value = null;
        showModal.value = true;
    });

    const openEdit = $((tx: BankTransaction) => {
        selectedTransaction.value = tx;
        showModal.value = true;
    });

    return (
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-1000">
            {/* Breadcrumbs */}
            <nav class="flex items-center gap-3 text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/40 italic">
                <Link href="/services/syvexbank" class="hover:text-primary transition-colors">Users</Link>
                <LuChevronRight class="size-3" />
                <span class="text-white/60">History</span>
            </nav>

            <Resource
                value={dataResource}
                onPending={() => (
                    <div class="flex flex-col items-center justify-center py-48 text-center bg-white/[0.01] rounded-[2rem] border border-white/5">
                        <LuRefreshCw class="size-12 animate-spin text-primary/20 mb-4" />
                        <p class="text-[10px] font-black uppercase tracking-[0.5em] text-muted-foreground/30 animate-pulse italic">Loading history...</p>
                    </div>
                )}
                onResolved={({ user, transactions }) => (
                    <div class="space-y-6">
                        {/* Header Cluster */}
                        <div class="flex flex-col md:flex-row md:items-center justify-between gap-6 bg-white/[0.03] p-8 rounded-[2rem] border border-white/5 shadow-2xl">
                            <div>
                                <h1 class="text-3xl font-black italic text-white uppercase tracking-tighter leading-none">Transactions</h1>
                                <p class="text-[10px] font-mono text-muted-foreground/40 uppercase tracking-[0.2em] mt-2 italic">
                                    History for {user?.full_name} ({user?.email})
                                </p>
                            </div>
                            <div class="flex items-center gap-4">
                                <Button
                                    onClick$={openAdd}
                                    class="h-14 px-10 font-black uppercase italic tracking-widest bg-white text-black hover:bg-white/90 shadow-xl"
                                >
                                    <LuPlus class="size-5 mr-2" /> Add Transaction
                                </Button>
                                <div class="px-6 py-3 bg-primary/10 border border-primary/20 rounded-2xl flex flex-col items-center justify-center">
                                    <span class="text-[8px] font-black text-primary uppercase tracking-widest leading-none mb-1">Total</span>
                                    <span class="text-xl font-black text-white italic tracking-tighter leading-none">{transactions?.length || 0}</span>
                                </div>
                            </div>
                        </div>

                        {/* Transaction Matrix */}
                        <div class="bg-white/[0.01] border border-white/5 rounded-[2rem] shadow-2xl overflow-hidden">
                            <div class="overflow-x-auto">
                                <table class="w-full text-left">
                                    <thead class="bg-white/[0.02] border-b border-white/5">
                                        <tr>
                                            <th class="px-8 py-5 text-[10px] font-black text-muted-foreground/40 uppercase tracking-widest italic">Date</th>
                                            <th class="px-8 py-5 text-[10px] font-black text-muted-foreground/40 uppercase tracking-widest italic">Type</th>
                                            <th class="px-8 py-5 text-[10px] font-black text-muted-foreground/40 uppercase tracking-widest italic">Amount</th>
                                            <th class="px-8 py-5 text-[10px] font-black text-muted-foreground/40 uppercase tracking-widest italic">Status</th>
                                            <th class="px-8 py-5 text-right text-[10px] font-black text-muted-foreground/40 uppercase tracking-widest italic">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody class="divide-y divide-white/5">
                                        {!transactions || transactions.length === 0 ? (
                                            <tr>
                                                <td colSpan={5} class="px-8 py-32 text-center text-[11px] font-black uppercase tracking-[0.4em] text-muted-foreground/20 italic">
                                                    No transactions found.
                                                </td>
                                            </tr>
                                        ) : (
                                            transactions.map((tx) => (
                                                <tr key={tx.id} class="hover:bg-white/[0.02] transition-colors group italic">
                                                    <td class="px-8 py-6 whitespace-nowrap">
                                                        <div class="text-sm font-black text-white uppercase tracking-tight">{new Date(tx.created_at).toLocaleDateString()}</div>
                                                        <div class="text-[9px] text-muted-foreground/30 font-mono tracking-widest">#{tx.reference || tx.id.slice(0, 8)}</div>
                                                    </td>
                                                    <td class="px-8 py-6 whitespace-nowrap">
                                                        <span class={cn(
                                                            "text-[9px] font-black px-2 py-0.5 rounded flex items-center gap-1.5 w-fit mb-1",
                                                            tx.direction === "CREDIT" ? "bg-success/10 text-success" : "bg-primary/10 text-primary"
                                                        )}>
                                                            {tx.direction === "CREDIT" ? <LuTrendingUp class="size-2.5" /> : <LuShieldAlert class="size-2.5" />}
                                                            {tx.direction}
                                                        </span>
                                                        <div class="text-[10px] font-bold text-white/50 uppercase tracking-wider">
                                                            {tx.type}
                                                            {tx.transfer_subtype && (
                                                                <span class="text-[8px] opacity-40 ml-1.5 border-l border-white/10 pl-1.5 capitalize">{tx.transfer_subtype}</span>
                                                            )}
                                                        </div>
                                                        {tx.type === "TRANSFER" && tx.recipient_info && (
                                                            <div class="text-[9px] text-muted-foreground/30 mt-1 flex items-center gap-1">
                                                                <LuBuilding2 class="size-2.5" />
                                                                {tx.recipient_info.name}
                                                                {tx.recipient_info.country && <span class="text-accent/40 font-black">({tx.recipient_info.country})</span>}
                                                            </div>
                                                        )}
                                                    </td>
                                                    <td class="px-8 py-6 whitespace-nowrap">
                                                        <div class={cn(
                                                            "text-lg font-black tabular-nums tracking-tighter",
                                                            tx.direction === "DEBIT" ? "text-white" : "text-success"
                                                        )}>
                                                            {tx.direction === "DEBIT" ? "-" : "+"}{(tx.amount || 0).toLocaleString()}
                                                            <span class="text-[10px] ml-1.5 opacity-20 font-mono">USD</span>
                                                        </div>
                                                    </td>
                                                    <td class="px-8 py-6 whitespace-nowrap">
                                                        <Badge class={cn(
                                                            "text-[9px] px-3 py-1 rounded-xl border font-black",
                                                            tx.status === "SUCCESS" ? "bg-success/10 text-success border-success/20" :
                                                                tx.status === "PENDING" ? "bg-warning/10 text-warning border-warning/20" :
                                                                    "bg-destructive/10 text-destructive border-destructive/20"
                                                        )}>
                                                            {tx.status}
                                                        </Badge>
                                                    </td>
                                                    <td class="px-8 py-6 whitespace-nowrap text-right">
                                                        <div class="flex items-center justify-end gap-3">
                                                            <button
                                                                onClick$={() => openEdit(tx)}
                                                                class="p-3 rounded-xl bg-white/5 border border-white/10 text-muted-foreground/40 hover:text-white hover:bg-white/10 transition-all"
                                                                title="Edit"
                                                            >
                                                                <LuPencil class="size-4" />
                                                            </button>
                                                            <button
                                                                onClick$={() => handleDelete(tx.id)}
                                                                class="p-3 rounded-xl bg-white/5 border border-white/10 text-muted-foreground/40 hover:text-destructive hover:bg-destructive/10 transition-all"
                                                                title="Delete"
                                                            >
                                                                <LuEraser class="size-4" />
                                                            </button>
                                                        </div>
                                                    </td>
                                                </tr>
                                            ))
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>

                        <TransactionModal
                            show={showModal.value}
                            user={user as any}
                            transaction={selectedTransaction.value}
                            onClose$={$(() => showModal.value = false)}
                            onSuccess$={$(() => refreshTrigger.value++)}
                        />
                    </div>
                )}
                onRejected={(error) => (
                    <div class="flex flex-col items-center justify-center py-48 text-center bg-white/[0.01] rounded-[2rem] border border-destructive/10">
                        <LuAlertCircle class="size-16 text-destructive mb-6 animate-pulse" />
                        <h2 class="text-2xl font-black italic text-white uppercase tracking-tighter mb-2">Error</h2>
                        <p class="text-xs text-muted-foreground/60 font-mono tracking-widest uppercase mb-8 max-w-md">
                            {error.message || "Connection error."}
                        </p>
                        <Button
                            onClick$={() => window.location.reload()}
                            class="h-12 px-8 border-white/10 text-[10px] font-black uppercase tracking-widest italic"
                        >
                            <LuRefreshCw class="size-3 mr-2" /> Retry
                        </Button>
                    </div>
                )}
            />
        </div>
    );
});

export const head: DocumentHead = {
    title: `Transactions | Syvex Bank`,
    meta: [
        {
            name: "description",
            content: "View transaction history.",
        },
    ],
};
