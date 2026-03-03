/**
 * SyvexBank: Financial Lattice Primitives
 * Ported and refined for the Phantom Intelligence Ecosystem.
 */

export interface BankUser {
    id: string;
    full_name: string;
    email: string;
    profile_image_url?: string;
    is_blocked: boolean;
    block_info: {
        reason: string;
        description: string;
    };
    accounts: BankAccount[];
    cards: BankCard[];
    settings: BankSettings;
    owner_id?: string;
    password_hash?: string;
    transaction_pin?: string;
    address?: string;
}

export interface BankAccount {
    id: string;
    type: 'Savings' | 'Current' | 'Business';
    balance: number;
    ledger_balance: number;
    account_number: string;
    currency: string;
}

export interface BankCard {
    id: string;
    type: 'VIRTUAL' | 'PHYSICAL';
    brand: 'VISA' | 'MASTERCARD' | 'VERVE';
    last4: string;
    expiry: string;
    is_active: boolean;
}

export interface BankSettings {
    theme: 'light' | 'dark';
    language: string;
    currency: string;
    notifications: {
        email: boolean;
        sms: boolean;
        push: boolean;
        marketing: boolean;
    };
}

export interface GeneralAccount {
    id: string;
    full_name: string;
    bank_name: string;
    account_number: string;
    type: string;
    routing_number?: string;
}

export interface BankTransaction {
    id: string;
    user_id: string;
    sender_account_id: string;
    amount: number;
    type: "DEPOSIT" | "TRANSFER" | "BILL" | "AIRTIME";
    transfer_subtype?: "within" | "other" | "international";
    direction: "CREDIT" | "DEBIT";
    status: "SUCCESS" | "FAILED" | "PENDING";
    category?: string;
    narration?: string;
    description?: string;
    reference?: string;
    recipient_info: {
        name: string;
        account_number: string;
        bank_name: string;
        iban?: string;
        sort_code?: string;
        routing_number?: string;
        swift_code?: string;
        transit_number?: string;
        institution_number?: string;
        bsb_code?: string;
        country?: string;
    };
    metadata?: Record<string, unknown>;
    sendEmail?: boolean;
    created_at: string;
}
