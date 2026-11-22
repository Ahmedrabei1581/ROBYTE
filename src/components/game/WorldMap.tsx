/**
 * @license
 * Copyright (c) 2026-2027 Ahmed Ramadan Fouad Ahmed Rabei — ROBYTE — All Rights Reserved.
 * World Selection Map — Displays the 4 curriculum worlds & 5 stages with 80% Mastery Lock
 */

import React, { useState } from 'react';
import { World, SubStage } from '../../types/gameTypes';
import { WORLDS_DATA } from '../../data/curriculumData';
import { useGame } from '../../context/GameContext';
import { sounds } from '../../utils/soundEffects';
import { Lock, CheckCircle2, Play, Shield, Cpu, Globe, Layout, AlertCircle, Home, MapPin, RotateCcw } from 'lucide-react';

interface WorldMapProps {
  onSelectSubStage: (world: World, subStage: SubStage) => void;
  onOpenStore: () => void;
  onOpenTeacherDashboard: () => void;
  onBackToHome?: () => void;
}

export const WorldMap: React.FC<WorldMapProps> = ({
  onSelectSubStage,
  onOpenStore,
  onOpenTeacherDashboard,
  onBackToHome,
}) => {
  const { state, startFreshForCurrentPlayer } = useGame();
  const [selectedWorldId, setSelectedWorldId] = useState<number>(state.lastActiveWorld || 1);
  const [showResetConfirm, setShowResetConfirm] = useState(false);

  const selectedWorld = WORLDS_DATA.find((w) => w.id === selectedWorldId) || WORLDS_DATA[0];
  const worldProg = state.worldProgress[selectedWorld.id];

  const handleSelectWorld = (world: World) => {
    sounds.playClick();
    setSelectedWorldId(world.id);
  };

  const getWorldIcon = (iconName: string) => {
    switch (iconName) {
      case 'Cpu':
        return <Cpu className="w-5 h-5 text-cyan-400" />;
      case 'ShieldAlert':
        return <Shield className="w-5 h-5 text-emerald-400" />;
      case 'Globe':
        return <Globe className="w-5 h-5 text-blue-400" />;
      case 'Layout':
        return <Layout className="w-5 h-5 text-amber-400" />;
      default:
        return <Cpu className="w-5 h-5" />;
    }
  };

  return (
    <div className="w-full h-full flex flex-col pt-14 px-4 pb-4 md:pt-14 md:px-8 md:pb-8 overflow-y-auto cyber-grid text-left">
      {/* Header & Mastery Overview */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded bg-cyan-950 text-cyan-400 border border-cyan-800 text-xs font-bold font-tech">
              Campaign & Stage Select
            </span>
            <span className="text-xs text-slate-400 font-tech">LANGUAGE SCHOOLS · YEAR 2</span>
          </div>
          <h1 className="text-xl md:text-3xl font-extrabold text-slate-100 font-cyber mt-1 flex items-center gap-2">
            <span className="text-cyan-400">ROBYTE</span>
            <span>Curriculum Worlds</span>
          </h1>
          <p className="text-xs md:text-sm text-slate-400">
            Select a world and combat stage to decrypt curriculum terminals. Unlock Requirement:{' '}
            <strong>80% Mastery (20 / 25 correct)</strong>.
          </p>
          {state.hasRegisteredName && (
            <div className="inline-flex items-center gap-2 mt-2 px-3 py-1 rounded-xl bg-cyan-950/60 border border-cyan-500/40 text-xs text-cyan-200">
              <MapPin className="w-3.5 h-3.5 text-amber-400 shrink-0" />
              <span>
                Hero <strong className="text-white">{state.playerName}</strong> checkpoint:{' '}
                <strong className="text-cyan-300">
                  World {state.lastActiveWorld} · Stage {state.lastActiveSubStageId}
                </strong>
              </span>
            </div>
          )}
        </div>

        {/* Quick Actions */}
        <div className="flex items-center gap-2 flex-wrap">
          {onBackToHome && (
            <button
              onClick={() => {
                sounds.playClick();
                onBackToHome();
              }}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-cyan-950/70 hover:bg-cyan-900 border border-cyan-500/40 text-xs font-bold text-cyan-300 transition-colors whitespace-nowrap"
            >
              <Home className="w-3.5 h-3.5" />
              <span>Home</span>
            </button>
          )}
          <button
            onClick={() => {
              sounds.playClick();
              onOpenStore();
            }}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-xs font-bold text-amber-300 transition-colors whitespace-nowrap"
          >
            <span>Armory Store</span>
          </button>
          <button
            onClick={() => {
              sounds.playClick();
              onOpenTeacherDashboard();
            }}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-xs font-bold text-cyan-300 transition-colors whitespace-nowrap"
          >
            <span>Teacher Analytics</span>
          </button>
          <button
            onClick={() => {
              sounds.playClick();
              setShowResetConfirm(true);
            }}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-rose-950/60 hover:bg-rose-900/70 border border-rose-500/40 text-xs font-bold text-rose-300 transition-colors whitespace-nowrap"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Start Over</span>
          </button>
        </div>
      </div>

      {showResetConfirm && (
        <div className="mb-5 p-3.5 rounded-2xl bg-rose-950/80 border border-rose-500/60 flex flex-col sm:flex-row items-center justify-between gap-3">
          <span className="text-xs font-bold text-rose-100">
            Reset all stages for "{state.playerName}" and restart from World 1 · Stage 1?
          </span>
          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={() => setShowResetConfirm(false)}
              className="px-3.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold"
            >
              Cancel
            </button>
            <button
              onClick={() => {
                sounds.playClick();
                setShowResetConfirm(false);
                startFreshForCurrentPlayer('playing');
              }}
              className="px-3.5 py-1.5 rounded-xl bg-rose-500 hover:bg-rose-400 text-white text-xs font-bold"
            >
              Yes, Start Over
            </button>
          </div>
        </div>
      )}

      {/* 4 Worlds Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5 mb-6">
        {WORLDS_DATA.map((w) => {
          const prog = state.worldProgress[w.id];
          const isUnlocked = prog?.isUnlocked ?? w.id === 1;
          const isSelected = selectedWorldId === w.id;
          const isCompleted = prog?.isCompleted ?? false;
          const bestScore = prog?.bestCorrectCount ?? 0;

          return (
            <div
              key={w.id}
              onClick={() => isUnlocked && handleSelectWorld(w)}
              className={`relative p-4 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between gap-3 ${
                isSelected
                  ? 'bg-slate-800/90 border-cyan-400 ring-2 ring-cyan-500/40 shadow-xl'
                  : isUnlocked
                  ? 'bg-slate-900/80 border-slate-800 hover:border-slate-700 hover:bg-slate-850'
                  : 'bg-slate-950/60 border-slate-900 opacity-60 cursor-not-allowed'
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="p-2 rounded-xl bg-slate-800 border border-slate-700">{getWorldIcon(w.iconName)}</div>
                  <div>
                    <span className="text-[10px] font-cyber tracking-wider text-slate-400">{w.badge}</span>
                    <h3 className="font-bold text-slate-100 text-sm">{w.title}</h3>
                  </div>
                </div>

                {!isUnlocked ? (
                  <div
                    className="p-1.5 rounded-lg bg-slate-900 border border-slate-800 text-slate-500"
                    title="Locked until 80% mastery is achieved in previous world"
                  >
                    <Lock className="w-4 h-4" />
                  </div>
                ) : isCompleted ? (
                  <div
                    className="p-1.5 rounded-lg bg-emerald-950 border border-emerald-800 text-emerald-400"
                    title="World Mastered (>= 80%)"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                  </div>
                ) : null}
              </div>

              <div className="flex flex-col gap-1.5 pt-2 border-t border-slate-800/80 text-xs">
                <div className="flex justify-between text-slate-400 text-[11px]">
                  <span>World Mastery</span>
                  <span className="font-cyber font-bold tabular-nums text-slate-200">
                    {bestScore} / 25 {isCompleted && '✓'}
                  </span>
                </div>
                <div className="w-full bg-slate-950 h-1.5 rounded-full overflow-hidden">
                  <div
                    className={`h-full ${isCompleted ? 'bg-emerald-500' : 'bg-cyan-500'}`}
                    style={{ width: `${Math.min(100, (bestScore / 25) * 100)}%` }}
                  />
                </div>
                {!isUnlocked && (
                  <div className="text-[10px] text-amber-400/90 font-medium flex items-center gap-1 mt-1">
                    <AlertCircle className="w-3 h-3 shrink-0" />
                    <span>Requires 20 correct answers (80%) in prior world</span>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Selected World Details & 5 Sub-Stages */}
      <div className="flex-1 bg-slate-900/90 border border-slate-800 rounded-2xl p-5 md:p-6 flex flex-col gap-6 shadow-2xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between border-b border-slate-800 pb-4 gap-3">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded bg-cyan-950 text-cyan-400 border border-cyan-800 text-xs font-bold">
                {selectedWorld.badge}
              </span>
              <span className="text-xs text-slate-400">{selectedWorld.subTitle}</span>
            </div>
            <h2 className="text-lg md:text-2xl font-bold text-slate-100 mt-1">{selectedWorld.title}</h2>
            <p className="text-xs text-slate-400 mt-0.5">{selectedWorld.description}</p>
          </div>

          <div className="flex items-center gap-3">
            <div className="text-right">
              <div className="text-[11px] text-slate-400">Best Recorded Score</div>
              <div className="font-cyber font-bold text-base md:text-lg text-cyan-400 tabular-nums">
                {worldProg?.bestCorrectCount || 0} / 25 Questions
              </div>
            </div>
            <div
              className={`px-3 py-1.5 rounded-xl border font-bold text-xs whitespace-nowrap ${
                worldProg?.isCompleted
                  ? 'bg-emerald-950/60 border-emerald-500 text-emerald-300'
                  : 'bg-amber-950/60 border-amber-500 text-amber-300'
              }`}
            >
              {worldProg?.isCompleted ? 'Passed (>= 80%)' : 'In Progress (< 80%)'}
            </div>
          </div>
        </div>

        {/* 5 Sub-Stages */}
        <div className="flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-200">
              5 Combat Sub-Stages (Progressive Combat & Question Difficulty):
            </h3>
            <span className="text-xs text-slate-400 tabular-nums">5 Questions / Stage = 25 Total</span>
          </div>

          <div className="grid grid-cols-1 gap-3">
            {selectedWorld.subStages.map((stage) => {
              const isBoss = stage.id === 5;
              const isStageCompleted = worldProg?.subStagesCompleted?.includes(stage.id) ?? false;
              const isCurrentCheckpoint =
                selectedWorld.id === state.lastActiveWorld && stage.id === state.lastActiveSubStageId;

              return (
                <div
                  key={stage.id}
                  className={`p-4 rounded-xl border flex flex-col md:flex-row md:items-center justify-between gap-4 transition-all ${
                    isCurrentCheckpoint
                      ? 'bg-cyan-950/35 border-cyan-400/70 ring-1 ring-cyan-400/30'
                      : isStageCompleted
                      ? 'bg-emerald-950/20 border-emerald-500/40'
                      : isBoss
                      ? 'bg-purple-950/30 border-pink-500/40 hover:border-pink-500/70'
                      : 'bg-slate-800/60 border-slate-700/70 hover:border-slate-600'
                  }`}
                >
                  <div className="flex items-center gap-3.5">
                    <div
                      className={`w-11 h-11 rounded-xl flex items-center justify-center font-cyber font-bold text-base shrink-0 ${
                        isStageCompleted
                          ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/50'
                          : isBoss
                          ? 'bg-pink-500/20 text-pink-400 border border-pink-500/40'
                          : 'bg-slate-900 text-cyan-400 border border-slate-700'
                      }`}
                    >
                      {isStageCompleted ? '✓' : isBoss ? '👾' : stage.id}
                    </div>

                    <div className="flex flex-col gap-0.5">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h4 className="font-bold text-slate-100 text-sm md:text-base">
                          Stage {stage.id}: {stage.name}
                        </h4>
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                            stage.difficulty === 'easy'
                              ? 'bg-emerald-950 text-emerald-400 border border-emerald-800'
                              : stage.difficulty === 'easy-medium'
                              ? 'bg-teal-950 text-teal-400 border border-teal-800'
                              : stage.difficulty === 'medium'
                              ? 'bg-blue-950 text-blue-400 border border-blue-800'
                              : stage.difficulty === 'hard'
                              ? 'bg-amber-950 text-amber-400 border border-amber-800'
                              : 'bg-rose-950 text-pink-400 border border-pink-800'
                          }`}
                        >
                          {stage.difficultyArabic}
                        </span>
                        {isStageCompleted && (
                          <span className="px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-600/50 text-[10px] font-bold">
                            Cleared
                          </span>
                        )}
                        {isCurrentCheckpoint && (
                          <span className="px-2 py-0.5 rounded bg-amber-950 text-amber-300 border border-amber-500/50 text-[10px] font-bold">
                            Current Checkpoint
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-2 text-xs text-cyan-300 font-tech flex-wrap">
                        <span>{stage.tagline}</span>
                        <span>·</span>
                        <span className="text-slate-400">{stage.curriculumFocus}</span>
                      </div>
                      <p className="text-xs text-slate-400">{stage.description}</p>
                      {isBoss && (
                        <span className="text-[11px] text-pink-400 font-bold">
                          Boss Encounter: {selectedWorld.boss.name} — {selectedWorld.boss.title}
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center justify-end gap-3 shrink-0">
                    <span className="text-xs text-slate-400 tabular-nums">{stage.questions.length} Questions</span>
                    <button
                      onClick={() => {
                        sounds.playClick();
                        onSelectSubStage(selectedWorld, stage);
                      }}
                      className={`px-5 py-2.5 rounded-xl font-bold text-xs md:text-sm flex items-center gap-2 transition-all shadow-md whitespace-nowrap ${
                        isBoss
                          ? 'bg-gradient-to-r from-pink-500 to-purple-600 text-white hover:brightness-110 active:scale-95'
                          : isCurrentCheckpoint
                          ? 'bg-gradient-to-r from-amber-400 to-cyan-400 text-black hover:brightness-110 active:scale-95'
                          : 'bg-gradient-to-r from-cyan-500 to-blue-600 text-black hover:brightness-110 active:scale-95'
                      }`}
                    >
                      <span>
                        {isCurrentCheckpoint
                          ? 'Resume Here'
                          : isStageCompleted
                          ? 'Replay Stage'
                          : isBoss
                          ? 'Battle Boss'
                          : 'Start Stage'}
                      </span>
                      <Play className="w-4 h-4 fill-current" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Official Curriculum Lessons List */}
        <div className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800 text-xs text-slate-400 flex flex-col gap-1.5">
          <span className="font-bold text-slate-300">Official Textbook & Assessment Lessons Covered:</span>
          <div className="flex flex-wrap gap-2">
            {selectedWorld.lessons.map((lesson, idx) => (
              <span key={idx} className="bg-slate-900 px-2.5 py-1 rounded-lg border border-slate-800 text-slate-300">
                {lesson}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
