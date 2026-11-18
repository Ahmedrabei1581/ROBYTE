/**
 * @license
 * Copyright (c) 2026-2027 Ahmed Ramadan Fouad Ahmed Rabei — ROBYTE — All Rights Reserved.
 * Armory, Hero Roster, Shield Upgrades & Skill Tree Store Modal.
 */

import React, { useState } from 'react';
import { useGame } from '../../context/GameContext';
import { CHARACTERS_DATA, WEAPONS_DATA, ARMORS_DATA } from '../../data/curriculumData';
import { sounds } from '../../utils/soundEffects';
import { SkillTree } from '../../types/gameTypes';
import { X, Coins, Zap, Shield, Sparkles, Check, Lock, ChevronUp } from 'lucide-react';

interface RewardsStoreModalProps {
  onClose: () => void;
}

export const RewardsStoreModal: React.FC<RewardsStoreModalProps> = ({ onClose }) => {
  const {
    state,
    equipCharacter,
    equipWeapon,
    equipArmor,
    purchaseCharacter,
    purchaseWeapon,
    purchaseArmor,
    upgradeSkill,
  } = useGame();

  const [activeTab, setActiveTab] = useState<'characters' | 'weapons' | 'armors' | 'skills'>('characters');

  const skillConfig: {
    key: keyof SkillTree;
    name: string;
    description: string;
    maxLevel: number;
    baseCost: number;
    icon: string;
  }[] = [
    {
      key: 'speedLevel',
      name: 'Cyber Thruster Engine',
      description: 'Boosts hero movement velocity and dodge agility by +8% per level.',
      maxLevel: 5,
      baseCost: 150,
      icon: '⚡',
    },
    {
      key: 'shieldLevel',
      name: 'Nano Shield Capacity',
      description: 'Increases maximum protective shield capacity by +25 points per level.',
      maxLevel: 5,
      baseCost: 180,
      icon: '🛡️',
    },
    {
      key: 'damageLevel',
      name: 'Weapon Core Amplifier',
      description: 'Boosts laser and plasma damage output by +12% per level.',
      maxLevel: 5,
      baseCost: 200,
      icon: '💥',
    },
    {
      key: 'coinBonusLevel',
      name: 'Mastery Coin Multiplier',
      description: 'Grants +15% bonus coins from curriculum question rewards per level.',
      maxLevel: 5,
      baseCost: 120,
      icon: '🪙',
    },
    {
      key: 'extraLifeLevel',
      name: 'Bio-Repair Cell',
      description: 'Enhances emergency damage resistance and battle recovery resilience.',
      maxLevel: 3,
      baseCost: 300,
      icon: '❤️',
    },
  ];

  return (
    <div dir="ltr" className="fixed inset-0 z-50 flex items-center justify-center p-3 md:p-6 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-4xl bg-slate-900 border border-slate-700 rounded-2xl p-5 md:p-7 shadow-2xl overflow-y-auto max-h-[92vh] flex flex-col gap-5 text-left">
        {/* Header & Coin Balance */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-4 gap-3">
          <div className="flex items-center gap-3">
            <button
              onClick={() => {
                sounds.playClick();
                onClose();
              }}
              className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
              aria-label="Close Armory"
            >
              <X className="w-5 h-5" />
            </button>
            <div>
              <h2 className="text-lg md:text-xl font-bold font-cyber text-slate-100">
                Armory &amp; Hero Customization Store
              </h2>
              <p className="text-xs text-slate-400">
                Unlock heroes, weapons, shields, and passive skills using coins earned from mastering lessons
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 bg-amber-500/10 border border-amber-500/30 px-3.5 py-1.5 rounded-xl font-cyber font-bold text-amber-400 tabular-nums text-sm shrink-0">
            <Coins className="w-4 h-4" />
            <span>{state.coins}</span>
            <span className="text-xs text-slate-400 font-tech">Coins</span>
          </div>
        </div>

        {/* Store Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs md:text-sm font-bold">
          <button
            onClick={() => {
              sounds.playClick();
              setActiveTab('characters');
            }}
            className={`px-4 py-2 rounded-xl border transition-all flex items-center gap-2 whitespace-nowrap ${
              activeTab === 'characters'
                ? 'bg-cyan-500/20 border-cyan-500 text-cyan-300 shadow-lg'
                : 'bg-slate-800/60 border-slate-700/60 text-slate-400 hover:text-slate-200'
            }`}
          >
            <span>Cyber Heroes</span>
            <span className="text-xs bg-slate-900 px-1.5 py-0.5 rounded text-cyan-400 tabular-nums">
              {CHARACTERS_DATA.length}
            </span>
          </button>

          <button
            onClick={() => {
              sounds.playClick();
              setActiveTab('weapons');
            }}
            className={`px-4 py-2 rounded-xl border transition-all flex items-center gap-2 whitespace-nowrap ${
              activeTab === 'weapons'
                ? 'bg-cyan-500/20 border-cyan-500 text-cyan-300 shadow-lg'
                : 'bg-slate-800/60 border-slate-700/60 text-slate-400 hover:text-slate-200'
            }`}
          >
            <span>Weapons &amp; Blades</span>
            <span className="text-xs bg-slate-900 px-1.5 py-0.5 rounded text-cyan-400 tabular-nums">
              {WEAPONS_DATA.length}
            </span>
          </button>

          <button
            onClick={() => {
              sounds.playClick();
              setActiveTab('armors');
            }}
            className={`px-4 py-2 rounded-xl border transition-all flex items-center gap-2 whitespace-nowrap ${
              activeTab === 'armors'
                ? 'bg-cyan-500/20 border-cyan-500 text-cyan-300 shadow-lg'
                : 'bg-slate-800/60 border-slate-700/60 text-slate-400 hover:text-slate-200'
            }`}
          >
            <span>Energy Armor</span>
            <span className="text-xs bg-slate-900 px-1.5 py-0.5 rounded text-cyan-400 tabular-nums">
              {ARMORS_DATA.length}
            </span>
          </button>

          <button
            onClick={() => {
              sounds.playClick();
              setActiveTab('skills');
            }}
            className={`px-4 py-2 rounded-xl border transition-all flex items-center gap-2 whitespace-nowrap ${
              activeTab === 'skills'
                ? 'bg-amber-500/20 border-amber-500 text-amber-300 shadow-lg'
                : 'bg-slate-800/60 border-slate-700/60 text-slate-400 hover:text-slate-200'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>Skill Tree</span>
          </button>
        </div>

        {/* Heroes Tab */}
        {activeTab === 'characters' && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {CHARACTERS_DATA.map((char) => {
              const isUnlocked = state.unlockedCharacters.includes(char.id);
              const isEquipped = state.selectedCharacterId === char.id;

              return (
                <div
                  key={char.id}
                  className={`p-4 rounded-xl border flex flex-col justify-between gap-3 transition-all ${
                    isEquipped
                      ? 'bg-cyan-950/40 border-cyan-500 ring-2 ring-cyan-500/30'
                      : isUnlocked
                      ? 'bg-slate-800/70 border-slate-700'
                      : 'bg-slate-900/60 border-slate-800 opacity-85'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div className="w-14 h-14 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center text-3xl shrink-0">
                      {char.avatar}
                    </div>
                    <div className="flex flex-col gap-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h3 className="font-bold text-slate-100 text-sm md:text-base">{char.name}</h3>
                        {isEquipped && (
                          <span className="px-2 py-0.5 rounded bg-cyan-500 text-black text-[10px] font-bold">
                            Active
                          </span>
                        )}
                      </div>
                      <div className="text-xs text-cyan-400 font-medium">{char.title}</div>
                      <p className="text-xs text-slate-400 leading-relaxed mt-1">{char.description}</p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-3 border-t border-slate-800/80 text-xs">
                    <div className="flex items-center gap-3 text-slate-300 tabular-nums">
                      <span className="flex items-center gap-1">
                        <Zap className="w-3.5 h-3.5 text-amber-400" />
                        Speed: x{char.speedMultiplier}
                      </span>
                      <span className="flex items-center gap-1">
                        <Shield className="w-3.5 h-3.5 text-cyan-400" />
                        Shield: +{char.shieldBonus}
                      </span>
                    </div>

                    {isEquipped ? (
                      <span className="text-emerald-400 font-bold flex items-center gap-1 whitespace-nowrap">
                        <Check className="w-3.5 h-3.5" /> Equipped
                      </span>
                    ) : isUnlocked ? (
                      <button
                        onClick={() => equipCharacter(char.id)}
                        className="px-4 py-1.5 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white font-bold transition-colors whitespace-nowrap"
                      >
                        Equip Hero
                      </button>
                    ) : (
                      <button
                        onClick={() => purchaseCharacter(char.id, char.cost)}
                        disabled={state.coins < char.cost}
                        className={`px-4 py-1.5 rounded-lg font-bold flex items-center gap-1.5 transition-colors whitespace-nowrap ${
                          state.coins >= char.cost
                            ? 'bg-amber-500 hover:bg-amber-400 text-black'
                            : 'bg-slate-800 text-slate-500 cursor-not-allowed'
                        }`}
                      >
                        <Lock className="w-3 h-3" />
                        <span>Unlock ({char.cost} Coins)</span>
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Weapons Tab */}
        {activeTab === 'weapons' && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {WEAPONS_DATA.map((wep) => {
              const isUnlocked = state.unlockedWeapons.includes(wep.id);
              const isEquipped = state.selectedWeaponId === wep.id;

              return (
                <div
                  key={wep.id}
                  className={`p-4 rounded-xl border flex flex-col justify-between gap-3 transition-all ${
                    isEquipped
                      ? 'bg-cyan-950/40 border-cyan-500 ring-2 ring-cyan-500/30'
                      : isUnlocked
                      ? 'bg-slate-800/70 border-slate-700'
                      : 'bg-slate-900/60 border-slate-800 opacity-85'
                  }`}
                >
                  <div className="flex flex-col gap-1.5">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div
                          className="w-4 h-4 rounded-full shadow-md"
                          style={{ backgroundColor: wep.color, boxShadow: `0 0 10px ${wep.color}` }}
                        />
                        <h3 className="font-bold text-slate-100 text-sm md:text-base">{wep.name}</h3>
                      </div>
                      {isEquipped && (
                        <span className="px-2 py-0.5 rounded bg-cyan-500 text-black text-[10px] font-bold">
                          Equipped
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-slate-400">{wep.description}</p>
                  </div>

                  <div className="flex items-center justify-between pt-3 border-t border-slate-800 text-xs">
                    <div className="flex items-center gap-3 text-slate-300 tabular-nums">
                      <span>
                        Damage: <strong className="text-amber-400">{wep.damage}</strong>
                      </span>
                      <span>
                        Cooldown: <strong className="text-cyan-400">{wep.fireRate}ms</strong>
                      </span>
                    </div>

                    {isEquipped ? (
                      <span className="text-emerald-400 font-bold flex items-center gap-1 whitespace-nowrap">
                        <Check className="w-3.5 h-3.5" /> Equipped
                      </span>
                    ) : isUnlocked ? (
                      <button
                        onClick={() => equipWeapon(wep.id)}
                        className="px-4 py-1.5 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white font-bold transition-colors whitespace-nowrap"
                      >
                        Equip
                      </button>
                    ) : (
                      <button
                        onClick={() => purchaseWeapon(wep.id, wep.cost)}
                        disabled={state.coins < wep.cost}
                        className={`px-4 py-1.5 rounded-lg font-bold flex items-center gap-1.5 transition-colors whitespace-nowrap ${
                          state.coins >= wep.cost
                            ? 'bg-amber-500 hover:bg-amber-400 text-black'
                            : 'bg-slate-800 text-slate-500 cursor-not-allowed'
                        }`}
                      >
                        <Lock className="w-3 h-3" />
                        <span>Unlock ({wep.cost} Coins)</span>
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Armor Tab */}
        {activeTab === 'armors' && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {ARMORS_DATA.map((arm) => {
              const isUnlocked = state.unlockedArmors.includes(arm.id);
              const isEquipped = state.selectedArmorId === arm.id;

              return (
                <div
                  key={arm.id}
                  className={`p-4 rounded-xl border flex flex-col justify-between gap-3 transition-all ${
                    isEquipped
                      ? 'bg-cyan-950/40 border-cyan-500 ring-2 ring-cyan-500/30'
                      : isUnlocked
                      ? 'bg-slate-800/70 border-slate-700'
                      : 'bg-slate-900/60 border-slate-800 opacity-85'
                  }`}
                >
                  <div className="flex flex-col gap-1.5">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Shield className="w-5 h-5 text-cyan-400" />
                        <h3 className="font-bold text-slate-100 text-sm md:text-base">{arm.name}</h3>
                      </div>
                      {isEquipped && (
                        <span className="px-2 py-0.5 rounded bg-cyan-500 text-black text-[10px] font-bold">
                          Equipped
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-slate-400">{arm.description}</p>
                  </div>

                  <div className="flex items-center justify-between pt-3 border-t border-slate-800 text-xs">
                    <div className="flex items-center gap-3 text-slate-300 tabular-nums">
                      <span>
                        Shield: <strong className="text-cyan-400">+{arm.shieldPoints}</strong>
                      </span>
                      <span>
                        Deflect Boost: <strong className="text-amber-400">{Math.round(arm.deflectChance * 100)}%</strong>
                      </span>
                    </div>

                    {isEquipped ? (
                      <span className="text-emerald-400 font-bold flex items-center gap-1 whitespace-nowrap">
                        <Check className="w-3.5 h-3.5" /> Equipped
                      </span>
                    ) : isUnlocked ? (
                      <button
                        onClick={() => equipArmor(arm.id)}
                        className="px-4 py-1.5 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white font-bold transition-colors whitespace-nowrap"
                      >
                        Equip
                      </button>
                    ) : (
                      <button
                        onClick={() => purchaseArmor(arm.id, arm.cost)}
                        disabled={state.coins < arm.cost}
                        className={`px-4 py-1.5 rounded-lg font-bold flex items-center gap-1.5 transition-colors whitespace-nowrap ${
                          state.coins >= arm.cost
                            ? 'bg-amber-500 hover:bg-amber-400 text-black'
                            : 'bg-slate-800 text-slate-500 cursor-not-allowed'
                        }`}
                      >
                        <Lock className="w-3 h-3" />
                        <span>Unlock ({arm.cost} Coins)</span>
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Skill Tree Tab */}
        {activeTab === 'skills' && (
          <div className="flex flex-col gap-3">
            <div className="p-3 bg-amber-500/10 border border-amber-500/30 rounded-xl text-xs text-amber-200">
              Upgrading passive skills permanently boosts your hero&apos;s agility, shield durability, weapon damage, and coin rewards across every stage!
            </div>

            <div className="grid grid-cols-1 gap-3">
              {skillConfig.map((skill) => {
                const currentLevel = state.skillTree[skill.key];
                const isMax = currentLevel >= skill.maxLevel;
                const nextCost = skill.baseCost * (currentLevel + 1);
                const canAfford = state.coins >= nextCost;

                return (
                  <div
                    key={skill.key}
                    className="p-3.5 rounded-xl bg-slate-800/80 border border-slate-700 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-slate-900 border border-slate-700 flex items-center justify-center text-xl shrink-0">
                        {skill.icon}
                      </div>
                      <div className="flex flex-col gap-0.5">
                        <div className="flex items-center gap-2 flex-wrap">
                          <h4 className="font-bold text-slate-100 text-sm">{skill.name}</h4>
                          <span className="text-[11px] font-cyber text-amber-400 font-bold tabular-nums">
                            (Level {currentLevel} / {skill.maxLevel})
                          </span>
                        </div>
                        <p className="text-xs text-slate-400">{skill.description}</p>
                      </div>
                    </div>

                    <div className="flex items-center justify-between sm:justify-end gap-3 shrink-0">
                      <div className="flex gap-1">
                        {Array.from({ length: skill.maxLevel }).map((_, i) => (
                          <div
                            key={i}
                            className={`w-2.5 h-6 rounded-sm ${
                              i < currentLevel
                                ? 'bg-amber-400 shadow-[0_0_8px_rgba(251,191,36,0.6)]'
                                : 'bg-slate-900 border border-slate-700'
                            }`}
                          />
                        ))}
                      </div>

                      {isMax ? (
                        <span className="px-3 py-1.5 rounded-lg bg-emerald-950 text-emerald-400 border border-emerald-800 text-xs font-bold whitespace-nowrap">
                          Max Level ✓
                        </span>
                      ) : (
                        <button
                          disabled={!canAfford}
                          onClick={() => upgradeSkill(skill.key, nextCost)}
                          className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all whitespace-nowrap ${
                            canAfford
                              ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-black hover:brightness-110 active:scale-95 shadow-md'
                              : 'bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-700'
                          }`}
                        >
                          <ChevronUp className="w-4 h-4" />
                          <span>Upgrade ({nextCost} Coins)</span>
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
