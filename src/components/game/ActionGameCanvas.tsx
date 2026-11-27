/**
 * @license
 * Copyright (c) 2026-2027 Ahmed Ramadan Fouad Ahmed Rabei — ROBYTE — All Rights Reserved.
 * ROBYTE 2D Cyber Action Game Engine
 * - Walk & Sprint movement with stamina gauge + speed trail physics
 * - Mandatory sequential Question Stations with per-question escalating spacecraft waves & projectile variety
 * - Configurable 6-hit damage limit (7th hit restarts the current stage/question attempt)
 * - Adaptive Mobile & Desktop Camera FOV, multi-touch joystick, smart magnetic targeting & Gamepad API
 */

import React, { useRef, useEffect, useState, useCallback } from 'react';
import { SubStage, World, PlayerCharacter, Weapon, Armor } from '../../types/gameTypes';
import { sounds } from '../../utils/soundEffects';
import {
  MAX_ALLOWED_HITS,
  HIT_INVULNERABILITY_SECONDS,
  PLAYER_MOVEMENT_CONFIG,
  getEscalationForQuestion,
  SpacecraftArchetype,
  EnemyProjectilePattern,
} from '../../config/gameplayConfig';
import {
  Shield,
  Zap,
  Target,
  Swords,
  Radio,
  Activity,
  ArrowUp,
  ArrowDown,
  ArrowLeft,
  ArrowRight,
  ShieldAlert,
  Maximize2,
  Minimize2,
  Home,
  Menu,
  Flame,
  Lock,
} from 'lucide-react';

interface ActionGameCanvasProps {
  playerName: string;
  world: World;
  subStage: SubStage;
  character: PlayerCharacter;
  weapon: Weapon;
  armor: Armor;
  skillBonus: {
    speedBonus: number;
    shieldBonus: number;
    damageBonus: number;
  };
  activePerks: string[];
  onOpenQuestion: (questionIndex: number) => void;
  solvedQuestions: Set<number>;
  onGameOver: (score: number) => void;
  onStageVictory: (score: number) => void;
  onBackToHome?: () => void;
  onOpenMenu?: () => void;
}

interface Platform {
  x: number;
  y: number;
  width: number;
  height: number;
  type: 'ground' | 'cyber-pad' | 'moving' | 'barrier';
}

interface Obstacle {
  id: number;
  x: number;
  y: number;
  width: number;
  height: number;
  hp: number;
  maxHp: number;
  type: 'cyber-mine' | 'shield-barricade' | 'energy-prism';
  color: string;
  points: number;
  isDestroyed: boolean;
  pulseTimer: number;
  floatOffset: number;
}

interface FloatingText {
  id: number;
  x: number;
  y: number;
  text: string;
  color: string;
  life: number;
  maxLife: number;
}

interface EnemyBase {
  id: number;
  x: number;
  y: number;
  width: number;
  height: number;
  hp: number;
  maxHp: number;
  type: 'ground-cannon' | 'ceiling-laser' | 'missile-tower' | 'patrol-drone' | 'boss-fortress';
  shootCooldown: number;
  maxShootCooldown: number;
  name: string;
  barrelAngle: number;
  isJammed: boolean;
  jamTimer: number;
  color: string;
  isDestroyed: boolean;
}

interface SpaceUnit {
  id: number;
  archetype: SpacecraftArchetype;
  x: number;
  y: number;
  anchorX: number;
  anchorY: number;
  width: number;
  height: number;
  hp: number;
  maxHp: number;
  phase: number;
  flightPattern: 'sine-patrol' | 'figure-eight' | 'swoop-dive' | 'orbital-strafe';
  shootCooldown: number;
  maxShootCooldown: number;
  patterns: EnemyProjectilePattern[];
  color: string;
  name: string;
  isJammed: boolean;
  jamTimer: number;
  isDestroyed: boolean;
  hitFlash: number;
  barrelAngle: number;
  shotCounter: number;
}

interface Bullet {
  x: number;
  y: number;
  vx: number;
  vy: number;
  isPlayer: boolean;
  damage: number;
  color: string;
  radius: number;
  isDeflected?: boolean;
  type: 'plasma' | 'laser' | 'missile' | 'quantum';
  pattern?: EnemyProjectilePattern;
  age?: number;
  hasSplit?: boolean;
  wavePhase?: number;
  targetX?: number;
  targetY?: number;
}

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  color: string;
  life: number;
  maxLife: number;
}

interface SprintAfterimage {
  x: number;
  y: number;
  facing: 1 | -1;
  crouching: boolean;
  life: number;
  maxLife: number;
}

interface QuestionStation {
  index: number;
  x: number;
  y: number;
  radius: number;
  isSolved: boolean;
  barrierX: number;
}

export const ActionGameCanvas: React.FC<ActionGameCanvasProps> = ({
  playerName,
  world,
  subStage,
  character,
  weapon,
  armor,
  skillBonus,
  activePerks,
  onOpenQuestion,
  solvedQuestions,
  onGameOver,
  onStageVictory,
  onBackToHome,
  onOpenMenu,
}) => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const stageAreaRef = useRef<HTMLDivElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const TRACK_LENGTH = 3800;
  const GROUND_Y = 520;

  const viewportRef = useRef({
    viewW: 1200,
    viewH: 640,
    dpr: 1,
    cameraScale: 1,
    worldViewWidth: 1200,
    worldViewHeight: 640,
  });

  const hasDeflectWidePerk = activePerks.includes('perk_deflect_wide');
  const hasSpeedPerk = activePerks.includes('perk_rocket_boots');
  const hasTriplePerk = activePerks.includes('perk_triple_blade');
  const hasSlowMoPerk = activePerks.includes('perk_matrix_slowmo');
  const hasNanoPerk = activePerks.includes('perk_nano_repair');
  const hasDoubleJumpPerk = activePerks.includes('perk_double_jump') || subStage.id >= 2;

  const baseDeflectDegrees = weapon.deflectAngle || 120;
  const effectiveDeflectAngle = ((baseDeflectDegrees + (hasDeflectWidePerk ? 50 : 0)) * Math.PI) / 180;

  const activeQuestionIdx = [0, 1, 2, 3, 4].find((i) => !solvedQuestions.has(i)) ?? 4;

  const [hudStats, setHudStats] = useState({
    hp: 100,
    maxHp: 100,
    shield: 100,
    maxShield: 100,
    stamina: PLAYER_MOVEMENT_CONFIG.maxStamina,
    maxStamina: PLAYER_MOVEMENT_CONFIG.maxStamina,
    isSprinting: false,
    sprintExhausted: false,
    hitsTaken: 0,
    maxAllowedHits: MAX_ALLOWED_HITS,
    currentQuestionNumber: 1,
    waveTitle: getEscalationForQuestion(1).waveTitle,
    waveShipsRemaining: 0,
    score: 0,
    progressPercent: 0,
    bossHp: 600,
    bossMaxHp: 600,
    isDeflecting: false,
    pulseCooldown: 0,
    empCooldown: 0,
    quantumCooldown: 0,
    gamepadConnected: false,
    gamepadName: '',
    lockedTargetName: '',
  });

  const [sprintLatchUI, setSprintLatchUI] = useState(false);
  const [nearStationIndex, setNearStationIndex] = useState<number | null>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const [touchJoystick, setTouchJoystick] = useState({
    active: false,
    startX: 0,
    startY: 0,
    currentX: 0,
    currentY: 0,
  });
  const [touchAimCrosshair, setTouchAimCrosshair] = useState<{ active: boolean; x: number; y: number }>({
    active: false,
    x: 0,
    y: 0,
  });

  const stateRef = useRef({
    cameraX: 0,
    cameraY: 0,
    player: {
      x: 120,
      y: GROUND_Y - 78,
      vx: 0,
      vy: 0,
      width: 50,
      height: 78,
      facing: 1 as 1 | -1,
      isGrounded: true,
      canDoubleJump: true,
      isCrouching: false,
      speed:
        PLAYER_MOVEMENT_CONFIG.walkSpeedBase *
        character.speedMultiplier *
        (1 + skillBonus.speedBonus) *
        (hasSpeedPerk ? 1.25 : 1.0),
      stamina: PLAYER_MOVEMENT_CONFIG.maxStamina,
      maxStamina: PLAYER_MOVEMENT_CONFIG.maxStamina,
      isSprinting: false,
      wasSprinting: false,
      sprintExhaustedLock: false,
      hp: hasNanoPerk ? 120 : 100,
      maxHp: hasNanoPerk ? 120 : 100,
      shield: 100 + armor.shieldPoints + skillBonus.shieldBonus + (hasNanoPerk ? 50 : 0),
      maxShield: 100 + armor.shieldPoints + skillBonus.shieldBonus + (hasNanoPerk ? 50 : 0),
      shootCooldown: 0,
      walkCycle: 0,
      isSwingingDeflector: false,
      swingProgress: 0,
      aimAngle: 0,
      isQuantumShieldActive: false,
      quantumDuration: 0,
      pulseCooldownTimer: 0,
      empCooldownTimer: 0,
      quantumCooldownTimer: 0,
    },
    keys: {
      left: false,
      right: false,
      jump: false,
      crouch: false,
      sprint: false,
      deflect: false,
      interact: false,
    },
    sprintLatch: false,
    touchInput: {
      moveX: 0,
      moveY: 0,
      isActive: false,
      moveTouchId: null as number | null,
      aimTouchId: null as number | null,
      joyStartX: 0,
      joyStartY: 0,
    },
    isTouchDevice: false,
    autoAimFire: false,
    lockedTarget: null as { x: number; y: number; radius: number; name: string } | null,
    mouse: {
      worldX: 350,
      worldY: GROUND_Y - 48,
      screenX: 350,
      screenY: 300,
      down: false,
    },
    platforms: [] as Platform[],
    obstacles: [] as Obstacle[],
    floatingTexts: [] as FloatingText[],
    enemyBases: [] as EnemyBase[],
    spaceUnits: [] as SpaceUnit[],
    stations: [] as QuestionStation[],
    bullets: [] as Bullet[],
    particles: [] as Particle[],
    sprintAfterimages: [] as SprintAfterimage[],
    sprintTrailTimer: 0,
    aiNeuralPackets: [] as { x: number; y: number; vx: number; vy: number; targetIdx: number; color: string }[],
    score: 0,
    hitsTaken: 0,
    hitInvulnTimer: 0,
    hitFlashTimer: 0,
    restartBannerTimer: 0,
    waveBannerTimer: 0,
    waveBannerTitle: '',
    waveRespawnTimer: 0,
    waveReinforcementsUsed: 0,
    activeQuestionIdx: 0,
    lastSpawnedQuestionIdx: -1,
    isVictoryTriggered: false,
    isGameOverTriggered: false,
    backgroundTimer: 0,
    screenShake: 0,
    gamepadConnected: false,
    gamepadName: '',
  });

  const createExplosion = useCallback((x: number, y: number, color: string, count: number = 20) => {
    const s = stateRef.current;
    for (let i = 0; i < count; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = Math.random() * 6 + 2;
      s.particles.push({
        x,
        y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        radius: Math.random() * 4 + 1.5,
        color,
        life: 0,
        maxLife: Math.random() * 22 + 18,
      });
    }
  }, []);

  const addFloatingText = useCallback((x: number, y: number, text: string, color: string = '#00f5ff') => {
    stateRef.current.floatingTexts.push({
      id: Math.random(),
      x,
      y,
      text,
      color,
      life: 0,
      maxLife: 1.35,
    });
  }, []);

  const spawnWaveForQuestion = useCallback(
    (questionIdx: number, silent: boolean = false) => {
      const s = stateRef.current;
      const questionNumber = Math.max(1, Math.min(5, questionIdx + 1));
      const tier = getEscalationForQuestion(questionNumber);
      const stageDiff = subStage.id;

      const prevBarrierX = questionIdx > 0 ? s.stations[questionIdx - 1]?.barrierX ?? 160 : 160;
      const nextBarrierX = s.stations[questionIdx]?.barrierX ?? TRACK_LENGTH - 120;
      const sectorStart = Math.max(240, prevBarrierX + 60);
      const sectorEnd = Math.min(TRACK_LENGTH - 110, nextBarrierX - 30);
      const span = Math.max(240, sectorEnd - sectorStart);

      const archetypeMeta: Record<
        SpacecraftArchetype,
        { w: number; h: number; baseHp: number; color: string; label: string }
      > = {
        'alien-scout': { w: 46, h: 32, baseHp: 58, color: '#38bdf8', label: 'Alien Scout' },
        'hover-gunship': { w: 54, h: 36, baseHp: 82, color: '#f59e0b', label: 'Hover Gunship' },
        'pulse-cruiser': { w: 62, h: 42, baseHp: 108, color: '#c084fc', label: 'Pulse Cruiser' },
        'void-splitter': { w: 58, h: 44, baseHp: 120, color: '#fb7185', label: 'Void Splitter' },
        'alien-commander': { w: 78, h: 52, baseHp: 165, color: '#ec4899', label: 'Alien Commander' },
      };

      const flightOptions: SpaceUnit['flightPattern'][] = [
        'sine-patrol',
        'figure-eight',
        'swoop-dive',
        'orbital-strafe',
      ];

      const units: SpaceUnit[] = [];
      const count = tier.spacecraftCount;
      for (let i = 0; i < count; i++) {
        const archetype = tier.archetypes[i % tier.archetypes.length];
        const meta = archetypeMeta[archetype];
        const ratio = count === 1 ? 0.55 : (i + 0.5) / count;
        const anchorX = sectorStart + span * (0.18 + ratio * 0.78);
        const anchorY = 125 + ((i * 53) % 165);
        const maxHp = Math.round(meta.baseHp + stageDiff * 14 + questionNumber * 8);
        const baseCooldownSec = Math.max(0.75, 1.85 * tier.fireRateMultiplier * Math.max(0.75, 1.05 - stageDiff * 0.05));

        units.push({
          id: questionNumber * 100 + i + 1,
          archetype,
          x: anchorX,
          y: anchorY,
          anchorX,
          anchorY,
          width: meta.w,
          height: meta.h,
          hp: maxHp,
          maxHp,
          phase: i * 1.35,
          flightPattern: flightOptions[(i + questionNumber) % flightOptions.length],
          shootCooldown: 0.75 + i * 0.35,
          maxShootCooldown: baseCooldownSec,
          patterns: tier.patterns,
          color: meta.color,
          name: meta.label,
          isJammed: false,
          jamTimer: 0,
          isDestroyed: false,
          hitFlash: 0,
          barrelAngle: Math.PI,
          shotCounter: i,
        });
      }

      s.spaceUnits = units;
      s.lastSpawnedQuestionIdx = questionIdx;
      s.waveReinforcementsUsed = 0;
      s.waveRespawnTimer = 0;
      s.waveBannerTitle = tier.waveTitle;
      s.waveBannerTimer = 2.6;

      if (!silent) {
        sounds.playWaveAlert();
      }
    },
    [subStage.id]
  );

  // Dynamic ResizeObserver for crisp DPR & wide mobile FOV
  useEffect(() => {
    const stageEl = stageAreaRef.current;
    const canvas = canvasRef.current;
    if (!stageEl || !canvas) return;

    const updateSize = () => {
      const rect = stageEl.getBoundingClientRect();
      const viewW = Math.max(300, Math.round(rect.width));
      const viewH = Math.max(220, Math.round(rect.height));
      const dpr = Math.min(window.devicePixelRatio || 1, 2);

      canvas.width = Math.round(viewW * dpr);
      canvas.height = Math.round(viewH * dpr);

      const isCompactScreen = viewW < 768;
      const cameraScale = isCompactScreen
        ? Math.max(0.46, Math.min(viewH / 530, viewW / 660))
        : Math.max(0.6, Math.min(viewH / 580, viewW / 980));

      viewportRef.current = {
        viewW,
        viewH,
        dpr,
        cameraScale,
        worldViewWidth: viewW / cameraScale,
        worldViewHeight: viewH / cameraScale,
      };
    };

    updateSize();
    const ro = new ResizeObserver(updateSize);
    ro.observe(stageEl);
    window.addEventListener('resize', updateSize);
    return () => {
      ro.disconnect();
      window.removeEventListener('resize', updateSize);
    };
  }, []);

  // Initialize platforms, stations, obstacles, enemy bases & initial wave
  useEffect(() => {
    const s = stateRef.current;
    s.cameraX = 0;
    s.score = 0;
    s.hitsTaken = 0;
    s.hitInvulnTimer = 0;
    s.hitFlashTimer = 0;
    s.restartBannerTimer = 0;
    s.sprintAfterimages = [];
    s.isVictoryTriggered = false;
    s.isGameOverTriggered = false;
    s.bullets = [];
    s.particles = [];
    s.obstacles = [];
    s.floatingTexts = [];

    const initialQIdx = [0, 1, 2, 3, 4].find((i) => !solvedQuestions.has(i)) ?? 4;
    s.activeQuestionIdx = initialQIdx;

    const platforms: Platform[] = [
      { x: 0, y: GROUND_Y, width: TRACK_LENGTH, height: 120, type: 'ground' },
      { x: 380, y: GROUND_Y - 110, width: 200, height: 18, type: 'cyber-pad' },
      { x: 820, y: GROUND_Y - 110, width: 200, height: 18, type: 'cyber-pad' },
      { x: 1100, y: GROUND_Y - 65, width: 150, height: 18, type: 'cyber-pad' },
      { x: 1280, y: GROUND_Y - 120, width: 240, height: 18, type: 'cyber-pad' },
      { x: 1600, y: GROUND_Y - 90, width: 170, height: 18, type: 'cyber-pad' },
      { x: 1820, y: GROUND_Y - 140, width: 170, height: 18, type: 'cyber-pad' },
      { x: 2030, y: GROUND_Y - 190, width: 240, height: 18, type: 'cyber-pad' },
      { x: 2360, y: GROUND_Y - 95, width: 180, height: 18, type: 'cyber-pad' },
      { x: 2580, y: GROUND_Y - 75, width: 150, height: 18, type: 'cyber-pad' },
      { x: 2720, y: GROUND_Y - 140, width: 240, height: 18, type: 'cyber-pad' },
      { x: 3040, y: GROUND_Y - 100, width: 180, height: 18, type: 'cyber-pad' },
      { x: 3240, y: GROUND_Y - 65, width: 150, height: 18, type: 'cyber-pad' },
      { x: 3380, y: GROUND_Y - 125, width: 250, height: 18, type: 'cyber-pad' },
    ];
    s.platforms = platforms;

    const stations: QuestionStation[] = [
      { index: 0, x: 650, y: GROUND_Y - 48, radius: 46, isSolved: solvedQuestions.has(0), barrierX: 740 },
      { index: 1, x: 1390, y: GROUND_Y - 145, radius: 46, isSolved: solvedQuestions.has(1), barrierX: 1470 },
      { index: 2, x: 2140, y: GROUND_Y - 215, radius: 46, isSolved: solvedQuestions.has(2), barrierX: 2220 },
      { index: 3, x: 2830, y: GROUND_Y - 165, radius: 46, isSolved: solvedQuestions.has(3), barrierX: 2910 },
      { index: 4, x: 3500, y: GROUND_Y - 150, radius: 48, isSolved: solvedQuestions.has(4), barrierX: 3580 },
    ];
    s.stations = stations;

    const spawnX = initialQIdx === 0 ? 120 : (stations[initialQIdx - 1]?.barrierX ?? 120) + 35;
    s.player.x = spawnX;
    s.player.y = GROUND_Y - 78;
    s.player.width = 50;
    s.player.height = 78;
    s.player.vx = 0;
    s.player.vy = 0;
    s.player.hp = hasNanoPerk ? 120 : 100;
    s.player.maxHp = hasNanoPerk ? 120 : 100;
    s.player.maxShield = 100 + armor.shieldPoints + skillBonus.shieldBonus + (hasNanoPerk ? 50 : 0);
    s.player.shield = s.player.maxShield;
    s.player.stamina = PLAYER_MOVEMENT_CONFIG.maxStamina;
    s.player.maxStamina = PLAYER_MOVEMENT_CONFIG.maxStamina;
    s.player.isSprinting = false;
    s.player.sprintExhaustedLock = false;
    s.player.speed =
      PLAYER_MOVEMENT_CONFIG.walkSpeedBase *
      character.speedMultiplier *
      (1 + skillBonus.speedBonus) *
      (hasSpeedPerk ? 1.25 : 1.0);
    s.player.pulseCooldownTimer = 0;
    s.player.empCooldownTimer = 0;
    s.player.quantumCooldownTimer = 0;

    const obstacles: Obstacle[] = [];
    const difficultyLevel = subStage.id;
    const obstacleCount = 5 + difficultyLevel * 3;

    const obstacleSeeds = [
      { x: 320, y: GROUND_Y - 50, type: 'cyber-mine' as const },
      { x: 490, y: GROUND_Y - 32, type: 'shield-barricade' as const },
      { x: 780, y: GROUND_Y - 60, type: 'energy-prism' as const },
      { x: 960, y: GROUND_Y - 80, type: 'cyber-mine' as const },
      { x: 1220, y: GROUND_Y - 40, type: 'shield-barricade' as const },
      { x: 1540, y: GROUND_Y - 50, type: 'energy-prism' as const },
      { x: 1740, y: GROUND_Y - 70, type: 'cyber-mine' as const },
      { x: 1950, y: GROUND_Y - 40, type: 'shield-barricade' as const },
      { x: 2280, y: GROUND_Y - 60, type: 'energy-prism' as const },
      { x: 2470, y: GROUND_Y - 75, type: 'cyber-mine' as const },
      { x: 2660, y: GROUND_Y - 40, type: 'shield-barricade' as const },
      { x: 2950, y: GROUND_Y - 55, type: 'energy-prism' as const },
      { x: 3120, y: GROUND_Y - 70, type: 'cyber-mine' as const },
      { x: 3290, y: GROUND_Y - 40, type: 'shield-barricade' as const },
      { x: 3420, y: GROUND_Y - 60, type: 'energy-prism' as const },
      { x: 3600, y: GROUND_Y - 80, type: 'cyber-mine' as const },
      { x: 1040, y: GROUND_Y - 140, type: 'energy-prism' as const },
      { x: 1700, y: GROUND_Y - 120, type: 'cyber-mine' as const },
      { x: 2500, y: GROUND_Y - 120, type: 'shield-barricade' as const },
      { x: 3180, y: GROUND_Y - 130, type: 'energy-prism' as const },
    ];

    for (let i = 0; i < Math.min(obstacleCount, obstacleSeeds.length); i++) {
      const seed = obstacleSeeds[i];
      const baseHp = seed.type === 'shield-barricade' ? 70 : seed.type === 'energy-prism' ? 55 : 35;
      const hp = baseHp + difficultyLevel * 18;
      const color =
        seed.type === 'cyber-mine' ? '#f59e0b' : seed.type === 'shield-barricade' ? '#00f5ff' : '#ec4899';
      const points =
        seed.type === 'shield-barricade'
          ? 90 + difficultyLevel * 20
          : seed.type === 'energy-prism'
          ? 110 + difficultyLevel * 25
          : 65 + difficultyLevel * 15;

      obstacles.push({
        id: i + 1,
        x: seed.x,
        y: seed.y,
        width: seed.type === 'shield-barricade' ? 32 : 36,
        height: seed.type === 'shield-barricade' ? 56 : 36,
        hp,
        maxHp: hp,
        type: seed.type,
        color,
        points,
        isDestroyed: false,
        pulseTimer: Math.random() * 5,
        floatOffset: Math.random() * Math.PI * 2,
      });
    }
    s.obstacles = obstacles;

    const bases: EnemyBase[] = [];
    const fireIntervalFactor = Math.max(0.55, 1.15 - difficultyLevel * 0.12);

    bases.push({
      id: 1,
      x: 460,
      y: GROUND_Y - 42,
      width: 56,
      height: 42,
      hp: 80 + difficultyLevel * 30,
      maxHp: 80 + difficultyLevel * 30,
      type: 'ground-cannon',
      shootCooldown: 0.7,
      maxShootCooldown: Math.round(95 * fireIntervalFactor),
      name: 'Forward Gate Turret',
      barrelAngle: Math.PI,
      isJammed: false,
      jamTimer: 0,
      color: '#f59e0b',
      isDestroyed: false,
    });

    bases.push({
      id: 2,
      x: 1020,
      y: 90,
      width: 52,
      height: 44,
      hp: 85 + difficultyLevel * 30,
      maxHp: 85 + difficultyLevel * 30,
      type: 'ceiling-laser',
      shootCooldown: 0.9,
      maxShootCooldown: Math.round(100 * fireIntervalFactor),
      name: 'Ceiling Laser #1',
      barrelAngle: Math.PI * 0.7,
      isJammed: false,
      jamTimer: 0,
      color: '#06b6d4',
      isDestroyed: false,
    });

    if (difficultyLevel >= 2) {
      bases.push({
        id: 3,
        x: 1720,
        y: GROUND_Y - 42,
        width: 56,
        height: 42,
        hp: 115 + difficultyLevel * 35,
        maxHp: 115 + difficultyLevel * 35,
        type: 'ground-cannon',
        shootCooldown: 0.8,
        maxShootCooldown: Math.round(85 * fireIntervalFactor),
        name: 'Armored Artillery Pod',
        barrelAngle: Math.PI,
        isJammed: false,
        jamTimer: 0,
        color: '#ef4444',
        isDestroyed: false,
      });

      bases.push({
        id: 4,
        x: 1920,
        y: 210,
        width: 48,
        height: 38,
        hp: 75 + difficultyLevel * 22,
        maxHp: 75 + difficultyLevel * 22,
        type: 'patrol-drone',
        shootCooldown: 0.65,
        maxShootCooldown: Math.round(75 * fireIntervalFactor),
        name: 'Recon Combat Drone',
        barrelAngle: Math.PI,
        isJammed: false,
        jamTimer: 0,
        color: '#a855f7',
        isDestroyed: false,
      });
    }

    if (difficultyLevel >= 3) {
      bases.push({
        id: 5,
        x: 2420,
        y: GROUND_Y - 60,
        width: 50,
        height: 60,
        hp: 145 + difficultyLevel * 35,
        maxHp: 145 + difficultyLevel * 35,
        type: 'missile-tower',
        shootCooldown: 1.1,
        maxShootCooldown: Math.round(115 * fireIntervalFactor),
        name: 'Homing Missile Tower',
        barrelAngle: Math.PI,
        isJammed: false,
        jamTimer: 0,
        color: '#f97316',
        isDestroyed: false,
      });
    }

    if (difficultyLevel >= 4) {
      bases.push({
        id: 6,
        x: 3100,
        y: 110,
        width: 52,
        height: 44,
        hp: 135 + difficultyLevel * 30,
        maxHp: 135 + difficultyLevel * 30,
        type: 'ceiling-laser',
        shootCooldown: 0.75,
        maxShootCooldown: Math.round(72 * fireIntervalFactor),
        name: 'Heavy Ceiling Laser',
        barrelAngle: Math.PI * 0.6,
        isJammed: false,
        jamTimer: 0,
        color: '#ec4899',
        isDestroyed: false,
      });

      bases.push({
        id: 7,
        x: 2920,
        y: 200,
        width: 48,
        height: 38,
        hp: 95 + difficultyLevel * 25,
        maxHp: 95 + difficultyLevel * 25,
        type: 'patrol-drone',
        shootCooldown: 0.7,
        maxShootCooldown: Math.round(68 * fireIntervalFactor),
        name: 'Elite Assault Drone',
        barrelAngle: Math.PI,
        isJammed: false,
        jamTimer: 0,
        color: '#00f5ff',
        isDestroyed: false,
      });
    }

    if (subStage.id === 5) {
      bases.push({
        id: 999,
        x: 3580,
        y: GROUND_Y - 130,
        width: 110,
        height: 130,
        hp: world.boss.maxHp,
        maxHp: world.boss.maxHp,
        type: 'boss-fortress',
        shootCooldown: 0.6,
        maxShootCooldown: 46,
        name: world.boss.name,
        barrelAngle: Math.PI,
        isJammed: false,
        jamTimer: 0,
        color: '#ec4899',
        isDestroyed: false,
      });
    }

    s.enemyBases = bases;

    const packets = [];
    for (let i = 0; i < 24; i++) {
      packets.push({
        x: Math.random() * 1200,
        y: Math.random() * 520,
        vx: (Math.random() - 0.5) * 2,
        vy: (Math.random() - 0.5) * 1.5,
        targetIdx: Math.floor(Math.random() * 8),
        color: ['#00f5ff', '#10b981', '#3b82f6', '#ec4899', '#f59e0b'][Math.floor(Math.random() * 5)],
      });
    }
    s.aiNeuralPackets = packets;

    // Spawn the initial question wave cleanly (resets to Q1 on new stage)
    spawnWaveForQuestion(initialQIdx, true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [world.id, subStage.id]);

  // Keep player stats synced with gear/perks without resetting player position or stage progress
  useEffect(() => {
    const p = stateRef.current.player;
    p.maxHp = hasNanoPerk ? 120 : 100;
    p.hp = Math.min(p.hp, p.maxHp);
    p.maxShield = 100 + armor.shieldPoints + skillBonus.shieldBonus + (hasNanoPerk ? 50 : 0);
    p.shield = Math.min(p.shield, p.maxShield);
    p.speed =
      PLAYER_MOVEMENT_CONFIG.walkSpeedBase *
      character.speedMultiplier *
      (1 + skillBonus.speedBonus) *
      (hasSpeedPerk ? 1.25 : 1.0);
  }, [
    character.id,
    character.speedMultiplier,
    armor.id,
    armor.shieldPoints,
    skillBonus.shieldBonus,
    skillBonus.speedBonus,
    hasNanoPerk,
    hasSpeedPerk,
  ]);

  // Sync solvedQuestions & escalate spacecraft wave whenever advancing to the next question
  useEffect(() => {
    const s = stateRef.current;
    s.stations.forEach((st) => {
      st.isSolved = solvedQuestions.has(st.index);
    });

    const nextActiveIdx = [0, 1, 2, 3, 4].find((i) => !solvedQuestions.has(i)) ?? 4;
    const prevActiveIdx = s.activeQuestionIdx;
    s.activeQuestionIdx = nextActiveIdx;

    if (solvedQuestions.size > 0) {
      const p = s.player;
      p.shield = Math.min(p.maxShield, p.shield + 45);
      p.hp = Math.min(p.maxHp, p.hp + 25);
      p.stamina = p.maxStamina;
      s.keys.left = false;
      s.keys.right = false;
      s.keys.jump = false;
      s.keys.crouch = false;
      s.keys.sprint = false;
      s.keys.deflect = false;
      s.keys.interact = false;
      sounds.playCorrect();

      if (subStage.id === 5) {
        const boss = s.enemyBases.find((b) => b.type === 'boss-fortress');
        if (boss) {
          boss.hp = Math.max(0, boss.maxHp * (1 - solvedQuestions.size / 5));
          createExplosion(boss.x + boss.width / 2, boss.y + boss.height / 2, '#ec4899', 45);
        }
      }
    }

    if (solvedQuestions.size < 5 && nextActiveIdx !== prevActiveIdx) {
      // Fresh 6-hit shield budget and escalated alien fleet wave for the newly unlocked question!
      s.hitsTaken = 0;
      s.bullets = [];
      spawnWaveForQuestion(nextActiveIdx, false);
    }

    if (solvedQuestions.size === 5 && !s.isVictoryTriggered) {
      s.isVictoryTriggered = true;
      sounds.playVictory();
      setTimeout(() => {
        onStageVictory(s.score + 750);
      }, 1400);
    }
  }, [solvedQuestions, subStage, onStageVictory, createExplosion, spawnWaveForQuestion]);

  const triggerDeflectorSwing = useCallback(() => {
    const p = stateRef.current.player;
    p.isSwingingDeflector = true;
    p.swingProgress = 0;
    sounds.playShield();
  }, []);

  const triggerKineticPulse = useCallback(() => {
    const s = stateRef.current;
    const p = s.player;
    if (p.pulseCooldownTimer > 0) return;

    p.pulseCooldownTimer = 5.5;
    sounds.playPulse();
    s.screenShake = 14;

    createExplosion(p.x + p.width / 2, p.y + p.height / 2, '#00f5ff', 50);

    for (const b of s.bullets) {
      const dist = Math.hypot(b.x - (p.x + p.width / 2), b.y - (p.y + p.height / 2));
      if (!b.isPlayer && dist < 280) {
        b.vx = -b.vx * 1.8;
        b.vy = -b.vy * 1.8;
        b.isPlayer = true;
        b.isDeflected = true;
        b.color = '#00f5ff';
        b.damage = 70;
      }
    }

    for (const base of s.enemyBases) {
      const dist = Math.hypot(base.x - p.x, base.y - p.y);
      if (dist < 300 && !base.isDestroyed) {
        base.hp -= 45;
        createExplosion(base.x + base.width / 2, base.y + base.height / 2, '#00f5ff', 20);
      }
    }

    for (const unit of s.spaceUnits) {
      const dist = Math.hypot(unit.x - (p.x + p.width / 2), unit.y - (p.y + p.height / 2));
      if (dist < 320 && !unit.isDestroyed) {
        unit.hp -= 55;
        unit.hitFlash = 0.25;
        createExplosion(unit.x, unit.y, unit.color, 20);
        if (unit.hp <= 0) {
          unit.isDestroyed = true;
          createExplosion(unit.x, unit.y, unit.color, 36);
          sounds.playExplosion();
          s.score += 140;
          addFloatingText(unit.x, unit.y - 16, '+140 PTS (Pulse Kill!)', '#00f5ff');
        }
      }
    }

    for (const obs of s.obstacles) {
      const dist = Math.hypot(obs.x - p.x, obs.y - p.y);
      if (dist < 300 && !obs.isDestroyed) {
        obs.hp -= 60;
        createExplosion(obs.x, obs.y, obs.color, 18);
        if (obs.hp <= 0) {
          obs.isDestroyed = true;
          createExplosion(obs.x, obs.y, obs.color, 30);
          sounds.playExplosion();
          s.score += obs.points;
          addFloatingText(obs.x, obs.y - 20, `+${obs.points} PTS (Kinetic Blast!)`, '#00f5ff');
        }
      }
    }
  }, [addFloatingText, createExplosion]);

  const triggerEmpJammer = useCallback(() => {
    const s = stateRef.current;
    const p = s.player;
    if (p.empCooldownTimer > 0) return;

    p.empCooldownTimer = 10.0;
    sounds.playEmp();
    s.screenShake = 9;

    for (const base of s.enemyBases) {
      if (!base.isDestroyed) {
        base.isJammed = true;
        base.jamTimer = 4.8;
        createExplosion(base.x + base.width / 2, base.y + base.height / 2, '#a855f7', 28);
      }
    }

    for (const unit of s.spaceUnits) {
      if (!unit.isDestroyed) {
        unit.isJammed = true;
        unit.jamTimer = 4.8;
        createExplosion(unit.x, unit.y, '#a855f7', 22);
      }
    }
  }, [createExplosion]);

  const triggerQuantumBarrier = useCallback(() => {
    const s = stateRef.current;
    const p = s.player;
    if (p.quantumCooldownTimer > 0) return;

    p.quantumCooldownTimer = 13.0;
    p.isQuantumShieldActive = true;
    p.quantumDuration = 4.0;
    sounds.playShield();
  }, []);

  const toggleSprintLatch = useCallback(() => {
    const s = stateRef.current;
    s.sprintLatch = !s.sprintLatch;
    setSprintLatchUI(s.sprintLatch);
    if (s.sprintLatch && !s.player.sprintExhaustedLock) {
      sounds.playSprintBurst();
    } else {
      sounds.playClick();
    }
  }, []);

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      containerRef.current?.requestFullscreen().catch(() => {});
      setIsFullscreen(true);
    } else {
      document.exitFullscreen().catch(() => {});
      setIsFullscreen(false);
    }
  };

  // 60 FPS Simulation & Render Loop
  useEffect(() => {
    let animationFrameId: number;
    let lastTime = performance.now();

    const restartCurrentQuestionAttempt = () => {
      const s = stateRef.current;
      const p = s.player;
      sounds.playStageReset();
      s.screenShake = 20;
      s.hitsTaken = 0;
      s.hitInvulnTimer = 1.0;
      s.hitFlashTimer = 0.55;
      s.restartBannerTimer = 3.2;
      s.bullets = [];
      s.sprintAfterimages = [];

      const qIdx = s.activeQuestionIdx;
      const checkpointX = qIdx === 0 ? 120 : (s.stations[qIdx - 1]?.barrierX ?? 120) + 35;

      p.x = checkpointX;
      p.y = GROUND_Y - p.height;
      p.vx = 0;
      p.vy = 0;
      p.hp = p.maxHp;
      p.shield = p.maxShield;
      p.stamina = p.maxStamina;
      p.sprintExhaustedLock = false;
      p.isSprinting = false;

      createExplosion(p.x + p.width / 2, p.y + p.height / 2, '#ef4444', 36);
      addFloatingText(
        p.x + p.width / 2,
        p.y - 30,
        `7th Hit! Restarting Q${qIdx + 1} Sector`,
        '#f43f5e'
      );
      spawnWaveForQuestion(qIdx, true);
    };

    const registerEnemyHitOnPlayer = (damageAmount: number) => {
      const s = stateRef.current;
      const p = s.player;
      if (s.hitInvulnTimer > 0 || s.isVictoryTriggered || s.isGameOverTriggered) return;

      const pCenterX = p.x + p.width / 2;
      const pCenterY = p.y + (p.isCrouching ? 24 : 39);

      s.hitsTaken += 1;
      s.hitInvulnTimer = HIT_INVULNERABILITY_SECONDS;
      s.hitFlashTimer = 0.36;
      s.screenShake = 13;

      createExplosion(pCenterX, pCenterY, '#ef4444', 18);

      if (s.hitsTaken > MAX_ALLOWED_HITS) {
        restartCurrentQuestionAttempt();
        return;
      }

      sounds.playHitAlert(s.hitsTaken, MAX_ALLOWED_HITS);
      if (p.shield > 0) {
        p.shield = Math.max(0, p.shield - Math.min(p.shield, damageAmount * 0.75));
      } else {
        const proportionalLoss = Math.max(8, Math.floor(p.maxHp / (MAX_ALLOWED_HITS + 1)));
        p.hp = Math.max(12, p.hp - proportionalLoss);
      }

      addFloatingText(
        pCenterX,
        p.y - 26,
        `Hit ${s.hitsTaken}/${MAX_ALLOWED_HITS}!`,
        s.hitsTaken >= MAX_ALLOWED_HITS ? '#f43f5e' : '#fbbf24'
      );
    };

    const loop = (currentTime: number) => {
      const rawDt = (currentTime - lastTime) / 1000;
      lastTime = currentTime;
      const dt = Math.min(rawDt, 0.05);

      const canvas = canvasRef.current;
      if (!canvas) {
        animationFrameId = requestAnimationFrame(loop);
        return;
      }
      const ctx = canvas.getContext('2d');
      if (!ctx) {
        animationFrameId = requestAnimationFrame(loop);
        return;
      }

      const s = stateRef.current;
      const {
        player,
        keys,
        touchInput,
        mouse,
        bullets,
        enemyBases,
        spaceUnits,
        obstacles,
        floatingTexts,
        stations,
        platforms,
        particles,
        sprintAfterimages,
        aiNeuralPackets,
      } = s;
      s.backgroundTimer += dt;

      if (s.hitInvulnTimer > 0) s.hitInvulnTimer = Math.max(0, s.hitInvulnTimer - dt);
      if (s.hitFlashTimer > 0) s.hitFlashTimer = Math.max(0, s.hitFlashTimer - dt);
      if (s.restartBannerTimer > 0) s.restartBannerTimer = Math.max(0, s.restartBannerTimer - dt);
      if (s.waveBannerTimer > 0) s.waveBannerTimer = Math.max(0, s.waveBannerTimer - dt);

      if (typeof navigator !== 'undefined' && navigator.getGamepads) {
        const gamepads = navigator.getGamepads();
        const gp = gamepads[0] || gamepads[1];
        if (gp) {
          if (!s.gamepadConnected) {
            s.gamepadConnected = true;
            s.gamepadName = gp.id.slice(0, 24);
          }

          const axisX = gp.axes[0];
          const axisY = gp.axes[1];

          keys.left = axisX < -0.25 || Boolean(gp.buttons[14]?.pressed);
          keys.right = axisX > 0.25 || Boolean(gp.buttons[15]?.pressed);
          keys.sprint = Boolean(gp.buttons[5]?.pressed || gp.buttons[10]?.pressed);

          if (gp.buttons[0]?.pressed || axisY < -0.45 || gp.buttons[12]?.pressed) {
            keys.jump = true;
          }

          keys.crouch = axisY > 0.45 || Boolean(gp.buttons[13]?.pressed);

          if (gp.buttons[1]?.pressed || gp.buttons[2]?.pressed || gp.buttons[7]?.pressed) {
            triggerDeflectorSwing();
          }

          if (gp.buttons[3]?.pressed) triggerKineticPulse();
          if (gp.buttons[4]?.pressed) triggerEmpJammer();
          if (gp.buttons[6]?.pressed) triggerQuantumBarrier();

          if (gp.buttons[9]?.pressed || (gp.buttons[2]?.pressed && nearStationIndex !== null)) {
            keys.interact = true;
          }

          const rightAxisX = gp.axes[2];
          const rightAxisY = gp.axes[3];
          if (Math.hypot(rightAxisX, rightAxisY) > 0.28) {
            player.aimAngle = Math.atan2(rightAxisY, rightAxisX);
          }
        }
      }

      if (player.pulseCooldownTimer > 0) player.pulseCooldownTimer = Math.max(0, player.pulseCooldownTimer - dt);
      if (player.empCooldownTimer > 0) player.empCooldownTimer = Math.max(0, player.empCooldownTimer - dt);
      if (player.quantumCooldownTimer > 0) player.quantumCooldownTimer = Math.max(0, player.quantumCooldownTimer - dt);

      if (player.isQuantumShieldActive) {
        player.quantumDuration -= dt;
        player.shield = Math.min(player.maxShield, player.shield + dt * 20);
        if (player.quantumDuration <= 0) {
          player.isQuantumShieldActive = false;
        }
      }

      let moveDir = 0;
      if (keys.left) moveDir -= 1;
      if (keys.right) moveDir += 1;

      if (touchInput.isActive) {
        moveDir = touchInput.moveX;
        if (touchInput.moveY < -0.45 && player.isGrounded) {
          keys.jump = true;
        }
        if (touchInput.moveY > 0.45) {
          player.isCrouching = true;
        }
      }

      if (moveDir > 0.15) {
        player.facing = 1;
      } else if (moveDir < -0.15) {
        player.facing = -1;
      }

      player.isCrouching = (keys.crouch || (touchInput.isActive && touchInput.moveY > 0.45)) && player.isGrounded;

      // Balanced Walk / Sprint state & Stamina system
      const isMovingHoriz = Math.abs(moveDir) > 0.1;
      const wantsSprint = (keys.sprint || s.sprintLatch) && isMovingHoriz && !player.isCrouching;

      if (wantsSprint && !player.sprintExhaustedLock && player.stamina > 0) {
        player.isSprinting = true;
        player.stamina = Math.max(0, player.stamina - PLAYER_MOVEMENT_CONFIG.staminaDrainPerSec * dt);
        if (!player.wasSprinting) {
          sounds.playSprintBurst();
        }
        if (player.stamina <= 0) {
          player.sprintExhaustedLock = true;
          player.isSprinting = false;
          if (s.sprintLatch) {
            s.sprintLatch = false;
            setSprintLatchUI(false);
          }
        }
      } else {
        player.isSprinting = false;
        const regenRate = isMovingHoriz
          ? PLAYER_MOVEMENT_CONFIG.staminaRegenWalkPerSec
          : PLAYER_MOVEMENT_CONFIG.staminaRegenIdlePerSec;
        player.stamina = Math.min(player.maxStamina, player.stamina + regenRate * dt);
        if (player.sprintExhaustedLock && player.stamina >= PLAYER_MOVEMENT_CONFIG.sprintResumeThreshold) {
          player.sprintExhaustedLock = false;
        }
      }
      player.wasSprinting = player.isSprinting;

      const movementMultiplier = player.isCrouching
        ? PLAYER_MOVEMENT_CONFIG.crouchMultiplier
        : player.isSprinting
        ? PLAYER_MOVEMENT_CONFIG.sprintMultiplier
        : 1.0;

      const currentSpeed = player.speed * movementMultiplier;
      if (isMovingHoriz) {
        player.vx = moveDir * currentSpeed;
        if (player.isGrounded) {
          player.walkCycle += dt * (player.isSprinting ? 21 : 14);
          if ((player.isSprinting || hasSpeedPerk) && Math.random() < (player.isSprinting ? 0.45 : 0.25)) {
            createExplosion(
              player.x + (player.facing === 1 ? -6 : player.width + 6),
              player.y + player.height - 4,
              player.isSprinting ? '#00f5ff' : '#facc15',
              2
            );
          }
        }
      } else {
        player.vx *= 0.75;
        player.walkCycle = 0;
      }

      if (player.isSprinting) {
        s.sprintTrailTimer += dt;
        if (s.sprintTrailTimer >= 0.045) {
          s.sprintTrailTimer = 0;
          sprintAfterimages.push({
            x: player.x + player.width / 2,
            y: player.y + (player.isCrouching ? 24 : 39),
            facing: player.facing,
            crouching: player.isCrouching,
            life: 0,
            maxLife: 0.24,
          });
        }
      }

      for (let i = sprintAfterimages.length - 1; i >= 0; i--) {
        sprintAfterimages[i].life += dt;
        if (sprintAfterimages[i].life >= sprintAfterimages[i].maxLife) {
          sprintAfterimages.splice(i, 1);
        }
      }

      if (keys.jump) {
        keys.jump = false;
        if (player.isGrounded) {
          player.vy = -14.4;
          player.isGrounded = false;
          player.canDoubleJump = hasDoubleJumpPerk;
          sounds.playJump();
        } else if (player.canDoubleJump) {
          player.vy = -13.0;
          player.canDoubleJump = false;
          sounds.playJump();
          createExplosion(player.x + player.width / 2, player.y + player.height, '#00f5ff', 12);
        }
      }

      player.vy += 0.62;
      if (player.vy > 15) player.vy = 15;

      // Sub-stepped horizontal integration for solid collision stability while sprinting
      const playerEffectiveHeight = player.isCrouching ? 48 : player.height;
      const stepsX = Math.max(1, Math.ceil(Math.abs(player.vx) / 8));
      const stepVx = player.vx / stepsX;
      for (let step = 0; step < stepsX; step++) {
        player.x += stepVx;

        for (const st of stations) {
          if (!st.isSolved && player.x + player.width > st.barrierX) {
            player.x = st.barrierX - player.width;
            player.vx = 0;
          }
        }

        for (const obs of obstacles) {
          if (obs.isDestroyed || obs.type !== 'shield-barricade') continue;
          const overlapsY =
            player.y + playerEffectiveHeight > obs.y - obs.height / 2 + 6 &&
            player.y < obs.y + obs.height / 2;
          if (!overlapsY) continue;
          if (
            stepVx > 0 &&
            player.x + player.width > obs.x - obs.width / 2 &&
            player.x < obs.x
          ) {
            player.x = obs.x - obs.width / 2 - player.width;
            player.vx = 0;
          } else if (
            stepVx < 0 &&
            player.x < obs.x + obs.width / 2 &&
            player.x + player.width > obs.x
          ) {
            player.x = obs.x + obs.width / 2;
            player.vx = 0;
          }
        }
      }

      player.y += player.vy;

      player.isGrounded = false;
      for (const p of platforms) {
        const isWithinX = player.x + player.width > p.x && player.x < p.x + p.width;
        if (isWithinX) {
          if (player.y + playerEffectiveHeight >= p.y && player.y + playerEffectiveHeight - player.vy <= p.y + 16) {
            player.y = p.y - playerEffectiveHeight;
            player.vy = 0;
            player.isGrounded = true;
            player.canDoubleJump = hasDoubleJumpPerk;
            break;
          }
        }
      }

      player.x = Math.max(20, Math.min(TRACK_LENGTH - 80, player.x));
      if (player.y > GROUND_Y - playerEffectiveHeight) {
        player.y = GROUND_Y - playerEffectiveHeight;
        player.vy = 0;
        player.isGrounded = true;
      }

      const { viewW, viewH, dpr, cameraScale, worldViewWidth, worldViewHeight } = viewportRef.current;
      const lookAheadRatio = player.facing === 1 ? 0.23 : 0.35;
      const targetCamX = player.x - worldViewWidth * lookAheadRatio;
      s.cameraX += (targetCamX - s.cameraX) * 0.11;
      s.cameraX = Math.max(0, Math.min(Math.max(0, TRACK_LENGTH - worldViewWidth), s.cameraX));

      const playerCenterX = player.x + player.width / 2;
      const playerCenterY = player.y + playerEffectiveHeight / 2;

      const bottomCamY = GROUND_Y + 52 - worldViewHeight;
      const desiredCamY = playerCenterY - worldViewHeight * 0.56;
      const minCamY = Math.min(-25, bottomCamY);
      const targetCamY = Math.min(bottomCamY, Math.max(minCamY, desiredCamY));
      s.cameraY += (targetCamY - s.cameraY) * 0.14;

      const visibleLeft = s.cameraX;
      const visibleRight = s.cameraX + worldViewWidth;
      const visibleTop = s.cameraY;
      const visibleBottom = s.cameraY + worldViewHeight;

      const aimCandidates: { x: number; y: number; radius: number; name: string; priority: number }[] = [];
      for (const unit of spaceUnits) {
        if (unit.isDestroyed) continue;
        const isVisibleUnit =
          unit.x >= visibleLeft - 24 &&
          unit.x <= visibleRight + 24 &&
          unit.y >= visibleTop - 24 &&
          unit.y <= visibleBottom + 24;
        if (!isVisibleUnit) continue;
        const d = Math.hypot(unit.x - playerCenterX, unit.y - playerCenterY);
        aimCandidates.push({
          x: unit.x,
          y: unit.y,
          radius: Math.max(unit.width, unit.height) * 0.65,
          name: unit.name,
          priority: d * 0.72,
        });
      }
      for (const base of enemyBases) {
        if (base.isDestroyed) continue;
        const bx = base.x + base.width / 2;
        const by = base.y + base.height / 2;
        const isVisibleTarget =
          bx >= visibleLeft - 12 &&
          bx <= visibleRight + 12 &&
          by >= visibleTop - 12 &&
          by <= visibleBottom + 12;
        if (!isVisibleTarget) continue;
        const d = Math.hypot(bx - playerCenterX, by - playerCenterY);
        aimCandidates.push({
          x: bx,
          y: by,
          radius: Math.max(base.width, base.height) * 0.62,
          name: base.name,
          priority: d * (base.type === 'boss-fortress' ? 0.7 : 0.78),
        });
      }
      for (const obs of obstacles) {
        if (obs.isDestroyed) continue;
        const isVisibleObs =
          obs.x >= visibleLeft - 10 &&
          obs.x <= visibleRight + 10 &&
          obs.y >= visibleTop - 10 &&
          obs.y <= visibleBottom + 10;
        if (!isVisibleObs) continue;
        const d = Math.hypot(obs.x - playerCenterX, obs.y - playerCenterY);
        aimCandidates.push({
          x: obs.x,
          y: obs.y,
          radius: Math.max(obs.width, obs.height) * 0.65,
          name: obs.type === 'cyber-mine' ? 'Cyber Mine' : obs.type === 'shield-barricade' ? 'Shield Barricade' : 'Energy Prism',
          priority: d * 1.18,
        });
      }
      aimCandidates.sort((a, b) => a.priority - b.priority);

      let gamepadAimApplied = false;
      if (s.gamepadConnected && typeof navigator !== 'undefined' && navigator.getGamepads) {
        const gamepads = navigator.getGamepads();
        const activeGp = gamepads[0] || gamepads[1];
        if (activeGp && activeGp.axes && activeGp.axes.length >= 4) {
          const rx = activeGp.axes[2];
          const ry = activeGp.axes[3];
          if (Math.hypot(rx, ry) > 0.28) {
            player.aimAngle = Math.atan2(ry, rx);
            gamepadAimApplied = true;
          }
        }
      }

      s.lockedTarget = null;
      if (!gamepadAimApplied) {
        if (s.autoAimFire) {
          if (aimCandidates.length > 0) {
            const best = aimCandidates[0];
            s.lockedTarget = { x: best.x, y: best.y, radius: best.radius, name: best.name };
            player.aimAngle = Math.atan2(best.y - playerCenterY, best.x - playerCenterX);
          } else {
            player.aimAngle = player.facing === 1 ? 0 : Math.PI;
          }
        } else {
          const rawAngle = Math.atan2(mouse.worldY - playerCenterY, mouse.worldX - playerCenterX);
          const assistCone = s.isTouchDevice || touchInput.aimTouchId !== null ? 0.48 : 0.22;

          let bestMagnetic: (typeof aimCandidates)[0] | null = null;
          let bestScore = Infinity;

          for (const cand of aimCandidates) {
            const candAngle = Math.atan2(cand.y - playerCenterY, cand.x - playerCenterX);
            let diff = Math.abs(rawAngle - candAngle);
            if (diff > Math.PI) diff = Math.PI * 2 - diff;
            if (diff <= assistCone) {
              const score = diff * 250 + Math.hypot(cand.x - playerCenterX, cand.y - playerCenterY) * 0.15;
              if (score < bestScore) {
                bestScore = score;
                bestMagnetic = cand;
              }
            }
          }

          if (bestMagnetic) {
            s.lockedTarget = {
              x: bestMagnetic.x,
              y: bestMagnetic.y,
              radius: bestMagnetic.radius,
              name: bestMagnetic.name,
            };
            player.aimAngle = Math.atan2(bestMagnetic.y - playerCenterY, bestMagnetic.x - playerCenterX);
          } else {
            player.aimAngle = rawAngle;
            if (aimCandidates.length > 0 && !mouse.down) {
              const nearest = aimCandidates[0];
              s.lockedTarget = {
                x: nearest.x,
                y: nearest.y,
                radius: nearest.radius,
                name: nearest.name,
              };
            }
          }
        }
      }

      if (player.isSwingingDeflector) {
        player.swingProgress += dt * 10;
        if (player.swingProgress >= 1) {
          player.isSwingingDeflector = false;
          player.swingProgress = 0;
        }
      }

      if (keys.deflect) {
        keys.deflect = false;
        triggerDeflectorSwing();
      }

      if (player.shield < player.maxShield) {
        player.shield = Math.min(player.maxShield, player.shield + dt * 6);
      }

      player.shootCooldown -= dt;
      if ((mouse.down || s.autoAimFire) && player.shootCooldown <= 0) {
        const speed = weapon.projectileSpeed * 1.65;
        const totalDamage = weapon.damage * (1 + skillBonus.damageBonus);

        if (hasTriplePerk) {
          [-0.14, 0, 0.14].forEach((offset) => {
            const angle = player.aimAngle + offset;
            bullets.push({
              x: playerCenterX + Math.cos(angle) * 30,
              y: playerCenterY + Math.sin(angle) * 30,
              vx: Math.cos(angle) * speed,
              vy: Math.sin(angle) * speed,
              isPlayer: true,
              damage: totalDamage * 0.85,
              color: weapon.color,
              radius: 7.5,
              type: 'plasma',
            });
          });
        } else {
          bullets.push({
            x: playerCenterX + Math.cos(player.aimAngle) * 30,
            y: playerCenterY + Math.sin(player.aimAngle) * 30,
            vx: Math.cos(player.aimAngle) * speed,
            vy: Math.sin(player.aimAngle) * speed,
            isPlayer: true,
            damage: totalDamage,
            color: weapon.color,
            radius: weapon.bulletType === 'quantum' ? 8.5 : 7,
            type: weapon.bulletType as 'plasma' | 'laser' | 'quantum',
          });
        }

        sounds.playShoot(weapon.bulletType);
        player.shootCooldown = weapon.fireRate / 1000;
      }

      const stageDiff = subStage.id;
      const activeQNum = Math.max(1, Math.min(5, s.activeQuestionIdx + 1));
      const escalationTier = getEscalationForQuestion(activeQNum);
      const enemyAggroRange = Math.min(780, worldViewWidth * 0.95);

      // Dynamic Alien/Spacecraft Squadron per active Question Index
      let activeShipsAlive = 0;
      for (const unit of spaceUnits) {
        if (unit.isDestroyed) continue;
        activeShipsAlive++;

        if (unit.hitFlash > 0) unit.hitFlash = Math.max(0, unit.hitFlash - dt);

        if (unit.isJammed) {
          unit.jamTimer -= dt;
          if (unit.jamTimer <= 0) unit.isJammed = false;
          continue;
        }

        const t = s.backgroundTimer + unit.phase;
        if (unit.flightPattern === 'sine-patrol') {
          unit.x = unit.anchorX + Math.sin(t * 1.45) * 95;
          unit.y = unit.anchorY + Math.cos(t * 2.1) * 36;
        } else if (unit.flightPattern === 'figure-eight') {
          unit.x = unit.anchorX + Math.sin(t * 1.3) * 110;
          unit.y = unit.anchorY + Math.sin(t * 2.6) * 44;
        } else if (unit.flightPattern === 'swoop-dive') {
          unit.x = unit.anchorX + Math.cos(t * 1.15) * 120;
          unit.y = unit.anchorY + Math.abs(Math.sin(t * 1.25)) * 88 - 22;
        } else {
          // orbital-strafe tracks slowly toward sector skirmish range
          const orbitCenterX = unit.anchorX + Math.sin(t * 0.5) * 65;
          unit.x = orbitCenterX + Math.cos(t * 2.4) * 78;
          unit.y = unit.anchorY + Math.sin(t * 2.4) * 52;
        }
        unit.y = Math.max(65, Math.min(GROUND_Y - 125, unit.y));
        unit.barrelAngle = Math.atan2(playerCenterY - unit.y, playerCenterX - unit.x);

        const isUnitOnScreen =
          unit.x + unit.width * 0.5 >= visibleLeft - 30 &&
          unit.x - unit.width * 0.5 <= visibleRight + 30 &&
          unit.y >= visibleTop - 30 &&
          unit.y <= visibleBottom + 30;
        const distToPlayer = Math.hypot(playerCenterX - unit.x, playerCenterY - unit.y);

        if (isUnitOnScreen && distToPlayer < enemyAggroRange) {
          unit.shootCooldown -= dt;
          if (unit.shootCooldown <= 0) {
            const pattern = unit.patterns[unit.shotCounter % unit.patterns.length];
            unit.shotCounter++;
            const baseProjSpeed =
              (hasSlowMoPerk ? 4.4 : 6.0) * escalationTier.projectileSpeedMultiplier;

            if (pattern === 'straight') {
              bullets.push({
                x: unit.x + Math.cos(unit.barrelAngle) * 24,
                y: unit.y + Math.sin(unit.barrelAngle) * 24,
                vx: Math.cos(unit.barrelAngle) * (baseProjSpeed * 1.15),
                vy: Math.sin(unit.barrelAngle) * (baseProjSpeed * 1.15),
                isPlayer: false,
                damage: 15,
                color: '#38bdf8',
                radius: 6.5,
                type: 'laser',
                pattern: 'straight',
                age: 0,
              });
            } else if (pattern === 'homing') {
              bullets.push({
                x: unit.x + Math.cos(unit.barrelAngle) * 22,
                y: unit.y + Math.sin(unit.barrelAngle) * 22,
                vx: Math.cos(unit.barrelAngle) * (baseProjSpeed * 0.65),
                vy: Math.sin(unit.barrelAngle) * (baseProjSpeed * 0.65),
                isPlayer: false,
                damage: 18,
                color: '#fb923c',
                radius: 8,
                type: 'missile',
                pattern: 'homing',
                age: 0,
              });
            } else if (pattern === 'wave-spread') {
              [-0.22, 0, 0.22].forEach((offset, idx) => {
                const a = unit.barrelAngle + offset;
                bullets.push({
                  x: unit.x + Math.cos(a) * 22,
                  y: unit.y + Math.sin(a) * 22,
                  vx: Math.cos(a) * (baseProjSpeed * 0.92),
                  vy: Math.sin(a) * (baseProjSpeed * 0.92),
                  isPlayer: false,
                  damage: 14,
                  color: '#c084fc',
                  radius: 6.5,
                  type: 'plasma',
                  pattern: 'wave-spread',
                  wavePhase: idx * 1.1,
                  age: 0,
                });
              });
            } else if (pattern === 'splitter') {
              bullets.push({
                x: unit.x + Math.cos(unit.barrelAngle) * 24,
                y: unit.y + Math.sin(unit.barrelAngle) * 24,
                vx: Math.cos(unit.barrelAngle) * (baseProjSpeed * 0.88),
                vy: Math.sin(unit.barrelAngle) * (baseProjSpeed * 0.88),
                isPlayer: false,
                damage: 16,
                color: '#fb7185',
                radius: 8.5,
                type: 'quantum',
                pattern: 'splitter',
                age: 0,
                hasSplit: false,
              });
            } else if (pattern === 'orbital-burst') {
              [-0.36, -0.18, 0, 0.18, 0.36].forEach((offset) => {
                const a = unit.barrelAngle + offset;
                bullets.push({
                  x: unit.x + Math.cos(a) * 24,
                  y: unit.y + Math.sin(a) * 24,
                  vx: Math.cos(a) * (baseProjSpeed * 1.02),
                  vy: Math.sin(a) * (baseProjSpeed * 1.02),
                  isPlayer: false,
                  damage: 16,
                  color: '#f472b6',
                  radius: 6.5,
                  type: 'plasma',
                  pattern: 'orbital-burst',
                  age: 0,
                });
              });
            }

            unit.shootCooldown = unit.maxShootCooldown;
          }
        }
      }

      // If all squadron ships in current question are cleared before solving, send 1 reinforcement wave after cooldown
      if (
        spaceUnits.length > 0 &&
        activeShipsAlive === 0 &&
        !stations[s.activeQuestionIdx]?.isSolved &&
        s.waveReinforcementsUsed < 1
      ) {
        s.waveRespawnTimer += dt;
        if (s.waveRespawnTimer >= 4.5) {
          s.waveReinforcementsUsed += 1;
          s.waveRespawnTimer = 0;
          spawnWaveForQuestion(s.activeQuestionIdx, false);
        }
      }

      // Enemy bases only fire when clearly visible inside viewport
      for (const base of enemyBases) {
        if (base.isDestroyed) continue;

        if (base.isJammed) {
          base.jamTimer -= dt;
          if (base.jamTimer <= 0) {
            base.isJammed = false;
          }
          continue;
        }

        if (base.type === 'patrol-drone') {
          base.x += Math.sin(s.backgroundTimer * 1.8 + base.id) * 1.8;
          base.y += Math.cos(s.backgroundTimer * 2.5 + base.id) * 0.9;
        }

        const baseCenterX = base.x + base.width / 2;
        const baseCenterY = base.y + base.height / 2;

        base.barrelAngle = Math.atan2(playerCenterY - baseCenterY, playerCenterX - baseCenterX);

        const isBaseOnScreen =
          base.x + base.width * 0.65 >= visibleLeft &&
          base.x + base.width * 0.35 <= visibleRight &&
          base.y + base.height * 0.65 >= visibleTop &&
          base.y + base.height * 0.35 <= visibleBottom;

        const distToPlayer = Math.hypot(playerCenterX - baseCenterX, playerCenterY - baseCenterY);
        if (isBaseOnScreen && distToPlayer < enemyAggroRange) {
          base.shootCooldown -= dt;
          if (base.shootCooldown <= 0) {
            const stageSpeedBoost = 1 + (stageDiff - 1) * 0.08 + (activeQNum - 1) * 0.05;
            const bulletSpeed = (hasSlowMoPerk ? 4.8 : 6.4) * stageSpeedBoost;

            if (base.type === 'ground-cannon') {
              const burstAngles = stageDiff >= 3 || activeQNum >= 3 ? [-0.11, 0.11] : [0];
              burstAngles.forEach((off) => {
                const a = base.barrelAngle + off;
                bullets.push({
                  x: baseCenterX + Math.cos(a) * 28,
                  y: baseCenterY + Math.sin(a) * 28,
                  vx: Math.cos(a) * bulletSpeed,
                  vy: Math.sin(a) * bulletSpeed,
                  isPlayer: false,
                  damage: 14 + stageDiff * 2,
                  color: '#fbbf24',
                  radius: 6,
                  type: 'plasma',
                });
              });
            } else if (base.type === 'ceiling-laser') {
              const laserAngles = stageDiff >= 4 || activeQNum >= 4 ? [-0.14, 0, 0.14] : [0];
              laserAngles.forEach((off) => {
                const a = base.barrelAngle + off;
                bullets.push({
                  x: baseCenterX,
                  y: baseCenterY + 24,
                  vx: Math.cos(a) * (bulletSpeed * 1.2),
                  vy: Math.sin(a) * (bulletSpeed * 1.2),
                  isPlayer: false,
                  damage: 14 + stageDiff * 2,
                  color: '#22d3ee',
                  radius: 5.5,
                  type: 'laser',
                });
              });
            } else if (base.type === 'missile-tower') {
              bullets.push({
                x: baseCenterX,
                y: base.y - 12,
                vx: Math.cos(base.barrelAngle) * (4.1 * stageSpeedBoost),
                vy: Math.sin(base.barrelAngle) * (4.1 * stageSpeedBoost),
                isPlayer: false,
                damage: 24 + stageDiff * 3,
                color: '#fb923c',
                radius: 8,
                type: 'missile',
                pattern: 'homing',
                age: 0,
                targetX: playerCenterX,
                targetY: playerCenterY,
              });
            } else if (base.type === 'patrol-drone') {
              [-0.09, 0.09].forEach((off) => {
                const a = base.barrelAngle + off;
                bullets.push({
                  x: baseCenterX,
                  y: baseCenterY,
                  vx: Math.cos(a) * bulletSpeed,
                  vy: Math.sin(a) * bulletSpeed,
                  isPlayer: false,
                  damage: 12 + stageDiff * 2,
                  color: '#c084fc',
                  radius: 5.8,
                  type: 'plasma',
                });
              });
            } else if (base.type === 'boss-fortress') {
              [-0.3, -0.15, 0, 0.15, 0.3].forEach((offset) => {
                const angle = base.barrelAngle + offset;
                bullets.push({
                  x: base.x,
                  y: baseCenterY,
                  vx: Math.cos(angle) * (bulletSpeed * 1.08),
                  vy: Math.sin(angle) * (bulletSpeed * 1.08),
                  isPlayer: false,
                  damage: 22,
                  color: '#f472b6',
                  radius: 7.5,
                  type: 'plasma',
                });
              });
            }

            base.shootCooldown = (base.maxShootCooldown / 60) * escalationTier.fireRateMultiplier;
          }
        }
      }

      for (let i = bullets.length - 1; i >= 0; i--) {
        const b = bullets[i];
        b.age = (b.age || 0) + dt;

        if ((b.type === 'missile' || b.pattern === 'homing') && !b.isPlayer) {
          // Deliberate gentle seeker steering so player can dodge or deflect
          if (b.age < 2.8) {
            const steerAngle = Math.atan2(playerCenterY - b.y, playerCenterX - b.x);
            b.vx += Math.cos(steerAngle) * 0.11;
            b.vy += Math.sin(steerAngle) * 0.11;
          }
          const mag = Math.hypot(b.vx, b.vy);
          const maxSeekerSpeed = 4.6;
          if (mag > maxSeekerSpeed) {
            b.vx = (b.vx / mag) * maxSeekerSpeed;
            b.vy = (b.vy / mag) * maxSeekerSpeed;
          }
        } else if (b.pattern === 'wave-spread' && !b.isPlayer) {
          const perpAngle = Math.atan2(b.vy, b.vx) + Math.PI / 2;
          const waveShift = Math.sin(b.age * 10 + (b.wavePhase || 0)) * 1.2;
          b.x += Math.cos(perpAngle) * waveShift;
          b.y += Math.sin(perpAngle) * waveShift;
        } else if (b.pattern === 'splitter' && !b.isPlayer && !b.hasSplit && b.age >= 0.62) {
          b.hasSplit = true;
          const baseAng = Math.atan2(b.vy, b.vx);
          const baseSpd = Math.hypot(b.vx, b.vy) || 5.2;
          [-0.42, 0.42].forEach((off) => {
            bullets.push({
              x: b.x,
              y: b.y,
              vx: Math.cos(baseAng + off) * (baseSpd * 1.08),
              vy: Math.sin(baseAng + off) * (baseSpd * 1.08),
              isPlayer: false,
              damage: 14,
              color: '#fda4af',
              radius: 5.5,
              type: 'laser',
              age: 0,
            });
          });
          createExplosion(b.x, b.y, '#fb7185', 8);
        }

        b.x += b.vx;
        b.y += b.vy;

        if (b.x < 0 || b.x > TRACK_LENGTH || b.y < -120 || b.y > GROUND_Y + 140) {
          bullets.splice(i, 1);
          continue;
        }

        if (b.isPlayer) {
          let hit = false;
          const pad = b.radius + 7;

          for (const unit of spaceUnits) {
            if (unit.isDestroyed) continue;
            if (
              Math.abs(b.x - unit.x) < unit.width / 2 + pad &&
              Math.abs(b.y - unit.y) < unit.height / 2 + pad
            ) {
              unit.hp -= b.damage;
              unit.hitFlash = 0.16;
              createExplosion(b.x, b.y, unit.color, 9);
              bullets.splice(i, 1);
              hit = true;

              if (unit.hp <= 0) {
                unit.isDestroyed = true;
                createExplosion(unit.x, unit.y, unit.color, 36);
                sounds.playExplosion();
                s.score += 140;
                addFloatingText(unit.x, unit.y - 16, `+140 PTS (${unit.name})`, unit.color);
              }
              break;
            }
          }
          if (hit) continue;

          for (const obs of obstacles) {
            if (obs.isDestroyed) continue;
            if (
              b.x > obs.x - obs.width / 2 - pad &&
              b.x < obs.x + obs.width / 2 + pad &&
              b.y > obs.y - obs.height / 2 - pad &&
              b.y < obs.y + obs.height / 2 + pad
            ) {
              const dmg = b.isDeflected ? b.damage * 1.8 : b.damage;
              obs.hp -= dmg;
              createExplosion(b.x, b.y, obs.color, 8);
              bullets.splice(i, 1);
              hit = true;

              if (obs.hp <= 0) {
                obs.isDestroyed = true;
                createExplosion(obs.x, obs.y, obs.color, 25);
                sounds.playExplosion();
                s.score += obs.points;
                addFloatingText(obs.x, obs.y - 18, `+${obs.points} PTS (Destroyed!)`, obs.color);
              }
              break;
            }
          }
          if (hit) continue;

          for (const base of enemyBases) {
            if (base.isDestroyed) continue;
            if (
              b.x > base.x - pad &&
              b.x < base.x + base.width + pad &&
              b.y > base.y - pad &&
              b.y < base.y + base.height + pad
            ) {
              base.hp -= b.damage;
              createExplosion(b.x, b.y, b.color, 7);
              bullets.splice(i, 1);
              hit = true;

              if (base.hp <= 0 && base.type !== 'boss-fortress') {
                base.isDestroyed = true;
                createExplosion(base.x + base.width / 2, base.y + base.height / 2, base.color, 40);
                sounds.playExplosion();
                s.score += 180;
                addFloatingText(base.x + base.width / 2, base.y - 15, '+180 PTS', '#10b981');
              }
              break;
            }
          }
          if (hit) continue;
        } else {
          let blockedByObstacle = false;
          for (const obs of obstacles) {
            if (obs.isDestroyed || obs.type === 'cyber-mine') continue;
            if (
              b.x > obs.x - obs.width / 2 &&
              b.x < obs.x + obs.width / 2 &&
              b.y > obs.y - obs.height / 2 &&
              b.y < obs.y + obs.height / 2
            ) {
              obs.hp -= b.damage * 0.6;
              createExplosion(b.x, b.y, obs.color, 6);
              bullets.splice(i, 1);
              blockedByObstacle = true;
              if (obs.hp <= 0) {
                obs.isDestroyed = true;
                createExplosion(obs.x, obs.y, obs.color, 22);
                sounds.playExplosion();
              }
              break;
            }
          }
          if (blockedByObstacle) continue;

          const distToPlayer = Math.hypot(b.x - playerCenterX, b.y - playerCenterY);
          const angleToBullet = Math.atan2(b.y - playerCenterY, b.x - playerCenterX);
          let angleDiff = Math.abs(player.aimAngle - angleToBullet);
          while (angleDiff > Math.PI) angleDiff = Math.abs(angleDiff - Math.PI * 2);

          const isFacingBullet = angleDiff <= effectiveDeflectAngle / 2;
          const isDeflectActive =
            (player.isSwingingDeflector && distToPlayer < 105) ||
            player.isQuantumShieldActive ||
            (isFacingBullet && distToPlayer < 88);

          if (isDeflectActive && distToPlayer < 105) {
            const deflectMultiplier = weapon.deflectMultiplier || 1.75;
            const origSpeed = Math.hypot(b.vx, b.vy) || 6;
            if (isFacingBullet || player.isSwingingDeflector) {
              b.vx = Math.cos(player.aimAngle) * origSpeed * deflectMultiplier;
              b.vy = Math.sin(player.aimAngle) * origSpeed * deflectMultiplier;
            } else {
              b.vx = -b.vx * deflectMultiplier;
              b.vy = -b.vy * deflectMultiplier;
            }
            b.isPlayer = true;
            b.isDeflected = true;
            b.color = weapon.color;
            b.damage = 65 * deflectMultiplier;

            createExplosion(b.x, b.y, weapon.color, 18);
            sounds.playShield();
            triggerDeflectorSwing();
            s.score += 60;
            addFloatingText(b.x, b.y - 16, '+60 Heroic Deflect!', weapon.color);
            continue;
          }

          if (player.isCrouching && b.y < player.y + 24) {
            continue;
          }

          if (distToPlayer < b.radius + (player.isCrouching ? 22 : 30)) {
            bullets.splice(i, 1);
            if (player.isQuantumShieldActive) {
              player.shield = Math.min(player.maxShield, player.shield + 25);
              createExplosion(playerCenterX, playerCenterY, '#00f5ff', 12);
            } else {
              registerEnemyHitOnPlayer(b.damage);
            }
          }
        }
      }

      for (const obs of obstacles) {
        if (obs.isDestroyed) continue;
        obs.pulseTimer += dt;
        const distToObs = Math.hypot(playerCenterX - obs.x, playerCenterY - obs.y);

        if (player.isSwingingDeflector && distToObs < 80) {
          obs.hp -= 45;
          createExplosion(obs.x, obs.y, '#ffffff', 8);
          if (obs.hp <= 0) {
            obs.isDestroyed = true;
            createExplosion(obs.x, obs.y, obs.color, 28);
            sounds.playExplosion();
            s.score += obs.points;
            addFloatingText(obs.x, obs.y - 20, `+${obs.points} PTS (Blade Slash!)`, '#fbbf24');
          }
        }

        if (distToObs < obs.width / 2 + 20) {
          if (obs.type === 'cyber-mine') {
            obs.isDestroyed = true;
            createExplosion(obs.x, obs.y, '#f59e0b', 32);
            sounds.playExplosion();
            s.screenShake = 12;
            if (player.shield > 0) {
              player.shield = Math.max(0, player.shield - 20);
            } else {
              player.hp = Math.max(12, player.hp - 15);
            }
            addFloatingText(playerCenterX, playerCenterY - 25, '-20 Shield (Mine Detonated!)', '#ef4444');
          }
        }
      }

      for (let i = floatingTexts.length - 1; i >= 0; i--) {
        const ft = floatingTexts[i];
        ft.y -= dt * 38;
        ft.life += dt;
        if (ft.life >= ft.maxLife) {
          floatingTexts.splice(i, 1);
        }
      }

      let currentNearStation: number | null = null;
      for (const st of stations) {
        if (st.index > s.activeQuestionIdx && !st.isSolved) continue;
        const dist = Math.abs(playerCenterX - st.x);
        if (dist < 95 && Math.abs(playerCenterY - st.y) < 85) {
          currentNearStation = st.index;
          if (keys.interact) {
            keys.interact = false;
            sounds.playTerminalChime();
            onOpenQuestion(st.index);
          }
          break;
        }
      }
      setNearStationIndex(currentNearStation);

      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        p.x += p.vx;
        p.y += p.vy;
        p.life++;
        if (p.life >= p.maxLife) {
          particles.splice(i, 1);
        }
      }

      // Render Scene
      ctx.save();
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      if (s.screenShake > 0) {
        const shakeX = (Math.random() - 0.5) * s.screenShake;
        const shakeY = (Math.random() - 0.5) * s.screenShake;
        ctx.translate(shakeX, shakeY);
        s.screenShake *= 0.85;
        if (s.screenShake < 0.5) s.screenShake = 0;
      }

      ctx.fillStyle = '#040711';
      ctx.fillRect(0, 0, viewW, viewH);

      drawAIEraParallaxBackground(ctx, viewW, viewH, world.themeType, s.cameraX, s.backgroundTimer, aiNeuralPackets);

      ctx.save();
      ctx.scale(cameraScale, cameraScale);
      ctx.translate(-s.cameraX, -s.cameraY);

      // Platforms
      platforms.forEach((p) => {
        if (p.type === 'ground') {
          ctx.fillStyle = '#080d1a';
          ctx.fillRect(p.x, p.y, p.width, p.height);
          ctx.fillStyle = world.accentColor;
          ctx.fillRect(p.x, p.y, p.width, 5);
          ctx.strokeStyle = `${world.accentColor}25`;
          ctx.lineWidth = 1.5;
          for (let gx = 0; gx < p.width; gx += 80) {
            ctx.beginPath();
            ctx.moveTo(gx, p.y);
            ctx.lineTo(gx, p.y + p.height);
            ctx.stroke();
          }
        } else {
          ctx.fillStyle = '#1e293b';
          ctx.fillRect(p.x, p.y, p.width, p.height);
          ctx.strokeStyle = world.accentColor;
          ctx.lineWidth = 2.5;
          ctx.strokeRect(p.x, p.y, p.width, p.height);
          ctx.fillStyle = `${world.accentColor}55`;
          ctx.fillRect(p.x + 6, p.y + p.height - 3, p.width - 12, 3);
        }
      });

      // Question Stations & Encrypted Sequential Gates
      stations.forEach((st) => {
        const isFocused = currentNearStation === st.index;
        const isLockedFuture = st.index > s.activeQuestionIdx && !st.isSolved;

        if (st.y < GROUND_Y - 50) {
          ctx.save();
          const colGrad = ctx.createLinearGradient(st.x, st.y, st.x, GROUND_Y);
          colGrad.addColorStop(
            0,
            st.isSolved ? 'rgba(16, 185, 129, 0.4)' : isLockedFuture ? 'rgba(100, 116, 139, 0.2)' : 'rgba(0, 245, 255, 0.35)'
          );
          colGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');
          ctx.fillStyle = colGrad;
          ctx.fillRect(st.x - 16, st.y, 32, GROUND_Y - st.y);
          ctx.restore();
        }

        ctx.save();
        ctx.translate(st.x, st.y);

        const radarRadius = st.radius + (isFocused ? 14 : 0) + Math.sin(s.backgroundTimer * 4 + st.index) * 4;
        ctx.beginPath();
        ctx.arc(0, 0, radarRadius, 0, Math.PI * 2);
        ctx.fillStyle = st.isSolved
          ? 'rgba(16, 185, 129, 0.22)'
          : isLockedFuture
          ? 'rgba(51, 65, 85, 0.25)'
          : 'rgba(0, 245, 255, 0.18)';
        ctx.fill();
        ctx.strokeStyle = st.isSolved ? '#10b981' : isLockedFuture ? '#64748b' : isFocused ? '#00f5ff' : world.accentColor;
        ctx.lineWidth = isFocused ? 4 : 2.5;
        ctx.stroke();

        ctx.fillStyle = st.isSolved ? '#064e3b' : isLockedFuture ? '#1e293b' : '#0f172a';
        ctx.fillRect(-38, -20, 76, 40);
        ctx.strokeStyle = st.isSolved ? '#34d399' : isLockedFuture ? '#64748b' : '#00f5ff';
        ctx.lineWidth = 2.5;
        ctx.strokeRect(-38, -20, 76, 40);

        ctx.fillStyle = st.isSolved ? '#34d399' : isLockedFuture ? '#94a3b8' : '#ffffff';
        ctx.font = 'bold 13px "Plus Jakarta Sans", sans-serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(st.isSolved ? '✓ Cleared' : isLockedFuture ? `🔒 Q${st.index + 1}` : `Quiz ${st.index + 1}`, 0, 0);

        const floatY = Math.sin(s.backgroundTimer * 4 + st.index) * 7;
        ctx.fillStyle = st.isSolved ? '#10b981' : isLockedFuture ? '#64748b' : '#00f5ff';
        ctx.font = '20px sans-serif';
        ctx.fillText(st.isSolved ? '💎' : isLockedFuture ? '🔒' : '💾', 0, -44 + floatY);

        ctx.restore();

        if (!st.isSolved) {
          ctx.save();
          ctx.strokeStyle = 'rgba(239, 68, 68, 0.85)';
          ctx.lineWidth = 5;
          ctx.setLineDash([10, 6]);
          ctx.beginPath();
          ctx.moveTo(st.barrierX, 20);
          ctx.lineTo(st.barrierX, GROUND_Y);
          ctx.stroke();

          ctx.fillStyle = 'rgba(239, 68, 68, 0.95)';
          ctx.fillRect(st.barrierX - 66, GROUND_Y - 160, 132, 28);
          ctx.fillStyle = '#ffffff';
          ctx.font = 'bold 11px "Plus Jakarta Sans", sans-serif';
          ctx.textAlign = 'center';
          ctx.fillText(`🔒 Solve Q${st.index + 1} to Pass`, st.barrierX, GROUND_Y - 142);
          ctx.restore();
        }
      });

      // Destructible Cyber Obstacles
      obstacles.forEach((obs) => {
        if (obs.isDestroyed) return;

        ctx.save();
        const pulse = Math.sin(s.backgroundTimer * 5 + obs.floatOffset);

        if (obs.type === 'cyber-mine') {
          const mineY = obs.y + pulse * 6;
          ctx.beginPath();
          ctx.arc(obs.x, mineY, 20 + pulse * 3, 0, Math.PI * 2);
          ctx.strokeStyle = `rgba(245, 158, 11, ${0.45 + pulse * 0.25})`;
          ctx.lineWidth = 1.5;
          ctx.stroke();

          ctx.beginPath();
          ctx.arc(obs.x, mineY, 14, 0, Math.PI * 2);
          ctx.fillStyle = '#451a03';
          ctx.fill();
          ctx.strokeStyle = '#f59e0b';
          ctx.lineWidth = 2.5;
          ctx.stroke();

          ctx.beginPath();
          ctx.arc(obs.x, mineY, 6, 0, Math.PI * 2);
          ctx.fillStyle = '#fbbf24';
          ctx.shadowColor = '#f59e0b';
          ctx.shadowBlur = 12;
          ctx.fill();

          ctx.fillStyle = '#f59e0b';
          ctx.font = 'bold 10px "Plus Jakarta Sans", sans-serif';
          ctx.textAlign = 'center';
          ctx.fillText('⚡ Mine', obs.x, mineY - 22);

          const bw = 32;
          ctx.fillStyle = 'rgba(0,0,0,0.75)';
          ctx.fillRect(obs.x - bw / 2, mineY - 16, bw, 3.5);
          ctx.fillStyle = '#f59e0b';
          ctx.fillRect(obs.x - bw / 2, mineY - 16, (obs.hp / obs.maxHp) * bw, 3.5);
        } else if (obs.type === 'shield-barricade') {
          ctx.fillStyle = '#0f172a';
          ctx.fillRect(obs.x - obs.width / 2, obs.y - obs.height / 2, obs.width, obs.height);
          ctx.strokeStyle = '#00f5ff';
          ctx.lineWidth = 3;
          ctx.strokeRect(obs.x - obs.width / 2, obs.y - obs.height / 2, obs.width, obs.height);

          ctx.fillStyle = 'rgba(0, 245, 255, 0.22)';
          ctx.fillRect(obs.x - obs.width / 2 + 4, obs.y - obs.height / 2 + 4, obs.width - 8, obs.height - 8);

          ctx.strokeStyle = '#00f5ff';
          ctx.lineWidth = 2;
          ctx.beginPath();
          ctx.moveTo(obs.x - obs.width / 2 + 4, obs.y - obs.height / 2 + 12);
          ctx.lineTo(obs.x + obs.width / 2 - 4, obs.y - obs.height / 2 + 26);
          ctx.moveTo(obs.x - obs.width / 2 + 4, obs.y + obs.height / 2 - 26);
          ctx.lineTo(obs.x + obs.width / 2 - 4, obs.y + obs.height / 2 - 12);
          ctx.stroke();

          const bw = obs.width + 12;
          ctx.fillStyle = 'rgba(0,0,0,0.85)';
          ctx.fillRect(obs.x - bw / 2, obs.y - obs.height / 2 - 12, bw, 4.5);
          ctx.fillStyle = '#00f5ff';
          ctx.fillRect(obs.x - bw / 2, obs.y - obs.height / 2 - 12, (obs.hp / obs.maxHp) * bw, 4.5);

          ctx.fillStyle = '#ffffff';
          ctx.font = 'bold 10px "Plus Jakarta Sans", sans-serif';
          ctx.textAlign = 'center';
          ctx.fillText('🛡️ Barrier', obs.x, obs.y - obs.height / 2 - 18);
        } else if (obs.type === 'energy-prism') {
          ctx.save();
          ctx.translate(obs.x, obs.y + pulse * 5);
          ctx.rotate(s.backgroundTimer * 2 + obs.floatOffset);

          ctx.beginPath();
          ctx.moveTo(0, -18);
          ctx.lineTo(16, 0);
          ctx.lineTo(0, 18);
          ctx.lineTo(-16, 0);
          ctx.closePath();
          ctx.fillStyle = 'rgba(236, 72, 153, 0.35)';
          ctx.fill();
          ctx.strokeStyle = '#ec4899';
          ctx.lineWidth = 2.5;
          ctx.shadowColor = '#ec4899';
          ctx.shadowBlur = 14;
          ctx.stroke();

          ctx.restore();

          const bw = 34;
          ctx.fillStyle = 'rgba(0,0,0,0.8)';
          ctx.fillRect(obs.x - bw / 2, obs.y - 28, bw, 4);
          ctx.fillStyle = '#ec4899';
          ctx.fillRect(obs.x - bw / 2, obs.y - 28, (obs.hp / obs.maxHp) * bw, 4);

          ctx.fillStyle = '#ec4899';
          ctx.font = 'bold 10px "Plus Jakarta Sans", sans-serif';
          ctx.textAlign = 'center';
          ctx.fillText('💎 Prism', obs.x, obs.y - 34);
        }

        ctx.restore();
      });

      // Enemy Bases
      enemyBases.forEach((base) => {
        if (base.isDestroyed) return;

        ctx.save();
        const baseCenterX = base.x + base.width / 2;
        const baseCenterY = base.y + base.height / 2;

        if (base.type === 'ground-cannon') {
          ctx.fillStyle = '#18181b';
          ctx.fillRect(base.x, base.y, base.width, base.height);
          ctx.strokeStyle = base.color;
          ctx.lineWidth = 2.5;
          ctx.strokeRect(base.x, base.y, base.width, base.height);

          ctx.save();
          ctx.translate(baseCenterX, baseCenterY);
          ctx.rotate(base.barrelAngle);
          ctx.fillStyle = '#3f3f46';
          ctx.fillRect(0, -6, 28, 12);
          ctx.strokeStyle = base.color;
          ctx.strokeRect(0, -6, 28, 12);
          ctx.restore();

          drawBaseHealthBar(ctx, base);
        } else if (base.type === 'ceiling-laser') {
          ctx.fillStyle = '#0f172a';
          ctx.fillRect(base.x, base.y, base.width, base.height);
          ctx.strokeStyle = '#06b6d4';
          ctx.lineWidth = 2.5;
          ctx.strokeRect(base.x, base.y, base.width, base.height);

          ctx.save();
          ctx.translate(baseCenterX, base.y + base.height);
          ctx.rotate(base.barrelAngle - Math.PI / 2);
          ctx.fillStyle = '#06b6d4';
          ctx.fillRect(-5, 0, 10, 20);
          ctx.restore();

          drawBaseHealthBar(ctx, base);
        } else if (base.type === 'missile-tower') {
          ctx.fillStyle = '#27272a';
          ctx.fillRect(base.x, base.y, base.width, base.height);
          ctx.strokeStyle = '#f97316';
          ctx.lineWidth = 3;
          ctx.strokeRect(base.x, base.y, base.width, base.height);

          ctx.fillStyle = '#f97316';
          ctx.font = '24px sans-serif';
          ctx.textAlign = 'center';
          ctx.fillText('🚀', baseCenterX, baseCenterY + 6);

          drawBaseHealthBar(ctx, base);
        } else if (base.type === 'patrol-drone') {
          ctx.fillStyle = '#18181b';
          ctx.fillRect(base.x, base.y, base.width, base.height);
          ctx.strokeStyle = '#a855f7';
          ctx.lineWidth = 2.5;
          ctx.strokeRect(base.x, base.y, base.width, base.height);

          ctx.fillStyle = '#a855f7';
          ctx.font = '20px sans-serif';
          ctx.textAlign = 'center';
          ctx.fillText('🛸', baseCenterX, baseCenterY + 5);

          drawBaseHealthBar(ctx, base);
        } else if (base.type === 'boss-fortress') {
          ctx.fillStyle = '#1e1b4b';
          ctx.fillRect(base.x, base.y, base.width, base.height);
          ctx.strokeStyle = '#ec4899';
          ctx.lineWidth = 4;
          ctx.strokeRect(base.x, base.y, base.width, base.height);

          ctx.fillStyle = '#ec4899';
          ctx.font = '44px sans-serif';
          ctx.textAlign = 'center';
          ctx.fillText('👾', baseCenterX, baseCenterY);

          const barW = 160;
          ctx.fillStyle = 'rgba(0,0,0,0.85)';
          ctx.fillRect(baseCenterX - barW / 2, base.y - 24, barW, 12);
          ctx.fillStyle = '#ec4899';
          ctx.fillRect(baseCenterX - barW / 2, base.y - 24, (base.hp / base.maxHp) * barW, 12);
          ctx.strokeStyle = '#ffffff';
          ctx.lineWidth = 1.5;
          ctx.strokeRect(baseCenterX - barW / 2, base.y - 24, barW, 12);
        }

        if (!base.isJammed && base.shootCooldown < 0.38) {
          const pulseWarn = 0.5 + 0.5 * Math.sin(s.backgroundTimer * 22);
          ctx.beginPath();
          ctx.arc(baseCenterX, baseCenterY, Math.max(base.width, base.height) * 0.68, 0, Math.PI * 2);
          ctx.strokeStyle = `rgba(239, 68, 68, ${0.45 + pulseWarn * 0.45})`;
          ctx.lineWidth = 2.5;
          ctx.stroke();
        }

        if (base.isJammed) {
          ctx.fillStyle = '#00f5ff';
          ctx.font = 'bold 12px "Plus Jakarta Sans", sans-serif';
          ctx.textAlign = 'center';
          ctx.fillText('⚡ EMP JAMMED', baseCenterX, base.y - 14);
        }

        ctx.restore();
      });

      // Dynamic Alien & Enemy Spacecraft Squadron
      spaceUnits.forEach((unit) => {
        if (unit.isDestroyed) return;
        drawSpacecraftUnit(ctx, unit, s.backgroundTimer);
      });

      // High-Contrast Projectiles
      bullets.forEach((b) => {
        ctx.save();
        if (!b.isPlayer) {
          // Outer dark contrast halo so bullets remain unmistakable against glowing backgrounds
          ctx.beginPath();
          ctx.arc(b.x, b.y, b.radius + 3, 0, Math.PI * 2);
          ctx.fillStyle = 'rgba(4, 7, 17, 0.85)';
          ctx.fill();

          ctx.beginPath();
          ctx.arc(b.x, b.y, b.radius, 0, Math.PI * 2);
          ctx.fillStyle = b.color;
          ctx.shadowColor = b.color;
          ctx.shadowBlur = 14;
          ctx.fill();

          // Luminous inner core
          ctx.beginPath();
          ctx.arc(b.x, b.y, Math.max(2, b.radius * 0.45), 0, Math.PI * 2);
          ctx.fillStyle = '#ffffff';
          ctx.fill();

          if (b.type === 'missile' || b.pattern === 'homing') {
            ctx.beginPath();
            ctx.arc(b.x - b.vx * 1.8, b.y - b.vy * 1.8, b.radius * 0.65, 0, Math.PI * 2);
            ctx.fillStyle = '#fde047';
            ctx.fill();
          } else if (b.pattern === 'splitter') {
            ctx.beginPath();
            ctx.arc(b.x, b.y, b.radius + 4.5, 0, Math.PI * 2);
            ctx.strokeStyle = '#fda4af';
            ctx.lineWidth = 1.5;
            ctx.stroke();
          }
        } else {
          ctx.beginPath();
          ctx.arc(b.x, b.y, b.radius, 0, Math.PI * 2);
          ctx.fillStyle = b.color;
          ctx.shadowColor = b.color;
          ctx.shadowBlur = b.isDeflected ? 20 : 10;
          ctx.fill();
        }
        ctx.restore();
      });

      // Particles
      particles.forEach((p) => {
        ctx.save();
        const alpha = 1 - p.life / p.maxLife;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius * alpha, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.globalAlpha = alpha;
        ctx.fill();
        ctx.restore();
      });

      // Sprint Speed Afterimage Trail
      sprintAfterimages.forEach((img) => {
        const alpha = Math.max(0, 1 - img.life / img.maxLife) * 0.35;
        ctx.save();
        ctx.globalAlpha = alpha;
        ctx.translate(img.x, img.y);
        ctx.scale(img.facing * 1.08, 1.08);
        ctx.fillStyle = '#00f5ff';
        if (!img.crouching) {
          ctx.fillRect(-16, -20, 32, 30);
          ctx.fillRect(-13, -42, 26, 22);
        } else {
          ctx.fillRect(-14, -12, 28, 16);
        }
        ctx.restore();
      });

      // Player Aim Laser, Target Lock Ring & Scaled Hero
      ctx.save();
      const pCenterX = player.x + player.width / 2;
      const pCenterY = player.y + (player.isCrouching ? 24 : 39);

      ctx.save();
      const laserEndX = s.lockedTarget ? s.lockedTarget.x : pCenterX + Math.cos(player.aimAngle) * 340;
      const laserEndY = s.lockedTarget ? s.lockedTarget.y : pCenterY + Math.sin(player.aimAngle) * 340;
      ctx.beginPath();
      ctx.setLineDash([8, 6]);
      ctx.moveTo(pCenterX + Math.cos(player.aimAngle) * 28, pCenterY + Math.sin(player.aimAngle) * 28);
      ctx.lineTo(laserEndX, laserEndY);
      ctx.strokeStyle = s.lockedTarget
        ? s.autoAimFire || mouse.down
          ? 'rgba(250, 204, 21, 0.85)'
          : 'rgba(0, 245, 255, 0.45)'
        : 'rgba(0, 245, 255, 0.25)';
      ctx.lineWidth = s.lockedTarget && (s.autoAimFire || mouse.down) ? 2.5 : 1.5;
      ctx.stroke();
      ctx.restore();

      if (s.lockedTarget) {
        const lt = s.lockedTarget;
        ctx.save();
        ctx.translate(lt.x, lt.y);
        ctx.rotate(s.backgroundTimer * 2.5);
        const lockRadius = lt.radius + 6 + Math.sin(s.backgroundTimer * 6) * 2.5;
        ctx.beginPath();
        ctx.arc(0, 0, lockRadius, 0, Math.PI * 2);
        ctx.strokeStyle = s.autoAimFire || mouse.down ? '#facc15' : '#00f5ff';
        ctx.lineWidth = 2.5;
        ctx.setLineDash([10, 6]);
        ctx.stroke();
        ctx.setLineDash([]);
        for (let a = 0; a < 4; a++) {
          ctx.rotate(Math.PI / 2);
          ctx.beginPath();
          ctx.moveTo(lockRadius - 4, 0);
          ctx.lineTo(lockRadius + 6, 0);
          ctx.strokeStyle = '#ef4444';
          ctx.lineWidth = 2.5;
          ctx.stroke();
        }
        ctx.restore();
      }

      ctx.save();
      const lightGrad = ctx.createRadialGradient(pCenterX, pCenterY, 10, pCenterX, pCenterY, 240);
      lightGrad.addColorStop(0, player.isSprinting ? 'rgba(56, 189, 248, 0.36)' : 'rgba(0, 245, 255, 0.28)');
      lightGrad.addColorStop(0.35, 'rgba(59, 130, 246, 0.12)');
      lightGrad.addColorStop(0.7, 'rgba(168, 85, 247, 0.04)');
      lightGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');
      ctx.fillStyle = lightGrad;
      ctx.beginPath();
      ctx.arc(pCenterX, pCenterY, 240, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();

      ctx.beginPath();
      ctx.ellipse(pCenterX, player.y + (player.isCrouching ? 48 : 78), 24, 8, 0, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(0, 0, 0, 0.55)';
      ctx.fill();

      // Player Tag & Health/Shield/Stamina Bars
      ctx.save();
      ctx.translate(pCenterX, player.y - (player.isCrouching ? 22 : 36));

      const displayName = playerName || 'Cyber Hero';
      ctx.font = 'bold 12px "Plus Jakarta Sans", sans-serif';
      const textWidth = ctx.measureText(displayName).width;
      const pillWidth = Math.max(84, textWidth + 28);

      ctx.fillStyle = 'rgba(15, 23, 42, 0.92)';
      ctx.strokeStyle = player.isSprinting ? '#facc15' : '#00f5ff';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.roundRect(-pillWidth / 2, -21, pillWidth, 21, 8);
      ctx.fill();
      ctx.stroke();

      ctx.fillStyle = '#ffffff';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(displayName, 0, -10);

      const barW = 56;
      ctx.fillStyle = 'rgba(0,0,0,0.75)';
      ctx.fillRect(-barW / 2, 4, barW, 5);
      ctx.fillStyle = '#22c55e';
      ctx.fillRect(-barW / 2, 4, (player.hp / player.maxHp) * barW, 5);
      if (player.shield > 0) {
        ctx.fillStyle = '#00f5ff';
        ctx.fillRect(-barW / 2, 10, (player.shield / player.maxShield) * barW, 3);
      }
      ctx.fillStyle = player.sprintExhaustedLock ? '#f43f5e' : '#facc15';
      ctx.fillRect(-barW / 2, 14, (player.stamina / player.maxStamina) * barW, 2.5);
      ctx.restore();

      if (player.isQuantumShieldActive) {
        ctx.save();
        ctx.beginPath();
        ctx.arc(pCenterX, pCenterY, 52, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(0, 245, 255, 0.28)';
        ctx.fill();
        ctx.strokeStyle = '#00f5ff';
        ctx.lineWidth = 4;
        ctx.shadowColor = '#00f5ff';
        ctx.shadowBlur = 20;
        ctx.stroke();
        ctx.restore();
      }

      ctx.save();
      ctx.translate(pCenterX, pCenterY);
      ctx.rotate(player.aimAngle);

      ctx.beginPath();
      ctx.arc(0, 0, 50, -effectiveDeflectAngle / 2, effectiveDeflectAngle / 2);
      ctx.strokeStyle = player.isSwingingDeflector ? '#ffffff' : 'rgba(0, 245, 255, 0.55)';
      ctx.lineWidth = player.isSwingingDeflector ? 6 : 2.5;
      if (player.isSwingingDeflector) {
        ctx.shadowColor = '#00f5ff';
        ctx.shadowBlur = 20;
      }
      ctx.stroke();
      ctx.restore();

      // Invulnerability blink after hit
      const blinkHide = s.hitInvulnTimer > 0 && Math.floor(s.backgroundTimer * 18) % 2 === 0;
      if (!blinkHide) {
        // Blocky Cyber Hero Avatar
        ctx.save();
        ctx.translate(pCenterX, pCenterY);
        ctx.scale(player.facing * 1.08, 1.08);

        const skin = character.robloxSkin || {
          headColor: '#facc15',
          torsoColor: '#2563eb',
          leftArmColor: '#facc15',
          rightArmColor: '#facc15',
          legsColor: '#16a34a',
          faceType: 'smile',
          accessory: 'headphones',
        };

        const legSwing = Math.sin(player.walkCycle) * (player.isSprinting ? 14 : 10);

        if (!player.isCrouching) {
          ctx.fillStyle = skin.legsColor;
          ctx.fillRect(-15 - legSwing, 10, 12, 26);
          ctx.strokeRect(-15 - legSwing, 10, 12, 26);
          ctx.fillRect(3 + legSwing, 10, 12, 26);
          ctx.strokeRect(3 + legSwing, 10, 12, 26);

          ctx.fillStyle = skin.torsoColor;
          ctx.fillRect(-18, -20, 36, 30);
          ctx.strokeStyle = '#00000044';
          ctx.lineWidth = 2;
          ctx.strokeRect(-18, -20, 36, 30);

          ctx.fillStyle = '#ffffff';
          ctx.fillRect(-5, -12, 10, 10);
          ctx.fillStyle = skin.torsoColor;
          ctx.fillRect(-2, -9, 4, 4);

          ctx.fillStyle = skin.leftArmColor;
          ctx.fillRect(-27, -18 - legSwing * 0.4, 9, 24);
          ctx.strokeRect(-27, -18 - legSwing * 0.4, 9, 24);

          ctx.fillStyle = skin.headColor;
          ctx.fillRect(-14, -42, 28, 22);
          ctx.strokeRect(-14, -42, 28, 22);

          if (skin.faceType === 'cyber-visor') {
            ctx.fillStyle = '#00f5ff';
            ctx.shadowColor = '#00f5ff';
            ctx.shadowBlur = 6;
            ctx.fillRect(2, -36, 12, 6);
            ctx.shadowBlur = 0;
          } else if (skin.faceType === 'cool') {
            ctx.fillStyle = '#0f172a';
            ctx.fillRect(3, -37, 10, 7);
            ctx.fillStyle = '#ffffff';
            ctx.fillRect(6, -35, 3, 3);
          } else {
            ctx.fillStyle = '#0f172a';
            ctx.fillRect(5, -36, 4, 4);
            ctx.fillRect(3, -28, 9, 3);
          }

          if (skin.accessory === 'headphones') {
            ctx.fillStyle = '#00f5ff';
            ctx.fillRect(-16, -39, 4, 12);
            ctx.fillRect(11, -39, 4, 12);
            ctx.fillRect(-13, -45, 26, 3);
          }

          ctx.save();
          ctx.translate(12, -12);
          ctx.rotate(player.facing === 1 ? player.aimAngle : Math.PI - player.aimAngle);

          ctx.fillStyle = skin.rightArmColor;
          ctx.fillRect(0, -5, 20, 9);
          ctx.strokeRect(0, -5, 20, 9);

          ctx.fillStyle = '#334155';
          ctx.fillRect(18, -3, 6, 12);
          ctx.fillStyle = weapon.color;
          ctx.shadowColor = weapon.color;
          ctx.shadowBlur = player.isSwingingDeflector ? 26 : 14;
          ctx.fillRect(24, -5, 36, 8);
          ctx.restore();
        } else {
          ctx.fillStyle = skin.legsColor;
          ctx.fillRect(-18, 4, 36, 15);
          ctx.strokeRect(-18, 4, 36, 15);

          ctx.fillStyle = skin.torsoColor;
          ctx.fillRect(-15, -12, 30, 16);
          ctx.strokeRect(-15, -12, 30, 16);

          ctx.fillStyle = skin.headColor;
          ctx.fillRect(-11, -30, 22, 18);
          ctx.strokeRect(-11, -30, 22, 18);

          ctx.save();
          ctx.translate(10, -4);
          ctx.fillStyle = weapon.color;
          ctx.shadowColor = weapon.color;
          ctx.shadowBlur = 14;
          ctx.fillRect(0, -4, 30, 6);
          ctx.restore();
        }

        ctx.restore();
      }
      ctx.restore();

      // Floating combat text
      floatingTexts.forEach((ft) => {
        ctx.save();
        const alpha = Math.max(0, 1 - ft.life / ft.maxLife);
        ctx.globalAlpha = alpha;
        ctx.fillStyle = ft.color;
        ctx.shadowColor = ft.color;
        ctx.shadowBlur = 10;
        ctx.font = 'bold 13px "Plus Jakarta Sans", sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText(ft.text, ft.x, ft.y);
        ctx.restore();
      });

      ctx.restore();

      // Hit Red Edge Flash Vignette
      if (s.hitFlashTimer > 0) {
        const flashAlpha = Math.min(0.45, s.hitFlashTimer * 1.1);
        const vig = ctx.createRadialGradient(viewW / 2, viewH / 2, viewW * 0.25, viewW / 2, viewH / 2, viewW * 0.72);
        vig.addColorStop(0, 'rgba(239, 68, 68, 0)');
        vig.addColorStop(1, `rgba(239, 68, 68, ${flashAlpha})`);
        ctx.fillStyle = vig;
        ctx.fillRect(0, 0, viewW, viewH);
      }

      // Incoming Wave Escalation / 7th-Hit Restart Canvas Banners
      if (s.restartBannerTimer > 0) {
        ctx.save();
        ctx.globalAlpha = Math.min(1, s.restartBannerTimer);
        const bw = Math.min(viewW - 32, 460);
        ctx.fillStyle = 'rgba(127, 29, 29, 0.92)';
        ctx.strokeStyle = '#fb7185';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.roundRect(viewW / 2 - bw / 2, 18, bw, 52, 14);
        ctx.fill();
        ctx.stroke();
        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 14px "Plus Jakarta Sans", sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText(
          `⚠️ Hit Limit Exceeded (7th Hit) · Restarting Q${s.activeQuestionIdx + 1} Sector`,
          viewW / 2,
          41
        );
        ctx.fillStyle = '#fecdd3';
        ctx.font = '11px "Plus Jakarta Sans", sans-serif';
        ctx.fillText(`Hits Reset to 0/${MAX_ALLOWED_HITS} · Shield & Wave Restored`, viewW / 2, 59);
        ctx.restore();
      } else if (s.waveBannerTimer > 0) {
        ctx.save();
        ctx.globalAlpha = Math.min(1, s.waveBannerTimer);
        const bw = Math.min(viewW - 32, 420);
        ctx.fillStyle = 'rgba(15, 23, 42, 0.88)';
        ctx.strokeStyle = escalationTier.accentColor;
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.roundRect(viewW / 2 - bw / 2, 16, bw, 44, 12);
        ctx.fill();
        ctx.stroke();
        ctx.fillStyle = escalationTier.accentColor;
        ctx.font = 'bold 13px "Plus Jakarta Sans", sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText(`🛸 ${s.waveBannerTitle}`, viewW / 2, 35);
        ctx.fillStyle = '#cbd5e1';
        ctx.font = '11px "Plus Jakarta Sans", sans-serif';
        ctx.fillText(
          `${escalationTier.spacecraftCount} Enemy Craft · Patterns: ${escalationTier.patterns.join(', ')}`,
          viewW / 2,
          51
        );
        ctx.restore();
      }

      // Edge Threat Distance Radar (Bases + Spacecraft)
      const allThreats = [
        ...enemyBases.filter((b) => !b.isDestroyed).map((b) => ({ x: b.x, width: b.width, y: b.y, height: b.height })),
        ...spaceUnits
          .filter((u) => !u.isDestroyed)
          .map((u) => ({ x: u.x - u.width / 2, width: u.width, y: u.y - u.height / 2, height: u.height })),
      ];

      const nextRightThreat = allThreats
        .filter((b) => b.x > visibleRight && b.x < visibleRight + 320)
        .sort((a, b) => a.x - b.x)[0];
      if (nextRightThreat) {
        const indY = Math.max(70, Math.min(viewH - 120, (nextRightThreat.y + nextRightThreat.height / 2 - s.cameraY) * cameraScale));
        const distMeters = Math.max(1, Math.round((nextRightThreat.x - visibleRight) / 18));
        ctx.save();
        ctx.fillStyle = 'rgba(220, 38, 38, 0.88)';
        ctx.strokeStyle = '#fca5a5';
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.roundRect(viewW - 102, indY - 14, 94, 28, 8);
        ctx.fill();
        ctx.stroke();
        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 11px "Plus Jakarta Sans", sans-serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(`⚠️ Enemy ${distMeters}m ▶`, viewW - 55, indY);
        ctx.restore();
      }

      const nextLeftThreat = allThreats
        .filter((b) => b.x + b.width < visibleLeft && b.x + b.width > visibleLeft - 260)
        .sort((a, b) => b.x - a.x)[0];
      if (nextLeftThreat) {
        const indY = Math.max(70, Math.min(viewH - 120, (nextLeftThreat.y + nextLeftThreat.height / 2 - s.cameraY) * cameraScale));
        ctx.save();
        ctx.fillStyle = 'rgba(220, 38, 38, 0.88)';
        ctx.strokeStyle = '#fca5a5';
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.roundRect(8, indY - 14, 84, 28, 8);
        ctx.fill();
        ctx.stroke();
        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 11px "Plus Jakarta Sans", sans-serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText('◀ ⚠️ Threat', 50, indY);
        ctx.restore();
      }

      ctx.restore();

      const boss = enemyBases.find((b) => b.type === 'boss-fortress');
      const progressRatio = Math.min(100, Math.round((player.x / TRACK_LENGTH) * 100));

      setHudStats({
        hp: Math.round(player.hp),
        maxHp: player.maxHp,
        shield: Math.round(player.shield),
        maxShield: player.maxShield,
        stamina: Math.round(player.stamina),
        maxStamina: player.maxStamina,
        isSprinting: player.isSprinting,
        sprintExhausted: player.sprintExhaustedLock,
        hitsTaken: s.hitsTaken,
        maxAllowedHits: MAX_ALLOWED_HITS,
        currentQuestionNumber: activeQNum,
        waveTitle: escalationTier.waveTitle,
        waveShipsRemaining: activeShipsAlive,
        score: s.score,
        progressPercent: progressRatio,
        bossHp: boss ? Math.round(boss.hp) : 0,
        bossMaxHp: boss ? boss.maxHp : 600,
        isDeflecting: player.isSwingingDeflector,
        pulseCooldown: Math.ceil(player.pulseCooldownTimer),
        empCooldown: Math.ceil(player.empCooldownTimer),
        quantumCooldown: Math.ceil(player.quantumCooldownTimer),
        gamepadConnected: s.gamepadConnected,
        gamepadName: s.gamepadName,
        lockedTargetName: s.lockedTarget?.name || '',
      });

      animationFrameId = requestAnimationFrame(loop);
    };

    animationFrameId = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(animationFrameId);
  }, [
    subStage,
    world,
    character,
    weapon,
    armor,
    skillBonus,
    effectiveDeflectAngle,
    hasNanoPerk,
    hasSpeedPerk,
    hasTriplePerk,
    hasSlowMoPerk,
    hasDoubleJumpPerk,
    onGameOver,
    onOpenQuestion,
    onStageVictory,
    playerName,
    triggerDeflectorSwing,
    triggerKineticPulse,
    triggerEmpJammer,
    triggerQuantumBarrier,
    addFloatingText,
    createExplosion,
    spawnWaveForQuestion,
    nearStationIndex,
  ]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const s = stateRef.current;
      const k = e.key.toLowerCase();

      if (e.key === 'Shift' || e.shiftKey) s.keys.sprint = true;
      if (k === 'a' || e.key === 'ArrowLeft') s.keys.left = true;
      if (k === 'd' || e.key === 'ArrowRight') s.keys.right = true;
      if (k === 'w' || e.key === 'ArrowUp') s.keys.jump = true;
      if (k === 's' || e.key === 'ArrowDown') s.keys.crouch = true;
      if (e.code === 'Space') {
        e.preventDefault();
        s.keys.deflect = true;
      }
      if (k === 'e') {
        if (nearStationIndex !== null) {
          s.keys.interact = true;
        } else {
          triggerKineticPulse();
        }
      }
      if (k === 'q') triggerEmpJammer();
      if (k === 'r') triggerQuantumBarrier();
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      const s = stateRef.current;
      const k = e.key.toLowerCase();

      if (e.key === 'Shift' || !e.shiftKey) s.keys.sprint = false;
      if (k === 'a' || e.key === 'ArrowLeft') s.keys.left = false;
      if (k === 'd' || e.key === 'ArrowRight') s.keys.right = false;
      if (k === 'w' || e.key === 'ArrowUp') s.keys.jump = false;
      if (k === 's' || e.key === 'ArrowDown') s.keys.crouch = false;
      if (e.code === 'Space') s.keys.deflect = false;
      if (k === 'e') s.keys.interact = false;
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [nearStationIndex, triggerKineticPulse, triggerEmpJammer, triggerQuantumBarrier]);

  const clientToWorld = (clientX: number, clientY: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return { screenX: 0, screenY: 0, worldX: 0, worldY: 0 };
    const cRect = canvas.getBoundingClientRect();
    const { cameraScale } = viewportRef.current;
    const screenX = clientX - cRect.left;
    const screenY = clientY - cRect.top;
    return {
      screenX,
      screenY,
      worldX: screenX / cameraScale + stateRef.current.cameraX,
      worldY: screenY / cameraScale + stateRef.current.cameraY,
    };
  };

  const handleStageTouchStart = (e: React.TouchEvent<HTMLDivElement>) => {
    const stage = stageAreaRef.current;
    if (!stage) return;
    const rect = stage.getBoundingClientRect();
    const s = stateRef.current;
    s.isTouchDevice = true;

    for (let i = 0; i < e.changedTouches.length; i++) {
      const touch = e.changedTouches[i];
      const touchX = touch.clientX - rect.left;
      const touchY = touch.clientY - rect.top;

      if (touchX < rect.width * 0.44 && s.touchInput.moveTouchId === null) {
        s.touchInput.moveTouchId = touch.identifier;
        s.touchInput.joyStartX = touchX;
        s.touchInput.joyStartY = touchY;
        s.touchInput.isActive = true;
        setTouchJoystick({
          active: true,
          startX: touchX,
          startY: touchY,
          currentX: touchX,
          currentY: touchY,
        });
      } else if (s.touchInput.aimTouchId === null) {
        s.touchInput.aimTouchId = touch.identifier;
        const pos = clientToWorld(touch.clientX, touch.clientY);
        s.mouse.screenX = pos.screenX;
        s.mouse.screenY = pos.screenY;
        s.mouse.worldX = pos.worldX;
        s.mouse.worldY = pos.worldY;
        s.mouse.down = true;
        setTouchAimCrosshair({ active: true, x: pos.screenX, y: pos.screenY });
      }
    }
  };

  const handleStageTouchMove = (e: React.TouchEvent<HTMLDivElement>) => {
    const stage = stageAreaRef.current;
    if (!stage) return;
    const rect = stage.getBoundingClientRect();
    const s = stateRef.current;

    for (let i = 0; i < e.changedTouches.length; i++) {
      const touch = e.changedTouches[i];
      if (touch.identifier === s.touchInput.moveTouchId) {
        const touchX = touch.clientX - rect.left;
        const touchY = touch.clientY - rect.top;
        const dx = touchX - s.touchInput.joyStartX;
        const dy = touchY - s.touchInput.joyStartY;
        const maxDist = 52;
        const dist = Math.hypot(dx, dy);
        const clampedDist = Math.min(dist, maxDist);
        const angle = Math.atan2(dy, dx);

        setTouchJoystick((prev) => ({
          ...prev,
          currentX: prev.startX + Math.cos(angle) * clampedDist,
          currentY: prev.startY + Math.sin(angle) * clampedDist,
        }));

        s.touchInput.moveX = Math.max(-1, Math.min(1, dx / maxDist));
        s.touchInput.moveY = Math.max(-1, Math.min(1, dy / maxDist));
      } else if (touch.identifier === s.touchInput.aimTouchId) {
        const pos = clientToWorld(touch.clientX, touch.clientY);
        s.mouse.screenX = pos.screenX;
        s.mouse.screenY = pos.screenY;
        s.mouse.worldX = pos.worldX;
        s.mouse.worldY = pos.worldY;
        setTouchAimCrosshair({ active: true, x: pos.screenX, y: pos.screenY });
      }
    }
  };

  const handleStageTouchEnd = (e: React.TouchEvent<HTMLDivElement>) => {
    const s = stateRef.current;
    for (let i = 0; i < e.changedTouches.length; i++) {
      const touch = e.changedTouches[i];
      if (touch.identifier === s.touchInput.moveTouchId) {
        s.touchInput.moveTouchId = null;
        s.touchInput.isActive = false;
        s.touchInput.moveX = 0;
        s.touchInput.moveY = 0;
        setTouchJoystick((prev) => ({ ...prev, active: false }));
      }
      if (touch.identifier === s.touchInput.aimTouchId) {
        s.touchInput.aimTouchId = null;
        s.mouse.down = false;
        setTouchAimCrosshair({ active: false, x: 0, y: 0 });
      }
    }
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const pos = clientToWorld(e.clientX, e.clientY);
    stateRef.current.mouse.screenX = pos.screenX;
    stateRef.current.mouse.screenY = pos.screenY;
    stateRef.current.mouse.worldX = pos.worldX;
    stateRef.current.mouse.worldY = pos.worldY;
  };

  const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const pos = clientToWorld(e.clientX, e.clientY);
    stateRef.current.mouse.worldX = pos.worldX;
    stateRef.current.mouse.worldY = pos.worldY;
    stateRef.current.mouse.down = true;
  };

  const handleMouseUp = () => {
    stateRef.current.mouse.down = false;
  };

  const hitsRemaining = Math.max(0, hudStats.maxAllowedHits - hudStats.hitsTaken);

  return (
    <div
      ref={containerRef}
      className="relative w-full h-full flex flex-col items-center justify-between select-none overflow-hidden bg-[#040711] p-0.5 sm:p-1.5"
    >
      {/* Compact Battle HUD Bar */}
      <div className="w-full flex items-center justify-between gap-2 bg-slate-900/90 border border-slate-800 px-2 sm:px-3 py-1.5 rounded-xl sm:rounded-2xl backdrop-blur-md z-20 shadow-xl shrink-0">
        <div className="flex items-center gap-1.5 sm:gap-2">
          {onOpenMenu ? (
            <button
              onClick={() => {
                sounds.playClick();
                onOpenMenu();
              }}
              className="px-2 sm:px-3 py-1.5 rounded-xl bg-cyan-950/80 hover:bg-cyan-900 text-cyan-300 hover:text-white border border-cyan-500/40 text-xs font-bold flex items-center gap-1.5 transition-all active:scale-95 shadow-sm whitespace-nowrap"
              title="Open Options & Navigation Drawer"
            >
              <Menu className="w-4 h-4 text-cyan-400 shrink-0" />
              <span className="hidden sm:inline">Options</span>
            </button>
          ) : (
            onBackToHome && (
              <button
                onClick={() => {
                  sounds.playClick();
                  onBackToHome();
                }}
                className="px-2 sm:px-3 py-1 rounded-xl bg-slate-800 hover:bg-slate-700 text-cyan-300 hover:text-white border border-slate-700 text-xs font-bold flex items-center gap-1 transition-all active:scale-95 whitespace-nowrap"
                title="Back to Title Screen"
              >
                <Home className="w-3.5 h-3.5 text-cyan-400" />
                <span className="hidden sm:inline">Home</span>
              </button>
            )
          )}

          <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-slate-800 border-2 border-cyan-400 flex items-center justify-center text-base sm:text-xl shadow-lg shadow-cyan-500/20 shrink-0">
            {character.avatar}
          </div>
          <div className="flex flex-col gap-0.5">
            <div className="flex items-center gap-1.5 text-[11px] sm:text-xs font-bold text-slate-200">
              <span className="font-cyber text-cyan-300 max-w-[85px] sm:max-w-none truncate">
                {playerName || character.name}
              </span>
              <span className="text-rose-400 font-mono tabular-nums">HP:{hudStats.hp}</span>
              <span className="text-amber-300 font-mono tabular-nums text-[10px]">
                ⚡{hudStats.stamina}%
              </span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-20 sm:w-28 bg-slate-800 h-1.5 rounded-full overflow-hidden">
                <div
                  className="bg-red-500 h-full transition-all duration-150"
                  style={{ width: `${Math.max(0, (hudStats.hp / hudStats.maxHp) * 100)}%` }}
                />
              </div>
              <div className="w-14 sm:w-20 bg-slate-800 h-1.5 rounded-full overflow-hidden" title="Sprint Stamina">
                <div
                  className={`h-full transition-all duration-100 ${
                    hudStats.sprintExhausted
                      ? 'bg-rose-500'
                      : hudStats.isSprinting
                      ? 'bg-cyan-300'
                      : 'bg-amber-400'
                  }`}
                  style={{ width: `${Math.max(0, (hudStats.stamina / hudStats.maxStamina) * 100)}%` }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Quiz Stations Bar (Mandatory Sequential Order) */}
        <div className="flex-1 max-w-md flex flex-col items-center gap-0.5 px-1 sm:px-3">
          <div className="w-full hidden sm:flex items-center justify-between text-[11px] font-bold text-slate-400">
            <span className="text-cyan-400 font-cyber">ROBYTE</span>
            <span className="text-amber-400 font-cyber truncate max-w-[180px]">{subStage.name}</span>
            <span className="text-emerald-400 font-mono tabular-nums">{hudStats.progressPercent}%</span>
          </div>

          <div className="w-full flex items-center justify-center sm:justify-between gap-1">
            {[0, 1, 2, 3, 4].map((idx) => {
              const isSolved = solvedQuestions.has(idx);
              const isCurrent = !isSolved && idx === activeQuestionIdx;
              const isLocked = !isSolved && idx > activeQuestionIdx;

              return (
                <button
                  key={idx}
                  disabled={isLocked}
                  onClick={() => {
                    if (isLocked) return;
                    sounds.playTerminalChime();
                    onOpenQuestion(idx);
                  }}
                  className={`px-1.5 sm:px-2 py-0.5 rounded text-[10px] font-bold transition-all whitespace-nowrap flex items-center gap-0.5 ${
                    isSolved
                      ? 'bg-emerald-600 text-white font-extrabold shadow'
                      : isCurrent
                      ? 'bg-cyan-500/20 text-cyan-200 border border-cyan-400 ring-1 ring-cyan-400/50'
                      : 'bg-slate-900 text-slate-600 border border-slate-800 cursor-not-allowed'
                  }`}
                  title={
                    isLocked
                      ? `Locked — Solve Question ${activeQuestionIdx + 1} first`
                      : `Curriculum Question Station ${idx + 1}`
                  }
                >
                  {isSolved ? '✓' : isLocked ? <Lock className="w-2.5 h-2.5" /> : null}
                  <span>{isSolved ? '' : `Q${idx + 1}`}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* 6-Hit Counter & Score */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          <div
            className={`flex items-center gap-1 px-2 py-1 rounded-xl border text-[10px] sm:text-xs font-bold tabular-nums whitespace-nowrap ${
              hitsRemaining <= 1
                ? 'bg-rose-950/90 border-rose-500 text-rose-200 animate-pulse'
                : hitsRemaining <= 3
                ? 'bg-amber-950/70 border-amber-500/60 text-amber-200'
                : 'bg-slate-800/90 border-slate-700 text-cyan-200'
            }`}
            title={`Hit Limit: ${hudStats.hitsTaken}/${hudStats.maxAllowedHits} (7th hit restarts current question sector)`}
          >
            <span className="hidden md:inline">Hits</span>
            <span>
              {hudStats.hitsTaken}/{hudStats.maxAllowedHits}
            </span>
            <div className="hidden sm:flex items-center gap-0.5 ml-0.5">
              {Array.from({ length: hudStats.maxAllowedHits }).map((_, i) => {
                const isTaken = i < hudStats.hitsTaken;
                return (
                  <span
                    key={i}
                    className={`w-1.5 h-3 rounded-sm transition-colors ${
                      isTaken ? 'bg-rose-500' : 'bg-emerald-400/85'
                    }`}
                  />
                );
              })}
            </div>
          </div>

          <span className="text-amber-400 font-mono font-bold text-[11px] sm:text-xs px-1 tabular-nums whitespace-nowrap">
            {hudStats.score} pts
          </span>

          <button
            onClick={toggleFullscreen}
            className="p-1.5 sm:p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 shadow transition-colors"
            title={isFullscreen ? 'Exit Fullscreen' : 'Fullscreen'}
          >
            {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Decrypt Station Prompt Banner */}
      {nearStationIndex !== null && nearStationIndex === activeQuestionIdx && !solvedQuestions.has(nearStationIndex) && (
        <div className="absolute top-14 sm:top-16 z-30 animate-bounce px-2">
          <button
            onClick={() => onOpenQuestion(nearStationIndex)}
            className="flex items-center gap-1.5 bg-gradient-to-r from-amber-400 via-cyan-400 to-blue-500 text-black font-black px-4 sm:px-7 py-2.5 rounded-2xl shadow-[0_0_35px_rgba(0,245,255,0.85)] border-2 border-white text-xs sm:text-sm hover:scale-105 active:scale-95 transition-transform whitespace-nowrap"
          >
            <Zap className="w-4 h-4 fill-current animate-pulse" />
            <span>⚡ Decrypt Quiz Terminal [{nearStationIndex + 1}] Now!</span>
          </button>
        </div>
      )}

      {/* Full-Bleed 2D Action Stage */}
      <div
        ref={stageAreaRef}
        onTouchStart={handleStageTouchStart}
        onTouchMove={handleStageTouchMove}
        onTouchEnd={handleStageTouchEnd}
        onTouchCancel={handleStageTouchEnd}
        className="relative w-full flex-1 min-h-0 my-0.5 rounded-xl sm:rounded-2xl border border-slate-800 shadow-[0_0_50px_rgba(0,0,0,0.8)] overflow-hidden bg-slate-950 touch-none"
      >
        <canvas
          ref={canvasRef}
          onMouseMove={handleMouseMove}
          onMouseDown={handleMouseDown}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
          className="game-canvas block w-full h-full cursor-crosshair touch-none"
        />

        {/* Active Wave & Equipped Weapon HUD Badge */}
        <div className="absolute top-2.5 right-3 flex items-center gap-1.5 pointer-events-none">
          <div className="bg-slate-900/85 px-2.5 py-1 rounded-xl text-[10px] sm:text-xs text-amber-300 border border-slate-800 backdrop-blur-md shadow">
            Wave Q{hudStats.currentQuestionNumber} · {hudStats.waveShipsRemaining} Craft
          </div>
          <div className="bg-slate-900/85 px-2.5 py-1 rounded-xl text-[10px] sm:text-xs text-cyan-300 border border-slate-800 flex items-center gap-1.5 backdrop-blur-md shadow">
            <Swords className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
            <span className="truncate max-w-[120px] sm:max-w-none">{weapon.name}</span>
          </div>
        </div>

        {/* Mobile Multi-Touch Control Hint */}
        <div className="absolute top-2.5 left-3 md:hidden bg-slate-900/75 px-2 py-1 rounded-xl text-[10px] text-slate-300 border border-slate-800/80 pointer-events-none">
          Left: Move · Right / 🎯: Aim & Fire
        </div>

        {/* Floating Touch Joystick */}
        {touchJoystick.active && (
          <div
            className="absolute pointer-events-none z-40"
            style={{
              left: `${touchJoystick.startX - 55}px`,
              top: `${touchJoystick.startY - 55}px`,
            }}
          >
            <div className="w-[110px] h-[110px] rounded-full bg-cyan-950/45 border-2 border-cyan-400/60 backdrop-blur-sm flex items-center justify-center shadow-[0_0_25px_rgba(0,245,255,0.35)]">
              <div
                className="w-12 h-12 rounded-full bg-gradient-to-tr from-cyan-400 to-blue-500 border-2 border-white shadow-lg"
                style={{
                  transform: `translate(${touchJoystick.currentX - touchJoystick.startX}px, ${
                    touchJoystick.currentY - touchJoystick.startY
                  }px)`,
                }}
              />
            </div>
          </div>
        )}

        {/* Right-Hand Aim Crosshair */}
        {touchAimCrosshair.active && (
          <div
            className="absolute pointer-events-none z-40 w-10 h-10 -ml-5 -mt-5 rounded-full border-2 border-amber-400/90 bg-amber-400/15 flex items-center justify-center"
            style={{ left: `${touchAimCrosshair.x}px`, top: `${touchAimCrosshair.y}px` }}
          >
            <div className="w-2 h-2 rounded-full bg-amber-400" />
          </div>
        )}
      </div>

      {/* Bottom Action & Movement Bar */}
      <div className="w-full max-w-7xl flex flex-wrap items-center justify-between gap-1.5 sm:gap-3 bg-slate-900/95 border border-slate-800 px-2 sm:px-3 py-1.5 sm:py-2 rounded-xl sm:rounded-2xl z-20 shadow-2xl shrink-0">
        <div className="flex items-center gap-1.5 sm:gap-2 flex-wrap">
          <button
            onMouseDown={() => {
              stateRef.current.autoAimFire = true;
              stateRef.current.mouse.down = true;
            }}
            onMouseUp={() => {
              stateRef.current.autoAimFire = false;
              stateRef.current.mouse.down = false;
            }}
            onMouseLeave={() => {
              stateRef.current.autoAimFire = false;
              stateRef.current.mouse.down = false;
            }}
            onTouchStart={(e) => {
              e.preventDefault();
              stateRef.current.isTouchDevice = true;
              stateRef.current.autoAimFire = true;
              stateRef.current.mouse.down = true;
            }}
            onTouchEnd={(e) => {
              e.preventDefault();
              stateRef.current.autoAimFire = false;
              stateRef.current.mouse.down = false;
            }}
            onTouchCancel={() => {
              stateRef.current.autoAimFire = false;
              stateRef.current.mouse.down = false;
            }}
            className="px-3 sm:px-4 py-2 rounded-xl bg-gradient-to-r from-amber-400 via-orange-500 to-rose-500 hover:brightness-110 text-black font-black text-xs sm:text-sm flex items-center gap-1.5 shadow-lg border border-amber-200 active:scale-95 transition-all touch-none whitespace-nowrap"
            title="Hold to auto-lock onto visible enemies and fire accurately"
          >
            <Target className="w-4 h-4 shrink-0" />
            <span>🎯 Smart Fire</span>
          </button>

          <button
            onClick={triggerDeflectorSwing}
            onTouchStart={(e) => {
              e.preventDefault();
              triggerDeflectorSwing();
            }}
            className="px-2.5 sm:px-3.5 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:brightness-110 text-black font-extrabold text-xs sm:text-sm flex items-center gap-1.5 shadow-lg border border-cyan-300 active:scale-95 transition-all touch-none whitespace-nowrap"
            title="Deflect incoming projectiles back at enemies [Space]"
          >
            <Shield className="w-4 h-4 fill-current shrink-0" />
            <span>Deflect</span>
            <span className="hidden md:inline font-mono text-[10px] bg-black/20 px-1 rounded">[Space]</span>
          </button>

          <button
            onClick={toggleSprintLatch}
            className={`px-2.5 sm:px-3 py-2 rounded-xl font-extrabold text-xs flex items-center gap-1 transition-all shadow-md whitespace-nowrap border ${
              hudStats.isSprinting || sprintLatchUI
                ? 'bg-cyan-400 text-black border-white shadow-[0_0_16px_rgba(34,211,238,0.6)]'
                : hudStats.sprintExhausted
                ? 'bg-rose-950/70 text-rose-300 border-rose-700'
                : 'bg-slate-800 hover:bg-slate-700 text-cyan-200 border-cyan-500/40'
            }`}
            title="Toggle Walk / Sprint mode (or hold Shift)"
          >
            <Flame className="w-3.5 h-3.5 shrink-0" />
            <span>{hudStats.isSprinting || sprintLatchUI ? 'Sprint ON' : 'Walk'}</span>
            <span className="hidden md:inline font-mono text-[10px] opacity-75">[Shift]</span>
          </button>

          <button
            onClick={triggerKineticPulse}
            disabled={hudStats.pulseCooldown > 0}
            className={`px-2.5 sm:px-3 py-2 rounded-xl font-bold text-xs flex items-center gap-1 transition-all shadow-md whitespace-nowrap ${
              hudStats.pulseCooldown > 0
                ? 'bg-slate-800 text-slate-500 border border-slate-700 cursor-not-allowed'
                : 'bg-emerald-600 hover:bg-emerald-500 text-white border border-emerald-400 active:scale-95'
            }`}
            title="360° Kinetic Pulse [E]"
          >
            <Activity className="w-3.5 h-3.5 shrink-0" />
            <span className="hidden sm:inline">Pulse</span>
            <span className="font-mono text-[10px]">
              {hudStats.pulseCooldown > 0 ? `${hudStats.pulseCooldown}s` : 'E'}
            </span>
          </button>

          <button
            onClick={triggerEmpJammer}
            disabled={hudStats.empCooldown > 0}
            className={`px-2.5 sm:px-3 py-2 rounded-xl font-bold text-xs flex items-center gap-1 transition-all shadow-md whitespace-nowrap ${
              hudStats.empCooldown > 0
                ? 'bg-slate-800 text-slate-500 border border-slate-700 cursor-not-allowed'
                : 'bg-purple-600 hover:bg-purple-500 text-white border border-purple-400 active:scale-95'
            }`}
            title="EMP Jammer — Disable enemy turrets & spacecraft [Q]"
          >
            <Radio className="w-3.5 h-3.5 shrink-0" />
            <span className="hidden sm:inline">EMP</span>
            <span className="font-mono text-[10px]">
              {hudStats.empCooldown > 0 ? `${hudStats.empCooldown}s` : 'Q'}
            </span>
          </button>

          <button
            onClick={triggerQuantumBarrier}
            disabled={hudStats.quantumCooldown > 0}
            className={`px-2.5 sm:px-3 py-2 rounded-xl font-bold text-xs flex items-center gap-1 transition-all shadow-md whitespace-nowrap ${
              hudStats.quantumCooldown > 0
                ? 'bg-slate-800 text-slate-500 border border-slate-700 cursor-not-allowed'
                : 'bg-amber-500 hover:bg-amber-400 text-black font-extrabold border border-amber-300 active:scale-95'
            }`}
            title="Quantum Immunity Shield [R]"
          >
            <ShieldAlert className="w-3.5 h-3.5 shrink-0" />
            <span className="hidden sm:inline">Quantum</span>
            <span className="font-mono text-[10px]">
              {hudStats.quantumCooldown > 0 ? `${hudStats.quantumCooldown}s` : 'R'}
            </span>
          </button>
        </div>

        {/* Touch Movement Pad */}
        <div className="flex items-center gap-1 sm:gap-1.5">
          <button
            onMouseDown={() => (stateRef.current.keys.left = true)}
            onMouseUp={() => (stateRef.current.keys.left = false)}
            onMouseLeave={() => (stateRef.current.keys.left = false)}
            onTouchStart={(e) => {
              e.preventDefault();
              stateRef.current.keys.left = true;
            }}
            onTouchEnd={(e) => {
              e.preventDefault();
              stateRef.current.keys.left = false;
            }}
            className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-slate-800 hover:bg-slate-700 active:bg-cyan-600 text-slate-200 flex items-center justify-center border border-slate-700 shadow touch-none"
            title="Move Left (A)"
          >
            <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5" />
          </button>

          <button
            onMouseDown={() => (stateRef.current.keys.jump = true)}
            onMouseUp={() => (stateRef.current.keys.jump = false)}
            onMouseLeave={() => (stateRef.current.keys.jump = false)}
            onTouchStart={(e) => {
              e.preventDefault();
              stateRef.current.keys.jump = true;
            }}
            onTouchEnd={(e) => {
              e.preventDefault();
              stateRef.current.keys.jump = false;
            }}
            className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-cyan-900/70 hover:bg-cyan-800 active:bg-cyan-500 text-cyan-200 flex items-center justify-center border border-cyan-500/50 shadow touch-none"
            title="Jet Jump (W)"
          >
            <ArrowUp className="w-4 h-4 sm:w-5 sm:h-5" />
          </button>

          <button
            onMouseDown={() => (stateRef.current.keys.crouch = true)}
            onMouseUp={() => (stateRef.current.keys.crouch = false)}
            onMouseLeave={() => (stateRef.current.keys.crouch = false)}
            onTouchStart={(e) => {
              e.preventDefault();
              stateRef.current.keys.crouch = true;
            }}
            onTouchEnd={(e) => {
              e.preventDefault();
              stateRef.current.keys.crouch = false;
            }}
            className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-slate-800 hover:bg-slate-700 active:bg-cyan-600 text-slate-200 flex items-center justify-center border border-slate-700 shadow touch-none"
            title="Crouch / Evade (S)"
          >
            <ArrowDown className="w-4 h-4 sm:w-5 sm:h-5" />
          </button>

          <button
            onMouseDown={() => (stateRef.current.keys.right = true)}
            onMouseUp={() => (stateRef.current.keys.right = false)}
            onMouseLeave={() => (stateRef.current.keys.right = false)}
            onTouchStart={(e) => {
              e.preventDefault();
              stateRef.current.keys.right = true;
            }}
            onTouchEnd={(e) => {
              e.preventDefault();
              stateRef.current.keys.right = false;
            }}
            className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-slate-800 hover:bg-slate-700 active:bg-cyan-600 text-slate-200 flex items-center justify-center border border-slate-700 shadow touch-none"
            title="Move Right (D)"
          >
            <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5" />
          </button>
        </div>
      </div>
    </div>
  );
};

function drawSpacecraftUnit(ctx: CanvasRenderingContext2D, unit: SpaceUnit, timer: number) {
  ctx.save();
  ctx.translate(unit.x, unit.y);

  const hullFill = unit.hitFlash > 0 ? '#ffffff' : '#0f172a';
  const accent = unit.color;

  // Thruster glow
  const thrusterPulse = 4 + Math.sin(timer * 24 + unit.phase) * 2.5;
  ctx.fillStyle = accent;
  ctx.shadowColor = accent;
  ctx.shadowBlur = 12;

  if (unit.archetype === 'alien-scout') {
    // Sleek saucer hull
    ctx.beginPath();
    ctx.ellipse(0, 2, unit.width * 0.48, unit.height * 0.28, 0, 0, Math.PI * 2);
    ctx.fillStyle = hullFill;
    ctx.fill();
    ctx.strokeStyle = accent;
    ctx.lineWidth = 2.5;
    ctx.stroke();

    // Alien dome
    ctx.beginPath();
    ctx.arc(0, -4, 11, Math.PI, 0);
    ctx.fillStyle = 'rgba(56, 189, 248, 0.55)';
    ctx.fill();
    ctx.stroke();

    // Twin engine pods
    ctx.fillStyle = '#22d3ee';
    ctx.fillRect(-14, 7, 6, thrusterPulse);
    ctx.fillRect(8, 7, 6, thrusterPulse);
  } else if (unit.archetype === 'hover-gunship') {
    // Armored interceptor wings
    ctx.beginPath();
    ctx.moveTo(0, -16);
    ctx.lineTo(26, 4);
    ctx.lineTo(14, 16);
    ctx.lineTo(-14, 16);
    ctx.lineTo(-26, 4);
    ctx.closePath();
    ctx.fillStyle = hullFill;
    ctx.fill();
    ctx.strokeStyle = accent;
    ctx.lineWidth = 2.5;
    ctx.stroke();

    // Visor & side cannons
    ctx.fillStyle = '#fbbf24';
    ctx.fillRect(-10, -4, 20, 6);
    ctx.fillStyle = '#f97316';
    ctx.fillRect(-24, 6, 6, 12);
    ctx.fillRect(18, 6, 6, 12);
  } else if (unit.archetype === 'pulse-cruiser') {
    // Dual-ring cruiser
    ctx.beginPath();
    ctx.roundRect(-28, -14, 56, 28, 12);
    ctx.fillStyle = hullFill;
    ctx.fill();
    ctx.strokeStyle = accent;
    ctx.lineWidth = 3;
    ctx.stroke();

    ctx.beginPath();
    ctx.arc(0, 0, 10 + Math.sin(timer * 8) * 1.5, 0, Math.PI * 2);
    ctx.fillStyle = '#e879f9';
    ctx.fill();
  } else if (unit.archetype === 'void-splitter') {
    // Tri-blade rotating frame
    ctx.save();
    ctx.rotate(Math.sin(timer * 2.5 + unit.phase) * 0.25);
    ctx.beginPath();
    ctx.moveTo(0, -22);
    ctx.lineTo(24, 0);
    ctx.lineTo(0, 22);
    ctx.lineTo(-24, 0);
    ctx.closePath();
    ctx.fillStyle = hullFill;
    ctx.fill();
    ctx.strokeStyle = accent;
    ctx.lineWidth = 3;
    ctx.stroke();
    ctx.restore();

    ctx.beginPath();
    ctx.arc(0, 0, 7, 0, Math.PI * 2);
    ctx.fillStyle = '#fda4af';
    ctx.fill();
  } else {
    // Alien Commander Dreadnought
    ctx.beginPath();
    ctx.moveTo(0, -24);
    ctx.lineTo(36, -4);
    ctx.lineTo(28, 20);
    ctx.lineTo(-28, 20);
    ctx.lineTo(-36, -4);
    ctx.closePath();
    ctx.fillStyle = '#1e1b4b';
    ctx.fill();
    ctx.strokeStyle = accent;
    ctx.lineWidth = 3.5;
    ctx.stroke();

    ctx.beginPath();
    ctx.arc(0, -2, 12, 0, Math.PI * 2);
    ctx.fillStyle = '#f472b6';
    ctx.fill();
  }

  ctx.shadowBlur = 0;

  // Firing telegraph ring
  if (!unit.isJammed && unit.shootCooldown < 0.35) {
    const warnAlpha = 0.5 + 0.5 * Math.sin(timer * 24);
    ctx.beginPath();
    ctx.arc(0, 0, Math.max(unit.width, unit.height) * 0.62, 0, Math.PI * 2);
    ctx.strokeStyle = `rgba(251, 113, 133, ${warnAlpha})`;
    ctx.lineWidth = 2;
    ctx.stroke();
  }

  if (unit.isJammed) {
    ctx.fillStyle = '#00f5ff';
    ctx.font = 'bold 11px "Plus Jakarta Sans", sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('⚡ JAMMED', 0, -unit.height / 2 - 14);
  }

  // Health bar above ship
  const bw = unit.width;
  ctx.fillStyle = 'rgba(0, 0, 0, 0.85)';
  ctx.fillRect(-bw / 2, -unit.height / 2 - 10, bw, 5);
  ctx.fillStyle = accent;
  ctx.fillRect(-bw / 2, -unit.height / 2 - 10, Math.max(0, (unit.hp / unit.maxHp) * bw), 5);

  ctx.restore();
}

function drawBaseHealthBar(ctx: CanvasRenderingContext2D, base: EnemyBase) {
  const barW = base.width;
  const barH = 6;
  ctx.fillStyle = 'rgba(0,0,0,0.8)';
  ctx.fillRect(base.x, base.y - 12, barW, barH);
  ctx.fillStyle = base.color;
  ctx.fillRect(base.x, base.y - 12, (base.hp / base.maxHp) * barW, barH);
  ctx.strokeStyle = '#3f3f46';
  ctx.lineWidth = 1;
  ctx.strokeRect(base.x, base.y - 12, barW, barH);
}

function drawAIEraParallaxBackground(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  _themeType: World['themeType'],
  cameraX: number,
  timer: number,
  aiNeuralPackets: { x: number; y: number; vx: number; vy: number; targetIdx: number; color: string }[]
) {
  ctx.save();

  const gridStep = 70;
  const offsetX = (cameraX * 0.14) % gridStep;
  ctx.strokeStyle = 'rgba(6, 182, 212, 0.07)';
  ctx.lineWidth = 1;
  for (let x = -offsetX; x < width; x += gridStep) {
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x, height);
    ctx.stroke();
  }
  for (let y = 0; y < height; y += gridStep) {
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(width, y);
    ctx.stroke();
  }

  const baseNodes = [
    { x: 180, y: 120 },
    { x: 380, y: 260 },
    { x: 600, y: 140 },
    { x: 820, y: 320 },
    { x: 1040, y: 160 },
    { x: 480, y: 440 },
    { x: 740, y: 460 },
    { x: 960, y: 420 },
  ];

  ctx.strokeStyle = 'rgba(0, 245, 255, 0.12)';
  ctx.lineWidth = 1.5;
  for (let i = 0; i < baseNodes.length; i++) {
    for (let j = i + 1; j < baseNodes.length; j++) {
      const nodeA = baseNodes[i];
      const nodeB = baseNodes[j];
      const screenAX = ((nodeA.x - cameraX * 0.2 + 3000) % (width + 300)) - 100;
      const screenBX = ((nodeB.x - cameraX * 0.2 + 3000) % (width + 300)) - 100;

      const dist = Math.hypot(screenAX - screenBX, nodeA.y - nodeB.y);
      if (dist < 340) {
        ctx.beginPath();
        ctx.moveTo(screenAX, nodeA.y);
        ctx.lineTo(screenBX, nodeB.y);
        ctx.stroke();
      }
    }
  }

  baseNodes.forEach((node, idx) => {
    const screenX = ((node.x - cameraX * 0.2 + 3000) % (width + 300)) - 100;
    const pulse = Math.sin(timer * 3 + idx) * 3;

    ctx.beginPath();
    ctx.arc(screenX, node.y, 7 + pulse, 0, Math.PI * 2);
    ctx.fillStyle = 'rgba(0, 245, 255, 0.35)';
    ctx.shadowColor = '#00f5ff';
    ctx.shadowBlur = 12;
    ctx.fill();
    ctx.shadowBlur = 0;
  });

  aiNeuralPackets.forEach((p) => {
    p.x += p.vx;
    p.y += p.vy;
    if (p.x < 0) p.x = width;
    if (p.x > width) p.x = 0;
    if (p.y < 0) p.y = height - 120;
    if (p.y > height - 120) p.y = 0;

    ctx.beginPath();
    ctx.arc(p.x, p.y, 2.5, 0, Math.PI * 2);
    ctx.fillStyle = p.color;
    ctx.shadowColor = p.color;
    ctx.shadowBlur = 8;
    ctx.fill();
    ctx.shadowBlur = 0;
  });

  const aiSymbols = [
    'Attention(Q,K,V) = softmax(QKᵀ/√d)V',
    'Deep Neural Network: y = σ(W₂·ReLU(W₁·x + b₁) + b₂)',
    'TPU Tensor Core v5: Active Matrix 128x128',
    'Quantum State: |Ψ⟩ = (1/√2)|00⟩ + (1/√2)|11⟩',
    'Backpropagation: ∂L/∂W = (∂L/∂y)·(∂y/∂z)·(∂z/∂W)',
    'Large Language Model: Tokenizer Vector Embedding',
    'Zero-Trust AI Guardrail: Active Inspection',
  ];

  ctx.fillStyle = 'rgba(0, 245, 255, 0.24)';
  ctx.font = '12px monospace';
  aiSymbols.forEach((sym, idx) => {
    const x = ((idx * 280 - cameraX * 0.28 + 4000) % (width + 450)) - 120;
    const y = 80 + idx * 55;
    ctx.fillText(sym, x, y);
  });

  ctx.strokeStyle = 'rgba(16, 185, 129, 0.14)';
  ctx.strokeRect(width - 240, 60, 180, 90);
  ctx.fillStyle = 'rgba(16, 185, 129, 0.2)';
  ctx.font = '10px monospace';
  ctx.fillText('NPU ACCELERATOR: 450 TFLOPS', width - 230, 80);
  ctx.fillText('MEMORY BUS: HBM3e 1.2 TB/s', width - 230, 98);
  ctx.fillText('STATUS: INFERENCE ONLINE', width - 230, 116);

  ctx.restore();
}
