// SPEAQ Web Mining Service - localStorage based
// Mirrors native app mining.ts logic exactly

const STATS_KEY = "speaq_mining_stats";
const REWARDS_KEY = "speaq_mining_rewards";

export type MiningType = "relay" | "mesh" | "bridge" | "validation" | "storage" | "translation" | "onboarding";

export interface MiningStats {
  totalEarned: number;
  todayEarned: number;
  todayDate: string;
  activeTypes: MiningType[];
  relayCount: number;
  meshUptime: number;
  storageUsedMB: number;
  validationCount: number;
  onboardedUsers: number;
  miningStarted: number;
  level: number;
  streak: number;
}

export interface MiningReward {
  id: string;
  type: MiningType;
  amount: number;
  timestamp: number;
  description: string;
}

// Calibrated to ~5-8% annual yield (comparable to Bitvavo/Binance staking)
// Target: 0.02-0.05 QC/day per active miner
export const REWARD_RATES: Record<MiningType, { perAction: number; dailyCap: number; description: string }> = {
  relay: { perAction: 0.0001, dailyCap: 0.01, description: "Relayed encrypted message" },
  mesh: { perAction: 0.0005, dailyCap: 0.02, description: "Mesh node uptime" },
  bridge: { perAction: 0.005, dailyCap: 0.5, description: "Cash bridge transaction" },
  validation: { perAction: 0.0002, dailyCap: 0.01, description: "Validated transaction proof" },
  storage: { perAction: 0.0001, dailyCap: 0.005, description: "Stored encrypted fragment" },
  translation: { perAction: 0.50, dailyCap: 0.5, description: "Translation contribution" },
  onboarding: { perAction: 0.10, dailyCap: 1.0, description: "Onboarded new user" },
};

const MAX_SUPPLY = 21_000_000;
const HALVING_INTERVAL = 2_100_000;

// Web mining types (mesh not available in browser)
export const WEB_MINING_TYPES: MiningType[] = ["relay", "validation", "storage"];

export function loadStats(): MiningStats {
  if (typeof window === "undefined")
    return emptyStats();
  try {
    const s = localStorage.getItem(STATS_KEY);
    if (s) {
      const stats: MiningStats = JSON.parse(s);
      const today = new Date().toISOString().split("T")[0];
      if (stats.todayDate !== today) {
        if (stats.todayEarned > 0) stats.streak++;
        stats.todayEarned = 0;
        stats.todayDate = today;
        saveStats(stats);
      }
      return stats;
    }
  } catch {}
  return emptyStats();
}

function emptyStats(): MiningStats {
  return {
    totalEarned: 0,
    todayEarned: 0,
    todayDate: new Date().toISOString().split("T")[0],
    activeTypes: [],
    relayCount: 0,
    meshUptime: 0,
    storageUsedMB: 0,
    validationCount: 0,
    onboardedUsers: 0,
    miningStarted: 0,
    level: 1,
    streak: 0,
  };
}

export function saveStats(stats: MiningStats): void {
  localStorage.setItem(STATS_KEY, JSON.stringify(stats));
}

export function loadRewards(): MiningReward[] {
  if (typeof window === "undefined") return [];
  try {
    const s = localStorage.getItem(REWARDS_KEY);
    return s ? JSON.parse(s) : [];
  } catch {
    return [];
  }
}

export function saveRewards(rewards: MiningReward[]): void {
  localStorage.setItem(REWARDS_KEY, JSON.stringify(rewards));
}

function getHalvingMultiplier(totalMined: number): number {
  const halvings = Math.floor(totalMined / HALVING_INTERVAL);
  return Math.max(Math.pow(0.5, halvings), 0.001);
}

export function simulateMiningCycle(
  stats: MiningStats,
  rewards: MiningReward[]
): { stats: MiningStats; rewards: MiningReward[]; earned: number } {
  if (stats.totalEarned >= MAX_SUPPLY) return { stats, rewards, earned: 0 };

  const halvMult = getHalvingMultiplier(stats.totalEarned);
  let earned = 0;
  const newRewards = [...rewards];
  const newStats = { ...stats };

  for (const type of newStats.activeTypes) {
    if (type === "mesh") continue; // Mesh not available in browser
    const rate = REWARD_RATES[type];
    if (!rate) continue;

    // Check daily cap
    const todayForType = newRewards
      .filter((r) => r.type === type && new Date(r.timestamp).toISOString().split("T")[0] === newStats.todayDate)
      .reduce((sum, r) => sum + r.amount, 0);
    if (todayForType >= rate.dailyCap) continue;

    // Random chance per cycle
    const chance = type === "relay" ? 0.6 : type === "validation" ? 0.4 : type === "storage" ? 0.3 : 0.1;
    if (Math.random() > chance) continue;

    const amount = Math.round(rate.perAction * halvMult * 100000) / 100000;
    if (amount <= 0) continue;

    newRewards.push({
      id: Date.now().toString(36) + Math.random().toString(36).substring(2, 4),
      type,
      amount,
      timestamp: Date.now(),
      description: rate.description,
    });

    newStats.totalEarned += amount;
    newStats.todayEarned += amount;
    earned += amount;

    if (type === "relay") newStats.relayCount++;
    if (type === "validation") newStats.validationCount++;
    if (type === "storage") newStats.storageUsedMB += 0.1;
  }

  newStats.level = Math.min(10, Math.floor(newStats.totalEarned / 5) + 1);

  const trimmed = newRewards.slice(-200);
  saveStats(newStats);
  saveRewards(trimmed);

  return { stats: newStats, rewards: trimmed, earned };
}

export function getSupplyInfo(totalMined: number) {
  return {
    maxSupply: MAX_SUPPLY,
    totalMined,
    remaining: MAX_SUPPLY - totalMined,
    halvingProgress: (totalMined % HALVING_INTERVAL) / HALVING_INTERVAL,
    currentHalving: Math.floor(totalMined / HALVING_INTERVAL),
  };
}

export function getEstimatedDaily(activeTypes: MiningType[], totalMined: number): number {
  const halvMult = getHalvingMultiplier(totalMined);
  return activeTypes.reduce((sum, type) => {
    const rate = REWARD_RATES[type];
    return rate ? sum + rate.dailyCap * halvMult * 0.6 : sum;
  }, 0);
}
