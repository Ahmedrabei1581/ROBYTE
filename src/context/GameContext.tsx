/**
 * @license
 * ROBYTE Game State, Learning Progression & Unique Player Registry
 * - Registers each player name once without duplicates
 * - Automatically recognizes returning players and restores their exact screen, world & stage
 * - Supports switching registered profiles or starting over at any time
 */

import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import {
  GameState,
  QuestionAttempt,
  WorldProgress,
  SkillTree,
  RegisteredPlayerSummary,
  ScreenState,
} from '../types/gameTypes';
import { WORLDS_DATA } from '../data/curriculumData';
import { sounds } from '../utils/soundEffects';

export interface RegisterResult {
  ok: boolean;
  error?: string;
  existingProfile?: RegisteredPlayerSummary;
}

export type CheckpointUpdate = Partial<
  Pick<
    GameState,
    'lastScreen' | 'lastActiveWorld' | 'lastActiveSubStageId' | 'solvedQuestionsInStage' | 'currentStageScore'
  >
>;

interface GameContextType {
  state: GameState;
  profileVersion: number;
  isSessionAuthenticated: boolean;
  lastActiveProfileName: string | null;
  registeredProfiles: RegisteredPlayerSummary[];
  isNameTaken: (name: string, excludeCurrent?: boolean) => boolean;
  registerNewPlayer: (name: string, phoneNumber?: string) => RegisterResult;
  renameCurrentPlayer: (name: string) => RegisterResult;
  loginExistingPlayer: (name: string) => boolean;
  loginExistingPlayerWithPhone: (
    name: string,
    phoneNumber: string,
    options?: { startFresh?: boolean }
  ) => RegisterResult;
  signOutSession: () => void;
  setPlayerName: (name: string) => RegisterResult;
  updateCheckpoint: (checkpoint: CheckpointUpdate) => void;
  markSubStageCompleted: (worldId: number, subStageId: number) => void;
  startFreshForCurrentPlayer: (targetScreen?: ScreenState) => void;
  recordQuestionAttempt: (attempt: QuestionAttempt) => void;
  evaluateWorldProgress: (worldId: number) => { canUnlockNext: boolean; totalCorrect: number; percentage: number };
  unlockNextWorld: (currentWorldId: number) => void;
  equipCharacter: (id: string) => void;
  equipWeapon: (id: string) => void;
  equipArmor: (id: string) => void;
  purchaseCharacter: (id: string, cost: number) => boolean;
  purchaseWeapon: (id: string, cost: number) => boolean;
  purchaseArmor: (id: string, cost: number) => boolean;
  upgradeSkill: (skillKey: keyof SkillTree, cost: number) => boolean;
  addRunPerk: (perkId: string) => void;
  clearRunPerks: () => void;
  awardReward: (coins: number, xp: number) => void;
  toggleSound: () => boolean;
  resetProgress: () => void;
  getQuestionHistory: (questionId: string) => QuestionAttempt | undefined;
  getFailedQuestions: (worldId?: number) => QuestionAttempt[];
}

const PROFILES_REGISTRY_KEY = 'robyte_ls_profiles_v1';
const ACTIVE_PLAYER_KEY = 'robyte_ls_active_v1';
const LEGACY_PROFILES_KEY = 'byteblitz_ls_profiles_v1';

export const normalizePlayerName = (name: string): string =>
  name.trim().replace(/\s+/g, ' ').toLowerCase();

const cleanDisplayName = (name: string): string =>
  name.trim().replace(/\s+/g, ' ');

export const normalizePhoneNumber = (phone: string): string => {
  const digits = phone.replace(/\D/g, '');
  if (digits.startsWith('20') && digits.length === 12 && digits[2] === '1') {
    return '0' + digits.slice(2);
  }
  return digits;
};

export const isValidPhoneNumber = (phone: string): boolean => {
  const digits = normalizePhoneNumber(phone);
  return digits.length >= 8 && digits.length <= 15;
};

export const maskPhoneNumber = (phone: string): string => {
  const digits = normalizePhoneNumber(phone);
  if (!digits) return '';
  if (digits.length <= 4) return digits;
  return `${digits.slice(0, 3)}${'•'.repeat(Math.max(2, digits.length - 6))}${digits.slice(-3)}`;
};

const createInitialSkills = (): SkillTree => ({
  speedLevel: 0,
  shieldLevel: 0,
  damageLevel: 0,
  coinBonusLevel: 0,
  extraLifeLevel: 0,
});

const createInitialWorldProgress = (): Record<number, WorldProgress> => ({
  1: {
    worldId: 1,
    isUnlocked: true,
    isCompleted: false,
    highScore: 0,
    highestAccuracy: 0,
    attemptsCount: 0,
    bestCorrectCount: 0,
    subStagesCompleted: [],
  },
  2: {
    worldId: 2,
    isUnlocked: false,
    isCompleted: false,
    highScore: 0,
    highestAccuracy: 0,
    attemptsCount: 0,
    bestCorrectCount: 0,
    subStagesCompleted: [],
  },
  3: {
    worldId: 3,
    isUnlocked: false,
    isCompleted: false,
    highScore: 0,
    highestAccuracy: 0,
    attemptsCount: 0,
    bestCorrectCount: 0,
    subStagesCompleted: [],
  },
  4: {
    worldId: 4,
    isUnlocked: false,
    isCompleted: false,
    highScore: 0,
    highestAccuracy: 0,
    attemptsCount: 0,
    bestCorrectCount: 0,
    subStagesCompleted: [],
  },
});

const createInitialState = (overrides: Partial<GameState> = {}): GameState => ({
  playerName: 'Cyber Hero',
  phoneNumber: '',
  isActivated: false,
  hasRegisteredName: false,
  playerLevel: 1,
  xp: 0,
  coins: 150,
  selectedCharacterId: 'char_roblox_noob',
  selectedWeaponId: 'wep_deflector_saber',
  selectedArmorId: 'arm_standard',
  unlockedCharacters: ['char_roblox_noob'],
  unlockedWeapons: ['wep_deflector_saber'],
  unlockedArmors: ['arm_standard'],
  activeRunPerks: [],
  skillTree: createInitialSkills(),
  worldProgress: createInitialWorldProgress(),
  questionAttempts: [],
  soundEnabled: true,
  musicEnabled: true,
  lastActiveWorld: 1,
  lastActiveSubStageId: 1,
  lastScreen: 'title',
  solvedQuestionsInStage: [],
  currentStageScore: 0,
  lastPlayedAt: Date.now(),
  ...overrides,
});

const hydrateState = (raw: Partial<GameState> | null | undefined): GameState => {
  const base = createInitialState();
  if (!raw) return base;

  const baseWorlds = createInitialWorldProgress();
  const mergedWorlds: Record<number, WorldProgress> = { ...baseWorlds };
  if (raw.worldProgress) {
    Object.keys(baseWorlds).forEach((k) => {
      const worldNum = Number(k);
      const savedWorld = raw.worldProgress?.[worldNum];
      if (savedWorld) {
        mergedWorlds[worldNum] = {
          ...baseWorlds[worldNum],
          ...savedWorld,
          subStagesCompleted: Array.isArray(savedWorld.subStagesCompleted)
            ? [...savedWorld.subStagesCompleted]
            : [],
        };
      }
    });
  }

  return {
    ...base,
    ...raw,
    skillTree: {
      ...base.skillTree,
      ...(raw.skillTree || {}),
    },
    worldProgress: mergedWorlds,
    solvedQuestionsInStage: Array.isArray(raw.solvedQuestionsInStage)
      ? raw.solvedQuestionsInStage
      : [],
    lastActiveWorld: raw.lastActiveWorld || 1,
    lastActiveSubStageId: raw.lastActiveSubStageId || 1,
    lastScreen: raw.lastScreen || (raw.hasRegisteredName ? 'playing' : 'title'),
  };
};

const readProfilesRegistry = (): Record<string, GameState> => {
  if (typeof window === 'undefined') return {};
  try {
    const raw = localStorage.getItem(PROFILES_REGISTRY_KEY) || localStorage.getItem(LEGACY_PROFILES_KEY);
    if (!raw) return {};
    const parsed = JSON.parse(raw);
    if (!parsed || typeof parsed !== 'object') return {};
    const result: Record<string, GameState> = {};
    Object.entries(parsed).forEach(([key, val]) => {
      result[key] = hydrateState(val as Partial<GameState>);
    });
    return result;
  } catch (err) {
    console.error('Failed to read profiles registry:', err);
    return {};
  }
};

const writeProfilesRegistry = (registry: Record<string, GameState>) => {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(PROFILES_REGISTRY_KEY, JSON.stringify(registry));
  } catch (err) {
    console.error('Failed to persist profiles registry:', err);
  }
};

const buildSummary = (normalizedName: string, profile: GameState): RegisteredPlayerSummary => {
  const completedStagesCount = Object.values(profile.worldProgress || {}).reduce(
    (sum, wp) => sum + (wp.subStagesCompleted?.length || 0),
    0
  );
  return {
    normalizedName,
    playerName: profile.playerName,
    phoneMasked: maskPhoneNumber(profile.phoneNumber || ''),
    isActivated: Boolean(profile.isActivated ?? profile.hasRegisteredName),
    playerLevel: profile.playerLevel,
    coins: profile.coins,
    lastActiveWorld: profile.lastActiveWorld || 1,
    lastActiveSubStageId: profile.lastActiveSubStageId || 1,
    lastScreen: profile.lastScreen || 'playing',
    completedStagesCount,
    lastPlayedAt: profile.lastPlayedAt || 0,
  };
};

const toSortedSummaries = (registry: Record<string, GameState>): RegisteredPlayerSummary[] =>
  Object.entries(registry)
    .filter(([, prof]) => prof.hasRegisteredName)
    .map(([key, prof]) => buildSummary(key, prof))
    .sort((a, b) => b.lastPlayedAt - a.lastPlayedAt);

const loadInitialSession = (): {
  initialState: GameState;
  initialRegistry: Record<string, GameState>;
  lastActiveProfileName: string | null;
} => {
  const registry = readProfilesRegistry();
  if (typeof window === 'undefined') {
    return { initialState: createInitialState(), initialRegistry: registry, lastActiveProfileName: null };
  }

  let lastActiveProfileName: string | null = null;
  try {
    const activeKey = localStorage.getItem(ACTIVE_PLAYER_KEY);
    if (activeKey && registry[activeKey]) {
      lastActiveProfileName = registry[activeKey].playerName;
    } else {
      const sorted = toSortedSummaries(registry);
      if (sorted.length > 0) {
        lastActiveProfileName = sorted[0].playerName;
      }
    }
  } catch (err) {
    console.error('Failed to read last active hero:', err);
  }

  // Always start on the Sign-In / Activation gate on every launch
  return { initialState: createInitialState(), initialRegistry: registry, lastActiveProfileName };
};

const GameContext = createContext<GameContextType | undefined>(undefined);

export const GameProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [{ initialState, initialRegistry, lastActiveProfileName }] = useState(() => loadInitialSession());

  const [state, setState] = useState<GameState>(initialState);
  const [registry, setRegistry] = useState<Record<string, GameState>>(initialRegistry);
  const [profileVersion, setProfileVersion] = useState<number>(0);
  const [isSessionAuthenticated, setIsSessionAuthenticated] = useState<boolean>(false);

  useEffect(() => {
    if (!state.hasRegisteredName || !isSessionAuthenticated) return;
    const key = normalizePlayerName(state.playerName);
    if (!key) return;

    setRegistry((prev) => {
      const updated = {
        ...prev,
        [key]: state,
      };
      writeProfilesRegistry(updated);
      return updated;
    });

    try {
      localStorage.setItem(ACTIVE_PLAYER_KEY, key);
    } catch (err) {
      console.error('Failed to save active player key:', err);
    }
  }, [state, isSessionAuthenticated]);

  const registeredProfiles = toSortedSummaries(registry);

  const isNameTaken = useCallback(
    (name: string, excludeCurrent = false): boolean => {
      const norm = normalizePlayerName(name);
      if (!norm) return false;
      const currentNorm = state.hasRegisteredName ? normalizePlayerName(state.playerName) : '';
      if (excludeCurrent && norm === currentNorm) return false;
      return Boolean(registry[norm] && registry[norm].hasRegisteredName);
    },
    [registry, state.hasRegisteredName, state.playerName]
  );

  const registerNewPlayer = useCallback(
    (name: string, phoneNumber: string = ''): RegisterResult => {
      const cleaned = cleanDisplayName(name);
      const norm = normalizePlayerName(cleaned);
      const cleanPhone = normalizePhoneNumber(phoneNumber);

      if (!cleaned) {
        return { ok: false, error: 'Please enter your hero username in Step 1.' };
      }
      if (cleaned.length > 25) {
        return { ok: false, error: 'Hero username must not exceed 25 characters.' };
      }

      if (registry[norm] && registry[norm].hasRegisteredName) {
        return {
          ok: false,
          error: `Username "${registry[norm].playerName}" is already registered! Please change your username in Step 1 or switch to Returning Hero Sign-In.`,
          existingProfile: buildSummary(norm, registry[norm]),
        };
      }

      if (!isValidPhoneNumber(cleanPhone)) {
        return { ok: false, error: 'Please enter a valid mobile phone number (8 to 15 digits).' };
      }

      const freshProfile = createInitialState({
        playerName: cleaned,
        phoneNumber: cleanPhone,
        isActivated: true,
        hasRegisteredName: true,
        lastScreen: 'playing',
        lastActiveWorld: 1,
        lastActiveSubStageId: 1,
        solvedQuestionsInStage: [],
        currentStageScore: 0,
        lastPlayedAt: Date.now(),
        soundEnabled: state.soundEnabled,
        musicEnabled: state.musicEnabled,
      });

      const updatedRegistry = {
        ...registry,
        [norm]: freshProfile,
      };
      setRegistry(updatedRegistry);
      writeProfilesRegistry(updatedRegistry);
      try {
        localStorage.setItem(ACTIVE_PLAYER_KEY, norm);
      } catch {}

      setState(freshProfile);
      setIsSessionAuthenticated(true);
      setProfileVersion((v) => v + 1);
      return { ok: true };
    },
    [registry, state.soundEnabled, state.musicEnabled]
  );

  const renameCurrentPlayer = useCallback(
    (name: string): RegisterResult => {
      if (!state.hasRegisteredName) {
        return registerNewPlayer(name, state.phoneNumber);
      }

      const cleaned = cleanDisplayName(name);
      const newNorm = normalizePlayerName(cleaned);
      const oldNorm = normalizePlayerName(state.playerName);

      if (!cleaned) {
        return { ok: false, error: 'Please enter a hero name to continue.' };
      }
      if (cleaned.length > 25) {
        return { ok: false, error: 'Hero name must not exceed 25 characters.' };
      }

      if (newNorm !== oldNorm && registry[newNorm] && registry[newNorm].hasRegisteredName) {
        return {
          ok: false,
          error: `"${registry[newNorm].playerName}" is already registered to another hero! Pick a different name or switch to that account.`,
          existingProfile: buildSummary(newNorm, registry[newNorm]),
        };
      }

      const updatedState: GameState = {
        ...state,
        playerName: cleaned,
        hasRegisteredName: true,
        lastPlayedAt: Date.now(),
      };

      const nextRegistry = { ...registry };
      if (oldNorm && oldNorm !== newNorm) {
        delete nextRegistry[oldNorm];
      }
      nextRegistry[newNorm] = updatedState;
      setRegistry(nextRegistry);
      writeProfilesRegistry(nextRegistry);
      try {
        localStorage.setItem(ACTIVE_PLAYER_KEY, newNorm);
      } catch {}

      setState(updatedState);
      return { ok: true };
    },
    [state, registry, registerNewPlayer]
  );

  const loginExistingPlayer = useCallback(
    (name: string): boolean => {
      const norm = normalizePlayerName(name);
      const found = registry[norm];
      if (!found) return false;

      const resumed = hydrateState({
        ...found,
        hasRegisteredName: true,
        isActivated: true,
        lastPlayedAt: Date.now(),
      });

      const nextRegistry = {
        ...registry,
        [norm]: resumed,
      };
      setRegistry(nextRegistry);
      writeProfilesRegistry(nextRegistry);
      try {
        localStorage.setItem(ACTIVE_PLAYER_KEY, norm);
      } catch {}

      setState(resumed);
      setIsSessionAuthenticated(true);
      setProfileVersion((v) => v + 1);
      return true;
    },
    [registry]
  );

  const loginExistingPlayerWithPhone = useCallback(
    (name: string, phoneNumber: string, options: { startFresh?: boolean } = {}): RegisterResult => {
      const norm = normalizePlayerName(name);
      const found = registry[norm];
      if (!found) {
        return { ok: false, error: 'Selected user profile was not found on this device.' };
      }

      const cleanInputPhone = normalizePhoneNumber(phoneNumber);
      if (!isValidPhoneNumber(cleanInputPhone)) {
        return { ok: false, error: 'Please enter the mobile phone number linked to this account.' };
      }

      const savedPhone = normalizePhoneNumber(found.phoneNumber || '');
      if (savedPhone && savedPhone !== cleanInputPhone) {
        return {
          ok: false,
          error: `Mobile number does not match the number registered for "${found.playerName}".`,
        };
      }

      const nextState = options.startFresh
        ? createInitialState({
            playerName: found.playerName,
            phoneNumber: savedPhone || cleanInputPhone,
            isActivated: true,
            hasRegisteredName: true,
            soundEnabled: found.soundEnabled ?? state.soundEnabled,
            musicEnabled: found.musicEnabled ?? state.musicEnabled,
            lastScreen: 'playing',
            lastActiveWorld: 1,
            lastActiveSubStageId: 1,
            solvedQuestionsInStage: [],
            currentStageScore: 0,
            lastPlayedAt: Date.now(),
          })
        : hydrateState({
            ...found,
            phoneNumber: savedPhone || cleanInputPhone,
            isActivated: true,
            hasRegisteredName: true,
            lastScreen: found.lastScreen === 'title' ? 'playing' : found.lastScreen || 'playing',
            lastPlayedAt: Date.now(),
          });

      const nextRegistry = {
        ...registry,
        [norm]: nextState,
      };
      setRegistry(nextRegistry);
      writeProfilesRegistry(nextRegistry);
      try {
        localStorage.setItem(ACTIVE_PLAYER_KEY, norm);
      } catch {}

      setState(nextState);
      setIsSessionAuthenticated(true);
      setProfileVersion((v) => v + 1);
      return { ok: true };
    },
    [registry, state.soundEnabled, state.musicEnabled]
  );

  const signOutSession = useCallback(() => {
    setIsSessionAuthenticated(false);
    setState(createInitialState({ soundEnabled: state.soundEnabled, musicEnabled: state.musicEnabled }));
    setProfileVersion((v) => v + 1);
  }, [state.soundEnabled, state.musicEnabled]);

  const setPlayerName = useCallback(
    (name: string): RegisterResult => {
      return renameCurrentPlayer(name);
    },
    [renameCurrentPlayer]
  );

  const updateCheckpoint = useCallback((checkpoint: CheckpointUpdate) => {
    setState((prev) => {
      const nextScreen = checkpoint.lastScreen ?? prev.lastScreen;
      const nextWorld = checkpoint.lastActiveWorld ?? prev.lastActiveWorld;
      const nextSubStage = checkpoint.lastActiveSubStageId ?? prev.lastActiveSubStageId;
      const nextSolved = checkpoint.solvedQuestionsInStage ?? prev.solvedQuestionsInStage;
      const nextScore = checkpoint.currentStageScore ?? prev.currentStageScore;

      const sameSolved =
        nextSolved.length === prev.solvedQuestionsInStage.length &&
        nextSolved.every((val, i) => val === prev.solvedQuestionsInStage[i]);

      if (
        nextScreen === prev.lastScreen &&
        nextWorld === prev.lastActiveWorld &&
        nextSubStage === prev.lastActiveSubStageId &&
        nextScore === prev.currentStageScore &&
        sameSolved
      ) {
        return prev;
      }

      return {
        ...prev,
        lastScreen: nextScreen,
        lastActiveWorld: nextWorld,
        lastActiveSubStageId: nextSubStage,
        solvedQuestionsInStage: [...nextSolved],
        currentStageScore: nextScore,
        lastPlayedAt: Date.now(),
      };
    });
  }, []);

  const markSubStageCompleted = useCallback((worldId: number, subStageId: number) => {
    setState((prev) => {
      const currentProg = prev.worldProgress[worldId] || createInitialWorldProgress()[worldId];
      const existingList = currentProg.subStagesCompleted || [];
      if (existingList.includes(subStageId)) return prev;

      const updatedCompleted = [...existingList, subStageId].sort((a, b) => a - b);
      return {
        ...prev,
        lastPlayedAt: Date.now(),
        worldProgress: {
          ...prev.worldProgress,
          [worldId]: {
            ...currentProg,
            subStagesCompleted: updatedCompleted,
          },
        },
      };
    });
  }, []);

  const startFreshForCurrentPlayer = useCallback((targetScreen: ScreenState = 'playing') => {
    setState((prev) => {
      const resetState = createInitialState({
        playerName: prev.hasRegisteredName ? prev.playerName : 'Cyber Hero',
        hasRegisteredName: prev.hasRegisteredName,
        soundEnabled: prev.soundEnabled,
        musicEnabled: prev.musicEnabled,
        lastScreen: targetScreen,
        lastActiveWorld: 1,
        lastActiveSubStageId: 1,
        solvedQuestionsInStage: [],
        currentStageScore: 0,
        lastPlayedAt: Date.now(),
      });
      return resetState;
    });
    setProfileVersion((v) => v + 1);
  }, []);

  const recordQuestionAttempt = (attempt: QuestionAttempt) => {
    setState((prev) => {
      const otherAttempts = prev.questionAttempts.filter((a) => a.questionId !== attempt.questionId);
      const newAttempts = [...otherAttempts, attempt];

      const hasBrainPerk = prev.activeRunPerks.includes('perk_cognitive_boost');
      const multiplier = hasBrainPerk ? 2 : 1;

      const coinsEarned = attempt.isCorrect ? (25 + prev.skillTree.coinBonusLevel * 5) * multiplier : 0;
      const xpEarned = attempt.isCorrect ? 50 * multiplier : 5;
      const totalXp = prev.xp + xpEarned;
      const newLevel = Math.floor(totalXp / 250) + 1;

      return {
        ...prev,
        questionAttempts: newAttempts,
        coins: prev.coins + coinsEarned,
        xp: totalXp,
        playerLevel: newLevel,
        lastPlayedAt: Date.now(),
      };
    });
  };

  // Evaluate 80% Mastery Gate (at least 20 out of 25 correct answers)
  const evaluateWorldProgress = (worldId: number) => {
    const world = WORLDS_DATA.find((w) => w.id === worldId);
    if (!world) return { canUnlockNext: false, totalCorrect: 0, percentage: 0 };

    const allWorldQuestionIds = world.subStages.flatMap((s) => s.questions.map((q) => q.id));
    const totalQuestions = allWorldQuestionIds.length;

    let correctCount = 0;
    allWorldQuestionIds.forEach((qId) => {
      const attempt = state.questionAttempts.find((a) => a.questionId === qId);
      if (attempt && attempt.isCorrect) {
        correctCount++;
      }
    });

    const percentage = Math.round((correctCount / totalQuestions) * 100);
    const canUnlockNext = correctCount >= 20;

    setState((prev) => {
      const currentProg = prev.worldProgress[worldId] || {
        worldId,
        isUnlocked: true,
        isCompleted: false,
        highScore: 0,
        highestAccuracy: 0,
        attemptsCount: 0,
        bestCorrectCount: 0,
        subStagesCompleted: [],
      };

      const updatedWorldProgress = {
        ...prev.worldProgress,
        [worldId]: {
          ...currentProg,
          isCompleted: canUnlockNext,
          attemptsCount: currentProg.attemptsCount + 1,
          bestCorrectCount: Math.max(currentProg.bestCorrectCount, correctCount),
          highestAccuracy: Math.max(currentProg.highestAccuracy, percentage),
        },
      };

      if (canUnlockNext && worldId < 4) {
        const nextWorldId = worldId + 1;
        const nextProg = updatedWorldProgress[nextWorldId];
        if (nextProg && !nextProg.isUnlocked) {
          updatedWorldProgress[nextWorldId] = {
            ...nextProg,
            isUnlocked: true,
          };
        }
      }

      return {
        ...prev,
        worldProgress: updatedWorldProgress,
        lastPlayedAt: Date.now(),
      };
    });

    return { canUnlockNext, totalCorrect: correctCount, percentage };
  };

  const unlockNextWorld = (currentWorldId: number) => {
    if (currentWorldId >= 4) return;
    const nextWorldId = currentWorldId + 1;
    setState((prev) => ({
      ...prev,
      worldProgress: {
        ...prev.worldProgress,
        [nextWorldId]: {
          ...(prev.worldProgress[nextWorldId] || createInitialWorldProgress()[nextWorldId]),
          isUnlocked: true,
        },
      },
    }));
  };

  const equipCharacter = (id: string) => {
    if (state.unlockedCharacters.includes(id)) {
      setState((prev) => ({ ...prev, selectedCharacterId: id }));
      sounds.playClick();
    }
  };

  const equipWeapon = (id: string) => {
    if (state.unlockedWeapons.includes(id)) {
      setState((prev) => ({ ...prev, selectedWeaponId: id }));
      sounds.playClick();
    }
  };

  const equipArmor = (id: string) => {
    if (state.unlockedArmors.includes(id)) {
      setState((prev) => ({ ...prev, selectedArmorId: id }));
      sounds.playClick();
    }
  };

  const purchaseCharacter = (id: string, cost: number): boolean => {
    if (state.coins >= cost && !state.unlockedCharacters.includes(id)) {
      setState((prev) => ({
        ...prev,
        coins: prev.coins - cost,
        unlockedCharacters: [...prev.unlockedCharacters, id],
        selectedCharacterId: id,
      }));
      sounds.playVictory();
      return true;
    }
    sounds.playError();
    return false;
  };

  const purchaseWeapon = (id: string, cost: number): boolean => {
    if (state.coins >= cost && !state.unlockedWeapons.includes(id)) {
      setState((prev) => ({
        ...prev,
        coins: prev.coins - cost,
        unlockedWeapons: [...prev.unlockedWeapons, id],
        selectedWeaponId: id,
      }));
      sounds.playVictory();
      return true;
    }
    sounds.playError();
    return false;
  };

  const purchaseArmor = (id: string, cost: number): boolean => {
    if (state.coins >= cost && !state.unlockedArmors.includes(id)) {
      setState((prev) => ({
        ...prev,
        coins: prev.coins - cost,
        unlockedArmors: [...prev.unlockedArmors, id],
        selectedArmorId: id,
      }));
      sounds.playVictory();
      return true;
    }
    sounds.playError();
    return false;
  };

  const upgradeSkill = (skillKey: keyof SkillTree, cost: number): boolean => {
    const currentVal = state.skillTree[skillKey];
    const maxVal = skillKey === 'extraLifeLevel' ? 3 : 5;
    if (currentVal < maxVal && state.coins >= cost) {
      setState((prev) => ({
        ...prev,
        coins: prev.coins - cost,
        skillTree: {
          ...prev.skillTree,
          [skillKey]: currentVal + 1,
        },
      }));
      sounds.playCorrect();
      return true;
    }
    sounds.playError();
    return false;
  };

  const addRunPerk = (perkId: string) => {
    setState((prev) => {
      if (prev.activeRunPerks.includes(perkId)) return prev;
      return {
        ...prev,
        activeRunPerks: [...prev.activeRunPerks, perkId],
      };
    });
    sounds.playVictory();
  };

  const clearRunPerks = () => {
    setState((prev) => ({ ...prev, activeRunPerks: [] }));
  };

  const awardReward = (coins: number, xp: number) => {
    setState((prev) => {
      const bonus = prev.skillTree.coinBonusLevel * 0.15;
      const actualCoins = Math.round(coins * (1 + bonus));
      const totalXp = prev.xp + xp;
      return {
        ...prev,
        coins: prev.coins + actualCoins,
        xp: totalXp,
        playerLevel: Math.floor(totalXp / 250) + 1,
      };
    });
  };

  const toggleSound = (): boolean => {
    const isMuted = sounds.toggleMute();
    const enabled = !isMuted;
    setState((prev) => ({ ...prev, soundEnabled: enabled }));
    return enabled;
  };

  const resetProgress = () => {
    startFreshForCurrentPlayer('title');
  };

  const getQuestionHistory = (questionId: string) => {
    return state.questionAttempts.find((a) => a.questionId === questionId);
  };

  const getFailedQuestions = (worldId?: number) => {
    if (worldId !== undefined) {
      return state.questionAttempts.filter((a) => a.worldId === worldId && !a.isCorrect);
    }
    return state.questionAttempts.filter((a) => !a.isCorrect);
  };

  return (
    <GameContext.Provider
      value={{
        state,
        profileVersion,
        isSessionAuthenticated,
        lastActiveProfileName,
        registeredProfiles,
        isNameTaken,
        registerNewPlayer,
        renameCurrentPlayer,
        loginExistingPlayer,
        loginExistingPlayerWithPhone,
        signOutSession,
        setPlayerName,
        updateCheckpoint,
        markSubStageCompleted,
        startFreshForCurrentPlayer,
        recordQuestionAttempt,
        evaluateWorldProgress,
        unlockNextWorld,
        equipCharacter,
        equipWeapon,
        equipArmor,
        purchaseCharacter,
        purchaseWeapon,
        purchaseArmor,
        upgradeSkill,
        addRunPerk,
        clearRunPerks,
        awardReward,
        toggleSound,
        resetProgress,
        getQuestionHistory,
        getFailedQuestions,
      }}
    >
      {children}
    </GameContext.Provider>
  );
};

export const useGame = () => {
  const context = useContext(GameContext);
  if (!context) {
    throw new Error('useGame must be used within a GameProvider');
  }
  return context;
};
