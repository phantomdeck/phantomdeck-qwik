import { component$, Slot, type PropsOf } from "@builder.io/qwik";
import { cn } from "../../utils/cn";

/**
 * Cyber Pro Table System
 * Advanced semantic table primitives for data-heavy nodes.
 * Performance-optimized with zero-JS layout logic.
 */

export const Table = component$<PropsOf<"table">>(({ ...props }) => {
    return (
        <div data-slot="table-container" class="relative w-full overflow-x-auto rounded-xl border border-white/5 bg-white/[0.01]">
            <table
                {...props}
                data-slot="table"
                class={cn("w-full caption-bottom text-sm", props.class)}
            >
                <Slot />
            </table>
        </div>
    );
});

export const TableHeader = component$<PropsOf<"thead">>(({ ...props }) => {
    return (
        <thead
            {...props}
            data-slot="table-header"
            class={cn("[&_tr]:border-b border-white/5 bg-white/[0.02] text-xs font-black uppercase tracking-widest text-muted-foreground/60", props.class)}
        >
            <Slot />
        </thead>
    );
});

export const TableBody = component$<PropsOf<"tbody">>(({ ...props }) => {
    return (
        <tbody
            {...props}
            data-slot="table-body"
            class={cn("[&_tr:last-child]:border-0", props.class)}
        >
            <Slot />
        </tbody>
    );
});

export const TableFooter = component$<PropsOf<"tfoot">>(({ ...props }) => {
    return (
        <tfoot
            {...props}
            data-slot="table-footer"
            class={cn("bg-white/[0.03] border-t border-white/5 font-bold text-white", props.class)}
        >
            <Slot />
        </tfoot>
    );
});

export const TableRow = component$<PropsOf<"tr">>(({ ...props }) => {
    return (
        <tr
            {...props}
            data-slot="table-row"
            class={cn(
                "border-b border-white/5 transition-colors hover:bg-white/[0.02] data-[state=selected]:bg-primary/5 group/row",
                props.class
            )}
        >
            <Slot />
        </tr>
    );
});

export const TableHead = component$<PropsOf<"th">>(({ ...props }) => {
    return (
        <th
            {...props}
            data-slot="table-head"
            class={cn(
                "h-12 px-4 text-left align-middle font-black italic whitespace-nowrap text-white/40",
                props.class
            )}
        >
            <Slot />
        </th>
    );
});

export const TableCell = component$<PropsOf<"td">>(({ ...props }) => {
    return (
        <td
            {...props}
            data-slot="table-cell"
            class={cn("p-4 align-middle whitespace-nowrap text-white/80", props.class)}
        >
            <Slot />
        </td>
    );
});

export const TableCaption = component$<PropsOf<"caption">>(({ ...props }) => {
    return (
        <caption
            {...props}
            data-slot="table-caption"
            class={cn("mt-4 text-xs italic font-medium text-muted-foreground/40 font-mono tracking-widest uppercase", props.class)}
        >
            <Slot />
        </caption>
    );
});
