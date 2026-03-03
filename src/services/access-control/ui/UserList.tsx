import { component$, type PropFunction } from "@builder.io/qwik";
import type { AuthUser } from "../../../types/auth";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "../../../components/ui/Table";
import { LuUser, LuShield, LuLayers, LuSettings, LuGhost, LuChevronRight } from "@qwikest/icons/lucide";
import { Badge } from "../../../components/ui/Badge";
import { Button } from "../../../components/ui/Button";

interface UserListProps {
    users: AuthUser[];
    onManage$: PropFunction<(user: AuthUser) => void>;
}

function getUserInitial(user: AuthUser): string {
    return user.user_metadata.full_name?.[0]?.toUpperCase() ?? user.email[0].toUpperCase();
}

function getUserDisplayName(user: AuthUser): string {
    return user.user_metadata.full_name ?? user.email;
}

function getServiceCount(user: AuthUser): number {
    return Object.keys(user.app_metadata.services).length;
}

export const UserList = component$<UserListProps>(({ users, onManage$ }) => {
    if (users.length === 0) {
        return (
            <div class="flex flex-col items-center justify-center p-12 text-center glass-card border-dashed">
                <div class="size-16 rounded-full bg-white/5 border border-white/10 flex items-center justify-center mb-4">
                    <LuGhost class="size-8 text-muted-foreground opacity-20" />
                </div>
                <h3 class="text-sm font-black italic uppercase tracking-widest text-white mb-1">NO_LATTICE_IDENTITIES</h3>
                <p class="text-[10px] font-mono text-muted-foreground uppercase opacity-50 tracking-tighter">The identity registry is empty.</p>
            </div>
        );
    }

    return (
        <div class="glass-card overflow-hidden rounded-2xl border border-white/5 ring-1 ring-white/5 shadow-2xl font-mono">
            <Table>
                <TableHeader>
                    <TableRow class="bg-white/[0.03] border-b border-white/5">
                        <TableHead class="px-6 py-4">
                            <div class="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground">
                                <LuUser class="size-3 text-primary" />
                                <span>IDENTITY</span>
                            </div>
                        </TableHead>
                        <TableHead class="px-6 py-4 hidden sm:table-cell">
                            <div class="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground">
                                <LuShield class="size-3 text-primary" />
                                <span>LATTICE_ROLE</span>
                            </div>
                        </TableHead>
                        <TableHead class="px-6 py-4 hidden md:table-cell">
                            <div class="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground">
                                <LuLayers class="size-3 text-primary" />
                                <span>MODULES</span>
                            </div>
                        </TableHead>
                        <TableHead class="px-6 py-4 text-right">
                            <LuSettings class="ml-auto size-3 opacity-20" />
                        </TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody class="divide-y divide-white/5">
                    {users.map((user) => (
                        <TableRow key={user.id} class="hover:bg-white/[0.02] transition-colors group cursor-pointer" onClick$={() => onManage$(user)}>
                            <TableCell class="px-6 py-5">
                                <div class="flex items-center gap-4">
                                    <div class="size-10 rounded-xl bg-gradient-to-br from-primary/20 to-accent/20 border border-white/10 flex items-center justify-center text-sm font-black italic text-white shadow-inner">
                                        {getUserInitial(user)}
                                    </div>
                                    <div class="flex flex-col min-w-0">
                                        <span class="font-black italic text-sm text-white uppercase tracking-tight truncate group-hover:text-primary transition-colors">
                                            {getUserDisplayName(user)}
                                        </span>
                                        <span class="text-[10px] text-muted-foreground font-mono truncate uppercase opacity-40">
                                            UID: {user.id.slice(0, 8)}...
                                        </span>
                                    </div>
                                </div>
                            </TableCell>
                            <TableCell class="px-6 py-5 hidden sm:table-cell">
                                <Badge
                                    variant={user.role === "super_admin" ? "default" : "secondary"}
                                    class="text-[9px] font-black uppercase italic tracking-[0.1em] px-3 py-1 scale-90"
                                >
                                    {user.role === "super_admin" ? "SUPER_ADMIN" : "OPERATOR_NODE"}
                                </Badge>
                            </TableCell>
                            <TableCell class="px-6 py-5 hidden md:table-cell">
                                <div class="flex items-center gap-2">
                                    <span class="text-xs font-black italic text-white">{getServiceCount(user)}</span>
                                    <span class="text-[9px] font-mono text-muted-foreground/40 uppercase tracking-tighter">Registered_Services</span>
                                </div>
                            </TableCell>
                            <TableCell class="px-6 py-5 text-right">
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    class="text-muted-foreground/30 hover:text-primary transition-colors hover:bg-primary/5 group-hover:opacity-100"
                                    onClick$={(e) => {
                                        e.stopPropagation();
                                        onManage$(user);
                                    }}
                                >
                                    <LuChevronRight class="size-5" />
                                </Button>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
    );
});
