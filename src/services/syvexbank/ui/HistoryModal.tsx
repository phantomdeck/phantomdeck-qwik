import { component$ } from "@builder.io/qwik";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../../../components/ui/Dialog";
import { TransactionHistory } from "./TransactionHistory";
import type { BankUser } from "../types";

interface HistoryModalProps {
    show: boolean;
    user: BankUser | null;
    onClose$: () => void;
}

export const HistoryModal = component$<HistoryModalProps>(({ show, user, onClose$ }) => {
    return (
        <Dialog show={show} onClose$={onClose$} size="lg">
            <DialogHeader>
                <div class="flex items-center gap-4">
                    <div class="size-10 rounded-xl bg-accent/10 border border-accent/20 flex items-center justify-center text-accent font-black italic">
                        {user?.full_name[0].toUpperCase()}
                    </div>
                    <div>
                        <DialogTitle>NODE_HISTORY: {user?.full_name}</DialogTitle>
                        <p class="text-[9px] font-mono text-muted-foreground/40 uppercase tracking-widest">{user?.email}</p>
                    </div>
                </div>
            </DialogHeader>
            <DialogContent class="p-0 max-h-[70vh]">
                {user && <TransactionHistory userId={user.id} />}
            </DialogContent>
        </Dialog>
    );
});
