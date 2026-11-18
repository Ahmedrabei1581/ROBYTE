/**
 * @license
 * Copyright (c) 2026-2027 Ahmed Ramadan Fouad Ahmed Rabei — ROBYTE — All Rights Reserved.
 * ROBYTE Title Screen Shell — Language Schools Edition
 */

import React, { useEffect, useRef, useState } from 'react';
import { Play, Sparkles, BarChart3, User, RotateCcw, MapPin } from 'lucide-react';
import { sounds } from '../../utils/soundEffects';
import { useGame } from '../../context/GameContext';
import { PlayerNameModal } from '../modals/PlayerNameModal';
import { PWAInstallButton } from '../pwa/PWAInstallButton';
import { WORLDS_DATA } from '../../data/curriculumData';

interface TitleScreenProps {
  onStart: () => void;
  onOpenStore: () => void;
  onOpenDashboard: () => void;
  isModalOpen?: boolean;
}

export const TitleScreen: React.FC<TitleScreenProps> = ({
  onStart,
  onOpenStore,
  onOpenDashboard,
  isModalOpen = false,
}) => {
  const { state, startFreshForCurrentPlayer } = useGame();
  const [showNameModal, setShowNameModal] = useState(false);
  const [showResetConfirm, setShowResetConfirm] = useState(false);
  const bgCanvasRef = useRef<HTMLCanvasElement | null>(null);

  const completedStagesCount = Object.values(state.worldProgress || {}).reduce(
    (sum, wp) => sum + (wp.subStagesCompleted?.length || 0),
    0
  );
  const hasSavedProgress =
    state.hasRegisteredName &&
    (completedStagesCount > 0 ||
      state.lastActiveWorld > 1 ||
      state.lastActiveSubStageId > 1 ||
      state.solvedQuestionsInStage.length > 0 ||
      state.questionAttempts.length > 0);

  const activeWorldInfo = WORLDS_DATA.find((w) => w.id === state.lastActiveWorld) || WORLDS_DATA[0];

  useEffect(() => {
    const canvas = bgCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', handleResize);

    const nodes: { x: number; y: number; vx: number; vy: number; radius: number; color: string }[] = [];
    const colors = ['#00f5ff', '#10b981', '#3b82f6', '#f59e0b', '#ec4899'];
    for (let i = 0; i < 45; i++) {
      nodes.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.7,
        vy: (Math.random() - 0.5) * 0.7,
        radius: Math.random() * 2.5 + 1.5,
        color: colors[Math.floor(Math.random() * colors.length)],
      });
    }

    const render = () => {
      ctx.fillStyle = '#060913';
      ctx.fillRect(0, 0, width, height);

      ctx.strokeStyle = 'rgba(0, 245, 255, 0.03)';
      ctx.lineWidth = 1;
      const step = 45;
      for (let x = 0; x < width; x += step) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, height);
        ctx.stroke();
      }
      for (let y = 0; y < height; y += step) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
        ctx.stroke();
      }

      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const dx = nodes[i].x - nodes[j].x;
          const dy = nodes[i].y - nodes[j].y;
          const dist = Math.hypot(dx, dy);
          if (dist < 130) {
            ctx.beginPath();
            ctx.moveTo(nodes[i].x, nodes[i].y);
            ctx.lineTo(nodes[j].x, nodes[j].y);
            ctx.strokeStyle = `rgba(0, 245, 255, ${0.18 * (1 - dist / 130)})`;
            ctx.lineWidth = 1;
            ctx.stroke();
          }
        }
      }

      nodes.forEach((node) => {
        node.x += node.vx;
        node.y += node.vy;
        if (node.x < 0 || node.x > width) node.vx *= -1;
        if (node.y < 0 || node.y > height) node.vy *= -1;

        ctx.beginPath();
        ctx.arc(node.x, node.y, node.radius, 0, Math.PI * 2);
        ctx.fillStyle = node.color;
        ctx.shadowColor = node.color;
        ctx.shadowBlur = 8;
        ctx.fill();
        ctx.shadowBlur = 0;
      });

      animId = requestAnimationFrame(render);
    };

    animId = requestAnimationFrame(render);
    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (showNameModal || showResetConfirm || isModalOpen || !state.hasRegisteredName) return;
      if (e.key === 'Enter' || e.code === 'Space') {
        sounds.playClick();
        onStart();
      }
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [onStart, showNameModal, showResetConfirm, isModalOpen, state.hasRegisteredName]);

  return (
    <div className="relative w-full h-full flex flex-col items-center justify-between p-4 sm:p-6 md:p-10 select-none overflow-y-auto overflow-x-hidden">
      <canvas ref={bgCanvasRef} className="fixed inset-0 w-full h-full pointer-events-none z-0" />

      <div className="relative z-10 flex flex-col items-center text-center max-w-3xl my-auto py-4 sm:py-6">
        <div className="inline-flex items-center gap-1.5 sm:gap-2 px-3.5 sm:px-4 py-1.5 rounded-full bg-gradient-to-r from-cyan-950/90 to-purple-950/90 border border-cyan-500/50 text-cyan-300 text-[10px] sm:text-xs font-bold mb-4 shadow-[0_0_20px_rgba(0,245,255,0.25)] backdrop-blur-md whitespace-nowrap">
          <Sparkles className="w-3.5 h-3.5 text-amber-400 shrink-0" />
          <span>LANGUAGE SCHOOLS EDITION</span>
          <span>·</span>
          <span>BACCALAUREATE YEAR 2</span>
        </div>

        <div className="w-full max-w-lg mb-2">
          <svg viewBox="0 0 600 135" className="w-full h-auto drop-shadow-[0_0_40px_rgba(0,245,255,0.6)]">
            <defs>
              <linearGradient id="robyteGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#ffffff" />
                <stop offset="25%" stopColor="#00f5ff" />
                <stop offset="60%" stopColor="#3b82f6" />
                <stop offset="100%" stopColor="#a855f7" />
              </linearGradient>
              <linearGradient id="robyteSubGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#f59e0b" />
                <stop offset="100%" stopColor="#fbbf24" />
              </linearGradient>
            </defs>

            <text
              x="300"
              y="74"
              textAnchor="middle"
              fill="url(#robyteGrad)"
              className="font-cyber font-black"
              style={{ fontSize: '68px', letterSpacing: '8px', fontWeight: '900' }}
            >
              ROBYTE
            </text>

            <text
              x="300"
              y="118"
              textAnchor="middle"
              fill="url(#robyteSubGrad)"
              className="font-tech font-extrabold"
              style={{ fontSize: '19px', letterSpacing: '3px' }}
            >
              AI BATTLEGROUNDS · LANGUAGE SCHOOLS
            </text>
          </svg>
        </div>

        <p className="text-xs md:text-sm text-slate-300 max-w-xl leading-relaxed mb-5 font-tech">
          Master the Programming & Artificial Intelligence Language Schools curriculum through high-speed 2D cyber combat. Move with multi-touch mobile controls or keyboard/gamepad, shatter obstacles, deflect enemy laser volleys, and decrypt all 100 curriculum terminals!
        </p>

        {/* Registered Hero Auto-Resume Card */}
        {state.hasRegisteredName && (
          <div className="w-full max-w-xl mb-5 p-3.5 rounded-2xl bg-slate-900/90 border border-cyan-500/40 backdrop-blur-md flex flex-col sm:flex-row items-center justify-between gap-3 text-left shadow-lg">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-cyan-500/20 border border-cyan-400/50 flex items-center justify-center font-black font-cyber text-cyan-300 text-base shrink-0">
                {state.playerName.trim()[0]?.toUpperCase() || 'R'}
              </div>
              <div>
                <div className="text-xs sm:text-sm font-bold text-white">
                  Welcome back, <span className="text-cyan-300 font-cyber">{state.playerName}</span>
                </div>
                <div className="text-[11px] text-slate-400 flex items-center gap-1.5 flex-wrap mt-0.5">
                  <MapPin className="w-3 h-3 text-amber-400 shrink-0" />
                  <span>
                    Checkpoint: <strong className="text-slate-200">{activeWorldInfo.title} · Stage {state.lastActiveSubStageId}</strong>
                  </span>
                  <span>·</span>
                  <span className="text-emerald-400 font-bold tabular-nums">{completedStagesCount} / 20 Stages Cleared</span>
                </div>
              </div>
            </div>

            {hasSavedProgress && !showResetConfirm && (
              <button
                type="button"
                onClick={() => {
                  sounds.playClick();
                  setShowResetConfirm(true);
                }}
                className="px-3 py-1.5 rounded-xl bg-rose-950/60 hover:bg-rose-900/70 border border-rose-500/40 text-rose-300 text-xs font-bold flex items-center gap-1.5 shrink-0 transition-colors whitespace-nowrap"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Start Over</span>
              </button>
            )}
          </div>
        )}

        {/* Inline Reset Confirmation */}
        {showResetConfirm && (
          <div className="w-full max-w-xl mb-5 p-3.5 rounded-2xl bg-rose-950/80 border border-rose-500/70 flex flex-col sm:flex-row items-center justify-between gap-3">
            <span className="text-xs font-bold text-rose-100">
              Reset stages for "{state.playerName}" and restart from World 1 · Stage 1?
            </span>
            <div className="flex items-center gap-2 shrink-0">
              <button
                type="button"
                onClick={() => setShowResetConfirm(false)}
                className="px-3.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold"
              >
                Cancel
              </button>
              <button
                type="button"
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

        {/* Primary Action Row */}
        <div className="flex flex-col sm:flex-row items-center gap-3 w-full justify-center flex-wrap">
          <button
            onClick={() => {
              sounds.playClick();
              if (!state.hasRegisteredName) {
                setShowNameModal(true);
              } else {
                onStart();
              }
            }}
            className="w-full sm:w-auto px-8 py-3.5 rounded-2xl bg-gradient-to-r from-cyan-400 via-cyan-500 to-blue-600 text-black font-extrabold text-base md:text-lg flex items-center justify-center gap-3 shadow-[0_0_35px_rgba(0,245,255,0.6)] hover:scale-105 active:scale-95 transition-all whitespace-nowrap"
          >
            <Play className="w-5 h-5 fill-current shrink-0" />
            <span>
              {hasSavedProgress
                ? `Resume Battle (World ${state.lastActiveWorld} · Stage ${state.lastActiveSubStageId})`
                : 'Enter Battle Now [PLAY]'}
            </span>
          </button>

          <button
            onClick={() => {
              sounds.playClick();
              onOpenStore();
            }}
            className="w-full sm:w-auto px-5 py-3 rounded-2xl bg-slate-900/90 border border-slate-700 text-slate-200 font-bold text-sm flex items-center justify-center gap-2 hover:bg-slate-800 hover:border-slate-600 transition-all whitespace-nowrap"
          >
            <Sparkles className="w-4 h-4 text-amber-400 shrink-0" />
            <span>Armory & Hero Store</span>
          </button>

          <button
            onClick={() => {
              sounds.playClick();
              onOpenDashboard();
            }}
            className="w-full sm:w-auto px-5 py-3 rounded-2xl bg-slate-900/90 border border-slate-700 text-slate-200 font-bold text-sm flex items-center justify-center gap-2 hover:bg-slate-800 hover:border-slate-600 transition-all whitespace-nowrap"
          >
            <BarChart3 className="w-4 h-4 text-cyan-400 shrink-0" />
            <span>Teacher Analytics</span>
          </button>

          <PWAInstallButton variant="hero" />

          <button
            onClick={() => {
              sounds.playClick();
              setShowNameModal(true);
            }}
            className="w-full sm:w-auto px-5 py-3 rounded-2xl bg-cyan-950/70 border border-cyan-500/50 text-cyan-300 font-bold text-sm flex items-center justify-center gap-2 hover:bg-cyan-900/60 transition-all whitespace-nowrap"
          >
            <User className="w-4 h-4 text-cyan-400 shrink-0" />
            <span>{state.hasRegisteredName ? 'Switch Hero / Account' : 'Register Unique Hero'}</span>
          </button>
        </div>
      </div>

      {/* Bottom Controls & Copyright Bar */}
      <div className="relative z-10 w-full flex flex-col md:flex-row items-center justify-between text-[11px] md:text-xs text-slate-500 font-tech border-t border-slate-800/80 pt-3 max-w-6xl gap-2">
        <div className="flex items-center justify-center flex-wrap gap-2">
          <span>2D Controls:</span>
          <span className="text-slate-300 font-bold">A/D Move</span>
          <span>·</span>
          <span className="text-slate-300 font-bold">W Jet Jump</span>
          <span>·</span>
          <span className="text-slate-300 font-bold">S Crouch</span>
          <span>·</span>
          <span className="text-slate-300 font-bold">Space Deflect</span>
          <span>·</span>
          <span className="text-cyan-400 font-bold">E Pulse / Station</span>
          <span>·</span>
          <span className="text-purple-400 font-bold">Q EMP Jammer</span>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-2 shrink-0 text-slate-400">
          <span>Mastery Gate: 80% (20/25)</span>
          <span>·</span>
          <span className="text-cyan-400/90 font-semibold">
            © 2026–2027 Ahmed Ramadan Fouad Ahmed Rabei · ROBYTE · All Rights Reserved
          </span>
        </div>
      </div>

      {showNameModal && <PlayerNameModal onClose={() => setShowNameModal(false)} />}
    </div>
  );
};
