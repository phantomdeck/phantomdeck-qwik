import { component$, useSignal, $, type QRL } from "@builder.io/qwik";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "../../../components/ui/Dialog";
import { createBankAccount } from "../handlers/index";
import { LuSave, LuBuilding, LuActivity } from "@qwikest/icons/lucide";
import { Button } from "../../../components/ui/Button";
import { Input } from "../../../components/ui/Input";

interface GeneralAccountModalProps {
    show: boolean;
    onClose$: QRL<() => void>;
    onSuccess$: QRL<() => void>;
}

export const GeneralAccountModal = component$<GeneralAccountModalProps>(({ show, onClose$, onSuccess$ }) => {
    const formData = useSignal({
        full_name: "",
        account_number: "",
        bank_name: "",
        type: "Individual",
    });
    const isSubmitting = useSignal(false);
    const errorMessage = useSignal("");

    const handleSubmit = $(async () => {
        if (!formData.value.full_name || !formData.value.account_number || !formData.value.bank_name) {
            errorMessage.value = "All fields are required.";
            return;
        }
        isSubmitting.value = true;
        errorMessage.value = "";
        try {
            await createBankAccount(formData.value as any);
            formData.value = { full_name: "", account_number: "", bank_name: "", type: "Individual" };
            onSuccess$();
            onClose$();
        } catch (err: unknown) {
            errorMessage.value = err instanceof Error ? err.message : "An unknown error occurred.";
        } finally {
            isSubmitting.value = false;
        }
    });

    return (
        <Dialog show={show} onClose$={onClose$} size="md">
            <DialogHeader>
                <div class="flex items-center gap-4">
                    <div class="size-10 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary">
                        <LuBuilding class="size-5" />
                    </div>
                    <DialogTitle>PROVISION_INSTITUTIONAL_NODE</DialogTitle>
                </div>
            </DialogHeader>
            <DialogContent class="space-y-6">
                {errorMessage.value && (
                    <div class="p-4 rounded-2xl bg-destructive/10 border border-destructive/20 text-destructive text-[10px] font-black uppercase italic italic animate-in shake duration-300">
                        {errorMessage.value}
                    </div>
                )}

                <div class="space-y-2">
                    <label class="text-[10px] font-black uppercase tracking-widest text-muted-foreground/60 italic ml-1">Account_Name</label>
                    <Input
                        placeholder="e.g. Apex Corporate, Global Liquidity..."
                        value={formData.value.full_name}
                        onInput$={(e) => (formData.value = { ...formData.value, full_name: (e.target as HTMLInputElement).value })}
                    />
                </div>

                <div class="space-y-2">
                    <label class="text-[10px] font-black uppercase tracking-widest text-muted-foreground/60 italic ml-1">Account_Number</label>
                    <Input
                        placeholder="0000000000"
                        class="font-mono tracking-widest"
                        value={formData.value.account_number}
                        onInput$={(e) => (formData.value = { ...formData.value, account_number: (e.target as HTMLInputElement).value })}
                    />
                </div>

                <div class="space-y-2">
                    <label class="text-[10px] font-black uppercase tracking-widest text-muted-foreground/60 italic ml-1">Institution_Marker</label>
                    <Input
                        placeholder="e.g. Chase, Apex Core, GTBank..."
                        value={formData.value.bank_name}
                        onInput$={(e) => (formData.value = { ...formData.value, bank_name: (e.target as HTMLInputElement).value })}
                    />
                </div>

                <div class="space-y-2">
                    <label class="text-[10px] font-black uppercase tracking-widest text-muted-foreground/60 italic ml-1">Node_Classify</label>
                    <select
                        class="w-full h-12 bg-white/[0.03] border border-white/5 rounded-2xl px-4 text-xs font-black uppercase italic tracking-widest text-white focus:outline-none focus:border-primary/40 focus:ring-1 focus:ring-primary/20 transition-all appearance-none"
                        value={formData.value.type}
                        onChange$={(e) => (formData.value = { ...formData.value, type: (e.target as HTMLSelectElement).value })}
                    >
                        <option value="Individual" class="bg-background">INDIVIDUAL_NODE</option>
                        <option value="Corporate" class="bg-background">CORPORATE_CLUSTER</option>
                    </select>
                </div>
            </DialogContent>
            <DialogFooter>
                <Button variant="glass" onClick$={onClose$} class="px-8 font-black uppercase italic opacity-40 hover:opacity-100">
                    CANCEL_LINK
                </Button>
                <Button
                    class="px-8 font-black uppercase italic tracking-widest bg-primary text-primary-foreground shadow-lg shadow-primary/20"
                    disabled={isSubmitting.value}
                    onClick$={handleSubmit}
                >
                    {isSubmitting.value ? <LuActivity class="size-4 animate-spin" /> : <><LuSave class="size-4 mr-2" /> CREATE_NODE</>}
                </Button>
            </DialogFooter>
        </Dialog>
    );
});
