/**
 * @license
 * Copyright (c) 2026-2027 Ahmed Ramadan Fouad Ahmed Rabei — ROBYTE — All Rights Reserved.
 * World Summary & 80% Mastery Gate Modal (20 / 25 correct required) with Error Diagnostic Report.
 */

import React, { useState } from 'react';
import { World } from '../../types/gameTypes';
import { useGame } from '../../context/GameContext';
import { Trophy, AlertTriangle, RefreshCw, ArrowLeft, CheckCircle, XCircle, BookOpen, Home } from 'lucide-react';
import confetti from 'canvas-confetti';

interface WorldSummaryModalProps {
  world: World;
  score: number;
  onRetry: () => void;
  onProceedNext: () => void;
  onBackToMap: () => void;
  onBackToHome?: () => void;
}

export const WorldSummaryModal: React.FC<WorldSummaryModalProps> = ({
  world,
  score,
  onRetry,
  onProceedNext,
  onBackToMap,
  onBackToHome,
}) => {
  const { evaluateWorldProgress, getFailedQuestions } = useGame();
  const [showErrorReport, setShowErrorReport] = useState(false);

  // Evaluate score out of 25 questions in this world
  const [evaluation] = useState(() => evaluateWorldProgress(world.id));
  const { canUnlockNext, totalCorrect, percentage } = evaluation;

  React.useEffect(() => {
    if (canUnlockNext) {
      try {
        confetti({
          particleCount: 80,
          spread: 80,
          origin: { y: 0.5 },
        });
      } catch {}
    }
  }, [canUnlockNext]);

  // Extract missed questions for this world
  const failedAttempts = getFailedQuestions(world.id);
  const allWorldQuestions = world.subStages.flatMap((s) => s.questions);
  const failedQuestionsList = allWorldQuestions.filter((q) =>
    failedAttempts.some((fa) => fa.questionId === q.id)
  );

  return (
    <div dir="ltr" className="fixed inset-0 z-50 flex items-center justify-center p-3 md:p-6 bg-black/90 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl bg-slate-900 border border-slate-700 rounded-2xl p-5 md:p-7 shadow-2xl overflow-y-auto max-h-[90vh] flex flex-col gap-6 text-left">
        {/* Summary Header */}
        <div className="text-center flex flex-col items-center gap-2">
          {canUnlockNext ? (
            <div className="w-16 h-16 rounded-2xl bg-emerald-500/20 border border-emerald-500/50 flex items-center justify-center text-emerald-400 mb-1">
              <Trophy className="w-8 h-8" />
            </div>
          ) : (
            <div className="w-16 h-16 rounded-2xl bg-rose-500/20 border border-rose-500/50 flex items-center justify-center text-rose-400 mb-1">
              <AlertTriangle className="w-8 h-8" />
            </div>
          )}

          <h2 className="text-xl md:text-2xl font-bold font-cyber text-slate-100">
            {canUnlockNext ? 'Heroic World Mastery Achieved!' : 'Mastery Threshold Not Reached Yet'}
          </h2>
          <p className="text-xs md:text-sm text-slate-400">
            {world.title} ({world.subTitle})
          </p>
        </div>

        {/* 80% Mastery Gate Scorecard */}
        <div
          className={`p-4 md:p-5 rounded-xl border text-center flex flex-col gap-3 ${
            canUnlockNext
              ? 'bg-emerald-950/40 border-emerald-500/50'
              : 'bg-rose-950/40 border-rose-500/50'
          }`}
        >
          <div className="flex items-center justify-around">
            <div>
              <div className="text-xs text-slate-400">Correct Answers</div>
              <div className="text-2xl md:text-3xl font-cyber font-bold tabular-nums text-slate-100">
                {totalCorrect} <span className="text-sm text-slate-400">/ 25</span>
              </div>
            </div>

            <div className="h-10 w-[1px] bg-slate-800" />

            <div>
              <div className="text-xs text-slate-400">Mastery Rate</div>
              <div
                className={`text-2xl md:text-3xl font-cyber font-bold tabular-nums ${
                  canUnlockNext ? 'text-emerald-400' : 'text-rose-400'
                }`}
              >
                {percentage}%
              </div>
            </div>

            <div className="h-10 w-[1px] bg-slate-800" />

            <div>
              <div className="text-xs text-slate-400">Combat Score</div>
              <div className="text-2xl md:text-3xl font-cyber font-bold text-amber-400 tabular-nums">
                {score}
              </div>
            </div>
          </div>

          {/* Mastery Progress Bar */}
          <div className="flex flex-col gap-1 text-xs">
            <div className="flex justify-between font-tech text-slate-300">
              <span>Minimum required to unlock next world: 80% (20 correct answers)</span>
              <span className="font-bold tabular-nums">
                {totalCorrect >= 20 ? 'Qualified ✓' : `${20 - totalCorrect} more needed`}
              </span>
            </div>
            <div className="w-full bg-slate-800 h-2.5 rounded-full overflow-hidden">
              <div
                className={`h-full transition-all duration-500 ${
                  canUnlockNext ? 'bg-emerald-500' : 'bg-rose-500'
                }`}
                style={{ width: `${Math.min(100, (totalCorrect / 25) * 100)}%` }}
              />
            </div>
          </div>

          <p className="text-xs text-slate-300 mt-1 text-left leading-relaxed">
            {canUnlockNext
              ? 'Congratulations! You exceeded the 80% curriculum mastery threshold. The next world is now unlocked on your map along with bonus armory rewards!'
              : 'Per the Egyptian Baccalaureate assessment standard, at least 80% (20 out of 25 correct answers) is required to unlock the next unit. Review your missed concepts below and retry!'}
          </p>
        </div>

        {/* Toggle Missed Questions Review Report */}
        {failedQuestionsList.length > 0 && (
          <div className="flex flex-col gap-3">
            <button
              onClick={() => setShowErrorReport(!showErrorReport)}
              className="flex items-center justify-between px-4 py-2.5 rounded-xl bg-slate-800/80 hover:bg-slate-800 border border-slate-700 text-xs md:text-sm text-cyan-300 font-bold transition-colors"
            >
              <div className="flex items-center gap-2">
                <BookOpen className="w-4 h-4" />
                <span>Error Diagnostic & Concepts to Review ({failedQuestionsList.length} questions)</span>
              </div>
              <span>{showErrorReport ? 'Hide Report ▲' : 'Show Report ▼'}</span>
            </button>

            {showErrorReport && (
              <div className="flex flex-col gap-3 max-h-60 overflow-y-auto p-3 bg-slate-950/80 rounded-xl border border-slate-800 text-xs">
                {failedQuestionsList.map((q, idx) => (
                  <div key={q.id} className="p-3 rounded-lg bg-slate-900 border border-slate-800 flex flex-col gap-1.5">
                    <div className="flex items-center justify-between text-slate-400">
                      <span className="font-bold text-slate-300">
                        Item {idx + 1}: {q.lesson}
                      </span>
                      <span className="text-rose-400 flex items-center gap-1 font-bold shrink-0">
                        <XCircle className="w-3.5 h-3.5" /> Needs Review
                      </span>
                    </div>
                    <p className="text-slate-200 font-medium">{q.question}</p>
                    <div className="text-emerald-400 font-bold flex items-center gap-1">
                      <CheckCircle className="w-3.5 h-3.5 shrink-0" />
                      <span>Correct Answer: {q.options[q.correctAnswer]}</span>
                    </div>
                    <div className="text-slate-400 bg-slate-950 p-2 rounded border border-slate-800/80">
                      <span className="text-cyan-400 font-bold">Explanation: </span>
                      {q.explanation}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Navigation & Retry Actions */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-3 border-t border-slate-800">
          <div className="flex items-center gap-2 w-full sm:w-auto">
            {onBackToHome && (
              <button
                onClick={onBackToHome}
                className="flex-1 sm:flex-initial px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-cyan-300 hover:text-white border border-slate-700 text-xs md:text-sm font-bold flex items-center justify-center gap-2 transition-colors shadow whitespace-nowrap"
              >
                <Home className="w-4 h-4 text-cyan-400" />
                <span>Home</span>
              </button>
            )}

            <button
              onClick={onBackToMap}
              className="flex-1 sm:flex-initial px-5 py-2.5 rounded-xl border border-slate-700 hover:bg-slate-800 text-slate-300 text-xs md:text-sm font-bold flex items-center justify-center gap-2 transition-colors whitespace-nowrap"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>World Map</span>
            </button>
          </div>

          <div className="flex items-center gap-2.5 w-full sm:w-auto">
            <button
              onClick={onRetry}
              className="flex-1 sm:flex-initial px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white border border-slate-600 text-xs md:text-sm font-bold flex items-center justify-center gap-2 transition-colors whitespace-nowrap"
            >
              <RefreshCw className="w-4 h-4" />
              <span>Retry World</span>
            </button>

            {world.id < 4 && (
              <button
                disabled={!canUnlockNext}
                onClick={onProceedNext}
                className={`flex-1 sm:flex-initial px-6 py-2.5 rounded-xl font-bold text-xs md:text-sm flex items-center justify-center gap-2 transition-all whitespace-nowrap ${
                  canUnlockNext
                    ? 'bg-gradient-to-r from-emerald-500 to-teal-600 text-black hover:brightness-110 active:scale-95 shadow-lg'
                    : 'bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-700'
                }`}
              >
                <span>Next World</span>
                <Trophy className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
