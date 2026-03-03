import { component$, Slot, type PropsOf } from "@builder.io/qwik";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "../../utils/cn";

/**
 * Cyber Pro Button Component
 * Built with CVA and Tailwind v4 following Shadcn patterns.
 */
export const buttonVariants = cva(
    "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-lg text-sm font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 active:scale-[0.98] select-none cursor-pointer",
    {
        variants: {
            variant: {
                default: "bg-primary text-primary-foreground shadow-lg shadow-primary/20 hover:bg-primary/90 hover:shadow-primary/30",
                outline: "border border-border bg-transparent hover:bg-accent hover:text-accent-foreground",
                secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80",
                ghost: "hover:bg-accent hover:text-accent-foreground",
                glass: "glass-card hover:bg-white/10 text-foreground border-white/20 shadow-md",
                destructive: "bg-destructive text-destructive-foreground hover:bg-destructive/90 shadow-sm shadow-destructive/20",
                link: "text-primary underline-offset-4 hover:underline",
            },
            size: {
                default: "h-9 px-4 py-2",
                xs: "h-7 rounded-md px-2 text-[10px] uppercase tracking-wider font-bold",
                sm: "h-8 rounded-md px-3 text-xs",
                lg: "h-11 rounded-md px-8 text-base font-semibold",
                icon: "h-9 w-9",
            },
        },
        defaultVariants: {
            variant: "default",
            size: "default",
        },
    }
);

export type ButtonProps = PropsOf<"button"> & VariantProps<typeof buttonVariants>;

export const Button = component$<ButtonProps>(({ variant, size, ...props }) => {
    return (
        <button
            {...props}
            class={cn(buttonVariants({ variant, size }), props.class)}
        >
            <Slot />
        </button>
    );
});
