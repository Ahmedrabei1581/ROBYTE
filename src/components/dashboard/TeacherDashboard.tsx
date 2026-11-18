/**
 * @license
 * Copyright (c) 2026-2027 Ahmed Ramadan Fouad Ahmed Rabei — ROBYTE — All Rights Reserved.
 * Teacher & Student Analytics Dashboard — Mastery tracking, error diagnostics, and JSON report export.
 */

import React, { useState } from 'react';
import { useGame } from '../../context/GameContext';
import { WORLDS_DATA } from '../../data/curriculumData';
import { sounds } from '../../utils/soundEffects';
import { Question } from '../../types/gameTypes';
import { X, User, BarChart3, BookCheck, AlertCircle, Download, CheckCircle2, XCircle } from 'lucide-react';

interface TeacherDashboardProps {
  onClose: () => void;
}

export const TeacherDashboard: React.FC<TeacherDashboardProps> = ({ onClose }) => {
  const { state, setPlayerName, getFailedQuestions } = useGame();
  const [editingName, setEditingName] = useState(false);
  const [tempName, setTempName] = useState(state.playerName);
  const [nameError, setNameError] = useState<string | null>(null);

  const totalQuestions = 100;
  const attemptedAttempts = state.questionAttempts;
  const totalAttempted = attemptedAttempts.length;
  const totalCorrect = attemptedAttempts.filter((a) => a.isCorrect).length;
  const overallAccuracy = totalAttempted > 0 ? Math.round((totalCorrect / totalAttempted) * 100) : 0;

  // Per-unit analytics
  const worldStats = WORLDS_DATA.map((w) => {
    const prog = state.worldProgress[w.id];
    const worldQuestions = w.subStages.flatMap((s) => s.questions);
    const worldAttempts = attemptedAttempts.filter((a) => a.worldId === w.id);
    const worldCorrect = worldAttempts.filter((a) => a.isCorrect).length;
    const accuracy = worldQuestions.length > 0 ? Math.round((worldCorrect / worldQuestions.length) * 100) : 0;
    const isPassing = worldCorrect >= 20;

    return {
      world: w,
      totalQuestions: worldQuestions.length,
      correctCount: worldCorrect,
      accuracy,
      isPassing,
      isUnlocked: prog?.isUnlocked ?? false,
      isCompleted: prog?.isCompleted ?? false,
    };
  });

  // Error diagnostics map
  const failedAttempts = getFailedQuestions();
  const allQuestionsMap = new Map<string, Question>();
  WORLDS_DATA.forEach((w) => {
    w.subStages.forEach((s) => {
      s.questions.forEach((q) => {
        allQuestionsMap.set(q.id, q);
      });
    });
  });

  const saveName = () => {
    const res = setPlayerName(tempName);
    if (!res.ok) {
      setNameError(res.error || 'This name is already registered and cannot be duplicated.');
      sounds.playError();
      return;
    }
    setNameError(null);
    setEditingName(false);
    sounds.playClick();
  };

  // Export official student analytics report as JSON
  const handleExportJSON = () => {
    sounds.playClick();
    const reportData = {
      appName: 'ROBYTE — Language Schools Edition',
      studentName: state.playerName,
      exportedAt: new Date().toISOString(),
      level: state.playerLevel,
      xp: state.xp,
      coins: state.coins,
      overallAccuracy: `${overallAccuracy}%`,
      totalAttempted,
      totalCorrect,
      worldProgress: worldStats.map((ws) => ({
        unitTitle: ws.world.title,
        unitSubtitle: ws.world.subTitle,
        score: `${ws.correctCount} / 25`,
        accuracy: `${ws.accuracy}%`,
        status: ws.isPassing ? 'Verified Mastery (>= 80%)' : 'Needs Review / Retry (< 80%)',
      })),
      errorReport: failedAttempts.map((fa) => {
        const q = allQuestionsMap.get(fa.questionId);
        return {
          questionId: fa.questionId,
          lesson: q?.lesson,
          question: q?.question,
          correctAnswer: q ? q.options[q.correctAnswer] : undefined,
          explanation: q?.explanation,
        };
      }),
    };

    const blob = new Blob([JSON.stringify(reportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `robyte_report_${state.playerName.replace(/\s+/g, '_')}_2027.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div dir="ltr" className="fixed inset-0 z-50 flex items-center justify-center p-3 md:p-6 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-4xl bg-slate-900 border border-slate-700 rounded-2xl p-5 md:p-7 shadow-2xl overflow-y-auto max-h-[92vh] flex flex-col gap-6 text-left">
        {/* Dashboard Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-4 gap-3">
          <div className="flex items-center gap-3">
            <button
              onClick={() => {
                sounds.playClick();
                onClose();
              }}
              className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
              aria-label="Close Dashboard"
            >
              <X className="w-5 h-5" />
            </button>
            <div>
              <div className="flex items-center gap-2">
                <BarChart3 className="w-5 h-5 text-cyan-400 shrink-0" />
                <h2 className="text-lg md:text-xl font-bold font-cyber text-slate-100">
                  Teacher &amp; Student Analytics Dashboard
                </h2>
              </div>
              <p className="text-xs text-slate-400">
                Programming &amp; Artificial Intelligence — Egyptian Baccalaureate 2nd Year (Language Schools Edition)
              </p>
            </div>
          </div>

          <button
            onClick={handleExportJSON}
            className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-xs md:text-sm transition-colors shadow-md whitespace-nowrap shrink-0"
          >
            <Download className="w-4 h-4" />
            <span className="hidden sm:inline">Export Report (JSON)</span>
            <span className="sm:hidden">Export</span>
          </button>
        </div>

        {/* Student Overview Strip */}
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 bg-slate-950/70 p-4 rounded-xl border border-slate-800">
          <div className="flex items-center gap-3 sm:col-span-1">
            <div className="w-12 h-12 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-2xl shrink-0">
              <User className="w-6 h-6 text-cyan-400" />
            </div>
            <div className="flex flex-col min-w-0">
              {editingName ? (
                <div className="flex flex-col gap-1 mt-1">
                  <div className="flex items-center gap-1.5">
                    <input
                      type="text"
                      value={tempName}
                      onChange={(e) => {
                        setTempName(e.target.value);
                        setNameError(null);
                      }}
                      className="w-28 px-2 py-1 bg-slate-800 border border-slate-700 rounded text-xs text-white"
                    />
                    <button
                      onClick={saveName}
                      className="px-2 py-1 bg-cyan-600 text-white text-[11px] rounded font-bold"
                    >
                      Save
                    </button>
                  </div>
                  {nameError && <span className="text-[10px] text-rose-400 font-bold">{nameError}</span>}
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <h3 className="font-bold text-slate-100 text-sm truncate">{state.playerName}</h3>
                  <button
                    onClick={() => {
                      setTempName(state.playerName);
                      setNameError(null);
                      setEditingName(true);
                    }}
                    className="text-[10px] text-cyan-400 hover:underline shrink-0"
                  >
                    [Edit]
                  </button>
                </div>
              )}
              <span className="text-xs text-slate-400 font-tech tabular-nums">
                Level {state.playerLevel} · {state.xp} XP
              </span>
            </div>
          </div>

          <div className="bg-slate-900 p-3 rounded-lg border border-slate-800/80 text-center">
            <div className="text-[11px] text-slate-400">Questions Answered</div>
            <div className="text-xl font-bold font-cyber text-slate-100 tabular-nums">
              {totalAttempted} <span className="text-xs text-slate-500">/ {totalQuestions}</span>
            </div>
          </div>

          <div className="bg-slate-900 p-3 rounded-lg border border-slate-800/80 text-center">
            <div className="text-[11px] text-slate-400">Overall Accuracy</div>
            <div
              className={`text-xl font-bold font-cyber tabular-nums ${
                overallAccuracy >= 80 ? 'text-emerald-400' : 'text-amber-400'
              }`}
            >
              {overallAccuracy}%
            </div>
          </div>

          <div className="bg-slate-900 p-3 rounded-lg border border-slate-800/80 text-center">
            <div className="text-[11px] text-slate-400">Worlds Mastered (&ge; 80%)</div>
            <div className="text-xl font-bold font-cyber text-cyan-400 tabular-nums">
              {worldStats.filter((w) => w.isCompleted).length} <span className="text-xs text-slate-500">/ 4</span>
            </div>
          </div>
        </div>

        {/* Unit-by-Unit Mastery Breakdown */}
        <div className="flex flex-col gap-3">
          <h3 className="text-sm font-bold text-slate-200 flex items-center gap-2">
            <BookCheck className="w-4 h-4 text-cyan-400" />
            <span>4-Unit Curriculum Mastery (80% Unlock Threshold)</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {worldStats.map((ws) => (
              <div
                key={ws.world.id}
                className="p-4 rounded-xl bg-slate-800/60 border border-slate-700/80 flex flex-col justify-between gap-3"
              >
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <h4 className="font-bold text-slate-100 text-sm">{ws.world.title}</h4>
                    <span className="text-xs text-slate-400">{ws.world.subTitle}</span>
                  </div>
                  <span
                    className={`px-2 py-0.5 rounded text-[10px] font-bold whitespace-nowrap shrink-0 ${
                      ws.isPassing
                        ? 'bg-emerald-950 text-emerald-300 border border-emerald-700'
                        : ws.correctCount > 0
                        ? 'bg-rose-950 text-rose-300 border border-rose-700'
                        : 'bg-slate-900 text-slate-400 border border-slate-800'
                    }`}
                  >
                    {ws.isPassing
                      ? 'Mastered (≥ 80%)'
                      : ws.correctCount > 0
                      ? 'Below 80% (Retry)'
                      : 'Not Started'}
                  </span>
                </div>

                <div className="flex flex-col gap-1.5">
                  <div className="flex justify-between text-xs text-slate-300 tabular-nums">
                    <span>
                      Current Score: <strong>{ws.correctCount} / 25</strong>
                    </span>
                    <span className="font-cyber font-bold">{ws.accuracy}%</span>
                  </div>
                  <div className="w-full bg-slate-900 h-2 rounded-full overflow-hidden">
                    <div
                      className={`h-full transition-all duration-300 ${
                        ws.isPassing ? 'bg-emerald-500' : 'bg-amber-500'
                      }`}
                      style={{ width: `${Math.min(100, ws.accuracy)}%` }}
                    />
                  </div>
                </div>

                <div className="text-[11px] text-slate-400 flex items-center gap-2 flex-wrap">
                  <span>{ws.world.lessons.length} Lessons</span>
                  <span>·</span>
                  <span>Boss: {ws.world.boss.name}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Missed Questions / Remediation Log */}
        <div className="flex flex-col gap-3">
          <div className="flex items-center justify-between flex-wrap gap-2">
            <h3 className="text-sm font-bold text-slate-200 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-rose-400" />
              <span>Missed Concepts &amp; Remediation Log ({failedAttempts.length})</span>
            </h3>
            <span className="text-xs text-slate-400">
              Designed to guide targeted classroom review
            </span>
          </div>

          {failedAttempts.length === 0 ? (
            <div className="p-6 rounded-xl bg-slate-950/60 border border-slate-800 text-center text-slate-400 text-xs">
              Zero errors recorded so far! Student performance is currently on a flawless streak.
            </div>
          ) : (
            <div className="flex flex-col gap-2.5 max-h-56 overflow-y-auto p-1">
              {failedAttempts.slice(0, 10).map((fa, i) => {
                const q = allQuestionsMap.get(fa.questionId);
                if (!q) return null;
                return (
                  <div key={i} className="p-3 rounded-lg bg-slate-950/80 border border-slate-800 flex flex-col gap-1 text-xs">
                    <div className="flex items-center justify-between text-slate-400 gap-2">
                      <span className="font-bold text-cyan-400">{q.lesson}</span>
                      <span className="text-rose-400 flex items-center gap-1 font-bold shrink-0">
                        <XCircle className="w-3.5 h-3.5" /> Needs Review
                      </span>
                    </div>
                    <p className="text-slate-200 font-medium">{q.question}</p>
                    <div className="text-emerald-400 font-bold flex items-center gap-1 mt-0.5">
                      <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
                      <span>Correct Answer: {q.options[q.correctAnswer]}</span>
                    </div>
                    <div className="text-slate-400 text-[11px] bg-slate-900 p-1.5 rounded">
                      <strong className="text-slate-300">Explanation: </strong>
                      {q.explanation}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
