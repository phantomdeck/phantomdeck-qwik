import { component$ } from "@builder.io/qwik";
import type { DocumentHead } from "@builder.io/qwik-city";
import { SyvexBankUI } from "../../../../services/syvexbank/ui/index";

export default component$(() => {
    return (
        <div class="space-y-12">
            <SyvexBankUI />
        </div>
    );
});

export const head: DocumentHead = {
    title: "SYVEX_BANKING | PhantomDeck Terminal",
    meta: [
        {
            name: "description",
            content: "Tactical financial orchestration and identity management engine.",
        },
    ],
};
