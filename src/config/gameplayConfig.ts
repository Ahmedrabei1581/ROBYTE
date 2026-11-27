/**
 * @license
 * Copyright (c) 2026-2027 Ahmed Ramadan Fouad Ahmed Rabei — ROBYTE — All Rights Reserved.
 * Central Gameplay Tuning Configuration:
 * - Hit limit before restarting the current stage/question attempt (MAX_ALLOWED_HITS = 6)
 * - Walk & Sprint movement + stamina balance
 * - Per-question combat escalation (spacecraft count, projectile patterns, fire rates)
 */

export const MAX_ALLOWED_HITS = 6;
export const HIT_INVULNERABILITY_SECONDS = 0.65;

export const PLAYER_MOVEMENT_CONFIG = {
  walkSpeedBase: 7.2,
  sprintMultiplier: 1.62,
  crouchMultiplier: 0.5,
  maxStamina: 100,
  staminaDrainPerSec: 28,
  staminaRegenIdlePerSec: 42,
  staminaRegenWalkPerSec: 24,
  sprintResumeThreshold: 15,
};

export type EnemyProjectilePattern =
  | 'straight'
  | 'homing'
  | 'wave-spread'
  | 'splitter'
  | 'orbital-burst';

export type SpacecraftArchetype =
  | 'alien-scout'
  | 'hover-gunship'
  | 'pulse-cruiser'
  | 'void-splitter'
  | 'alien-commander';

export interface QuestionEscalationTier {
  questionIndex: number; // 1 to 5 inside each stage
  waveTitle: string;
  spacecraftCount: number;
  fireRateMultiplier: number; // Lower = faster enemy fire
  projectileSpeedMultiplier: number;
  burstDensity: number;
  archetypes: SpacecraftArchetype[];
  patterns: EnemyProjectilePattern[];
  accentColor: string;
}

export const QUESTION_ESCALATION_CONFIG: QuestionEscalationTier[] = [
  {
    questionIndex: 1,
    waveTitle: 'Q1 Sector · Alien Scout Patrol',
    spacecraftCount: 2,
    fireRateMultiplier: 1.05,
    projectileSpeedMultiplier: 1.0,
    burstDensity: 1,
    archetypes: ['alien-scout'],
    patterns: ['straight'],
    accentColor: '#38bdf8',
  },
  {
    questionIndex: 2,
    waveTitle: 'Q2 Sector · Tracking Gunships Inbound',
    spacecraftCount: 3,
    fireRateMultiplier: 0.88,
    projectileSpeedMultiplier: 1.08,
    burstDensity: 2,
    archetypes: ['alien-scout', 'hover-gunship'],
    patterns: ['straight', 'homing'],
    accentColor: '#f59e0b',
  },
  {
    questionIndex: 3,
    waveTitle: 'Q3 Sector · Pulse Cruisers & Wave Bursts',
    spacecraftCount: 4,
    fireRateMultiplier: 0.75,
    projectileSpeedMultiplier: 1.15,
    burstDensity: 3,
    archetypes: ['alien-scout', 'hover-gunship', 'pulse-cruiser'],
    patterns: ['straight', 'homing', 'wave-spread'],
    accentColor: '#c084fc',
  },
  {
    questionIndex: 4,
    waveTitle: 'Q4 Sector · Void Splitters & Heavy Assault',
    spacecraftCount: 5,
    fireRateMultiplier: 0.64,
    projectileSpeedMultiplier: 1.22,
    burstDensity: 3,
    archetypes: ['hover-gunship', 'pulse-cruiser', 'void-splitter'],
    patterns: ['straight', 'homing', 'wave-spread', 'splitter'],
    accentColor: '#fb7185',
  },
  {
    questionIndex: 5,
    waveTitle: 'Q5 Climax · Alien Fleet Commander',
    spacecraftCount: 6,
    fireRateMultiplier: 0.54,
    projectileSpeedMultiplier: 1.3,
    burstDensity: 4,
    archetypes: ['hover-gunship', 'pulse-cruiser', 'void-splitter', 'alien-commander'],
    patterns: ['straight', 'homing', 'wave-spread', 'splitter', 'orbital-burst'],
    accentColor: '#ec4899',
  },
];

export function getEscalationForQuestion(questionNumber: number): QuestionEscalationTier {
  const clamped = Math.max(1, Math.min(5, questionNumber));
  return QUESTION_ESCALATION_CONFIG[clamped - 1];
}
