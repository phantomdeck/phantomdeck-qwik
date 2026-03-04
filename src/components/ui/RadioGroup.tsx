import {
    component$,
    Slot,
    type PropsOf,
    createContextId,
    useContext,
    useContextProvider,
    useStore,
    $
} from "@builder.io/qwik";
import { cn } from "../../utils/cn";

/**
 * Cyber Pro Radio Group System
 * Tactical 선택(selection) primitive with high-fidelity feedback.
 */

export interface RadioGroupStore {
    value?: string;
}

export const RadioGroupContext = createContextId<RadioGroupStore>('radio-group-context');

export const RadioGroup = component$<Omit<PropsOf<"div">, "onValueChange$"> & { defaultValue?: string, value?: string, onValueChange$?: (val: string) => void }>(
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    ({ defaultValue, value, onValueChange$: _onValueChange$, ...props }) => {
        // We use a store for shared choice state
        const state = useStore<RadioGroupStore>({ value: value || defaultValue });
        useContextProvider(RadioGroupContext, state);

        return (
            <div
                {...props}
                role="radiogroup"
                class={cn("grid gap-3", props.class)}
            >
                <Slot />
            </div>
        );
    }
);

export const RadioGroupItem = component$<PropsOf<"button"> & { value: string }>(
    ({ value, ...props }) => {
        const state = useContext(RadioGroupContext);
        const isChecked = state.value === value;

        const handleClick = $(() => {
            state.value = value;
        });

        return (
            <button
                {...props}
                type="button"
                role="radio"
                aria-checked={isChecked}
                data-state={isChecked ? 'checked' : 'unchecked'}
                onClick$={handleClick}
                class={cn(
                    "aspect-square h-5 w-5 shrink-0 rounded-full border border-white/10 bg-white/[0.03] transition-all hover:border-primary/40 focus:outline-none focus:ring-2 focus:ring-primary/20",
                    isChecked && "border-primary bg-primary/20 shadow-[0_0_12px_rgba(var(--primary-rgb),0.1)]",
                    props.disabled && "cursor-not-allowed opacity-50",
                    props.class
                )}
            >
                {isChecked && (
                    <div class="mx-auto h-2.5 w-2.5 rounded-full bg-primary shadow-[0_0_8px_var(--primary)] animate-in zoom-in-50 duration-300" />
                )}
                <Slot />
            </button>
        );
    }
);
