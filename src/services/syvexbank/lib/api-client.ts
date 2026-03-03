import type { BankUser, BankTransaction, GeneralAccount } from "../types";

/**
 * SyvexBank Admin API Client for PhantomDeck.
 * Direct orchestration with the SyvexBank core service.
 */

export interface EnvAccessor {
    get(key: string): string | undefined;
}

interface RequestOptions extends RequestInit {
    params?: Record<string, string>;
}

async function syvexFetch<T>(endpoint: string, options: RequestOptions = {}): Promise<T> {
    // Resolve environment with fallbacks for Vite/Bun/Process
    const SYVEX_API_BASE = import.meta.env.SYVEX_API_URL || (typeof process !== 'undefined' ? process.env.SYVEX_API_URL : undefined) || "http://localhost:5173/api/admin";
    const SYVEX_ADMIN_KEY = import.meta.env.SYVEX_ADMIN_KEY || (typeof process !== 'undefined' ? process.env.SYVEX_ADMIN_KEY : undefined) || "test_key";

    const { params, ...init } = options;

    const urlString = endpoint.startsWith('http') ? endpoint : `${SYVEX_API_BASE}${endpoint}`;
    const url = new URL(urlString);

    if (params) {
        Object.entries(params).forEach(([key, value]) => {
            if (value !== undefined) {
                url.searchParams.append(key, value);
            }
        });
    }

    const headers: Record<string, string> = {
        'x-admin-api-key': SYVEX_ADMIN_KEY,
        ...((init.headers as Record<string, string>) || {}),
    };

    if (!(init.body instanceof FormData)) {
        headers['Content-Type'] = 'application/json';
    }

    const response = await fetch(url.toString(), {
        ...init,
        headers,
    });

    const result = await response.json().catch(() => ({ success: false, error: 'MALFORMED_LATTICE_SIGNAL' }));

    if (!response.ok || !result.success) {
        throw new Error(result.error || `SYVEX_UPLINK_FAILURE: ${response.status}`);
    }

    return result.data;
}

/**
 * Tactical API Client for SyvexBank
 */
export const syvexClient = {
    // Users
    getUsers: (ownerId?: string) => syvexFetch<BankUser[]>('/users', { params: ownerId ? { ownerId } : {} }),
    getUser: (id: string) => syvexFetch<BankUser>(`/users/${id}`),
    createUser: (data: Partial<BankUser> | FormData) => syvexFetch<BankUser>('/users', {
        method: 'POST',
        body: data instanceof FormData ? data : JSON.stringify(data),
    }),
    updateUser: (id: string, data: Partial<BankUser> | FormData) => syvexFetch<BankUser>(`/users/${id}`, {
        method: 'PATCH',
        body: data instanceof FormData ? data : JSON.stringify(data),
    }),
    deleteUser: (id: string) => syvexFetch(`/users/${id}`, {
        method: 'DELETE',
    }),
    blockUser: (id: string, data: { isBlocked: boolean, reason?: string, description?: string }) =>
        syvexFetch(`/users/${id}/block`, {
            method: 'POST',
            body: JSON.stringify(data),
        }),
    getChatToken: (id: string) => syvexFetch<{ token: string }>(`/users/${id}/chat-token`, {
        method: 'POST'
    }),

    // Transactions
    getTransactions: (userId?: string) => syvexFetch<BankTransaction[]>(`/transactions`, { params: userId ? { userId } : {} }),
    createTransaction: (data: Partial<BankTransaction>) => syvexFetch<BankTransaction>('/transactions', {
        method: 'POST',
        body: JSON.stringify(data),
    }),
    updateTransaction: (id: string, data: Partial<BankTransaction>) => syvexFetch<BankTransaction>(`/transactions/${id}`, {
        method: 'PATCH',
        body: JSON.stringify(data),
    }),
    deleteTransaction: (id: string) => syvexFetch(`/transactions/${id}`, {
        method: 'DELETE',
    }),

    // General Accounts
    getAccounts: () => syvexFetch<GeneralAccount[]>('/accounts'),
    createAccount: (data: Partial<GeneralAccount>) => syvexFetch<GeneralAccount>('/accounts', {
        method: 'POST',
        body: JSON.stringify(data),
    }),
    updateAccount: (id: string, data: Partial<GeneralAccount>) => syvexFetch<GeneralAccount>(`/accounts/${id}`, {
        method: 'PATCH',
        body: JSON.stringify(data),
    }),
    deleteAccount: (id: string) => syvexFetch(`/accounts/${id}`, {
        method: 'DELETE',
    }),
};
