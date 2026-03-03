import { component$, useSignal, $ } from "@builder.io/qwik";
import { Button } from "../../components/ui/Button";
import {
    Card,
    CardHeader,
    CardTitle,
    CardDescription,
    CardContent,
    CardFooter,
    CardAction
} from "../../components/ui/Card";
import {
    Dialog,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogContent,
    DialogFooter
} from "../../components/ui/Dialog";
import {
    Tabs,
    TabsList,
    TabsTrigger,
    TabsContent
} from "../../components/ui/Tabs";
import {
    Field,
    FieldLabel,
    FieldTitle,
    FieldDescription,
    FieldError,
    FieldSeparator
} from "../../components/ui/Field";
import { Separator } from "../../components/ui/Separator";
import {
    Drawer,
    DrawerHeader,
    DrawerTitle,
    DrawerDescription,
    DrawerContent,
    DrawerFooter
} from "../../components/ui/Drawer";
import {
    Sheet,
    SheetHeader,
    SheetTitle,
    SheetDescription,
    SheetContent,
    SheetFooter
} from "../../components/ui/Sheet";
import {
    Carousel,
    CarouselContent,
    CarouselItem
} from "../../components/ui/Carousel";
import {
    LuRocket,
    LuPlus,
    LuActivity,
    LuArrowRight,
    LuShield,
    LuCpu,
    LuDatabase,
    LuSettings,
    LuExternalLink,
    LuLayout,
    LuLayers,
    LuSmartphone
} from "@qwikest/icons/lucide";
import { Skeleton } from "../../components/ui/Skeleton";
import { toast } from "../../components/ui/Toast";
import {
    InputOTP,
    InputOTPGroup,
    InputOTPSlot,
    InputOTPSeparator
} from "../../components/ui/InputOTP";
import { Input } from "../../components/ui/Input";
import { Textarea } from "../../components/ui/Textarea";
import { Checkbox } from "../../components/ui/Checkbox";
import { Switch } from "../../components/ui/Switch";
import { RadioGroup, RadioGroupItem } from "../../components/ui/RadioGroup";
import {
    Table,
    TableHeader,
    TableBody,
    TableFooter,
    TableHead,
    TableRow,
    TableCell,
    TableCaption
} from "../../components/ui/Table";

export default component$(() => {
    const isDialogOpen = useSignal(false);
    const isDrawerOpen = useSignal(false);
    const isSheetOpen = useSignal(false);
    const otpValue = useSignal("");

    return (
        <div class="min-h-screen bg-background p-8 md:p-12 pb-64 overflow-x-hidden">
            <div class="mx-auto max-w-6xl space-y-24">
                {/* ─── Hero Header ───────────────────────────────── */}
                <header class="space-y-4 border-b border-border/20 pb-16">
                    <div class="flex items-center gap-3 text-primary animate-pulse">
                        <LuRocket class="size-6" />
                        <span class="text-xs font-black uppercase tracking-[0.4em] font-mono">Phantom Intelligence V4</span>
                    </div>
                    <h1 class="text-6xl font-black tracking-tighter text-white mb-2 italic">PRO_UI_SUITE</h1>
                    <p class="text-muted-foreground/60 max-w-2xl leading-relaxed text-lg">
                        A surgical-grade, reactive UI kit built on top of Qwik's core engine.
                        Native-first, performance-obsessed design.
                    </p>
                </header>

                {/* ─── Tabs & Carousel ────────────────────────────── */}
                <section class="space-y-8">
                    <div class="flex items-baseline justify-between border-l-4 border-primary pl-6">
                        <h2 class="text-2xl font-black text-white uppercase tracking-tighter italic">Dynamic Layouts</h2>
                        <div class="flex gap-2">
                            <span class="text-[10px] font-mono text-primary font-bold tracking-widest uppercase bg-primary/10 px-2 py-0.5 rounded">/ui/Tabs.tsx</span>
                            <span class="text-[10px] font-mono text-accent font-bold tracking-widest uppercase bg-accent/10 px-2 py-0.5 rounded">/ui/Carousel.tsx</span>
                        </div>
                    </div>

                    <Tabs defaultValue="overview" class="w-full">
                        <TabsList variant="default" class="mb-10 w-full justify-start md:w-auto">
                            <TabsTrigger value="overview"><LuLayout class="size-4 mr-2" /> Overview</TabsTrigger>
                            <TabsTrigger value="carousel"><LuLayers class="size-4 mr-2" /> Carousel Snap</TabsTrigger>
                            <TabsTrigger value="more"><LuExternalLink class="size-4 mr-2" /> Advanced</TabsTrigger>
                        </TabsList>

                        <TabsContent value="overview">
                            <div class="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                                <Card class="border-primary/20 bg-primary/[0.02]">
                                    <CardHeader>
                                        <CardTitle class="text-xl">Surgical Precision</CardTitle>
                                        <CardDescription>Tabs are context-reactive and lightweight.</CardDescription>
                                    </CardHeader>
                                    <CardContent>
                                        <p class="text-xs text-muted-foreground leading-relaxed">
                                            This entire gallery section is managed by a single Qwik signal.
                                            Zero-hydration for inactive tabs ensures top-tier performance.
                                        </p>
                                    </CardContent>
                                </Card>
                                <Card>
                                    <CardHeader>
                                        <CardTitle class="text-xl italic">Glass Surfaces</CardTitle>
                                        <CardDescription>Multi-layered translucency tokens.</CardDescription>
                                    </CardHeader>
                                    <CardContent>
                                        <div class="flex gap-2 py-2">
                                            <div class="size-8 rounded-full bg-primary/20 animate-pulse" />
                                            <div class="size-8 rounded-full bg-accent/20 animate-pulse delay-75" />
                                            <div class="size-8 rounded-full bg-destructive/20 animate-pulse delay-150" />
                                        </div>
                                    </CardContent>
                                </Card>
                            </div>
                        </TabsContent>

                        <TabsContent value="carousel">
                            <Carousel>
                                <CarouselContent>
                                    {[1, 2, 3, 4, 5, 6].map((i) => (
                                        <CarouselItem key={i}>
                                            <Card class="h-64 border-white/5 hover:border-accent/40 bg-white/[0.01]">
                                                <CardHeader>
                                                    <span class="text-xs font-mono font-bold text-accent opacity-50 italic uppercase tracking-widest">Node_0{i}</span>
                                                    <CardTitle class="text-2xl font-black italic">Snap Module</CardTitle>
                                                </CardHeader>
                                                <CardContent class="flex items-center justify-center">
                                                    <div class="size-16 rounded-full border border-dashed border-accent/20 flex items-center justify-center animate-spin-slow">
                                                        <LuActivity class="size-8 text-accent/40" />
                                                    </div>
                                                </CardContent>
                                            </Card>
                                        </CarouselItem>
                                    ))}
                                </CarouselContent>
                                <div class="mt-4 flex items-center justify-center gap-2">
                                    <p class="text-[10px] uppercase font-black text-muted-foreground tracking-[0.2em] italic">Native Scroll Snap v1.0</p>
                                </div>
                            </Carousel>
                        </TabsContent>

                        <TabsContent value="more">
                            <div class="h-40 glass-card rounded-2xl border-dashed border-white/10 flex items-center justify-center uppercase font-black tracking-[0.5em] text-white/20 italic">
                                Advanced Node Implementation Pending
                            </div>
                        </TabsContent>
                    </Tabs>
                </section>

                {/* ─── Overlays & Modals ───────────────────────────── */}
                <section class="space-y-12">
                    <div class="flex items-baseline justify-between border-l-4 border-destructive pl-6">
                        <h2 class="text-2xl font-black text-white uppercase tracking-tighter italic">Engine Overlays</h2>
                        <div class="flex gap-2">
                            <span class="text-[10px] font-mono text-destructive font-bold tracking-widest uppercase bg-destructive/10 px-2 py-0.5 rounded">/ui/Dialog.tsx</span>
                            <span class="text-[10px] font-mono text-white/50 font-bold tracking-widest uppercase bg-white/5 px-2 py-0.5 rounded">/ui/Drawer.tsx</span>
                        </div>
                    </div>

                    <div class="grid gap-8 md:grid-cols-3">
                        <Card class="p-4 border-destructive/20 bg-destructive/[0.02]">
                            <CardHeader>
                                <CardTitle class="text-xl">Modal Portal Engine</CardTitle>
                                <CardDescription>Uses the native &lt;dialog&gt; API for focus trapping & accessibility.</CardDescription>
                            </CardHeader>
                            <CardContent class="py-6">
                                <Button
                                    variant="destructive"
                                    size="lg"
                                    class="w-full font-black italic uppercase shadow-destructive/20"
                                    onClick$={() => (isDialogOpen.value = true)}
                                >
                                    <LuShield class="size-5 mr-2" /> Launch Modal Interface
                                </Button>
                            </CardContent>
                        </Card>

                        <Card class="p-4">
                            <CardHeader>
                                <CardTitle class="text-xl">Edge Drawer</CardTitle>
                                <CardDescription>Mobile-first slide-up interaction pattern.</CardDescription>
                            </CardHeader>
                            <CardContent class="py-6">
                                <Button
                                    variant="glass"
                                    size="lg"
                                    class="w-full font-black italic uppercase"
                                    onClick$={() => (isDrawerOpen.value = true)}
                                >
                                    <LuSmartphone class="size-5 mr-2" /> Open Command Center
                                </Button>
                            </CardContent>
                        </Card>

                        <Card class="p-4 border-accent/20 bg-accent/[0.02]">
                            <CardHeader>
                                <CardTitle class="text-xl">Side Lattice (Sheet)</CardTitle>
                                <CardDescription>High-fidelity side panel for complex sub-forms.</CardDescription>
                            </CardHeader>
                            <CardContent class="py-6">
                                <Button
                                    variant="outline"
                                    size="lg"
                                    class="w-full font-black italic uppercase border-accent/20 text-accent hover:bg-accent/10 transition-colors"
                                    onClick$={() => (isSheetOpen.value = true)}
                                >
                                    <LuExternalLink class="size-5 mr-2" /> Neural Side-Panel
                                </Button>
                            </CardContent>
                        </Card>
                    </div>
                </section>

                {/* ─── Overlay Components ─────────────────────────── */}
                <Sheet
                    show={isSheetOpen.value}
                    onClose$={$(() => (isSheetOpen.value = false))}
                    side="right"
                >
                    <SheetHeader>
                        <SheetTitle>Neural Profile Meta</SheetTitle>
                        <SheetDescription>Update your identity hash and node associations for the current session.</SheetDescription>
                    </SheetHeader>
                    <SheetContent class="space-y-10">
                        <div class="space-y-6">
                            <Field>
                                <FieldLabel>IDENTITY_HASH</FieldLabel>
                                <div class="flex items-center gap-3">
                                    <Input value="Pedro_Duarte_v8.4" class="flex-1 font-mono uppercase bg-white/5 border-white/5" />
                                    <Button variant="ghost" size="icon" class="text-primary"><LuActivity class="size-5" /></Button>
                                </div>
                            </Field>
                            <Field>
                                <FieldLabel>ASSOCIATED_NODE_ID</FieldLabel>
                                <Input placeholder="@peduarte" class="font-mono bg-white/5 border-white/5" />
                            </Field>
                        </div>

                        <div class="p-6 rounded-2xl border border-white/5 bg-white/[0.02] space-y-4">
                            <h3 class="text-[10px] font-black uppercase tracking-widest text-primary italic opacity-70">Security Protocol</h3>
                            <div class="flex items-center justify-between">
                                <p class="text-xs text-muted-foreground/60 italic">Enhanced session encryption</p>
                                <Switch checked />
                            </div>
                        </div>
                    </SheetContent>
                    <SheetFooter>
                        <Button variant="ghost" class="font-bold underline" onClick$={() => (isSheetOpen.value = false)}>ABORT</Button>
                        <Button variant="default" class="px-10 font-black italic uppercase tracking-widest" onClick$={() => (isSheetOpen.value = false)}>COMMIT_CHANGES</Button>
                    </SheetFooter>
                </Sheet>
                <Dialog
                    show={isDialogOpen.value}
                    onClose$={$(() => (isDialogOpen.value = false))}
                    size="md"
                >
                    <DialogHeader>
                        <DialogTitle>NODE_SHUTDOWN_PROTOCOL</DialogTitle>
                        <DialogDescription>Warning: This action will purge all temporary service caches for the current session.</DialogDescription>
                    </DialogHeader>
                    <DialogContent class="space-y-6">
                        <div class="p-4 bg-destructive/5 rounded-xl border border-destructive/10 space-y-4">
                            <div class="flex items-center gap-3 text-destructive">
                                <LuActivity class="size-5 animate-pulse" />
                                <span class="text-xs font-black uppercase tracking-widest font-mono">Real-time risk audit in progress</span>
                            </div>
                            <div class="h-1 bg-destructive/10 rounded-full overflow-hidden">
                                <div class="h-full bg-destructive w-1/3" />
                            </div>
                        </div>
                        <p class="text-sm text-muted-foreground/80 leading-relaxed italic">
                            Decommissioning of Phantom Intelligence nodes requires authorized confirmation.
                            Are you certain of this state transition?
                        </p>
                    </DialogContent>
                    <DialogFooter>
                        <Button variant="ghost" onClick$={() => (isDialogOpen.value = false)}>Abort</Button>
                        <Button variant="destructive" class="px-8 font-black">CONFIRM PURGE</Button>
                    </DialogFooter>
                </Dialog>

                <Drawer
                    show={isDrawerOpen.value}
                    onClose$={$(() => (isDrawerOpen.value = false))}
                    side="bottom"
                >
                    <DrawerHeader>
                        <DrawerTitle>COMMAND_CENTER_MOBILE</DrawerTitle>
                        <DrawerDescription>Quick access telemetry and system configuration.</DrawerDescription>
                    </DrawerHeader>
                    <DrawerContent class="space-y-4 pb-12">
                        {[1, 2, 3].map((i) => (
                            <div key={i} class="p-4 glass rounded-xl border-white/5 flex items-center justify-between group">
                                <div class="flex items-center gap-4">
                                    <LuSettings class="size-5 text-muted-foreground group-hover:text-primary transition-colors" />
                                    <span class="text-xs font-bold uppercase tracking-wider text-white">System Config Node {i}</span>
                                </div>
                                <Button variant="secondary" size="xs">ACTIVE</Button>
                            </div>
                        ))}
                    </DrawerContent>
                    <DrawerFooter>
                        <Button variant="default" class="w-full font-black uppercase italic" onClick$={() => (isDrawerOpen.value = false)}>ACKNOWLEDGE & CLOSE</Button>
                    </DrawerFooter>
                </Drawer>

                {/* ─── Form Architecture ──────────────────────────── */}
                <section class="space-y-12">
                    <div class="flex items-baseline justify-between border-l-4 border-accent pl-6">
                        <h2 class="text-2xl font-black text-white uppercase tracking-tighter italic">Form Architecture</h2>
                        <div class="flex gap-2">
                            <span class="text-[10px] font-mono text-accent font-bold tracking-widest uppercase bg-accent/10 px-2 py-0.5 rounded">/ui/Field.tsx</span>
                            <span class="text-[10px] font-mono text-white/50 font-bold tracking-widest uppercase bg-white/5 px-2 py-0.5 rounded">/ui/Label.tsx</span>
                        </div>
                    </div>

                    <div class="grid gap-10 md:grid-cols-2">
                        {/* Vertical Flow */}
                        <Card class="border-accent/10 bg-accent/[0.01]">
                            <CardHeader>
                                <CardTitle class="text-[10px] uppercase font-black tracking-[0.3em] text-accent/50 mb-2">Orientation: Vertical</CardTitle>
                            </CardHeader>
                            <CardContent class="space-y-10">
                                <Field orientation="vertical">
                                    <FieldTitle>USER_IDENTITY</FieldTitle>
                                    <FieldDescription>Alpha-numeric protocol identifier for current node.</FieldDescription>
                                    <div class="relative group">
                                        <input
                                            placeholder="e.g. PHANTOM_NODE_7"
                                            class="w-full bg-white/[0.03] border border-white/5 rounded-xl px-4 py-3 text-sm focus:border-accent/40 focus:ring-1 focus:ring-accent/40 outline-none transition-all placeholder:text-muted-foreground/30"
                                        />
                                        <div class="absolute inset-0 rounded-xl bg-accent/5 opacity-0 group-focus-within:opacity-100 transition-opacity pointer-events-none blur-sm" />
                                    </div>
                                    <FieldError errors={["Validation mismatch in node cluster"]} />
                                </Field>

                                <FieldSeparator>
                                    <span class="text-[10px] font-mono text-muted-foreground/40 italic tracking-[0.2em] font-black uppercase">Or Protocol</span>
                                </FieldSeparator>

                                <Field orientation="vertical">
                                    <div class="flex items-center justify-between">
                                        <FieldTitle>SYNC_FREQUENCY</FieldTitle>
                                        <span class="text-[10px] text-accent font-black tracking-widest uppercase italic">0.5ms Delay</span>
                                    </div>
                                    <input
                                        type="range"
                                        class="accent-primary w-full h-1.5 bg-white/5 rounded-full appearance-none cursor-pointer"
                                    />
                                </Field>
                            </CardContent>
                        </Card>

                        {/* Horizontal / Action Flow */}
                        <Card class="border-white/5 bg-white/[0.01]">
                            <CardHeader>
                                <CardTitle class="text-[10px] uppercase font-black tracking-[0.3em] text-white/20 mb-2">Orientation: Horizontal</CardTitle>
                            </CardHeader>
                            <CardContent class="space-y-8">
                                <Field orientation="horizontal">
                                    <div class="flex-1 space-y-1">
                                        <FieldTitle>DARK_MODE_PROTOCOL</FieldTitle>
                                        <FieldDescription>Automatic intensity based on ambient node metrics.</FieldDescription>
                                    </div>
                                    <div class="size-6 rounded-md bg-accent/20 border border-accent/20 flex items-center justify-center text-accent animate-pulse">
                                        <LuActivity class="size-4" />
                                    </div>
                                </Field>

                                <Separator class="opacity-20" />

                                <Field orientation="horizontal">
                                    <div class="flex-1 space-y-1">
                                        <FieldTitle>NEURAL_CACHE_PRESERV</FieldTitle>
                                        <FieldDescription>Prevent cache purging on critical state jumps.</FieldDescription>
                                    </div>
                                    <div class="flex items-center gap-2">
                                        <label class="relative inline-flex items-center cursor-pointer">
                                            <input type="checkbox" checked class="sr-only peer" />
                                            <div class="w-11 h-6 bg-white/5 border border-white/5 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white/40 after:border-white/10 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary/20 peer-checked:border-primary/20" />
                                        </label>
                                    </div>
                                </Field>
                            </CardContent>
                        </Card>
                    </div>
                </section>

                {/* ─── Telemetry Buffering (Skeleton) ─────────────── */}
                <section class="space-y-12">
                    <div class="flex items-baseline justify-between border-l-4 border-muted pl-6">
                        <h2 class="text-2xl font-black text-white uppercase tracking-tighter italic">Telemetry Buffering</h2>
                        <span class="text-[10px] font-mono text-muted-foreground/50 font-bold tracking-widest uppercase bg-white/5 px-2 py-0.5 rounded">/ui/Skeleton.tsx</span>
                    </div>

                    <div class="grid gap-10 md:grid-cols-2 lg:grid-cols-3">
                        {/* Card Skeleton */}
                        <Card class="border-white/5 bg-white/[0.01]">
                            <CardHeader class="flex-row items-center gap-4 space-y-0">
                                <Skeleton class="h-12 w-12 rounded-xl shrink-0" />
                                <div class="space-y-2 flex-1">
                                    <Skeleton class="h-4 w-2/3" />
                                    <Skeleton class="h-3 w-1/3 opacity-50" />
                                </div>
                            </CardHeader>
                            <CardContent class="space-y-4 py-4">
                                <Skeleton class="h-24 w-full rounded-2xl" />
                                <div class="space-y-2">
                                    <Skeleton class="h-3 w-full" />
                                    <Skeleton class="h-3 w-[80%]" />
                                    <Skeleton class="h-3 w-[60%]" />
                                </div>
                            </CardContent>
                        </Card>

                        {/* Profile/User Skeleton */}
                        <div class="glass-card p-8 rounded-2xl flex items-center gap-6">
                            <Skeleton class="h-16 w-16 rounded-full shrink-0 border border-primary/20 bg-primary/5 shadow-inner" />
                            <div class="flex-1 space-y-3">
                                <Skeleton class="h-5 w-3/4 rounded-md" />
                                <Skeleton class="h-4 w-1/2 rounded-md opacity-30" />
                                <div class="flex gap-2 pt-2">
                                    <Skeleton class="h-2 w-8 rounded-full" />
                                    <Skeleton class="h-2 w-12 rounded-full" />
                                </div>
                            </div>
                        </div>

                        {/* Functional Node Skeleton */}
                        <div class="space-y-6">
                            <div class="flex items-center justify-between px-2">
                                <Skeleton class="h-4 w-1/4 rounded" />
                                <Skeleton class="h-4 w-8 rounded-full" />
                            </div>
                            <div class="grid grid-cols-4 gap-3">
                                {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
                                    <Skeleton key={i} class="aspect-square rounded-lg border border-white/5" />
                                ))}
                            </div>
                            <Skeleton class="h-11 w-full rounded-xl" />
                        </div>
                    </div>
                </section>

                {/* ─── Neural Notifications (Toast) ──────────────── */}
                <section class="space-y-12">
                    <div class="flex items-baseline justify-between border-l-4 border-primary pl-6">
                        <h2 class="text-2xl font-black text-white uppercase tracking-tighter italic">Neural Notifications</h2>
                        <div class="flex gap-2">
                            <span class="text-[10px] font-mono text-primary font-bold tracking-widest uppercase bg-primary/10 px-2 py-0.5 rounded">/ui/Toast.tsx</span>
                        </div>
                    </div>

                    <div class="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
                        <Card class="border-primary/20 bg-primary/[0.02] p-2">
                            <CardHeader>
                                <CardTitle class="text-[10px] uppercase font-black tracking-widest opacity-50">Event System</CardTitle>
                            </CardHeader>
                            <CardContent class="py-6">
                                <Button
                                    variant="default"
                                    size="lg"
                                    class="w-full font-black italic uppercase shadow-primary/20"
                                    onClick$={() =>
                                        toast("Event synchronized", {
                                            description: "Neural cache successfully updated for sub-node 7.",
                                        })
                                    }
                                >
                                    <LuActivity class="size-5 mr-3" /> Test Sync Broadcast
                                </Button>
                            </CardContent>
                        </Card>

                        <Card class="p-2">
                            <CardHeader>
                                <CardTitle class="text-[10px] uppercase font-black tracking-widest opacity-50 text-destructive">Crisis Node</CardTitle>
                            </CardHeader>
                            <CardContent class="py-6">
                                <Button
                                    variant="destructive"
                                    size="lg"
                                    class="w-full font-black italic uppercase shadow-destructive/20"
                                    onClick$={() =>
                                        toast.error("PROTOCOL VIOLATION", {
                                            description: "Access denied by secondary firewall orchestration.",
                                        })
                                    }
                                >
                                    <LuShield class="size-5 mr-3" /> Test Failure Alert
                                </Button>
                            </CardContent>
                        </Card>
                    </div>
                </section>

                {/* ─── Security Lattice (Input OTP) ──────────────── */}
                <section class="space-y-12">
                    <div class="flex items-baseline justify-between border-l-4 border-accent pl-6">
                        <h2 class="text-2xl font-black text-white uppercase tracking-tighter italic">Security Lattice</h2>
                        <div class="flex gap-2">
                            <span class="text-[10px] font-mono text-accent font-bold tracking-widest uppercase bg-accent/10 px-2 py-0.5 rounded">/ui/InputOTP.tsx</span>
                        </div>
                    </div>

                    <div class="grid gap-10 lg:grid-cols-2">
                        <Card class="border-accent/10 bg-accent/[0.01]">
                            <CardHeader>
                                <CardTitle class="text-sm font-black italic tracking-tighter">Two-Factor Authentication Node</CardTitle>
                                <CardDescription>Enter the 6-digit identity key to authorize current transaction.</CardDescription>
                            </CardHeader>
                            <CardContent class="flex flex-col items-center justify-center py-10 space-y-8">
                                <InputOTP maxLength={6} value={otpValue} onComplete$={$(() => toast.success("AUTHENTICATED_OK"))}>
                                    <InputOTPGroup>
                                        {[0, 1, 2].map(i => <InputOTPSlot key={i} index={i} value={otpValue} />)}
                                    </InputOTPGroup>
                                    <InputOTPSeparator />
                                    <InputOTPGroup>
                                        {[3, 4, 5].map(i => <InputOTPSlot key={i} index={i} value={otpValue} />)}
                                    </InputOTPGroup>
                                </InputOTP>

                                <p class="text-[10px] text-muted-foreground/30 font-mono tracking-widest italic uppercase">Waiting for secure entry protocol...</p>
                            </CardContent>
                        </Card>

                        <div class="flex flex-col justify-center space-y-6">
                            <div class="flex items-center gap-4 text-accent animate-pulse">
                                <LuShield class="size-6" />
                                <span class="text-xs font-black uppercase tracking-[0.3em]">Vault Lock Enabled</span>
                            </div>
                            <p class="text-xs text-muted-foreground/60 leading-relaxed italic">
                                Input OTP mimics the Shadcn pattern with modular slots and groups, allowing for any layout—even separate boxes or specialized separators.
                            </p>
                            <Button variant="outline" size="sm" class="w-fit italic font-black uppercase tracking-widest border-accent/20 text-accent">Resend Sequence</Button>
                        </div>
                    </div>
                </section>

                {/* ─── Data Grid Orchestration (Table) ─────────── */}
                <section class="space-y-12">
                    <div class="flex items-baseline justify-between border-l-4 border-primary pl-6">
                        <h2 class="text-2xl font-black text-white uppercase tracking-tighter italic">Data Grid Orchestration</h2>
                        <div class="flex gap-2">
                            <span class="text-[10px] font-mono text-primary font-bold tracking-widest uppercase bg-primary/10 px-2 py-0.5 rounded">/ui/Table.tsx</span>
                        </div>
                    </div>

                    <div class="space-y-6">
                        <Table>
                            <TableCaption>Active Node Telemetry — Phase 4 Core Cluster</TableCaption>
                            <TableHeader>
                                <TableRow>
                                    <TableHead class="w-[100px]">Node_ID</TableHead>
                                    <TableHead>Protocol</TableHead>
                                    <TableHead>Latency</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead class="text-right">Throughput</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                <TableRow>
                                    <TableCell class="font-black italic">PXA-01</TableCell>
                                    <TableCell class="text-xs font-mono uppercase">Neural_Link_v7</TableCell>
                                    <TableCell class="text-accent">0.42ms</TableCell>
                                    <TableCell>
                                        <span class="inline-flex items-center rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-black uppercase text-primary tracking-tighter border border-primary/20 animate-pulse">Synchronized</span>
                                    </TableCell>
                                    <TableCell class="text-right font-mono">1.2 TB/s</TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell class="font-black italic text-white/40">PXA-02</TableCell>
                                    <TableCell class="text-xs font-mono uppercase">ArTMIS_Sync</TableCell>
                                    <TableCell class="text-destructive">14.1ms</TableCell>
                                    <TableCell>
                                        <span class="inline-flex items-center rounded-full bg-destructive/10 px-2 py-0.5 text-[10px] font-black uppercase text-destructive tracking-tighter border border-destructive/20">Congested</span>
                                    </TableCell>
                                    <TableCell class="text-right font-mono opacity-20">0.02 TB/s</TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell class="font-black italic">PXA-03</TableCell>
                                    <TableCell class="text-xs font-mono uppercase">Phantom_Core</TableCell>
                                    <TableCell class="text-accent">0.89ms</TableCell>
                                    <TableCell>
                                        <span class="inline-flex items-center rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-black uppercase text-primary tracking-tighter border border-primary/20 animate-pulse">Synchronized</span>
                                    </TableCell>
                                    <TableCell class="text-right font-mono text-white/60">0.9 TB/s</TableCell>
                                </TableRow>
                            </TableBody>
                            <TableFooter>
                                <TableRow>
                                    <TableCell colSpan={4} class="italic text-white">Aggregated Cluster Load</TableCell>
                                    <TableCell class="text-right font-black italic">2.12 TB/s</TableCell>
                                </TableRow>
                            </TableFooter>
                        </Table>
                    </div>
                </section>

                {/* ─── Neural Input Vector (Forms) ─────────────── */}
                <section class="space-y-12">
                    <div class="flex items-baseline justify-between border-l-4 border-accent pl-6">
                        <h2 class="text-2xl font-black text-white uppercase tracking-tighter italic">Neural Input Vector</h2>
                        <div class="flex gap-2">
                            <span class="text-[10px] font-mono text-accent font-bold tracking-widest uppercase bg-accent/10 px-2 py-0.5 rounded">/ui/Input.tsx</span>
                            <span class="text-[10px] font-mono text-primary font-bold tracking-widest uppercase bg-primary/10 px-2 py-0.5 rounded">/ui/Switch.tsx</span>
                        </div>
                    </div>

                    <div class="grid gap-10 lg:grid-cols-2">
                        {/* Standard Inputs */}
                        <div class="space-y-10 group/inputs">
                            <Field>
                                <FieldLabel>NODE_ACCESS_KEY</FieldLabel>
                                <Input placeholder="Enter primary key..." type="password" />
                                <FieldDescription>Encrypted at rest following session purge.</FieldDescription>
                            </Field>

                            <Field>
                                <FieldLabel>NODE_METADATA_STREAM</FieldLabel>
                                <Textarea placeholder="Inject streaming logs or metadata..." class="h-32" />
                                <FieldDescription>Max overflow 2MB per session jump.</FieldDescription>
                            </Field>
                        </div>

                        {/* Toggles & Radios */}
                        <Card class="border-white/5 bg-white/[0.01]">
                            <CardHeader>
                                <CardTitle class="text-[10px] uppercase font-black tracking-widest text-primary mb-2">Toggle Operations</CardTitle>
                            </CardHeader>
                            <CardContent class="grid gap-12">
                                {/* Binary Toggles */}
                                <div class="grid gap-8 sm:grid-cols-2">
                                    <Field orientation="horizontal">
                                        <div class="flex-1">
                                            <FieldTitle>AUTOSYNC</FieldTitle>
                                            <FieldDescription>Continuous telemetry push.</FieldDescription>
                                        </div>
                                        <Switch checked />
                                    </Field>

                                    <Field orientation="horizontal">
                                        <div class="flex-1">
                                            <FieldTitle>CACHE_PURGE</FieldTitle>
                                            <FieldDescription>Aggressive memory cleanup.</FieldDescription>
                                        </div>
                                        <Checkbox checked />
                                    </Field>
                                </div>

                                <Separator class="opacity-10" />

                                {/* Radio Selection */}
                                <div class="space-y-4">
                                    <FieldTitle class="text-xs opacity-50 italic">NODE_PRIORITY_GROUP</FieldTitle>
                                    <RadioGroup defaultValue="low">
                                        <div class="flex items-center gap-6">
                                            <label class="flex items-center gap-3 cursor-pointer group/label">
                                                <RadioGroupItem value="low" />
                                                <span class="text-xs font-bold text-white/40 group-hover/label:text-white transition-colors uppercase italic">Low</span>
                                            </label>
                                            <label class="flex items-center gap-3 cursor-pointer group/label">
                                                <RadioGroupItem value="med" />
                                                <span class="text-xs font-bold text-white/40 group-hover/label:text-white transition-colors uppercase italic">Med</span>
                                            </label>
                                            <label class="flex items-center gap-3 cursor-pointer group/label">
                                                <RadioGroupItem value="high" />
                                                <span class="text-xs font-bold text-white/40 group-hover/label:text-white transition-colors uppercase italic">High</span>
                                            </label>
                                        </div>
                                    </RadioGroup>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </section>

                {/* ─── Roadmap Footer ─────────────────────────────── */}
                <section class="pt-24 pb-48">
                    <div class="relative overflow-hidden rounded-3xl border border-dashed border-white/20 p-20 flex flex-col items-center justify-center text-center space-y-8 group transition-all hover:border-primary/50 hover:bg-primary/[0.01]">
                        <div class="absolute -top-10 -left-10 size-64 bg-primary/5 blur-[100px] rounded-full" />
                        <div class="absolute -bottom-10 -right-10 size-64 bg-accent/5 blur-[100px] rounded-full" />

                        <div class="size-24 rounded-3xl border border-dashed border-white/20 flex items-center justify-center transition-all duration-500 group-hover:rotate-[25deg] group-hover:scale-125 group-hover:border-primary/50 shadow-2xl group-hover:shadow-primary/20">
                            <span class="text-5xl">⚙️</span>
                        </div>
                        <div class="space-y-2 relative z-10 scale-90 md:scale-100">
                            <h2 class="text-3xl font-black uppercase tracking-[1em] text-white/20 group-hover:text-white transition-all duration-700 italic">SYSTEM_FULLY_READY_V4</h2>
                            <p class="text-[10px] text-muted-foreground/40 font-mono uppercase tracking-[0.4em] group-hover:text-primary transition-colors leading-relaxed">
                                CORE COMPONENTS INITIALIZED: BUTTONS | CARDS | TABS | CAROUSEL | DIALOG | DRAWER
                            </p>
                        </div>
                    </div>
                </section>
            </div>
        </div>
    );
});
