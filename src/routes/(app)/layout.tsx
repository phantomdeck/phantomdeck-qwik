import { component$, Slot, useSignal, $ } from "@builder.io/qwik";
import { routeLoader$, type RequestHandler } from "@builder.io/qwik-city";
import { getUser } from "~/utils/auth-helper";
import { getVisibleServices } from "~/lib/access-control";
import { Header } from "~/components/layout/Header";
import {
    SidebarNav,
    SidebarNavItem,
    SidebarNavHeading,
} from "~/components/layout/SidebarNav";
import {
    LuLayoutDashboard,
    LuShieldCheck,
    LuActivity,
    LuRocket,
    LuSettings,
    LuNetwork,
} from "@qwikest/icons/lucide";
import { cn } from "~/utils/cn";

export const onGet: RequestHandler = async ({ cacheControl }) => {
    cacheControl({
        staleWhileRevalidate: 60 * 60 * 24 * 7,
        maxAge: 5,
    });
};

export const useLayoutData = routeLoader$(async (event) => {
    const user = await getUser(event);
    if (!user) throw event.redirect(302, "/login");
    const visibleServices = getVisibleServices(user);
    return {
        user,
        services: visibleServices.map((s: { id: any; name: any; ui: { route: any; icon: any; }; }) => ({
            id: s.id,
            name: s.name,
            route: s.ui.route,
            icon: s.ui.icon,
        })),
    };
});

export default component$(() => {
    const layoutData = useLayoutData();
    const isSidebarOpen = useSignal(false);
    const toggleSidebar = $(() => (isSidebarOpen.value = !isSidebarOpen.value));
    const user = layoutData.value.user;
    const services = layoutData.value.services;
    const userInitial = user?.user_metadata.full_name?.[0]?.toUpperCase() ?? user?.email?.[0]?.toUpperCase() ?? "?";
    const userName = user?.user_metadata.full_name ?? user?.email ?? "Unknown Operator";

    return (
        <div class="flex min-h-screen w-full bg-background font-sans">
            {isSidebarOpen.value && (
                <div
                    class="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm lg:hidden"
                    onClick$={toggleSidebar}
                />
            )}

            {/* Sidebar */}
            <aside class={cn(
                "fixed inset-y-0 left-0 z-50 flex w-64 flex-col border-r border-white/5 bg-background transition-transform duration-300 ease-in-out lg:sticky lg:translate-x-0 lg:transition-none",
                isSidebarOpen.value ? "translate-x-0" : "-translate-x-full"
            )}>
                <header class="flex h-16 shrink-0 items-center px-6 border-b border-white/5">
                    <div class="flex items-center gap-2.5">
                        <div class="flex size-8 items-center justify-center rounded-lg bg-primary/10 text-primary">
                            <LuRocket class="size-4" />
                        </div>
                        <span class="text-sm font-black tracking-tight text-white uppercase italic">PhantomDeck</span>
                    </div>
                </header>

                <SidebarNav>
                    <SidebarNavItem href="/" label="Overview">
                        <LuLayoutDashboard q:slot="icon" class="size-4" />
                    </SidebarNavItem>

                    {services.length > 0 && (
                        <>
                            <SidebarNavHeading label="Services" />
                            {services.map((service: any) => (
                                <SidebarNavItem key={service.id} href={service.route} label={service.name}>
                                    {service.id === "access-control" ? (
                                        <LuShieldCheck q:slot="icon" class="size-4" />
                                    ) : service.id === "syvexbank" ? (
                                        <LuNetwork q:slot="icon" class="size-4" />
                                    ) : (
                                        <LuActivity q:slot="icon" class="size-4" />
                                    )}
                                </SidebarNavItem>
                            ))}
                        </>
                    )}

                    <SidebarNavHeading label="Settings" />
                    <SidebarNavItem href="/settings" label="Config">
                        <LuSettings q:slot="icon" class="size-4" />
                    </SidebarNavItem>
                </SidebarNav>
            </aside>

            {/* Main Content */}
            <div class="flex flex-1 flex-col min-w-0">
                <Header
                    title="Dashboard"
                    userName={userName}
                    userInitial={userInitial}
                    onToggleSidebar$={toggleSidebar}
                />
                <main class="flex-1 p-6 lg:p-10">
                    <div class="mx-auto max-w-7xl">
                        <Slot />
                    </div>
                </main>
            </div>
        </div>
    );
});
