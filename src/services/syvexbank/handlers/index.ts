import { server$ } from "@builder.io/qwik-city";
import { syvexClient } from "../lib/api-client";
import type { BankUser, BankTransaction, GeneralAccount } from "../types";

/**
 * SyvexBank Administrative Handlers
 * Phantom Intelligence Orchestration Layer
 */

export const getSyvexExecutiveSummary = server$(async function () {
    try {
        const [users, accounts, transactions] = await Promise.all([
            syvexClient.getUsers(),
            syvexClient.getAccounts(),
            syvexClient.getTransactions()
        ]);

        const totalLiquidity = users.reduce((sum, user) => {
            const userTotal = (user.accounts || []).reduce((accSum, acc) => accSum + (acc.balance || 0), 0);
            return sum + userTotal;
        }, 0);

        return {
            stats: {
                totalLiquidity,
                activeLoans: accounts.length,
                riskLevel: "Minimal" as const,
                uplink: "Online" as const
            },
            recentTransactions: transactions.slice(0, 5),
            lastSync: new Date().toISOString()
        };
    } catch (error) {
        console.error("[SYVEX_HANDLER] Executive Summary Failed:", error);
        return {
            stats: { totalLiquidity: 0, activeLoans: 0, riskLevel: "Critical" as const, uplink: "Offline" as const },
            recentTransactions: [],
            lastSync: new Date().toISOString()
        };
    }
});

// Users Actions
export const getBankUsers = server$(async function (ownerId?: string) {
    try {
        return await syvexClient.getUsers(ownerId);
    } catch (error) {
        console.error("[SYVEX_HANDLER] Failed to fetch bank users:", error);
        return [];
    }
});

export const getBankUser = server$(async function (id: string) {
    return await syvexClient.getUser(id);
});

export const createBankUser = server$(async function (data: Partial<BankUser>) {
    return await syvexClient.createUser(data);
});

export const updateBankUser = server$(async function (id: string, data: Partial<BankUser>) {
    return await syvexClient.updateUser(id, data);
});

export const deleteBankUser = server$(async function (id: string) {
    return await syvexClient.deleteUser(id);
});

export const blockBankUser = server$(async function (id: string, isBlocked: boolean, reason: string = '', description: string = '') {
    return await syvexClient.blockUser(id, { isBlocked, reason, description });
});

export const getBankChatToken = server$(async function (id: string) {
    return await syvexClient.getChatToken(id);
});

// Transactions Actions
export const getBankTransactions = server$(async function (userId?: string) {
    return await syvexClient.getTransactions(userId);
});

export const createBankTransaction = server$(async function (data: Partial<BankTransaction>) {
    return await syvexClient.createTransaction(data);
});

export const updateBankTransaction = server$(async function (id: string, data: Partial<BankTransaction>) {
    return await syvexClient.updateTransaction(id, data);
});

export const deleteBankTransaction = server$(async function (id: string) {
    return await syvexClient.deleteTransaction(id);
});

// Accounts Actions
export const getBankAccounts = server$(async function () {
    return await syvexClient.getAccounts();
});

export const createBankAccount = server$(async function (data: Partial<GeneralAccount>) {
    return await syvexClient.createAccount(data);
});

export const updateBankAccount = server$(async function (id: string, data: Partial<GeneralAccount>) {
    return await syvexClient.updateAccount(id, data);
});

export const deleteBankAccount = server$(async function (id: string) {
    return await syvexClient.deleteAccount(id);
});
