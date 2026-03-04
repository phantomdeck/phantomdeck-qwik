import { component$, useSignal, useTask$, type Signal, $ } from "@builder.io/qwik";
import { server$ } from "@builder.io/qwik-city";
import { Sheet, SheetHeader, SheetTitle, SheetDescription, SheetContent, SheetFooter } from "../../../components/ui/Sheet";
import type { AuthUser, UserServiceAccess, BillingStatus } from "../../../types/auth";
import { safeServices } from "../../config";
import { adminAuth } from "../../../lib/supabase/admin";
import {
    LuUser,
    LuShield,
    LuSave,
    LuGhost,
} from "@qwikest/icons/lucide";
import { Button } from "../../../components/ui/Button";
import { Switch } from "../../../components/ui/Switch";
import { cn } from "../../../utils/cn";

interface ManageSheetProps {
    showSig: Signal<boolean>;
    userSig: Signal<AuthUser | null>;
}

interface UserData {
    role: "super_admin" | "client";
    services: Record<string, UserServiceAccess>;
}

export const saveUserAction = server$(
    async (userId: string, data: UserData) => {
        const { error } = await adminAuth.updateUserById(userId, {
            app_metadata: {
                role: data.role,
                services: data.services,
            },
        });

        if (error) {
            console.error("[ACCESS_CONTROL] Error updating user:", error);
            return { success: false, error: error.message };
        }

        return { success: true };
    }
);

function getUserInitial(user: AuthUser): string {
    return user.user_metadata.full_name?.[0]?.toUpperCase() ?? user.email[0].toUpperCase();
}

function getUserDisplayName(user: AuthUser): string {
    return user.user_metadata.full_name ?? user.email;
}

export const ManageSheet = component$<ManageSheetProps>(({ showSig, userSig }) => {
    const user = userSig.value;
    const isSubmitting = useSignal(false);
    const roleEdit = useSignal<"super_admin" | "client">("client");
    const servicesEdit = useSignal<Record<string, UserServiceAccess>>({});

    useTask$(({ track }) => {
        const u = track(() => userSig.value);
        if (u) {
            roleEdit.value = u.role;
            servicesEdit.value = JSON.parse(JSON.stringify(u.app_metadata.services || {}));
        }
    });

    const handleSave = $(async () => {
        if (!user) return;
        isSubmitting.value = true;
        try {
            const result = await saveUserAction(user.id, {
                role: roleEdit.value,
                services: servicesEdit.value,
            });
            if (result.success) {
                showSig.value = false;
                window.location.reload();
            } else {
                alert(`Error: ${result.error}`);
            }
        } finally {
            isSubmitting.value = false;
        }
    });

    return (
        <Sheet show={showSig.value} onClose$={$(() => (showSig.value = false))}>
            {user ? (
                <>
                    <SheetHeader>
                        <div class="flex items-center gap-5">
                            <div class="size-16 rounded-2xl bg-gradient-to-br from-primary/20 to-accent/20 border border-white/10 flex items-center justify-center text-2xl font-black italic text-white shadow-2xl">
                                {getUserInitial(user)}
                            </div>
                            <div>
                                <SheetTitle>{getUserDisplayName(user)}</SheetTitle>
                                <SheetDescription class="uppercase font-mono tracking-widest text-[10px]">LATTICE_IDENTITY: {user.id.slice(0, 12)}...</SheetDescription>
                            </div>
                        </div>
                    </SheetHeader>

                    <SheetContent class="space-y-10">
                        {/* Account Core */}
                        <section class="space-y-4">
                            <h3 class="text-[10px] font-black uppercase tracking-[0.4em] text-muted-foreground/30 italic flex items-center gap-2">
                                <LuUser class="size-3" /> IDENTITY_CORE
                            </h3>
                            <div class="p-6 rounded-2xl bg-white/[0.02] border border-white/5 space-y-4">
                                <div class="flex items-center justify-between">
                                    <span class="text-[10px] font-mono text-muted-foreground uppercase opacity-40">System_Role</span>
                                    <div class="flex bg-black/40 p-1 rounded-lg border border-white/5">
                                        <button
                                            onClick$={() => roleEdit.value = "client"}
                                            class={cn(
                                                "px-3 py-1 rounded-md text-[9px] font-black uppercase transition-all",
                                                roleEdit.value === "client" ? "bg-white/10 text-white" : "text-muted-foreground/40 hover:text-white"
                                            )}
                                        >
                                            Client
                                        </button>
                                        <button
                                            onClick$={() => roleEdit.value = "super_admin"}
                                            class={cn(
                                                "px-3 py-1 rounded-md text-[9px] font-black uppercase transition-all",
                                                roleEdit.value === "super_admin" ? "bg-primary text-primary-foreground shadow-lg" : "text-muted-foreground/40 hover:text-white"
                                            )}
                                        >
                                            Admin
                                        </button>
                                    </div>
                                </div>
                                <div class="flex items-center justify-between">
                                    <span class="text-[10px] font-mono text-muted-foreground uppercase opacity-40">Node_Email</span>
                                    <span class="text-xs font-mono text-white/80">{user.email}</span>
                                </div>
                            </div>
                        </section>

                        {/* Permission Matrix */}
                        <section class="space-y-4">
                            <div class="flex items-center justify-between">
                                <h3 class="text-[10px] font-black uppercase tracking-[0.4em] text-muted-foreground/30 italic flex items-center gap-2">
                                    <LuShield class="size-3" /> PERMISSION_MATRIX
                                </h3>
                                <span class="text-[9px] font-mono text-muted-foreground/20 uppercase">{safeServices.length} Modules</span>
                            </div>
                            <div class="space-y-3">
                                {safeServices.map((service) => {
                                    const access = servicesEdit.value[service.id] || {
                                        access_level: "hide",
                                        granted_at: new Date().toISOString(),
                                    };
                                    const isActive = access.access_level !== "hide";

                                    return (
                                        <div key={service.id} class="group p-5 rounded-2xl border border-white/5 bg-white/[0.01] hover:bg-white/[0.03] transition-all">
                                            <div class="flex items-center justify-between mb-4">
                                                <div class="flex flex-col">
                                                    <span class="text-xs font-black italic text-white uppercase group-hover:text-primary transition-colors">{service.name}</span>
                                                    <span class="text-[8px] font-mono text-muted-foreground/40 uppercase tracking-widest">Protocol_{service.id.toUpperCase()}</span>
                                                </div>
                                                <Switch
                                                    checked={isActive}
                                                    onChange$={$(() => {
                                                        servicesEdit.value = {
                                                            ...servicesEdit.value,
                                                            [service.id]: {
                                                                ...access,
                                                                access_level: !isActive ? "full" : "hide"
                                                            }
                                                        };
                                                    })}
                                                />
                                            </div>

                                            {isActive && (
                                                <div class="grid grid-cols-2 gap-2 pt-4 border-t border-white/5 animate-in fade-in duration-300">
                                                    <div class="space-y-1">
                                                        <span class="text-[8px] font-mono text-muted-foreground/40 uppercase">Access_Level</span>
                                                        <select
                                                            class="w-full bg-black/40 border border-white/5 rounded-lg h-7 text-[9px] font-black uppercase text-white px-2 outline-none focus:border-primary/50"
                                                            value={String(access.access_level)}
                                                            onChange$={(e: any) => {
                                                                const val = (e.target as HTMLSelectElement).value;
                                                                servicesEdit.value = {
                                                                    ...servicesEdit.value,
                                                                    [service.id]: { ...access, access_level: val as any }
                                                                };
                                                            }}
                                                        >
                                                            <option value="read_only">READ_ONLY</option>
                                                            <option value="full">FULL_ACCESS</option>
                                                        </select>
                                                    </div>
                                                    <div class="space-y-1">
                                                        <span class="text-[8px] font-mono text-muted-foreground/40 uppercase">Billing_State</span>
                                                        <select
                                                            class="w-full bg-black/40 border border-white/5 rounded-lg h-7 text-[9px] font-black uppercase text-white px-2 outline-none focus:border-primary/50"
                                                            value={access.billing_status || ""}
                                                            onChange$={(e: any) => {
                                                                const val = (e.target as HTMLSelectElement).value;
                                                                servicesEdit.value = {
                                                                    ...servicesEdit.value,
                                                                    [service.id]: { ...access, billing_status: val ? val as BillingStatus : undefined }
                                                                };
                                                            }}
                                                        >
                                                            <option value="">N/A</option>
                                                            <option value="active">ACTIVE</option>
                                                            <option value="trial">TRIALING</option>
                                                            <option value="pending">WAITING</option>
                                                            <option value="inactive">DISABLED</option>
                                                        </select>
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    );
                                })}
                            </div>
                        </section>
                    </SheetContent>

                    <SheetFooter>
                        <Button
                            variant="default"
                            disabled={isSubmitting.value}
                            onClick$={handleSave}
                            class="w-full sm:flex-1 h-12 font-black uppercase italic tracking-widest shadow-primary/20"
                        >
                            {isSubmitting.value ? (
                                <span class="flex items-center gap-2 animate-pulse">COMMITTING_CHANGES...</span>
                            ) : (
                                <span class="flex items-center gap-2"><LuSave class="size-4" /> COMMIT_SYNC_PHASE</span>
                            )}
                        </Button>
                    </SheetFooter>
                </>
            ) : (
                <div class="h-full flex flex-col items-center justify-center p-12 text-center">
                    <LuGhost class="size-12 text-muted-foreground/20 mb-4" />
                    <p class="text-xs font-mono text-muted-foreground/40 uppercase tracking-widest">No identity selected for management.</p>
                </div>
            )}
        </Sheet>
    );
});
