// SPEAQ Web Wallet Service - localStorage based
// Mirrors native app wallet logic

const WALLET_KEY = "speaq_wallet";
const TX_KEY = "speaq_transactions";

export interface WalletState {
  balance: number;
  totalReceived: number;
  totalSent: number;
  totalMined: number;
}

export interface Transaction {
  id: string;
  type: "send" | "receive" | "mining" | "bridge";
  amount: number;
  counterparty?: string;
  description: string;
  timestamp: number;
}

// 1 QC = 0.01 gram gold (pegged)
const QC_TO_GOLD = 0.01;
const GOLD_EUR_PER_GRAM = 85.5;
const SPARKS_PER_QC = 100_000_000;

export function loadWallet(): WalletState {
  if (typeof window === "undefined") return { balance: 0, totalReceived: 0, totalSent: 0, totalMined: 0 };
  try {
    const s = localStorage.getItem(WALLET_KEY);
    return s ? JSON.parse(s) : { balance: 0, totalReceived: 0, totalSent: 0, totalMined: 0 };
  } catch {
    return { balance: 0, totalReceived: 0, totalSent: 0, totalMined: 0 };
  }
}

export function saveWallet(w: WalletState): void {
  localStorage.setItem(WALLET_KEY, JSON.stringify(w));
}

export function loadTransactions(): Transaction[] {
  if (typeof window === "undefined") return [];
  try {
    const s = localStorage.getItem(TX_KEY);
    return s ? JSON.parse(s) : [];
  } catch {
    return [];
  }
}

export function saveTransactions(txs: Transaction[]): void {
  localStorage.setItem(TX_KEY, JSON.stringify(txs));
}

export function addMiningReward(
  wallet: WalletState,
  txs: Transaction[],
  amount: number,
  miningType: string
): { wallet: WalletState; txs: Transaction[] } {
  const w = { ...wallet, balance: wallet.balance + amount, totalMined: wallet.totalMined + amount };
  const tx: Transaction = {
    id: Date.now().toString(36) + Math.random().toString(36).substring(2, 6),
    type: "mining",
    amount,
    description: `Mining: ${miningType}`,
    timestamp: Date.now(),
  };
  const newTxs = [tx, ...txs].slice(0, 500);
  saveWallet(w);
  saveTransactions(newTxs);
  return { wallet: w, txs: newTxs };
}

export function sendQC(
  wallet: WalletState,
  txs: Transaction[],
  amount: number,
  to: string
): { wallet: WalletState; txs: Transaction[] } | null {
  if (wallet.balance < amount) return null;
  const w = { ...wallet, balance: wallet.balance - amount, totalSent: wallet.totalSent + amount };
  const tx: Transaction = {
    id: Date.now().toString(36) + Math.random().toString(36).substring(2, 6),
    type: "send",
    amount,
    counterparty: to,
    description: `Sent to ${to.substring(0, 8)}...`,
    timestamp: Date.now(),
  };
  const newTxs = [tx, ...txs].slice(0, 500);
  saveWallet(w);
  saveTransactions(newTxs);
  return { wallet: w, txs: newTxs };
}

export function receiveQC(
  wallet: WalletState,
  txs: Transaction[],
  amount: number,
  from: string
): { wallet: WalletState; txs: Transaction[] } {
  const w = { ...wallet, balance: wallet.balance + amount, totalReceived: wallet.totalReceived + amount };
  const tx: Transaction = {
    id: Date.now().toString(36) + Math.random().toString(36).substring(2, 6),
    type: "receive",
    amount,
    counterparty: from,
    description: `Received from ${from.substring(0, 8)}...`,
    timestamp: Date.now(),
  };
  const newTxs = [tx, ...txs].slice(0, 500);
  saveWallet(w);
  saveTransactions(newTxs);
  return { wallet: w, txs: newTxs };
}

export function qcToGold(qc: number): number {
  return qc * QC_TO_GOLD;
}

export function qcToEur(qc: number): number {
  return qc * QC_TO_GOLD * GOLD_EUR_PER_GRAM;
}

export function qcToSparks(qc: number): number {
  return Math.floor(qc * SPARKS_PER_QC);
}

export function getGoldPrice(): number {
  return GOLD_EUR_PER_GRAM;
}
