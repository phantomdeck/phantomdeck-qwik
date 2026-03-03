import { component$, Slot, type PropsOf } from "@builder.io/qwik";
import { cn } from "../../utils/cn";
import { Label } from "./Label";
import { Separator } from "./Separator";

/**
 * Cyber Pro Field System
 * Advanced form-building primitives for Phantom Intelligence.
 * Includes Fields, Legends, Groups, Titles, and Errors.
 */

export const FieldSet = component$<PropsOf<"fieldset">>(({ ...props }) => (
    <fieldset
        {...props}
        data-slot="field-set"
        class={cn(
            "group/field-set flex flex-col gap-4 border-none p-0 m-0",
            "has-[>[data-slot=checkbox-group]]:gap-3 has-[>[data-slot=radio-group]]:gap-3",
            props.class
        )}
    >
        <Slot />
    </fieldset>
));

export const FieldLegend = component$<PropsOf<"legend"> & { variant?: "legend" | "label" }>(
    ({ variant = "legend", ...props }) => (
        <legend
            {...props}
            data-slot="field-legend"
            data-variant={variant}
            class={cn(
                "mb-1.5 font-bold tracking-tight text-white/90 italic",
                variant === "label" && "text-sm",
                variant === "legend" && "text-base",
                props.class
            )}
        >
            <Slot />
        </legend>
    )
);

export const FieldGroup = component$<PropsOf<"div">>(({ ...props }) => (
    <div
        {...props}
        data-slot="field-group"
        class={cn(
            "group/field-group flex w-full flex-col gap-5",
            "data-[slot=checkbox-group]:gap-3 *:data-[slot=field-group]:gap-4",
            props.class
        )}
    >
        <Slot />
    </div>
));

export interface FieldProps extends PropsOf<"div"> {
    orientation?: "vertical" | "horizontal" | "responsive";
    invalid?: boolean;
}

export const Field = component$<FieldProps>(
    ({ orientation = "vertical", invalid = false, ...props }) => {
        return (
            <div
                {...props}
                role="group"
                data-slot="field"
                data-orientation={orientation}
                data-invalid={invalid}
                class={cn(
                    "group/field flex w-full",
                    orientation === "vertical" && "flex-col gap-2 *:w-full",
                    orientation === "horizontal" && "flex-row items-center gap-4",
                    orientation === "responsive" && "flex-col gap-2 @md/field-group:flex-row @md/field-group:items-center @md/field-group:gap-4",
                    invalid && "text-destructive",
                    props.class
                )}
            >
                <Slot />
            </div>
        );
    }
);

export const FieldContent = component$<PropsOf<"div">>(({ ...props }) => (
    <div
        {...props}
        data-slot="field-content"
        class={cn(
            "group/field-content flex flex-1 flex-col gap-0.5 leading-snug",
            props.class
        )}
    >
        <Slot />
    </div>
));

export const FieldLabel = component$<PropsOf<typeof Label>>(({ ...props }) => (
    <Label
        {...props}
        data-slot="field-label"
        class={cn(
            "group/field-label peer/field-label w-fit leading-snug",
            "has-[>[data-slot=field]]:w-full has-[>[data-slot=field]]:flex-col",
            "has-data-checked:bg-primary/5 has-data-checked:border-primary/30",
            props.class
        )}
    >
        <Slot />
    </Label>
));

export const FieldTitle = component$<PropsOf<"div">>(({ ...props }) => (
    <div
        {...props}
        data-slot="field-title"
        class={cn(
            "flex w-fit items-center gap-2 text-sm font-bold tracking-tight text-white/80 group-data-[disabled=true]/field:opacity-50",
            props.class
        )}
    >
        <Slot />
    </div>
));

export const FieldDescription = component$<PropsOf<"p">>(({ ...props }) => (
    <p
        {...props}
        data-slot="field-description"
        class={cn(
            "text-xs font-medium text-muted-foreground/60 leading-normal italic px-1",
            "[[data-variant=legend]+&]:-mt-1.5",
            "group-has-data-horizontal/field:text-balance",
            "[&>a:hover]:text-primary [&>a]:underline [&>a]:underline-offset-4",
            props.class
        )}
    >
        <Slot />
    </p>
));

export const FieldSeparator = component$<PropsOf<"div">>(({ ...props }) => (
    <div
        {...props}
        data-slot="field-separator"
        class={cn(
            "relative -my-2 h-5 text-sm group-data-[variant=outline]/field-group:-mb-2",
            props.class
        )}
    >
        <Separator class="absolute inset-0 top-1/2 opacity-20" />
        <div class="relative mx-auto flex w-fit bg-background px-3">
            <Slot />
        </div>
    </div>
));

export interface FieldErrorProps extends PropsOf<"div"> {
    errors?: string[];
}

export const FieldError = component$<FieldErrorProps>(({ errors, ...props }) => {
    if (!errors || errors.length === 0) return null;

    return (
        <div
            {...props}
            role="alert"
            data-slot="field-error"
            class={cn(
                "text-destructive text-xs font-black uppercase tracking-widest italic pt-1",
                props.class
            )}
        >
            {errors.length === 1 ? (
                errors[0]
            ) : (
                <ul class="ml-4 flex list-disc flex-col gap-1">
                    {errors.map((msg, i) => (
                        <li key={i}>{msg}</li>
                    ))}
                </ul>
            )}
            <Slot />
        </div>
    );
});
