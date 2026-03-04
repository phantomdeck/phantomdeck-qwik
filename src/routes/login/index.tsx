import { component$, useVisibleTask$ } from "@builder.io/qwik";
import { Form, routeAction$, zod$, z, type DocumentHead } from "@builder.io/qwik-city";
import { createSupabaseServerClient } from "../../lib/supabase/server";
import {
    Card,
    CardHeader,
    CardTitle,
    CardDescription,
    CardContent,
    CardFooter
} from "../../components/ui/Card";
import { Button } from "../../components/ui/Button";
import { Input } from "../../components/ui/Input";
import { Field, FieldLabel, FieldError } from "../../components/ui/Field";
import { LuShield, LuRocket, LuActivity } from "@qwikest/icons/lucide";

/**
 * Tactical Auth Portal
 * Cyber Pro Login engine for Phantom Intelligence.
 * Note: Registration is locked to master node control.
 */

export const useLoginAction = routeAction$(async (data, event) => {
    const supabase = createSupabaseServerClient(event);

    const { error } = await supabase.auth.signInWithPassword({
        email: data.email,
        password: data.password,
    });

    if (error) {
        return {
            success: false,
            error: error.message,
        };
    }

    return {
        success: true
    };
}, zod$({
    email: z.string().email("Invalid email format (NEEDS: user@node.io)"),
    password: z.string().min(6, "Tactical bypass: minimum 6 chars"),
}));

export default component$(() => {
    const loginAction = useLoginAction();

    // ─── CLIENT-SIDE REDIRECT ───
    // This handles the transition after the action is successful
    // Better for mobile cookie persistence on non-localhost IP access
    // eslint-disable-next-line qwik/no-use-visible-task
    useVisibleTask$(({ track }) => {
        const result = track(() => loginAction.value);
        if (result?.success) {
            window.location.href = "/";
        }
    });

    return (
        <div class="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-background px-6 py-20">
            {/* Background Ambience */}
            <div class="absolute -left-64 -top-64 size-[800px] rounded-full bg-primary/5 blur-[200px]" />
            <div class="absolute -right-64 -bottom-64 size-[800px] rounded-full bg-accent/5 blur-[200px]" />

            {/* Tactical Branding Header */}
            <div class="z-10 mb-12 flex flex-col items-center space-y-4 text-center">
                <div class="flex size-16 items-center justify-center rounded-2xl border border-primary/20 bg-primary/10 shadow-lg shadow-primary/10 transition-transform duration-500 hover:rotate-[30deg] hover:scale-110">
                    <LuRocket class="size-8 text-primary shadow-glow" />
                </div>
                <div class="space-y-1">
                    <h1 class="text-4xl font-black italic tracking-tighter text-white uppercase">PHANTOM_DECK</h1>
                    <p class="font-mono text-[10px] font-bold uppercase tracking-[0.4em] text-muted-foreground/60">Intelligence Orchestration v4.2</p>
                </div>
            </div>

            <Card class="z-10 w-full max-w-md border-white/5 bg-white/[0.01] shadow-2xl backdrop-blur-3xl animate-in fade-in slide-in-from-bottom-5 duration-700">
                <CardHeader class="pb-4 space-y-1">
                    <CardTitle class="text-2xl">Access Portal</CardTitle>
                    <CardDescription class="italic leading-relaxed">Enter your node credentials to bypass encryption lattices.</CardDescription>
                </CardHeader>

                <CardContent class="pt-6">
                    <Form action={loginAction} class="space-y-6">
                        <Field>
                            <FieldLabel>NODE_IDENTITY (EMAIL)</FieldLabel>
                            <Input
                                name="email"
                                type="email"
                                placeholder="you@phantom.io"
                                required
                                class="bg-white/5 border-white/5 focus:ring-primary/40 h-12"
                            />
                            {loginAction.value?.fieldErrors?.email && (
                                <FieldError errors={[loginAction.value.fieldErrors.email]} />
                            )}
                        </Field>

                        <Field>
                            <FieldLabel>BYPASS_KEY (PASSWORD)</FieldLabel>
                            <Input
                                name="password"
                                type="password"
                                placeholder="••••••••"
                                required
                                class="bg-white/5 border-white/5 focus:ring-primary/40 h-12"
                            />
                            {loginAction.value?.fieldErrors?.password && (
                                <FieldError errors={[loginAction.value.fieldErrors.password]} />
                            )}
                        </Field>

                        {loginAction.value?.error && (
                            <div class="rounded-xl border border-destructive/20 bg-destructive/10 p-4 text-xs font-black uppercase italic tracking-widest text-destructive animate-in shake-1">
                                <LuActivity class="size-4 mb-2" />
                                Bypass Failed: {loginAction.value.error}
                            </div>
                        )}

                        <Button
                            type="submit"
                            disabled={loginAction.isRunning}
                            class="w-full font-black italic uppercase tracking-widest h-14 shadow-primary/20 transition-all active:scale-95 text-base"
                        >
                            {loginAction.isRunning ? (
                                <span class="flex items-center gap-2">
                                    <LuActivity class="size-5 animate-pulse" /> AUTHORIZING...
                                </span>
                            ) : (
                                <span class="flex items-center gap-2 text-glow">
                                    <LuShield class="size-5" /> AUTHORIZE_BYPASS
                                </span>
                            )}
                        </Button>
                    </Form>
                </CardContent>

                <CardFooter class="flex flex-col items-center pt-4 pb-10">
                    <p class="text-[10px] font-mono uppercase tracking-[0.2em] text-muted-foreground/30">Secure Lattice Connection v4.2.0-PRO</p>
                    <div class="mt-4 h-0.5 w-12 rounded-full bg-white/5" />
                </CardFooter>
            </Card>

            {/* Footer Meta */}
            <div class="z-10 mt-12 flex items-center justify-center gap-8 opacity-20 transition-all hover:opacity-100 duration-500 font-mono text-[9px] uppercase font-black tracking-widest text-white cursor-default">
                <div class="flex items-center gap-2 border-r border-white/10 pr-8 transition-colors hover:text-primary"><span class="size-1.5 rounded-full bg-primary" /> PHANTOM_NET_ACTIVE</div>
                <div class="hidden sm:block hover:text-accent">ENCRYPTION: AES_256_PRO</div>
                <div class="hidden sm:block">UPTIME: 99.998%</div>
            </div>
        </div>
    );
});

export const head: DocumentHead = {
    title: "PHANTOM_DECK | AUTH_PORTAL",
    meta: [
        { name: "description", content: "Authorize bypass for Phantom Intelligence Orchestration" },
    ],
};
