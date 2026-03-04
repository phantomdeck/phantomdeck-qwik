import { component$, useSignal, $ } from "@builder.io/qwik";
import { routeLoader$, type DocumentHead, Link } from "@builder.io/qwik-city";
import { safeServices } from "~/services/config";
import {
    LuActivity,
    LuShieldCheck,
    LuLock,
    LuChevronRight,
    LuBuilding2,
} from "@qwikest/icons/lucide";

import { getUser } from "~/utils/auth-helper";
import { getServiceAccess } from "~/lib/access-control";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "~/components/ui/Card";
import { Button } from "~/components/ui/Button";
import { Badge } from "~/components/ui/Badge";
import { cn } from "~/utils/cn";
import { InviteModal } from "~/services/access-control/ui/InviteModal";
import {
    AlertDialog,
    AlertDialogHeader,
    AlertDialogMedia,
    AlertDialogTitle,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogAction,
    AlertDialogCancel
} from "~/components/ui/Dialog";

export const useOverviewData = routeLoader$(async (event) => {
    const user = await getUser(event);
    if (!user) throw event.redirect(302, "/login");

    const servicesWithAccess = safeServices
        .filter((s) => s.enabled)
        .map((s) => ({
            id: s.id,
            name: s.name,
            ui: { icon: s.ui.icon, route: s.ui.route },
            ad: s.ad,
            access: getServiceAccess(user, s.id),
        }))
        .filter((s) => s.access.canSee);

    const canManageAccess = getServiceAccess(user, "access-control").canUse;

    return {
        user,
        servicesWithAccess,
        canManageAccess,
        stats: {
            activeCount: servicesWithAccess.filter((s) => s.access.canUse).length,
            availableCount: servicesWithAccess.length,
        },
    };
});

export default component$(() => {
    const data = useOverviewData();
    const isInviteOpen = useSignal(false);
    const showTeaserModal = useSignal(false);
    const selectedTeaser = useSignal<{ name: string; contact: string } | null>(null);

    const handleServiceClick = $((service: any) => {
        if (!service.access.canUse) {
            selectedTeaser.value = {
                name: service.name,
                contact: service.ad?.contactText ?? "Query Master Node for identity bypass.",
            };
            showTeaserModal.value = true;
        }
    });

    const user = data.value.user;
    const firstName = user.user_metadata.full_name?.split(" ")[0] ?? user.email?.split("@")[0] ?? "Operator";

    return (
        <div class="space-y-10">
            {/* Header */}
            <div class="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 class="text-3xl font-black italic uppercase tracking-tight text-white">
                        Welcome, <span class="text-primary">{firstName}</span>
                    </h1>
                    <p class="text-xs font-mono text-muted-foreground uppercase tracking-widest mt-1">
                        System Overview &bull; Active Node
                    </p>
                </div>

                {data.value.canManageAccess && (
                    <Button onClick$={$(() => (isInviteOpen.value = true))} size="sm" class="uppercase font-black italic tracking-widest">
                        <LuShieldCheck class="size-4 mr-2" />
                        Admin_Panel
                    </Button>
                )}
            </div>

            {/* Stats */}
            <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card class="bg-white/5 border-white/5">
                    <CardHeader class="pb-2">
                        <CardDescription class="text-[10px] uppercase font-bold tracking-widest">Provisioned Modules</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div class="text-3xl font-black italic text-white">
                            {data.value.stats.activeCount} <span class="text-lg text-muted-foreground/30 not-italic">/ {data.value.stats.availableCount}</span>
                        </div>
                    </CardContent>
                </Card>

                <Card class="bg-white/5 border-white/5">
                    <CardHeader class="pb-2">
                        <CardDescription class="text-[10px] uppercase font-bold tracking-widest">Integrity Status</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div class="flex items-center gap-2 text-3xl font-black italic text-accent uppercase">
                            <div class="size-2 rounded-full bg-accent animate-pulse" />
                            Secure
                        </div>
                    </CardContent>
                </Card>

                <Card class="bg-white/5 border-white/5">
                    <CardHeader class="pb-2">
                        <CardDescription class="text-[10px] uppercase font-bold tracking-widest">Lattice Latency</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div class="text-3xl font-black italic text-white uppercase">
                            12 <span class="text-lg text-muted-foreground/30 not-italic">MS</span>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Service Matrix */}
            <div class="space-y-6">
                <h2 class="text-xs font-black uppercase tracking-[0.3em] text-muted-foreground/40">Available Services</h2>

                <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {data.value.servicesWithAccess.map((service: any) => {
                        const isLocked = !service.access.canUse;
                        const displayIcon = service.id === "access-control"
                            ? <LuShieldCheck class="size-6" />
                            : service.id === "syvexbank"
                                ? <LuBuilding2 class="size-6" />
                                : <LuActivity class="size-6" />;

                        return (
                            <Card
                                key={service.id}
                                onClick$={() => handleServiceClick(service)}
                                class={cn(
                                    "group relative overflow-hidden transition-all duration-300",
                                    isLocked ? "bg-white/[0.02] border-white/5 opacity-60" : "bg-white/5 border-white/10 hover:border-primary/50 hover:bg-white/[0.08] cursor-pointer"
                                )}
                            >
                                <CardHeader class="flex flex-row items-center justify-between pb-4">
                                    <div class={cn(
                                        "flex size-12 items-center justify-center rounded-xl border",
                                        isLocked ? "bg-white/5 border-white/10 text-white/20" : "bg-primary/10 border-primary/20 text-primary"
                                    )}>
                                        {displayIcon}
                                    </div>
                                    {!isLocked && (
                                        <Badge variant="outline" class="text-[9px] uppercase font-bold italic border-primary/20 text-primary">Active</Badge>
                                    )}
                                </CardHeader>

                                <CardContent class="pb-6">
                                    <CardTitle class="text-xl mb-1.5">{service.name}</CardTitle>
                                    <CardDescription class="text-sm line-clamp-2">
                                        {service.ad?.description ?? "Standard system module."}
                                    </CardDescription>
                                </CardContent>

                                {!isLocked && (
                                    <CardFooter class="pt-0">
                                        <Link
                                            href={service.ui.route}
                                            onClick$={(e) => e.stopPropagation()}
                                            class="flex items-center gap-1.5 text-xs font-black uppercase italic text-primary hover:underline"
                                        >
                                            Launch Terminal <LuChevronRight class="size-3" />
                                        </Link>
                                    </CardFooter>
                                )}
                            </Card>
                        );
                    })}
                </div>
            </div>

            {/* Overlays */}
            <InviteModal showSig={isInviteOpen} />

            <AlertDialog show={showTeaserModal.value} onClose$={$(() => (showTeaserModal.value = false))}>
                <AlertDialogHeader>
                    <AlertDialogMedia><LuLock class="size-6 text-accent" /></AlertDialogMedia>
                    <AlertDialogTitle>Access Restricted</AlertDialogTitle>
                    <AlertDialogDescription>
                        Your identity does not have permission to access <strong>{selectedTeaser.value?.name}</strong>.
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <div class="px-8 pb-4">
                    <div class="p-4 rounded-xl bg-accent/5 border border-accent/10 text-center text-[11px] font-mono text-accent uppercase tracking-wider">
                        {selectedTeaser.value?.contact}
                    </div>
                </div>
                <AlertDialogFooter>
                    <AlertDialogCancel onClick$={$(() => (showTeaserModal.value = false))}>Close</AlertDialogCancel>
                    <AlertDialogAction onClick$={$(() => (showTeaserModal.value = false))}>Acknowledge</AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialog>
        </div>
    );
});

export const head: DocumentHead = { title: "Dashboard | PhantomDeck" };
