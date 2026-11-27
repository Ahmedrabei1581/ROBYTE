/**
 * @license
 * Copyright (c) 2026-2027 Ahmed Ramadan Fouad Ahmed Rabei — ROBYTE — All Rights Reserved.
 * Question Terminal Modal — Clear assessment prompt, 4 options, and instant curriculum explanation.
 */

import React, { useState } from 'react';
import { Question } from '../../types/gameTypes';
import { sounds } from '../../utils/soundEffects';
import { useGame } from '../../context/GameContext';
import { CheckCircle2, XCircle, BookOpen, ArrowRight, ShieldAlert, Award, Home, RotateCcw, Lock } from 'lucide-react';
import confetti from 'canvas-confetti';

interface QuestionModalProps {
  question: Question;
  worldTitle: string;
  subStageName: string;
  onClose: (isCorrect: boolean) => void;
  onBackToHome?: () => void;
}

export const QuestionModal: React.FC<QuestionModalProps> = ({
  question,
  worldTitle,
  subStageName,
  onClose,
  onBackToHome,
}) => {
  const { recordQuestionAttempt } = useGame();
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [attemptStatus, setAttemptStatus] = useState<'idle' | 'wrong' | 'correct'>('idle');
  const [wrongIndices, setWrongIndices] = useState<number[]>([]);
  const [wrongAttemptsCount, setWrongAttemptsCount] = useState(0);

  const handleSelectOption = (idx: number) => {
    if (attemptStatus === 'correct') return;
    if (attemptStatus === 'wrong') return;
    if (wrongIndices.includes(idx)) return;

    setSelectedOption(idx);
    const isCorrect = idx === question.correctAnswer;

    if (isCorrect) {
      setAttemptStatus('correct');
      sounds.playCorrect();
      try {
        confetti({
          particleCount: 40,
          spread: 60,
          origin: { y: 0.6 },
        });
      } catch {}

      recordQuestionAttempt({
        questionId: question.id,
        worldId: question.worldId,
        subStageId: question.subStageId,
        selectedAnswer: idx,
        isCorrect: true,
        timestamp: Date.now(),
      });
    } else {
      setAttemptStatus('wrong');
      setWrongIndices((prev) => (prev.includes(idx) ? prev : [...prev, idx]));
      setWrongAttemptsCount((c) => c + 1);
      sounds.playError();

      if (wrongAttemptsCount === 0) {
        recordQuestionAttempt({
          questionId: question.id,
          worldId: question.worldId,
          subStageId: question.subStageId,
          selectedAnswer: idx,
          isCorrect: false,
          timestamp: Date.now(),
        });
      }
    }
  };

  const handleTryAgain = () => {
    sounds.playClick();
    setSelectedOption(null);
    setAttemptStatus('idle');
  };

  const handleFinish = () => {
    if (attemptStatus !== 'correct') return;
    sounds.playClick();
    onClose(true);
  };

  const isCorrect = attemptStatus === 'correct';
  const showFeedback = attemptStatus !== 'idle';

  return (
    <div dir="ltr" className="fixed inset-0 z-50 flex items-center justify-center p-3 md:p-6 bg-black/90 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-3xl bg-slate-900 border-2 border-cyan-500/60 rounded-2xl p-5 md:p-8 shadow-[0_0_50px_rgba(0,245,255,0.25)] overflow-y-auto max-h-[92vh] flex flex-col gap-5 text-left">
        {/* Ambient Tech Glow */}
        <div className="absolute top-0 right-0 w-72 h-72 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

        {/* Header: Difficulty, Question Index & World Info */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-3.5 gap-2 flex-wrap">
          <div className="flex items-center gap-2 sm:gap-3">
            {onBackToHome && (
              <button
                onClick={() => {
                  sounds.playClick();
                  onBackToHome();
                }}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-cyan-300 hover:text-white border border-slate-700 text-xs font-bold transition-colors shadow whitespace-nowrap"
                title="Back to Title Screen"
              >
                <Home className="w-3.5 h-3.5 text-cyan-400" />
                <span>Home</span>
              </button>
            )}

            <span className="px-3 py-1 rounded-md bg-cyan-950 text-cyan-300 border border-cyan-800/80 text-xs font-bold font-tech whitespace-nowrap">
              {question.difficultyArabic}
            </span>
            <span className="text-xs text-slate-300 font-tech tabular-nums whitespace-nowrap">
              Question {question.questionIndex} of 5
            </span>
          </div>

          <div className="text-right ml-auto">
            <div className="text-xs sm:text-sm font-bold text-cyan-400">{worldTitle}</div>
            <div className="text-[11px] sm:text-xs text-slate-400">{subStageName}</div>
          </div>
        </div>

        {/* Lesson Reference */}
        <div className="flex items-center justify-between gap-2 text-xs text-slate-300 bg-slate-950/70 px-3.5 py-2 rounded-xl border border-slate-800 flex-wrap">
          <div className="flex items-center gap-2">
            <BookOpen className="w-4 h-4 text-cyan-400 shrink-0" />
            <span className="font-bold text-cyan-400 shrink-0">Curriculum Reference:</span>
            <span className="text-slate-100 font-semibold">{question.lesson}</span>
          </div>
          {!isCorrect && (
            <span className="flex items-center gap-1 text-[11px] font-bold text-amber-300">
              <Lock className="w-3 h-3" />
              <span>Correct answer required to unlock next sector</span>
            </span>
          )}
        </div>

        {/* Question Prompt */}
        <div className="py-1">
          <h3 className="text-lg md:text-2xl font-black text-slate-50 leading-relaxed drop-shadow-sm">
            {question.question}
          </h3>
        </div>

        {/* Multiple-Choice / True-False Options */}
        <div className="flex flex-col gap-2.5">
          {question.options.map((option, idx) => {
            const isSelected = selectedOption === idx;
            const isTargetCorrect = idx === question.correctAnswer;
            const wasPreviouslyWrong = wrongIndices.includes(idx);

            let buttonStyle = 'bg-slate-800/70 hover:bg-slate-800 border-slate-700 text-slate-200';

            if (attemptStatus === 'correct') {
              if (isTargetCorrect) {
                buttonStyle = 'bg-emerald-950/80 border-emerald-500 text-emerald-200 ring-2 ring-emerald-500/40';
              } else if (wasPreviouslyWrong) {
                buttonStyle = 'bg-red-950/40 border-red-900/60 text-red-300/60 opacity-60';
              } else {
                buttonStyle = 'bg-slate-950/40 border-slate-800 text-slate-500 opacity-60';
              }
            } else if (attemptStatus === 'wrong') {
              if (isSelected) {
                buttonStyle = 'bg-red-950/80 border-red-500 text-red-200 ring-2 ring-red-500/40';
              } else if (wasPreviouslyWrong) {
                buttonStyle = 'bg-red-950/40 border-red-800/50 text-red-300/50 opacity-55';
              } else {
                buttonStyle = 'bg-slate-900/60 border-slate-800 text-slate-400 opacity-75';
              }
            } else if (wasPreviouslyWrong) {
              buttonStyle = 'bg-red-950/40 border-red-800/60 text-red-300/60 opacity-60 line-through';
            }

            const isDisabled = attemptStatus !== 'idle' || wasPreviouslyWrong;

            return (
              <button
                key={idx}
                disabled={isDisabled}
                onClick={() => handleSelectOption(idx)}
                className={`relative w-full flex items-center justify-between p-4 sm:p-4.5 rounded-2xl border text-left transition-all font-bold text-base sm:text-lg ${buttonStyle} disabled:cursor-default`}
              >
                <div className="flex items-center gap-3.5">
                  <span
                    className={`w-8 h-8 rounded-xl flex items-center justify-center font-black text-sm shrink-0 ${
                      attemptStatus === 'correct' && isTargetCorrect
                        ? 'bg-emerald-500 text-black'
                        : wasPreviouslyWrong
                        ? 'bg-red-500 text-white'
                        : 'bg-slate-700 text-slate-200'
                    }`}
                  >
                    {String.fromCharCode(65 + idx)}
                  </span>
                  <span className="leading-snug">{option}</span>
                </div>

                {attemptStatus === 'correct' && isTargetCorrect && (
                  <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 ml-2" />
                )}
                {wasPreviouslyWrong && (
                  <XCircle className="w-5 h-5 text-red-400 shrink-0 ml-2" />
                )}
              </button>
            );
          })}
        </div>

        {/* Instant Curriculum Explanation / Wrong-Answer Hint */}
        {showFeedback && (
          <div
            className={`p-4 rounded-xl border text-sm leading-relaxed ${
              isCorrect
                ? 'bg-emerald-950/40 border-emerald-500/40 text-emerald-200'
                : 'bg-red-950/40 border-red-500/40 text-rose-200'
            }`}
          >
            <div className="flex items-center gap-2 font-bold mb-1.5">
              {isCorrect ? (
                <>
                  <Award className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Correct! Terminal Decrypted (+25 Coins, +50 XP)</span>
                </>
              ) : (
                <>
                  <ShieldAlert className="w-4 h-4 text-rose-400 shrink-0" />
                  <span>Incorrect! You cannot skip without solving — try again:</span>
                </>
              )}
            </div>
            <p className="text-xs md:text-sm text-slate-300">
              {isCorrect
                ? question.explanation
                : `Hint from "${question.lesson}": Review the concept carefully and select the correct answer to unlock the sector gate.`}
            </p>
          </div>
        )}

        {/* Continue or Try Again Action */}
        {showFeedback && (
          <div className="flex items-center justify-between pt-2 border-t border-slate-800 gap-3">
            {!isCorrect ? (
              <>
                <span className="text-xs text-rose-300 font-semibold">
                  Gate stays locked until solved ({wrongAttemptsCount} wrong attempt{wrongAttemptsCount === 1 ? '' : 's'})
                </span>
                <button
                  onClick={handleTryAgain}
                  className="flex items-center gap-2 bg-gradient-to-r from-amber-500 to-orange-500 text-black font-bold px-6 py-2.5 rounded-xl hover:brightness-110 active:scale-95 transition-all text-sm md:text-base whitespace-nowrap"
                >
                  <RotateCcw className="w-4 h-4" />
                  <span>Try Again</span>
                </button>
              </>
            ) : (
              <button
                onClick={handleFinish}
                className="ml-auto flex items-center gap-2 bg-gradient-to-r from-cyan-500 to-blue-600 text-black font-bold px-6 py-2.5 rounded-xl hover:brightness-110 active:scale-95 transition-all text-sm md:text-base whitespace-nowrap"
              >
                <span>Continue Cyber Mission</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
