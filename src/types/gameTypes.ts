/**
 * @license
 * Copyright (c) 2026-2027 Ahmed Ramadan Fouad Ahmed Rabei — ROBYTE — All Rights Reserved.
 * Programming & Artificial Intelligence Curriculum (Language Schools — Egyptian Baccalaureate 2nd Year)
 */

export type QuestionDifficulty = 'easy' | 'easy-medium' | 'medium' | 'hard' | 'very-hard';
export type QuestionType = 'mcq' | 'true-false' | 'fill-blank' | 'application';

export interface Question {
  id: string;
  worldId: number;
  subStageId: number; // 1 to 5
  questionIndex: number; // 1 to 5 within substage
  question: string;
  options: string[];
  correctAnswer: number; // index 0-3
  explanation: string;
  difficulty: QuestionDifficulty;
  difficultyArabic: string; // Localized difficulty label ("Easy", "Medium", etc.)
  type: QuestionType;
  lesson: string;
}

export interface SubStage {
  id: number;
  name: string;
  tagline: string;
  difficulty: QuestionDifficulty;
  difficultyArabic: string; // Localized difficulty label
  description: string;
  curriculumFocus: string;
  bossName?: string;
  questions: Question[];
}

export interface World {
  id: number;
  title: string;
  subTitle: string;
  description: string;
  iconName: string;
  badge: string;
  accentColor: string;
  borderColor: string;
  themeType: 'ai-metropolis' | 'cyber-fortress' | 'web-realm' | 'ux-kingdom';
  lessons: string[];
  subStages: SubStage[];
  boss: {
    name: string;
    title: string;
    description: string;
    avatar: string;
    maxHp: number;
  };
}

export interface RobloxSkin {
  headColor: string;
  torsoColor: string;
  leftArmColor: string;
  rightArmColor: string;
  legsColor: string;
  shirtPattern: 'hoodie' | 'armor' | 'classic' | 'ninja';
  faceType: 'cool' | 'smile' | 'cyber-visor' | 'gamer';
  accessory: 'headphones' | 'cap' | 'visor' | 'ninja-mask';
}

export interface PlayerCharacter {
  id: string;
  name: string;
  title: string;
  avatar: string;
  description: string;
  speedMultiplier: number;
  shieldBonus: number;
  unlockedByDefault: boolean;
  cost: number;
  unlockCondition: string;
  robloxSkin: RobloxSkin;
}

export interface Weapon {
  id: string;
  name: string;
  description: string;
  color: string;
  fireRate: number; // ms
  damage: number;
  projectileSpeed: number;
  bulletType: 'laser' | 'plasma' | 'pulse' | 'quantum';
  cost: number;
  unlockedByDefault: boolean;
  deflectAngle: number; // Deflection arc in degrees
  deflectMultiplier: number; // Reflected projectile speed & damage multiplier
}

export interface Armor {
  id: string;
  name: string;
  description: string;
  shieldPoints: number;
  deflectChance: number;
  cost: number;
  unlockedByDefault: boolean;
}

export interface StagePerk {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  icon: string;
  category: 'deflect' | 'speed' | 'firepower' | 'defense' | 'time' | 'learning';
  statBoost: string;
}

export interface SkillTree {
  speedLevel: number; // max 5
  shieldLevel: number; // max 5
  damageLevel: number; // max 5
  coinBonusLevel: number; // max 5
  extraLifeLevel: number; // max 3
}

export interface QuestionAttempt {
  questionId: string;
  worldId: number;
  subStageId: number;
  selectedAnswer: number;
  isCorrect: boolean;
  timestamp: number;
}

export interface WorldProgress {
  worldId: number;
  isUnlocked: boolean;
  isCompleted: boolean;
  highScore: number;
  highestAccuracy: number; // percentage
  attemptsCount: number;
  bestCorrectCount: number; // out of 25
  subStagesCompleted: number[];
}

export type ScreenState = 'title' | 'map' | 'playing';

export interface RegisteredPlayerSummary {
  normalizedName: string;
  playerName: string;
  phoneMasked: string;
  isActivated: boolean;
  playerLevel: number;
  coins: number;
  lastActiveWorld: number;
  lastActiveSubStageId: number;
  lastScreen: ScreenState;
  completedStagesCount: number;
  lastPlayedAt: number;
}

export interface GameState {
  playerName: string;
  phoneNumber: string;
  isActivated: boolean;
  hasRegisteredName: boolean;
  playerLevel: number;
  xp: number;
  coins: number;
  selectedCharacterId: string;
  selectedWeaponId: string;
  selectedArmorId: string;
  unlockedCharacters: string[];
  unlockedWeapons: string[];
  unlockedArmors: string[];
  activeRunPerks: string[];
  skillTree: SkillTree;
  worldProgress: Record<number, WorldProgress>;
  questionAttempts: QuestionAttempt[];
  soundEnabled: boolean;
  musicEnabled: boolean;
  lastActiveWorld: number;
  lastActiveSubStageId: number;
  lastScreen: ScreenState;
  solvedQuestionsInStage: number[];
  currentStageScore: number;
  lastPlayedAt: number;
}
