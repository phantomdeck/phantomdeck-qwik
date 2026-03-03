import { component$, Slot, type PropsOf } from "@builder.io/qwik";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "../../utils/cn";

/**
 * Cyber Pro Badge
 * Surgical identification tag.
 */

const badgeVariants = cva(
    "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-black italic uppercase tracking-widest transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
    {
        variants: {
            variant: {
                default:
                    "border-transparent bg-primary/20 text-primary shadow-[0_0_8px_rgba(var(--primary-rgb),0.2)]",
                secondary:
                    "border-transparent bg-secondary/80 text-secondary-foreground hover:bg-secondary/60",
                destructive:
                    "border-transparent bg-destructive/20 text-destructive shadow-[0_0_8px_rgba(var(--destructive-rgb),0.2)]",
                outline: "text-foreground border-white/10 hover:bg-white/5",
                accent: "border-transparent bg-accent/20 text-accent shadow-[0_0_8px_rgba(var(--accent-rgb),0.2)]",
            },
        },
        defaultVariants: {
            variant: "default",
        },
    }
);

export interface BadgeProps
    extends PropsOf<"div">,
    VariantProps<typeof badgeVariants> { }

export const Badge = component$<BadgeProps>(({ variant, class: className, ...props }) => {
    return (
        <div
            class={cn(badgeVariants({ variant }), className)}
            {...props}
        >
            <Slot />
        </div>
    );
});
