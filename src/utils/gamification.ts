import { PetState } from '../types/pet';

// Base reward values
export const BASE_XP_PER_HABIT = 15;
export const BASE_COINS_PER_HABIT = 10;

/**
 * Calculates XP earned based on duration and streak bonuses
 */
export const calculateXpEarned = (durationMinutes: number, currentStreak: number): number => {
  const durationBonus = Math.floor(durationMinutes / 5) * 2; // +2 XP per 5 mins
  const streakBonus = Math.min(currentStreak * 2, 20); // Cap streak bonus at +20 XP
  return BASE_XP_PER_HABIT + durationBonus + streakBonus;
};

/**
 * Determines pet stage based on level thresholds
 */
export const getPetStage = (level: number): PetState['stage'] => {
  if (level < 3) return 'egg';
  if (level < 7) return 'baby';
  if (level < 15) return 'teen';
  if (level < 30) return 'adult';
  return 'legendary';
};

/**
 * Calculates total XP required to reach the next level
 */
export const getXpForNextLevel = (level: number): number => {
  return Math.floor(100 * Math.pow(1.2, level - 1));
};

/**
 * Process pet state update after earning XP
 */
export interface LevelUpResult {
  updatedPet: PetState;
  didLevelUp: boolean;
  levelsGained: number;
}

export const processXpGain = (currentPet: PetState, xpGained: number, coinsGained: number = BASE_COINS_PER_HABIT): LevelUpResult => {
  let { level, current_xp, xp_to_next_level, coins } = currentPet;
  let newXp = current_xp + xpGained;
  let newCoins = coins + coinsGained;
  let didLevelUp = false;
  let levelsGained = 0;

  while (newXp >= xp_to_next_level) {
    newXp -= xp_to_next_level;
    level += 1;
    didLevelUp = true;
    levelsGained += 1;
    xp_to_next_level = getXpForNextLevel(level);
  }

  const updatedPet: PetState = {
    ...currentPet,
    level,
    current_xp: newXp,
    xp_to_next_level,
    coins: newCoins,
    stage: getPetStage(level),
    updated_at: new Date().toISOString(),
  };

  return {
    updatedPet,
    didLevelUp,
    levelsGained,
  };
};