import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface SpendingLimit {
    limit: number;
    category: string;
}
export interface LeaderboardEntry {
    name: string;
    user: Principal;
    points: bigint;
}
export interface Challenge {
    id: bigint;
    completed: boolean;
    rewardPoints: bigint;
    description: string;
    targetAmount: number;
}
export interface UserProfile {
    bankAccountNumber?: string;
    balance: number;
    name: string;
    spendingLimits: Array<SpendingLimit>;
    digiPoints: bigint;
}
export interface Transaction {
    paymentMethod: string;
    type: string;
    description: string;
    timestamp: bigint;
    category: string;
    amount: number;
}
export enum UserRole {
    admin = "admin",
    user = "user",
    guest = "guest"
}
export interface backendInterface {
    addDigiPoints(points: bigint): Promise<void>;
    addTransaction(transaction: Transaction): Promise<void>;
    assignCallerUserRole(user: Principal, role: UserRole): Promise<void>;
    completeChallenge(challengeId: bigint): Promise<void>;
    createChallenge(description: string, targetAmount: number, rewardPoints: bigint): Promise<bigint>;
    getAllUsers(): Promise<Array<Principal>>;
    getBankAccount(): Promise<string | null>;
    getCallerBalance(): Promise<number>;
    getCallerUserProfile(): Promise<UserProfile | null>;
    getCallerUserRole(): Promise<UserRole>;
    getChallenges(): Promise<Array<Challenge>>;
    getDigiPoints(): Promise<bigint>;
    getLeaderboard(): Promise<Array<LeaderboardEntry>>;
    getReferralPoints(): Promise<bigint>;
    getReferrals(): Promise<Array<Principal>>;
    getSpendingLimits(): Promise<Array<SpendingLimit>>;
    getSupportedCategories(): Promise<Array<string>>;
    getTransactions(category: string | null): Promise<Array<Transaction>>;
    getUserProfile(user: Principal): Promise<UserProfile | null>;
    isCallerAdmin(): Promise<boolean>;
    referUser(referredUser: Principal): Promise<void>;
    resetUserData(user: Principal): Promise<void>;
    saveCallerUserProfile(profile: UserProfile): Promise<void>;
    setBankAccount(bankAccountNumber: string): Promise<void>;
    setSpendingLimit(category: string, limit: number): Promise<void>;
    updateBalance(newBalance: number): Promise<void>;
}
