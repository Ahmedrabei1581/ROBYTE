/**
 * @license
 * Copyright (c) 2026-2027 Ahmed Ramadan Fouad Ahmed Rabei — ROBYTE — All Rights Reserved.
 * Exclusive Intellectual Property, Publishing & Distribution Rights: Ahmed Ramadan Fouad Ahmed Rabei.
 */

import React, { useEffect, useRef, useState } from 'react';
import { GameProvider, useGame } from './context/GameContext';
import { TitleScreen } from './components/game/TitleScreen';
import { WorldMap } from './components/game/WorldMap';
import { ActionGameCanvas } from './components/game/ActionGameCanvas';
import { QuestionModal } from './components/modals/QuestionModal';
import { WorldSummaryModal } from './components/modals/WorldSummaryModal';
import { RewardsStoreModal } from './components/modals/RewardsStoreModal';
import { TeacherDashboard } from './components/dashboard/TeacherDashboard';
import { CurriculumMapModal } from './components/curriculum/CurriculumMapModal';
import { PerkSelectionModal } from './components/modals/PerkSelectionModal';
import { PlayerNameModal } from './components/modals/PlayerNameModal';
import { CodeExportModal } from './components/modals/CodeExportModal';
import { PWAInstallButton } from './components/pwa/PWAInstallButton';
import { OfflineIndicator } from './components/pwa/OfflineIndicator';
import { World, SubStage, Question, StagePerk, ScreenState } from './types/gameTypes';
import { WORLDS_DATA, CHARACTERS_DATA, WEAPONS_DATA, ARMORS_DATA, STAGE_PERKS_POOL } from './data/curriculumData';
import { sounds } from './utils/soundEffects';
import {
  Sparkles,
  BarChart3,
  Volume2,
  VolumeX,
  RefreshCw,
  AlertOctagon,
  BookOpen,
  Gamepad2,
  Coins,
  User,
  RotateCcw,
  X,
  Menu,
  Home,
  Map as MapIcon,
  ShieldCheck,
  FolderArchive,
} from 'lucide-react';

const resolveWorldAndStage = (worldId?: number, subStageId?: number) => {
  const world = WORLDS_DATA.find((w) => w.id === worldId) || WORLDS_DATA[0];
  const subStage = world.subStages.find((s) => s.id === subStageId) || world.subStages[0];
  return { world, subStage };
};

const GameShell: React.FC = () => {
  const {
    state,
    profileVersion,
    isSessionAuthenticated,
    signOutSession,
    updateCheckpoint,
    markSubStageCompleted,
    startFreshForCurrentPlayer,
    toggleSound,
    awardReward,
    addRunPerk,
  } = useGame();

  const initialTarget = resolveWorldAndStage(state.lastActiveWorld, state.lastActiveSubStageId);

  const [currentScreen, setCurrentScreen] = useState<ScreenState>(() =>
    isSessionAuthenticated && state.hasRegisteredName ? state.lastScreen || 'playing' : 'title'
  );
  const [selectedWorld, setSelectedWorld] = useState<World>(initialTarget.world);
  const [selectedSubStage, setSelectedSubStage] = useState<SubStage>(initialTarget.subStage);

  const [showNameModal, setShowNameModal] = useState<boolean>(
    () => !isSessionAuthenticated || !state.hasRegisteredName
  );
  const [showWelcomeBanner, setShowWelcomeBanner] = useState<boolean>(false);
  const [showHeaderResetConfirm, setShowHeaderResetConfirm] = useState<boolean>(false);

  const [activeQuestion, setActiveQuestion] = useState<Question | null>(null);
  const [solvedQuestionsInStage, setSolvedQuestionsInStage] = useState<Set<number>>(
    () => new Set(state.solvedQuestionsInStage || [])
  );
  const [showWorldSummary, setShowWorldSummary] = useState(false);
  const [showGameOver, setShowGameOver] = useState(false);
  const [currentScore, setCurrentScore] = useState<number>(() => state.currentStageScore || 0);

  const [showPerkSelection, setShowPerkSelection] = useState(false);
  const [offeredPerks, setOfferedPerks] = useState<StagePerk[]>([]);
  const [pendingNextStage, setPendingNextStage] = useState<SubStage | null>(null);

  const [showStore, setShowStore] = useState(false);
  const [showDashboard, setShowDashboard] = useState(false);
  const [showCurriculumMap, setShowCurriculumMap] = useState(false);
  const [showCodeExport, setShowCodeExport] = useState(false);
  const [isSideMenuOpen, setIsSideMenuOpen] = useState(false);

  const lastHandledVersionRef = useRef<number>(profileVersion);
  const stateRef = useRef(state);
  stateRef.current = state;

  useEffect(() => {
    if (profileVersion === lastHandledVersionRef.current) return;
    lastHandledVersionRef.current = profileVersion;

    const latest = stateRef.current;
    const { world, subStage } = resolveWorldAndStage(latest.lastActiveWorld, latest.lastActiveSubStageId);
    setSelectedWorld(world);
    setSelectedSubStage(subStage);
    setSolvedQuestionsInStage(new Set(latest.solvedQuestionsInStage || []));
    setCurrentScore(latest.currentStageScore || 0);
    setCurrentScreen(
      isSessionAuthenticated && latest.hasRegisteredName ? latest.lastScreen || 'playing' : 'title'
    );
    setActiveQuestion(null);
    setShowWorldSummary(false);
    setShowGameOver(false);
    setShowPerkSelection(false);
    setPendingNextStage(null);
    setShowHeaderResetConfirm(false);
    if (isSessionAuthenticated && latest.hasRegisteredName) {
      setShowWelcomeBanner(true);
    } else {
      setShowWelcomeBanner(false);
    }
  }, [profileVersion, isSessionAuthenticated]);

  useEffect(() => {
    if (!showWelcomeBanner) return;
    const timer = window.setTimeout(() => setShowWelcomeBanner(false), 7500);
    return () => window.clearTimeout(timer);
  }, [showWelcomeBanner]);

  useEffect(() => {
    if (!isSideMenuOpen) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsSideMenuOpen(false);
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [isSideMenuOpen]);

  useEffect(() => {
    if (!state.hasRegisteredName || !isSessionAuthenticated) return;
    updateCheckpoint({
      lastScreen: currentScreen,
      lastActiveWorld: selectedWorld.id,
      lastActiveSubStageId: selectedSubStage.id,
      solvedQuestionsInStage: Array.from(solvedQuestionsInStage).sort((a, b) => a - b),
      currentStageScore: currentScore,
    });
  }, [
    state.hasRegisteredName,
    isSessionAuthenticated,
    currentScreen,
    selectedWorld.id,
    selectedSubStage.id,
    solvedQuestionsInStage,
    currentScore,
    updateCheckpoint,
  ]);

  const currentCharacter = CHARACTERS_DATA.find((c) => c.id === state.selectedCharacterId) || CHARACTERS_DATA[0];
  const currentWeapon = WEAPONS_DATA.find((w) => w.id === state.selectedWeaponId) || WEAPONS_DATA[0];
  const currentArmor = ARMORS_DATA.find((a) => a.id === state.selectedArmorId) || ARMORS_DATA[0];

  const skillBonus = {
    speedBonus: state.skillTree.speedLevel * 0.08,
    shieldBonus: state.skillTree.shieldLevel * 25,
    damageBonus: state.skillTree.damageLevel * 0.12,
  };

  const handleSelectSubStage = (world: World, subStage: SubStage) => {
    setSelectedWorld(world);
    setSelectedSubStage(subStage);
    setSolvedQuestionsInStage(new Set());
    setCurrentScore(0);
    setCurrentScreen('playing');
  };

  const handleSelectWorldFromCurriculum = (worldId: number) => {
    const w = WORLDS_DATA.find((item) => item.id === worldId);
    if (w) {
      setSelectedWorld(w);
      setSelectedSubStage(w.subStages[0]);
      setSolvedQuestionsInStage(new Set());
      setCurrentScore(0);
      setCurrentScreen('playing');
    }
  };

  const handleOpenQuestion = (questionIndex: number) => {
    const q = selectedSubStage.questions[questionIndex];
    if (q) {
      setActiveQuestion(q);
    }
  };

  const handleCloseQuestion = (isCorrect: boolean) => {
    if (activeQuestion) {
      const idx = activeQuestion.questionIndex - 1;
      if (isCorrect) {
        setSolvedQuestionsInStage((prev) => {
          const next = new Set(prev);
          next.add(idx);
          return next;
        });
        setCurrentScore((s) => s + 100);
      }
    }
    setActiveQuestion(null);
  };

  const handleStageVictory = (finalScore: number) => {
    awardReward(150, 200);
    markSubStageCompleted(selectedWorld.id, selectedSubStage.id);

    if (selectedSubStage.id === 5) {
      setCurrentScore(finalScore);
      setShowWorldSummary(true);
    } else {
      const nextStageId = selectedSubStage.id + 1;
      const nextStage = selectedWorld.subStages.find((s) => s.id === nextStageId);

      if (nextStage) {
        updateCheckpoint({
          lastActiveWorld: selectedWorld.id,
          lastActiveSubStageId: nextStage.id,
          solvedQuestionsInStage: [],
          currentStageScore: 0,
          lastScreen: 'playing',
        });

        const shuffled = [...STAGE_PERKS_POOL].sort(() => 0.5 - Math.random());
        const selectedThree = shuffled.slice(0, 3);
        setOfferedPerks(selectedThree);
        setPendingNextStage(nextStage);
        setShowPerkSelection(true);
      } else {
        setShowWorldSummary(true);
      }
    }
  };

  const handlePerkChosen = (perk: StagePerk) => {
    addRunPerk(perk.id);
    setShowPerkSelection(false);
    if (pendingNextStage) {
      setSelectedSubStage(pendingNextStage);
      setSolvedQuestionsInStage(new Set());
      setCurrentScore(0);
    }
  };

  const handleGameOver = (finalScore: number) => {
    setCurrentScore(finalScore);
    setShowGameOver(true);
  };

  const retrySubStage = () => {
    setShowGameOver(false);
    setSolvedQuestionsInStage(new Set());
    sounds.playClick();
  };

  const handleProceedNextWorld = () => {
    setShowWorldSummary(false);
    if (selectedWorld.id < 4) {
      const nextW = WORLDS_DATA[selectedWorld.id];
      setSelectedWorld(nextW);
      setSelectedSubStage(nextW.subStages[0]);
      setSolvedQuestionsInStage(new Set());
      setCurrentScore(0);
      setCurrentScreen('playing');
    } else {
      setCurrentScreen('map');
    }
  };

  return (
    <div dir="ltr" className="relative w-screen h-dvh flex flex-col bg-[#060913] text-slate-100 overflow-hidden font-sans select-none">
      {/* Floating Side Drawer Trigger on Title & World Map (Embedded in Battle HUD during play) */}
      {currentScreen !== 'playing' && (
        <button
          onClick={() => {
            sounds.playClick();
            setIsSideMenuOpen(true);
          }}
          className="fixed top-3 left-3 z-40 flex items-center gap-2 px-3 py-2 rounded-2xl bg-slate-950/90 hover:bg-slate-900 border border-cyan-500/45 text-cyan-300 hover:text-white shadow-[0_0_24px_rgba(0,245,255,0.2)] backdrop-blur-md transition-all active:scale-95 whitespace-nowrap"
          title="Open Options & Navigation Drawer"
        >
          <Menu className="w-4 h-4 text-cyan-400 shrink-0" />
          <span className="text-xs font-bold">Options</span>
          <span className="hidden sm:inline-flex items-center gap-1 px-1.5 py-0.5 rounded-lg bg-amber-500/15 border border-amber-500/30 text-[10px] font-mono tabular-nums text-amber-300">
            <Coins className="w-3 h-3" />
            {state.coins}
          </span>
        </button>
      )}

      {/* Slide-out Options & Navigation Side Drawer (Full-screen canvas preserved underneath) */}
      {isSideMenuOpen && (
        <div className="fixed inset-0 z-50 flex justify-start" dir="ltr">
          <div
            className="fixed inset-0 bg-black/70 backdrop-blur-sm transition-opacity"
            onClick={() => setIsSideMenuOpen(false)}
          />

          <aside className="relative z-10 w-72 sm:w-80 max-w-[88vw] h-full bg-slate-950/95 border-r border-cyan-500/40 shadow-[0_0_50px_rgba(0,0,0,0.9)] backdrop-blur-xl flex flex-col justify-between overflow-y-auto p-4 text-left">
            <div className="flex flex-col gap-4">
              {/* Drawer Header */}
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-xl bg-cyan-500/15 border border-cyan-500/40 flex items-center justify-center shrink-0">
                    <Gamepad2 className="w-4 h-4 text-cyan-400" />
                  </div>
                  <div className="flex flex-col">
                    <span className="tracking-widest text-base bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400 bg-clip-text text-transparent font-cyber font-black">
                      ROBYTE
                    </span>
                    <span className="text-[10px] text-slate-400">Options & Navigation</span>
                  </div>
                </div>
                <button
                  onClick={() => {
                    sounds.playClick();
                    setIsSideMenuOpen(false);
                  }}
                  className="p-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-400 hover:text-white transition-colors"
                  aria-label="Close menu"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Active Hero Profile Card */}
              <div className="rounded-2xl bg-slate-900/90 border border-cyan-500/30 p-3 flex flex-col gap-2.5">
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2 min-w-0">
                    <div className="w-9 h-9 rounded-xl bg-cyan-500/15 border border-cyan-500/40 flex items-center justify-center shrink-0">
                      <User className="w-4 h-4 text-cyan-300" />
                    </div>
                    <div className="min-w-0">
                      <div className="text-xs font-cyber font-bold text-white truncate">{state.playerName}</div>
                      <div className="text-[10px] text-slate-400 font-tech">
                        Level {state.playerLevel} · World {selectedWorld.id}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-1 bg-amber-500/15 border border-amber-500/35 px-2 py-1 rounded-xl text-xs font-cyber font-bold text-amber-300 tabular-nums shrink-0">
                    <Coins className="w-3.5 h-3.5 shrink-0" />
                    <span>{state.coins}</span>
                  </div>
                </div>

                <button
                  onClick={() => {
                    sounds.playClick();
                    setIsSideMenuOpen(false);
                    setShowNameModal(true);
                  }}
                  className="w-full py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-[11px] font-bold text-cyan-300 transition-colors"
                >
                  Switch Account / Edit Hero Name
                </button>
              </div>

              {/* Game Screens */}
              <div className="flex flex-col gap-1.5">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 px-1">
                  Game Screens
                </span>

                <button
                  onClick={() => {
                    sounds.playClick();
                    setCurrentScreen('title');
                    setIsSideMenuOpen(false);
                  }}
                  className={`w-full px-3.5 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2.5 transition-colors ${
                    currentScreen === 'title'
                      ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/50'
                      : 'bg-slate-900/70 hover:bg-slate-800 text-slate-200 border border-slate-800'
                  }`}
                >
                  <Home className="w-4 h-4 text-cyan-400 shrink-0" />
                  <span>Title Screen</span>
                </button>

                <button
                  onClick={() => {
                    sounds.playClick();
                    setCurrentScreen('playing');
                    setIsSideMenuOpen(false);
                  }}
                  className={`w-full px-3.5 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2.5 transition-colors ${
                    currentScreen === 'playing'
                      ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/50'
                      : 'bg-slate-900/70 hover:bg-slate-800 text-slate-200 border border-slate-800'
                  }`}
                >
                  <Gamepad2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Combat Arena</span>
                </button>

                <button
                  onClick={() => {
                    sounds.playClick();
                    setCurrentScreen('map');
                    setIsSideMenuOpen(false);
                  }}
                  className={`w-full px-3.5 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2.5 transition-colors ${
                    currentScreen === 'map'
                      ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/50'
                      : 'bg-slate-900/70 hover:bg-slate-800 text-slate-200 border border-slate-800'
                  }`}
                >
                  <MapIcon className="w-4 h-4 text-blue-400 shrink-0" />
                  <span>Worlds & Stages Map</span>
                </button>
              </div>

              {/* Learning, Armory & Tools */}
              <div className="flex flex-col gap-1.5">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 px-1">
                  Upgrades & Resources
                </span>

                <button
                  onClick={() => {
                    sounds.playClick();
                    setIsSideMenuOpen(false);
                    setShowCurriculumMap(true);
                  }}
                  className="w-full px-3.5 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2.5 bg-slate-900/70 hover:bg-slate-800 text-slate-200 border border-slate-800 transition-colors"
                >
                  <BookOpen className="w-4 h-4 text-cyan-400 shrink-0" />
                  <span>Curriculum Overview</span>
                </button>

                <button
                  onClick={() => {
                    sounds.playClick();
                    setIsSideMenuOpen(false);
                    setShowStore(true);
                  }}
                  className="w-full px-3.5 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2.5 bg-slate-900/70 hover:bg-slate-800 text-amber-300 border border-slate-800 transition-colors"
                >
                  <Sparkles className="w-4 h-4 text-amber-400 shrink-0" />
                  <span>Armory & Heroes Store</span>
                </button>

                <button
                  onClick={() => {
                    sounds.playClick();
                    setIsSideMenuOpen(false);
                    setShowDashboard(true);
                  }}
                  className="w-full px-3.5 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2.5 bg-slate-900/70 hover:bg-slate-800 text-slate-200 border border-slate-800 transition-colors"
                >
                  <BarChart3 className="w-4 h-4 text-purple-400 shrink-0" />
                  <span>Teacher Analytics</span>
                </button>

                <button
                  onClick={() => {
                    sounds.playClick();
                    setIsSideMenuOpen(false);
                    setShowCodeExport(true);
                  }}
                  className="w-full px-3.5 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2.5 bg-slate-900/70 hover:bg-slate-800 text-emerald-300 border border-slate-800 transition-colors"
                >
                  <FolderArchive className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Download Source ZIP</span>
                </button>
              </div>

              {/* Game Settings */}
              <div className="flex flex-col gap-1.5">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 px-1">
                  Settings
                </span>

                <button
                  onClick={() => toggleSound()}
                  className="w-full px-3.5 py-2.5 rounded-xl text-xs font-bold flex items-center justify-between gap-2 bg-slate-900/70 hover:bg-slate-800 text-slate-200 border border-slate-800 transition-colors"
                >
                  <span className="flex items-center gap-2.5">
                    {state.soundEnabled ? (
                      <Volume2 className="w-4 h-4 text-cyan-400 shrink-0" />
                    ) : (
                      <VolumeX className="w-4 h-4 text-slate-500 shrink-0" />
                    )}
                    <span>Sound Effects</span>
                  </span>
                  <span
                    className={`text-[10px] px-2 py-0.5 rounded-md ${
                      state.soundEnabled ? 'bg-cyan-500/20 text-cyan-300' : 'bg-slate-800 text-slate-400'
                    }`}
                  >
                    {state.soundEnabled ? 'On' : 'Muted'}
                  </span>
                </button>

                <PWAInstallButton variant="drawer" />

                {isSessionAuthenticated && state.hasRegisteredName && (
                  <>
                    <button
                      onClick={() => {
                        sounds.playClick();
                        setIsSideMenuOpen(false);
                        signOutSession();
                        setShowNameModal(true);
                      }}
                      className="w-full px-3.5 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2.5 bg-slate-900/70 hover:bg-slate-800 text-amber-300 border border-amber-500/35 transition-colors"
                    >
                      <User className="w-4 h-4 text-amber-400 shrink-0" />
                      <span>Sign Out / Switch Device User</span>
                    </button>

                    <button
                      onClick={() => {
                        sounds.playClick();
                        setIsSideMenuOpen(false);
                        setShowHeaderResetConfirm(true);
                      }}
                      className="w-full px-3.5 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2.5 bg-rose-950/50 hover:bg-rose-900/70 text-rose-300 border border-rose-500/35 transition-colors"
                    >
                      <RotateCcw className="w-4 h-4 text-rose-400 shrink-0" />
                      <span>Start Over (Reset Progress)</span>
                    </button>
                  </>
                )}
              </div>
            </div>

            {/* Copyright & Ownership Footer */}
            <div className="pt-4 mt-4 border-t border-slate-800/80 flex items-start gap-2 text-[10px] text-slate-400 leading-relaxed">
              <ShieldCheck className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
              <span>
                All Rights Reserved © 2026–2027
                <br />
                <strong className="text-cyan-300">Ahmed Ramadan Fouad Ahmed Rabei</strong>
              </span>
            </div>
          </aside>
        </div>
      )}

      {/* Floating Auto-Resume Banner */}
      {showWelcomeBanner && isSessionAuthenticated && state.hasRegisteredName && !showNameModal && (
        <div className="fixed bottom-3 left-1/2 -translate-x-1/2 z-40 w-[calc(100%-1.5rem)] max-w-2xl bg-gradient-to-r from-cyan-950/95 via-slate-900/95 to-indigo-950/95 border border-cyan-500/50 rounded-2xl px-3.5 py-2.5 shadow-2xl backdrop-blur-md">
          <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
            <div className="flex items-center gap-2 text-cyan-100">
              <span className="px-2 py-0.5 rounded-md bg-cyan-500/20 border border-cyan-400/50 text-cyan-300 font-bold shrink-0">
                Auto-Resume
              </span>
              <span>
                Welcome back, <strong className="text-white font-cyber">{state.playerName}</strong>! Restored checkpoint:{' '}
                <strong className="text-amber-300">
                  {selectedWorld.title} · Stage {selectedSubStage.id}
                </strong>
              </span>
            </div>

            <div className="flex items-center gap-1.5">
              <button
                onClick={() => {
                  sounds.playClick();
                  setShowWelcomeBanner(false);
                  setCurrentScreen('map');
                }}
                className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-600 text-cyan-300 font-bold transition-colors whitespace-nowrap"
              >
                Switch Stage
              </button>
              <button
                onClick={() => {
                  sounds.playClick();
                  setShowWelcomeBanner(false);
                  setShowHeaderResetConfirm(true);
                }}
                className="px-2.5 py-1 rounded-lg bg-rose-950/70 hover:bg-rose-900 border border-rose-500/40 text-rose-300 font-bold transition-colors whitespace-nowrap"
              >
                Start Over
              </button>
              <button
                onClick={() => setShowWelcomeBanner(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-white"
                aria-label="Dismiss"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Full-Viewport Active Screen */}
      <main className="flex-1 min-h-0 relative w-full h-full overflow-hidden">
        {currentScreen === 'title' && (
          <TitleScreen
            onStart={() => setCurrentScreen('playing')}
            onOpenStore={() => setShowStore(true)}
            onOpenDashboard={() => setShowDashboard(true)}
            isModalOpen={
              !isSessionAuthenticated ||
              isSideMenuOpen ||
              showNameModal ||
              showHeaderResetConfirm ||
              showStore ||
              showDashboard ||
              showCurriculumMap ||
              showCodeExport
            }
          />
        )}

        {currentScreen === 'map' && (
          <WorldMap
            onSelectSubStage={handleSelectSubStage}
            onOpenStore={() => setShowStore(true)}
            onOpenTeacherDashboard={() => setShowDashboard(true)}
            onBackToHome={() => setCurrentScreen('title')}
          />
        )}

        {currentScreen === 'playing' && (
          <ActionGameCanvas
            key={`${state.playerName}-${profileVersion}-${selectedWorld.id}-${selectedSubStage.id}`}
            playerName={state.playerName}
            world={selectedWorld}
            subStage={selectedSubStage}
            character={currentCharacter}
            weapon={currentWeapon}
            armor={currentArmor}
            skillBonus={skillBonus}
            activePerks={state.activeRunPerks}
            onOpenQuestion={handleOpenQuestion}
            solvedQuestions={solvedQuestionsInStage}
            onGameOver={handleGameOver}
            onStageVictory={handleStageVictory}
            onBackToHome={() => setCurrentScreen('title')}
            onOpenMenu={() => setIsSideMenuOpen(true)}
          />
        )}
      </main>

      {/* Start Over Confirmation Modal */}
      {showHeaderResetConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
          <div className="w-full max-w-md bg-slate-900 border border-rose-500/60 rounded-2xl p-6 text-center flex flex-col items-center gap-4 shadow-2xl">
            <div className="w-14 h-14 rounded-2xl bg-rose-500/20 border border-rose-500/40 flex items-center justify-center text-rose-400">
              <RotateCcw className="w-7 h-7" />
            </div>
            <h2 className="text-xl font-bold font-cyber text-white">Start Over</h2>
            <p className="text-xs text-slate-300 leading-relaxed">
              This will reset all stage progress for "<strong className="text-cyan-300">{state.playerName}</strong>" and restart from World 1 · Stage 1 while keeping your unique profile name. Continue?
            </p>
            <div className="flex gap-2.5 w-full mt-1">
              <button
                onClick={() => setShowHeaderResetConfirm(false)}
                className="flex-1 py-2.5 rounded-xl border border-slate-700 hover:bg-slate-800 text-xs font-bold text-slate-300"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  sounds.playClick();
                  setShowHeaderResetConfirm(false);
                  startFreshForCurrentPlayer('playing');
                }}
                className="flex-1 py-2.5 rounded-xl bg-rose-500 hover:bg-rose-400 text-white text-xs font-bold shadow-lg"
              >
                Yes, Start Over
              </button>
            </div>
          </div>
        </div>
      )}

      {showPerkSelection && (
        <PerkSelectionModal
          stageNumber={selectedSubStage.id}
          stageName={selectedSubStage.name}
          perks={offeredPerks}
          onSelectPerk={handlePerkChosen}
        />
      )}

      {activeQuestion && (
        <QuestionModal
          question={activeQuestion}
          worldTitle={selectedWorld.title}
          subStageName={selectedSubStage.name}
          onClose={handleCloseQuestion}
          onBackToHome={() => {
            setActiveQuestion(null);
            setCurrentScreen('title');
          }}
        />
      )}

      {showWorldSummary && (
        <WorldSummaryModal
          world={selectedWorld}
          score={currentScore}
          onRetry={() => {
            setShowWorldSummary(false);
            setSolvedQuestionsInStage(new Set());
          }}
          onProceedNext={handleProceedNextWorld}
          onBackToMap={() => {
            setShowWorldSummary(false);
            setCurrentScreen('map');
          }}
          onBackToHome={() => {
            setShowWorldSummary(false);
            setCurrentScreen('title');
          }}
        />
      )}

      {showGameOver && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md">
          <div className="w-full max-w-md bg-slate-900 border border-rose-500/50 rounded-2xl p-6 text-center flex flex-col items-center gap-4 shadow-2xl">
            <div className="w-16 h-16 rounded-full bg-rose-500/20 border border-rose-500/40 flex items-center justify-center text-rose-400">
              <AlertOctagon className="w-8 h-8" />
            </div>
            <h2 className="text-xl font-bold font-cyber text-slate-100">Hero Down in Combat!</h2>
            <p className="text-xs text-slate-400 leading-relaxed">
              Aim your deflector blade directly toward incoming enemy shots and press [Space] or tap Deflect to bounce lasers right back into their turrets!
            </p>
            <div className="flex gap-2 w-full mt-2">
              <button
                onClick={() => {
                  setShowGameOver(false);
                  setCurrentScreen('title');
                }}
                className="flex-1 py-2.5 rounded-xl border border-slate-700 hover:bg-slate-800 text-xs font-bold text-slate-300"
              >
                Home
              </button>
              <button
                onClick={() => {
                  setShowGameOver(false);
                  setCurrentScreen('map');
                }}
                className="flex-1 py-2.5 rounded-xl border border-slate-700 hover:bg-slate-800 text-xs font-bold text-slate-300"
              >
                World Map
              </button>
              <button
                onClick={retrySubStage}
                className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-black text-xs font-bold flex items-center justify-center gap-1.5 shadow-lg hover:brightness-110"
              >
                <RefreshCw className="w-4 h-4" />
                <span>Retry Stage</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {showStore && <RewardsStoreModal onClose={() => setShowStore(false)} />}

      {showDashboard && <TeacherDashboard onClose={() => setShowDashboard(false)} />}

      {showCurriculumMap && (
        <CurriculumMapModal
          onClose={() => setShowCurriculumMap(false)}
          onSelectWorld={(worldId) => handleSelectWorldFromCurriculum(worldId)}
        />
      )}

      {showCodeExport && <CodeExportModal onClose={() => setShowCodeExport(false)} />}

      {(showNameModal || !isSessionAuthenticated || !state.hasRegisteredName) && (
        <PlayerNameModal
          isInitialSetup={!isSessionAuthenticated || !state.hasRegisteredName}
          onClose={() => setShowNameModal(false)}
        />
      )}

      <OfflineIndicator />
    </div>
  );
};

export default function App() {
  return (
    <GameProvider>
      <GameShell />
    </GameProvider>
  );
}
