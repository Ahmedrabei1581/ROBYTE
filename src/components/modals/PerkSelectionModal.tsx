/**
 * @license
 * Copyright (c) 2026-2027 Ahmed Ramadan Fouad Ahmed Rabei — ROBYTE — All Rights Reserved.
 * Post-Stage Hero Perk Selection Modal.
 */

import React from 'react';
import { StagePerk } from '../../types/gameTypes';
import { sounds } from '../../utils/soundEffects';
import { Sparkles, ArrowRight } from 'lucide-react';

interface PerkSelectionModalProps {
  stageNumber: number;
  stageName: string;
  perks: StagePerk[];
  onSelectPerk: (perk: StagePerk) => void;
}

export const PerkSelectionModal: React.FC<PerkSelectionModalProps> = ({
  stageNumber,
  stageName,
  perks,
  onSelectPerk,
}) => {
  const getCategoryColor = (cat: StagePerk['category']) => {
    switch (cat) {
      case 'deflect':
        return 'from-cyan-500/20 to-blue-600/30 border-cyan-400 text-cyan-300';
      case 'speed':
        return 'from-amber-500/20 to-yellow-600/30 border-amber-400 text-amber-300';
      case 'firepower':
        return 'from-rose-500/20 to-red-600/30 border-rose-400 text-rose-300';
      case 'time':
        return 'from-purple-500/20 to-indigo-600/30 border-purple-400 text-purple-300';
      case 'defense':
        return 'from-emerald-500/20 to-teal-600/30 border-emerald-400 text-emerald-300';
      case 'learning':
        return 'from-fuchsia-500/20 to-pink-600/30 border-fuchsia-400 text-fuchsia-300';
      default:
        return 'from-slate-800 to-slate-900 border-slate-700 text-slate-200';
    }
  };

  return (
    <div dir="ltr" className="fixed inset-0 z-50 flex items-center justify-center p-3 md:p-6 bg-black/90 backdrop-blur-md animate-in fade-in duration-200 select-none">
      <div className="relative w-full max-w-3xl bg-slate-900/95 border-2 border-cyan-500/60 rounded-3xl p-5 md:p-7 shadow-[0_0_50px_rgba(6,182,212,0.3)] flex flex-col items-center gap-5 text-center overflow-y-auto max-h-[92vh]">
        {/* Victory Badge */}
        <div className="flex flex-col items-center gap-1.5">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs font-bold font-cyber">
            <Sparkles className="w-4 h-4 text-emerald-400" />
            <span>Stage {stageNumber} Cleared Successfully!</span>
          </div>

          <h2 className="text-xl md:text-2xl font-black font-cyber text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 via-cyan-300 to-white">
            Choose a Cyber Perk for the Next Stage
          </h2>

          <p className="text-xs text-slate-300 max-w-lg font-tech">
            Awesome job conquering &ldquo;{stageName}&rdquo; and decrypting all terminals! Pick a special tactical upgrade for your hero and deflector blade:
          </p>
        </div>

        {/* 3 Perk Selection Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5 w-full mt-2">
          {perks.map((perk) => {
            const colorClass = getCategoryColor(perk.category);
            return (
              <button
                key={perk.id}
                onClick={() => {
                  sounds.playVictory();
                  onSelectPerk(perk);
                }}
                className={`group relative p-4 rounded-2xl bg-gradient-to-b ${colorClass} border-2 hover:scale-[1.03] active:scale-95 transition-all text-left flex flex-col justify-between gap-3 shadow-lg hover:shadow-cyan-500/20 cursor-pointer`}
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-3xl filter drop-shadow group-hover:scale-110 transition-transform">
                      {perk.icon}
                    </span>
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-900/80 border border-slate-700 text-white font-mono font-bold">
                      {perk.statBoost}
                    </span>
                  </div>

                  <h3 className="text-sm font-bold text-white font-cyber group-hover:text-cyan-300 transition-colors">
                    {perk.title}
                  </h3>

                  <span className="text-[11px] text-slate-400 font-tech block mb-1.5">
                    {perk.subtitle}
                  </span>

                  <p className="text-xs text-slate-300 leading-relaxed font-sans">
                    {perk.description}
                  </p>
                </div>

                <div className="w-full pt-2 border-t border-slate-700/60 flex items-center justify-between text-xs font-bold text-cyan-300 group-hover:text-white transition-colors">
                  <span>Equip Perk</span>
                  <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" />
                </div>
              </button>
            );
          })}
        </div>

        <div className="text-[11px] text-slate-400 font-tech pt-1">
          Selected perks stack across the run to help your hero deflect incoming fire and storm tougher stages!
        </div>
      </div>
    </div>
  );
};
