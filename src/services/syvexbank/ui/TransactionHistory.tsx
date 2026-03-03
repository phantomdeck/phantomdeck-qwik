import { component$, useSignal, useResource$, Resource } from "@builder.io/qwik";
import { getBankTransactions } from "../handlers/index";
import { LuHistory, LuTrendingUp, LuShieldAlert, LuRefreshCw, LuArrowRight } from "@qwikest/icons/lucide";
import { cn } from "../../../utils/cn";
import { Badge } from "../../../components/ui/Badge";

interface TransactionHistoryProps {
    userId?: string;
}

export const TransactionHistory = component$<TransactionHistoryProps>(({ userId }) => {
    const transactionsResource = useResource$(async ({ track }) => {
        track(() => userId);
        return await getBankTransactions(userId);
    });

    return (
        <div class="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-700">
            <div class="flex items-center gap-3 opacity-30">
                <LuHistory class="size-3" />
                <span class="text-[9px] font-black uppercase tracking-[0.4em] italic text-primary">ENTITY_TRANSACTION_LEDGER</span>
            </div>

            <Resource
                value={transactionsResource}
                onPending={() => (
                    <div class="flex flex-col items-center justify-center p-32 text-center rounded-3xl border border-white/5 bg-white/[0.01]">
                        <LuRefreshCw class="size-12 animate-spin text-primary/20 mb-4" />
                        <p class="text-[10px] font-black uppercase tracking-[0.4em] text-muted-foreground/30 animate-pulse">Scanning_Node_History...</p>
                    </div>
                )}
                onResolved={(txs) => (
                    <div class="rounded-3xl border border-white/5 bg-white/[0.01] overflow-hidden">
                        {txs.length === 0 ? (
                            <div class="p-24 text-center text-muted-foreground/30 font-mono text-[10px] uppercase tracking-widest italic">
                                No financial signals detected from this node.
                            </div>
                        ) : (
                            <div class="divide-y divide-white/5">
                                {txs.map((tx) => (
                                    <div key={tx.id} class="p-6 flex items-center justify-between hover:bg-white/[0.02] transition-colors group">
                                        <div class="flex items-center gap-5">
                                            <div class={cn(
                                                "size-12 rounded-2xl flex items-center justify-center border transition-all",
                                                tx.direction === "CREDIT" || tx.type === "DEPOSIT"
                                                    ? "bg-success/10 border-success/20 text-success shadow-[0_0_20px_rgba(var(--color-success),0.1)]"
                                                    : "bg-destructive/10 border-destructive/20 text-destructive shadow-[0_0_20px_rgba(var(--color-destructive),0.1)]"
                                            )}>
                                                {tx.direction === "CREDIT" || tx.type === "DEPOSIT" ? <LuTrendingUp class="size-5" /> : <LuShieldAlert class="size-5" />}
                                            </div>
                                            <div class="space-y-1">
                                                <p class="text-sm font-black italic text-white uppercase tracking-tight group-hover:text-accent transition-colors">{tx.description}</p>
                                                <div class="flex items-center gap-2">
                                                    <p class="text-[9px] font-mono text-muted-foreground/40 uppercase tracking-widest italic font-black">REF_{tx.reference || tx.id.slice(0, 8)}</p>
                                                    <span class="text-muted-foreground/20 italic font-black text-[9px]">/</span>
                                                    <Badge variant="outline" class="text-[8px] px-1.5 py-0 border-white/5 uppercase opacity-40">{tx.status}</Badge>
                                                </div>
                                            </div>
                                        </div>

                                        <div class="flex items-center gap-8">
                                            <div class="text-right space-y-0.5">
                                                <p class={cn(
                                                    "text-base font-black italic uppercase",
                                                    tx.direction === "CREDIT" || tx.type === "DEPOSIT" ? "text-success" : "text-white"
                                                )}>
                                                    {tx.direction === "CREDIT" || tx.type === "DEPOSIT" ? "+" : "-"}${tx.amount.toLocaleString()}
                                                </p>
                                                <p class="text-[9px] font-mono text-muted-foreground/30 uppercase tracking-tighter">{new Date(tx.created_at).toLocaleString()}</p>
                                            </div>
                                            <LuArrowRight class="size-4 text-muted-foreground/10 group-hover:text-accent group-hover:translate-x-1 transition-all" />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                )}
            />
        </div>
    );
});
