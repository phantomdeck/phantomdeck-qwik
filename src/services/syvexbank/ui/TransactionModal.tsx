import { component$, useSignal, useStore, $, useVisibleTask$, useTask$, type QRL } from "@builder.io/qwik";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../../../components/ui/Dialog";
import { Button } from "../../../components/ui/Button";
import {
    LuPlus,
    LuRefreshCw,
    LuSave,
    LuXCircle,
    LuActivity,
} from "@qwikest/icons/lucide";
import type { BankTransaction, BankUser } from "../types";
import { createBankTransaction, updateBankTransaction } from "../handlers/index";
import { cn } from "../../../utils/cn";

interface TransactionModalProps {
    show: boolean;
    user: BankUser | null;
    transaction: BankTransaction | null;
    onClose$: QRL<() => void>;
    onSuccess$: QRL<() => void>;
}

const COUNTRIES = [
    { name: "United Kingdom", currency: "GBP", code: "GB", fields: [{ name: "sort_code", label: "Sort Code", placeholder: "6-digit code (e.g. 20-45-12)" }, { name: "iban", label: "IBAN", placeholder: "International Bank Account Number" }] },
    { name: "Canada", currency: "CAD", code: "CA", fields: [{ name: "transit_number", label: "Transit Number", placeholder: "5-digit transit number" }, { name: "institution_number", label: "Institution Number", placeholder: "3-digit inst. number" }] },
    { name: "Germany", currency: "EUR", code: "DE", fields: [{ name: "iban", label: "IBAN", placeholder: "DE followed by 20 digits" }, { name: "swift_code", label: "BIC/SWIFT", placeholder: "8 or 11 characters" }] },
    { name: "France", currency: "EUR", code: "FR", fields: [{ name: "iban", label: "IBAN", placeholder: "FR followed by 25 characters" }, { name: "swift_code", label: "BIC/SWIFT", placeholder: "8 or 11 characters" }] },
    { name: "Australia", currency: "AUD", code: "AU", fields: [{ name: "bsb_code", label: "BSB Code", placeholder: "6-digit code (e.g. 062-000)" }] },
    { name: "United States (Global)", currency: "USD", code: "US", fields: [{ name: "routing_number", label: "Routing Number (ABA)", placeholder: "9-digit routing number" }] },
];

export const TransactionModal = component$<TransactionModalProps>(({ show, user, transaction, onClose$, onSuccess$ }) => {
    const isEditing = !!transaction;
    const isSubmitting = useSignal(false);

    const formData = useStore<{
        amount: string;
        type: "DEPOSIT" | "TRANSFER" | "BILL" | "AIRTIME";
        direction: "CREDIT" | "DEBIT";
        status: "SUCCESS" | "FAILED" | "PENDING";
        narration: string;
        sender_account_id: string;
        transferSubtype: "within" | "other" | "international";
        recipientName: string;
        recipientNumber: string;
        bankName: string;
        countryName: string;
        dynamicFields: Record<string, string>;
        sendEmail: boolean;
        created_at: string;
    }>({
        amount: "",
        type: "DEPOSIT",
        direction: "CREDIT",
        status: "SUCCESS",
        narration: "",
        sender_account_id: "",

        // Transfer specific signals (Migrated from simubank admin logic)
        transferSubtype: "within",
        recipientName: "",
        recipientNumber: "",
        bankName: "SYVEX Institutional",
        countryName: COUNTRIES[0].name,
        dynamicFields: {},
        sendEmail: false,
        created_at: new Date().toISOString().slice(0, 16)
    });

    // eslint-disable-next-line qwik/no-use-visible-task
    useVisibleTask$(({ track }) => {
        track(() => show);
        if (show && user) {
            if (transaction) {
                const date = new Date(transaction.created_at);
                const localISO = new Date(date.getTime() - (date.getTimezoneOffset() * 60000)).toISOString().slice(0, 16);

                Object.assign(formData, {
                    amount: transaction.amount.toString(),
                    type: transaction.type || "DEPOSIT",
                    direction: transaction.direction || "CREDIT",
                    status: transaction.status || "SUCCESS",
                    narration: transaction.description || "", // narration is mapped to description in some types
                    sender_account_id: transaction.sender_account_id || (user.accounts?.[0]?.id || ""),
                    transferSubtype: transaction.transfer_subtype || (transaction.metadata?.international ? "international" : (transaction.recipient_info?.bank_name === "SYVEX Institutional" ? "within" : "other")),
                    recipientName: transaction.recipient_info?.name || "",
                    recipientNumber: transaction.recipient_info?.account_number || "",
                    bankName: transaction.recipient_info?.bank_name || "SYVEX Institutional",
                    countryName: (transaction.recipient_info?.country as string) || (transaction.metadata?.country as string) || COUNTRIES[0].name,
                    dynamicFields: {
                        iban: transaction.recipient_info?.iban || "",
                        sort_code: transaction.recipient_info?.sort_code || "",
                        routing_number: transaction.recipient_info?.routing_number || "",
                        swift_code: transaction.recipient_info?.swift_code || "",
                        transit_number: transaction.recipient_info?.transit_number || "",
                        institution_number: transaction.recipient_info?.institution_number || "",
                        bsb_code: transaction.recipient_info?.bsb_code || "",
                    } as any,
                    sendEmail: false,
                    created_at: localISO
                });
            } else {
                const now = new Date();
                const localNow = new Date(now.getTime() - (now.getTimezoneOffset() * 60000)).toISOString().slice(0, 16);

                Object.assign(formData, {
                    amount: "",
                    type: "DEPOSIT",
                    direction: "CREDIT",
                    status: "SUCCESS",
                    narration: "",
                    sender_account_id: user.accounts?.[0]?.id || "",
                    transferSubtype: "within",
                    recipientName: "",
                    recipientNumber: "",
                    bankName: "SYVEX Institutional",
                    countryName: COUNTRIES[0].name,
                    dynamicFields: {},
                    sendEmail: false,
                    created_at: localNow
                });
            }
        }
    });

    // Auto-align direction based on type (Enforced logic)
    useTask$(({ track }) => {
        const type = track(() => formData.type);
        if (type === "DEPOSIT") {
            formData.direction = "CREDIT";
        } else {
            formData.direction = "DEBIT";
        }
    });

    const handleSubmit = $(async () => {
        if (!user || isSubmitting.value) return;
        isSubmitting.value = true;

        try {
            const isTransfer = formData.type === "TRANSFER";
            const prefix = formData.type === "TRANSFER" ? "TRF" :
                formData.type === "DEPOSIT" ? "DEP" :
                    formData.type === "BILL" ? "BIL" : "AIR";

            const reference = transaction?.reference || `${prefix}-${Math.random().toString(36).toUpperCase().slice(2, 10)}`;

            const metadata: Record<string, unknown> = {};
            if (isTransfer && formData.transferSubtype === "international") {
                metadata.country = formData.countryName;
                metadata.international = true;
            }

            const recipient_info: BankTransaction["recipient_info"] = isTransfer ? {
                name: formData.recipientName,
                account_number: formData.recipientNumber,
                bank_name: formData.transferSubtype === "within" ? "SYVEX Institutional" : (formData.bankName || "Other Bank"),
                country: formData.transferSubtype === "international" ? formData.countryName : undefined,
                ...formData.dynamicFields
            } : {
                name: user.full_name,
                account_number: user.accounts.find(a => a.id === formData.sender_account_id)?.account_number || "",
                bank_name: "SYVEX Institutional"
            };

            const payload: Partial<BankTransaction> = {
                user_id: user.id,
                sender_account_id: formData.sender_account_id,
                amount: Number(formData.amount),
                type: formData.type,
                transfer_subtype: isTransfer ? formData.transferSubtype : undefined,
                direction: formData.direction,
                status: formData.status,
                description: formData.narration || `${formData.type} Operation`,
                narration: formData.narration,
                reference: reference,
                recipient_info,
                metadata,
                created_at: new Date(formData.created_at).toISOString(),
            };

            if (isEditing && transaction) {
                await updateBankTransaction(transaction.id, payload);
            } else {
                await createBankTransaction(payload);
            }

            onSuccess$();
            onClose$();
        } catch (err) {
            console.error("Update Failure:", err);
            alert("There was an error saving this transaction record.");
        } finally {
            isSubmitting.value = false;
        }
    });

    const currentCountry = COUNTRIES.find(c => c.name === formData.countryName) || COUNTRIES[0];

    return (
        <Dialog show={show} onClose$={onClose$} size="lg">
            <DialogHeader>
                <div class="flex items-center gap-4">
                    <div class="size-12 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary">
                        {isEditing ? <LuActivity class="size-6" /> : <LuPlus class="size-6" />}
                    </div>
                    <div>
                        <DialogTitle class="uppercase italic font-black tracking-tighter text-xl">
                            {isEditing ? "Edit Transaction" : "Add Transaction"}
                        </DialogTitle>
                        <p class="text-[9px] font-mono text-muted-foreground/40 uppercase tracking-[0.2em] italic mt-0.5">
                            {isEditing ? `Ref: ${transaction?.reference || transaction?.id}` : "Manual Entry"}
                        </p>
                    </div>
                </div>
            </DialogHeader>

            <DialogContent class="p-8 space-y-8 overflow-y-auto max-h-[85vh]">
                <div class="space-y-6">
                    {/* Targeting Node */}
                    <div class="space-y-2">
                        <label class="text-[10px] font-black uppercase tracking-widest text-muted-foreground/40 italic ml-1">Select Account</label>
                        <select
                            class="w-full bg-white/5 border border-white/10 rounded-xl px-5 py-4 text-sm font-black italic uppercase text-white focus:outline-none transition-all"
                            value={formData.sender_account_id}
                            onChange$={(e) => (formData.sender_account_id = (e.target as HTMLSelectElement).value)}
                        >
                            {user?.accounts?.map(acc => (
                                <option key={acc.id} value={acc.id} class="bg-background">
                                    {`${acc.type} (***${acc.account_number.slice(-4)}) - ${acc.balance.toLocaleString()} ${acc.currency}`}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div class="space-y-2">
                            <label class="text-[10px] font-black uppercase tracking-widest text-muted-foreground/40 italic ml-1">Transaction Type</label>
                            <select
                                id="tx-type-select"
                                class="w-full bg-white/5 border border-white/10 rounded-xl px-5 py-4 text-sm font-black italic uppercase text-white focus:outline-none"
                                value={formData.type}
                                onChange$={(e) => (formData.type = (e.target as HTMLSelectElement).value as any)}
                            >
                                <option value="DEPOSIT" class="bg-background">DEPOSIT</option>
                                <option value="TRANSFER" class="bg-background">TRANSFER</option>
                                <option value="BILL" class="bg-background">BILL PAYMENT</option>
                                <option value="AIRTIME" class="bg-background">AIRTIME</option>
                            </select>
                        </div>
                        <div class="space-y-2">
                            <label class="text-[10px] font-black uppercase tracking-widest text-muted-foreground/40 italic ml-1">Direction</label>
                            <div class="w-full bg-white/5 border border-white/10 rounded-xl px-5 py-4 text-sm font-black italic uppercase text-muted-foreground/50 cursor-not-allowed">
                                {formData.direction === "CREDIT" ? "Credit (+)" : "Debit (-)"}
                            </div>
                        </div>
                    </div>

                    {/* Enhanced Transfer Logic (Mirrored from simubank migration) */}
                    {formData.type === "TRANSFER" && (
                        <div id="transfer-logic-container" class="p-6 rounded-2xl bg-white/[0.02] border border-white/5 space-y-6 animate-in slide-in-from-top-2">
                            <div class="flex gap-2">
                                {[
                                    { id: "within", label: "Within Syvex" },
                                    { id: "other", label: "Other Bank" },
                                    { id: "international", label: "International" }
                                ].map(sub => (
                                    <button
                                        key={sub.id}
                                        type="button"
                                        onClick$={() => (formData.transferSubtype = sub.id as any)}
                                        class={cn(
                                            "flex-1 py-3 rounded-xl text-[9px] font-black uppercase tracking-widest italic transition-all border",
                                            formData.transferSubtype === sub.id
                                                ? "bg-primary text-white border-primary"
                                                : "bg-white/5 text-muted-foreground/40 border-white/5 hover:bg-white/10"
                                        )}
                                    >
                                        {sub.label}
                                    </button>
                                ))}
                            </div>

                            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div class="col-span-2 space-y-2">
                                    <label class="text-[9px] font-black text-muted-foreground/40 uppercase tracking-widest italic ml-1">Recipient Name</label>
                                    <input
                                        type="text"
                                        required
                                        class="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm font-bold uppercase text-white focus:outline-none"
                                        value={formData.recipientName}
                                        onInput$={(e) => (formData.recipientName = (e.target as HTMLInputElement).value)}
                                    />
                                </div>
                                <div class="space-y-2">
                                    <label class="text-[9px] font-black text-muted-foreground/40 uppercase tracking-widest italic ml-1 text-nowrap">Account Number</label>
                                    <input
                                        type="text"
                                        required
                                        class="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm font-bold text-white focus:outline-none"
                                        value={formData.recipientNumber}
                                        onInput$={(e) => (formData.recipientNumber = (e.target as HTMLInputElement).value)}
                                    />
                                </div>
                                <div class="space-y-2">
                                    {formData.transferSubtype === "international" ? (
                                        <>
                                            <label class="text-[9px] font-black text-muted-foreground/40 uppercase tracking-widest italic ml-1">Country</label>
                                            <select
                                                class="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm font-bold text-white focus:outline-none"
                                                value={formData.countryName}
                                                onChange$={(e) => (formData.countryName = (e.target as HTMLSelectElement).value)}
                                            >
                                                {COUNTRIES.map(c => <option key={c.name} value={c.name} class="bg-background">{c.name}</option>)}
                                            </select>
                                        </>
                                    ) : (
                                        <>
                                            <label class="text-[9px] font-black text-muted-foreground/40 uppercase tracking-widest italic ml-1">Bank Name</label>
                                            <input
                                                type="text"
                                                disabled={formData.transferSubtype === "within"}
                                                class="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm font-bold text-white disabled:opacity-30"
                                                value={formData.bankName}
                                                onInput$={(e) => (formData.bankName = (e.target as HTMLInputElement).value)}
                                            />
                                        </>
                                    )}
                                </div>

                                {/* Dynamic Compliance Fields */}
                                {formData.transferSubtype === "international" && (
                                    <div class="col-span-2 grid grid-cols-2 gap-4 mt-2 border-t border-white/5 pt-4">
                                        {currentCountry.fields.map(field => (
                                            <div key={field.name} class="space-y-2">
                                                <label class="text-[9px] font-black text-primary/60 uppercase tracking-widest italic ml-1">{field.label}</label>
                                                <input
                                                    type="text"
                                                    placeholder={field.placeholder}
                                                    class="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-xs font-bold text-white/70 focus:outline-none"
                                                    value={formData.dynamicFields[field.name] || ""}
                                                    onInput$={(e) => (formData.dynamicFields = { ...formData.dynamicFields, [field.name]: (e.target as HTMLInputElement).value })}
                                                />
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>
                    )}

                    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div class="space-y-2">
                            <label class="text-[10px] font-black uppercase tracking-widest text-muted-foreground/40 italic ml-1">Amount (USD)</label>
                            <input
                                type="number"
                                step="0.01"
                                class="w-full bg-white/5 border border-white/10 rounded-xl px-5 py-4 text-xl font-black italic uppercase tabular-nums text-white focus:outline-none"
                                placeholder="0.00"
                                value={formData.amount}
                                onInput$={(e) => (formData.amount = (e.target as HTMLInputElement).value)}
                            />
                        </div>
                        <div class="space-y-2">
                            <label class="text-[10px] font-black uppercase tracking-widest text-muted-foreground/40 italic ml-1">Status</label>
                            <select
                                class="w-full bg-white/5 border border-white/10 rounded-xl px-5 py-4 text-sm font-black italic uppercase text-white focus:outline-none"
                                value={formData.status}
                                onChange$={(e) => (formData.status = (e.target as HTMLSelectElement).value as any)}
                            >
                                <option value="SUCCESS" class="bg-background">SUCCESS</option>
                                <option value="PENDING" class="bg-background">PENDING</option>
                                <option value="FAILED" class="bg-background">FAILED</option>
                            </select>
                        </div>
                    </div>

                    <div class="space-y-2">
                        <label class="text-[10px] font-black uppercase tracking-widest text-muted-foreground/40 italic ml-1 font-mono">Date & Time</label>
                        <input
                            type="datetime-local"
                            class="w-full bg-black border border-white/10 rounded-xl px-5 py-4 text-sm font-mono text-white focus:outline-none"
                            value={formData.created_at}
                            onChange$={(e) => (formData.created_at = (e.target as HTMLInputElement).value)}
                        />
                    </div>

                    <div class="space-y-2">
                        <label class="text-[10px] font-black uppercase tracking-widest text-muted-foreground/40 italic ml-1">Description</label>
                        <textarea
                            placeholder="Add a reason or description..."
                            class="w-full bg-white/5 border border-white/10 rounded-xl px-5 py-4 text-xs font-medium text-white/70 focus:outline-none min-h-[80px]"
                            value={formData.narration}
                            onInput$={(e) => (formData.narration = (e.target as HTMLTextAreaElement).value)}
                        />
                    </div>

                    <div class="flex items-center justify-end gap-3 pt-4 sticky bottom-0 bg-transparent pb-4">
                        <Button
                            variant="outline"
                            onClick$={onClose$}
                            class="h-14 px-8 border-white/5 text-[11px] font-black uppercase italic tracking-widest text-muted-foreground hover:bg-white/5"
                        >
                            <LuXCircle class="size-4 mr-2" /> Cancel
                        </Button>
                        <Button
                            onClick$={handleSubmit}
                            disabled={isSubmitting.value || !formData.amount}
                            class="h-14 px-10 font-black uppercase italic tracking-[0.2em] bg-primary text-white flex-1 sm:flex-none"
                        >
                            {isSubmitting.value ? <LuRefreshCw class="size-4 animate-spin mr-2" /> : <LuSave class="size-4 mr-2" />}
                            {isEditing ? "Update" : "Save"}
                        </Button>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
});
