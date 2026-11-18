/**
 * @license
 * Copyright (c) 2026-2027 Ahmed Ramadan Fouad Ahmed Rabei — ROBYTE — All Rights Reserved.
 * Unique Player Access Gate, 2-Step Mobile Activation (4-Digit Code) & Device Profile Dropdown
 * - First-time players: Step 1 (Unique Username + Mobile Number, blocks duplicate names) -> Step 2 (4-Digit Activation Code)
 * - Returning players: Username dropdown listing profiles saved on this device -> Mobile verification -> Resume Saved Stage or Start Fresh shortcut
 */

import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  User,
  Sparkles,
  Check,
  Shuffle,
  ShieldCheck,
  LogIn,
  UserPlus,
  RotateCcw,
  AlertTriangle,
  MapPin,
  Phone,
  KeyRound,
  ChevronDown,
  ArrowLeft,
  ArrowRight,
  MessageSquareText,
  RefreshCw,
} from 'lucide-react';
import { sounds } from '../../utils/soundEffects';
import {
  useGame,
  normalizePlayerName,
  isValidPhoneNumber,
  normalizePhoneNumber,
} from '../../context/GameContext';
import { ScreenState } from '../../types/gameTypes';

interface PlayerNameModalProps {
  onClose?: () => void;
  isInitialSetup?: boolean;
}

const SUGGESTED_NAMES = [
  'NovaCoder_27',
  'NeuralKnight',
  'CyberNinja_EG',
  'QuantumHero',
  'FutureDev_X',
  'PixelMaster',
  'AlgoArchitect',
  'ZeroTrust_Ace',
  'DataSentinel',
  'WebWizard_99',
  'UX_Vanguard',
  'BlitzLegend',
];

const getScreenLabel = (screen: ScreenState): string => {
  if (screen === 'playing') return 'Combat Arena';
  if (screen === 'map') return 'World Map';
  return 'Title Screen';
};

export const PlayerNameModal: React.FC<PlayerNameModalProps> = ({
  onClose,
  isInitialSetup = false,
}) => {
  const {
    state,
    isSessionAuthenticated,
    lastActiveProfileName,
    registeredProfiles,
    registerNewPlayer,
    renameCurrentPlayer,
    loginExistingPlayerWithPhone,
    startFreshForCurrentPlayer,
  } = useGame();

  // Default to Returning Sign-In if profiles exist on this device and session isn't unlocked yet;
  // otherwise default to First-Time Registration with Mobile + 4-Digit Activation.
  const [activeTab, setActiveTab] = useState<'signin' | 'register'>(() =>
    registeredProfiles.length > 0 && !isSessionAuthenticated ? 'signin' : 'register'
  );

  // Returning Sign-In states
  const [selectedExistingName, setSelectedExistingName] = useState<string>(() => {
    if (lastActiveProfileName) return lastActiveProfileName;
    if (registeredProfiles.length > 0) return registeredProfiles[0].playerName;
    return '';
  });
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [signinPhone, setSigninPhone] = useState('');
  const [signinError, setSigninError] = useState<string | null>(null);
  const dropdownRef = useRef<HTMLDivElement | null>(null);

  // New Registration / Rename states
  const [actionMode, setActionMode] = useState<'new' | 'rename'>(
    isSessionAuthenticated && state.hasRegisteredName && !isInitialSetup ? 'rename' : 'new'
  );
  const [regStep, setRegStep] = useState<1 | 2>(1);
  const [nameInput, setNameInput] = useState(
    isSessionAuthenticated && state.hasRegisteredName && !isInitialSetup ? state.playerName : ''
  );
  const [regPhone, setRegPhone] = useState('');
  const [generatedOtp, setGeneratedOtp] = useState<string>('');
  const [otpDigits, setOtpDigits] = useState<string[]>(['', '', '', '']);
  const [resendCooldown, setResendCooldown] = useState<number>(0);
  const [error, setError] = useState<string | null>(null);
  const [confirmStartFresh, setConfirmStartFresh] = useState(false);

  const otpInputRefs = useRef<(HTMLInputElement | null)[]>([]);

  // Close username dropdown on outside click
  useEffect(() => {
    if (!isDropdownOpen) return;
    const handleOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsDropdownOpen(false);
      }
    };
    window.addEventListener('mousedown', handleOutside);
    return () => window.removeEventListener('mousedown', handleOutside);
  }, [isDropdownOpen]);

  // Countdown timer for resending 4-digit activation code
  useEffect(() => {
    if (resendCooldown <= 0) return;
    const id = window.setInterval(() => {
      setResendCooldown((prev) => (prev <= 1 ? 0 : prev - 1));
    }, 1000);
    return () => window.clearInterval(id);
  }, [resendCooldown]);

  const selectedProfile = useMemo(() => {
    const norm = normalizePlayerName(selectedExistingName);
    return (
      registeredProfiles.find((p) => p.normalizedName === norm) ||
      registeredProfiles[0] ||
      undefined
    );
  }, [selectedExistingName, registeredProfiles]);

  const normalizedInput = normalizePlayerName(nameInput);

  const matchedExistingProfile = useMemo(() => {
    if (!normalizedInput) return undefined;
    return registeredProfiles.find((p) => p.normalizedName === normalizedInput);
  }, [normalizedInput, registeredProfiles]);

  const isDuplicateConflict = useMemo(() => {
    if (!matchedExistingProfile) return false;
    if (actionMode === 'rename' && isSessionAuthenticated && state.hasRegisteredName) {
      return matchedExistingProfile.normalizedName !== normalizePlayerName(state.playerName);
    }
    return true;
  }, [matchedExistingProfile, actionMode, isSessionAuthenticated, state.hasRegisteredName, state.playerName]);

  const generateOtpCode = () => String(Math.floor(1000 + Math.random() * 9000));

  const handleRandomize = () => {
    sounds.playClick();
    const available = SUGGESTED_NAMES.filter(
      (n) => !registeredProfiles.some((p) => p.normalizedName === normalizePlayerName(n))
    );
    const pool = available.length > 0 ? available : SUGGESTED_NAMES;
    const randomName = pool[Math.floor(Math.random() * pool.length)];
    setNameInput(randomName);
    setError(null);
  };

  const handleSelectSuggestion = (suggested: string) => {
    sounds.playClick();
    setNameInput(suggested);
    setError(null);
  };

  // Returning player verification (Resume OR Start Fresh shortcut)
  const handleSignInSubmit = (startFresh: boolean) => {
    if (!selectedProfile) {
      setSigninError('Please select a username from the device list or activate a new hero.');
      sounds.playError();
      return;
    }

    const res = loginExistingPlayerWithPhone(selectedProfile.playerName, signinPhone, {
      startFresh,
    });

    if (!res.ok) {
      setSigninError(res.error || 'Mobile verification failed.');
      sounds.playError();
      return;
    }

    sounds.playVictory();
    setSigninError(null);
    if (onClose) onClose();
  };

  // Step 1 -> Send 4-digit activation code (strictly checks non-duplicate username + valid mobile)
  const handleStep1Submit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = nameInput.trim();

    if (!trimmed) {
      setError('Please enter your hero username in Step 1.');
      sounds.playError();
      return;
    }
    if (trimmed.length > 25) {
      setError('Hero username must not exceed 25 characters.');
      sounds.playError();
      return;
    }

    if (isDuplicateConflict && matchedExistingProfile) {
      setError(
        `Username "${matchedExistingProfile.playerName}" is already registered! Change your username in Step 1 or sign in with your existing profile.`
      );
      sounds.playError();
      return;
    }

    // Rename-only flow for an already activated logged-in hero
    if (actionMode === 'rename' && isSessionAuthenticated && state.hasRegisteredName) {
      const res = renameCurrentPlayer(trimmed);
      if (!res.ok) {
        setError(res.error || 'Could not update hero name.');
        sounds.playError();
        return;
      }
      sounds.playVictory();
      if (onClose) onClose();
      return;
    }

    // First-time registration requires valid mobile phone before dispatching 4-digit code
    if (!isValidPhoneNumber(regPhone)) {
      setError('Please enter a valid mobile number (8 to 15 digits, e.g. 01012345678).');
      sounds.playError();
      return;
    }

    const code = generateOtpCode();
    setGeneratedOtp(code);
    setOtpDigits(['', '', '', '']);
    setResendCooldown(15);
    setError(null);
    setRegStep(2);
    sounds.playTerminalChime();

    setTimeout(() => {
      otpInputRefs.current[0]?.focus();
    }, 60);
  };

  const handleOtpDigitChange = (index: number, rawVal: string) => {
    const cleanDigits = rawVal.replace(/\D/g, '');
    setError(null);

    // Support pasting full 4-digit code
    if (cleanDigits.length > 1) {
      const next = ['', '', '', ''];
      for (let i = 0; i < 4; i++) {
        next[i] = cleanDigits[i] || '';
      }
      setOtpDigits(next);
      const focusIdx = Math.min(cleanDigits.length, 3);
      otpInputRefs.current[focusIdx]?.focus();
      return;
    }

    const next = [...otpDigits];
    next[index] = cleanDigits;
    setOtpDigits(next);

    if (cleanDigits && index < 3) {
      otpInputRefs.current[index + 1]?.focus();
    }
  };

  const handleOtpKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !otpDigits[index] && index > 0) {
      otpInputRefs.current[index - 1]?.focus();
    }
  };

  const handleResendOtp = () => {
    if (resendCooldown > 0) return;
    const code = generateOtpCode();
    setGeneratedOtp(code);
    setOtpDigits(['', '', '', '']);
    setResendCooldown(15);
    setError(null);
    sounds.playTerminalChime();
    otpInputRefs.current[0]?.focus();
  };

  const handleVerifyAndActivate = (e: React.FormEvent) => {
    e.preventDefault();
    const enteredOtp = otpDigits.join('');
    if (enteredOtp.length !== 4) {
      setError('Please enter all 4 digits of the activation code.');
      sounds.playError();
      return;
    }
    if (enteredOtp !== generatedOtp) {
      setError('Incorrect 4-digit activation code. Check the code sent to your mobile and try again.');
      sounds.playError();
      return;
    }

    const result = registerNewPlayer(nameInput, regPhone);
    if (!result.ok) {
      // If duplicate conflict was hit at commit time, return player to Step 1
      setError(result.error || 'Could not activate account. Please review Step 1.');
      setRegStep(1);
      sounds.playError();
      return;
    }

    sounds.playVictory();
    if (onClose) onClose();
  };

  const handleConfirmReset = () => {
    sounds.playClick();
    startFreshForCurrentPlayer('playing');
    setConfirmStartFresh(false);
    if (onClose) onClose();
  };

  return (
    <div
      dir="ltr"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md animate-fade-in select-none"
    >
      <div className="w-full max-w-xl bg-slate-900/95 border-2 border-cyan-500/60 rounded-3xl p-5 sm:p-7 shadow-[0_0_50px_rgba(0,245,255,0.25)] flex flex-col gap-5 relative overflow-y-auto max-h-[92vh] text-left">
        {/* Top Accent Strip */}
        <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-cyan-500 via-blue-500 to-amber-400" />

        {/* Modal Header */}
        <div className="flex items-center gap-3.5 pt-1">
          <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-cyan-500/20 border-2 border-cyan-400/50 flex items-center justify-center text-cyan-400 shadow-lg shrink-0">
            {activeTab === 'register' && regStep === 2 ? (
              <KeyRound className="w-6 h-6 sm:w-7 sm:h-7 text-amber-300" />
            ) : (
              <User className="w-6 h-6 sm:w-7 sm:h-7" />
            )}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-cyan-950 border border-cyan-500/40 text-cyan-300">
                ROBYTE · Device Hero Access
              </span>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-950/80 border border-amber-500/40 text-amber-300">
                {activeTab === 'signin'
                  ? 'Mobile Sign-In'
                  : regStep === 1
                  ? 'Step 1 of 2: Mobile & Unique ID'
                  : 'Step 2 of 2: 4-Digit Activation'}
              </span>
            </div>
            <h2 className="text-lg sm:text-2xl font-black font-cyber text-white mt-1">
              {activeTab === 'signin'
                ? 'Welcome Back · Select Hero & Verify Mobile'
                : regStep === 1
                ? 'Activate Your ROBYTE Hero Account'
                : 'Enter Your 4-Digit Activation Code'}
            </h2>
            <p className="text-xs text-slate-400 leading-relaxed">
              {activeTab === 'signin'
                ? 'Select your username from the device list, enter your mobile number to resume right where you left off, or jump straight to a New Beginning.'
                : regStep === 1
                ? 'Choose a unique username and enter your mobile number to receive a 4-digit activation code.'
                : 'Type the 4 digits sent to activate gameplay for this hero.'}
            </p>
          </div>
        </div>

        {/* Mode Switcher Tabs (Sign In vs New Activation) */}
        {registeredProfiles.length > 0 && (
          <div className="grid grid-cols-2 gap-2 p-1 rounded-2xl bg-slate-950 border border-slate-800">
            <button
              type="button"
              onClick={() => {
                sounds.playClick();
                setActiveTab('signin');
                setSigninError(null);
                setError(null);
              }}
              className={`py-2 px-3 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all whitespace-nowrap ${
                activeTab === 'signin'
                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/50'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <LogIn className="w-3.5 h-3.5 shrink-0" />
              <span className="tabular-nums">Device Users ({registeredProfiles.length})</span>
            </button>

            <button
              type="button"
              onClick={() => {
                sounds.playClick();
                setActiveTab('register');
                setRegStep(1);
                setError(null);
                setSigninError(null);
              }}
              className={`py-2 px-3 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all whitespace-nowrap ${
                activeTab === 'register'
                  ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/50'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <UserPlus className="w-3.5 h-3.5 shrink-0" />
              <span>
                {isSessionAuthenticated && state.hasRegisteredName && !isInitialSetup
                  ? 'Edit Name / New Hero'
                  : 'New Hero Activation'}
              </span>
            </button>
          </div>
        )}

        {/* ==================== RETURNING PLAYER SIGN-IN (DROPDOWN + MOBILE) ==================== */}
        {activeTab === 'signin' ? (
          <div className="flex flex-col gap-4">
            {/* Username Dropdown Selector from same device */}
            <div className="relative" ref={dropdownRef}>
              <label className="block text-xs font-bold text-slate-300 mb-1.5">
                Username (Registered on This Device):
              </label>

              <button
                type="button"
                onClick={() => {
                  sounds.playClick();
                  setIsDropdownOpen((prev) => !prev);
                }}
                className="w-full bg-slate-950/90 border-2 border-slate-700 hover:border-cyan-500/60 focus:border-cyan-400 rounded-2xl px-4 py-3 flex items-center justify-between gap-3 text-left transition-colors"
              >
                {selectedProfile ? (
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-8 h-8 rounded-lg bg-cyan-500/20 border border-cyan-500/40 flex items-center justify-center font-black font-cyber text-cyan-300 text-sm shrink-0">
                      {selectedProfile.playerName[0]?.toUpperCase() || 'B'}
                    </div>
                    <div className="min-w-0">
                      <div className="text-sm font-cyber font-bold text-white truncate">
                        {selectedProfile.playerName}
                      </div>
                      <div className="text-[11px] text-slate-400 flex items-center gap-1.5 flex-wrap">
                        <span className="text-cyan-300 font-semibold">
                          World {selectedProfile.lastActiveWorld} · Stage {selectedProfile.lastActiveSubStageId}
                        </span>
                        <span>·</span>
                        <span className="tabular-nums">
                          {selectedProfile.completedStagesCount}/20 cleared
                        </span>
                        {selectedProfile.phoneMasked && (
                          <>
                            <span>·</span>
                            <span className="font-mono text-slate-400">{selectedProfile.phoneMasked}</span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                ) : (
                  <span className="text-sm text-slate-400">Select a player from this device...</span>
                )}

                <ChevronDown
                  className={`w-4 h-4 text-cyan-400 shrink-0 transition-transform ${
                    isDropdownOpen ? 'rotate-180' : ''
                  }`}
                />
              </button>

              {/* Expanded Username Dropdown List */}
              {isDropdownOpen && (
                <div className="mt-1.5 w-full rounded-2xl bg-slate-950 border border-cyan-500/50 shadow-2xl overflow-hidden z-20 max-h-56 overflow-y-auto divide-y divide-slate-800/80">
                  {registeredProfiles.map((prof) => {
                    const isSelected =
                      selectedProfile && prof.normalizedName === selectedProfile.normalizedName;
                    return (
                      <button
                        key={prof.normalizedName}
                        type="button"
                        onClick={() => {
                          sounds.playClick();
                          setSelectedExistingName(prof.playerName);
                          setIsDropdownOpen(false);
                          setSigninError(null);
                        }}
                        className={`w-full px-4 py-2.5 flex items-center justify-between gap-3 text-left transition-colors ${
                          isSelected
                            ? 'bg-cyan-950/60 text-white'
                            : 'hover:bg-slate-900 text-slate-200'
                        }`}
                      >
                        <div className="min-w-0">
                          <div className="flex items-center gap-2">
                            <span className="font-cyber font-bold text-xs sm:text-sm truncate">
                              {prof.playerName}
                            </span>
                            <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-800 text-cyan-300 font-bold tabular-nums">
                              LVL {prof.playerLevel}
                            </span>
                          </div>
                          <div className="text-[11px] text-slate-400 flex items-center gap-1.5 mt-0.5">
                            <MapPin className="w-3 h-3 text-amber-400 shrink-0" />
                            <span>
                              Stopped at World {prof.lastActiveWorld} · Stage {prof.lastActiveSubStageId} ({getScreenLabel(prof.lastScreen)})
                            </span>
                          </div>
                        </div>
                        {isSelected && <Check className="w-4 h-4 text-cyan-400 shrink-0" />}
                      </button>
                    );
                  })}

                  <button
                    type="button"
                    onClick={() => {
                      sounds.playClick();
                      setIsDropdownOpen(false);
                      setActiveTab('register');
                      setActionMode('new');
                      setRegStep(1);
                      setError(null);
                    }}
                    className="w-full px-4 py-2.5 flex items-center gap-2 text-xs font-bold text-emerald-300 hover:bg-emerald-950/40 transition-colors"
                  >
                    <UserPlus className="w-4 h-4 shrink-0" />
                    <span>+ Register a New Player Account</span>
                  </button>
                </div>
              )}
            </div>

            {/* Mobile Verification Field for Returning Player */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-bold text-slate-300">
                  Enter Registered Mobile Number:
                </label>
                {selectedProfile?.phoneMasked && (
                  <span className="text-[11px] font-mono text-slate-400">
                    Hint: {selectedProfile.phoneMasked}
                  </span>
                )}
              </div>
              <div className="relative flex items-center">
                <Phone className="w-4 h-4 text-cyan-400 absolute left-3.5 pointer-events-none" />
                <input
                  type="tel"
                  inputMode="tel"
                  value={signinPhone}
                  onChange={(e) => {
                    setSigninPhone(e.target.value);
                    setSigninError(null);
                  }}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      handleSignInSubmit(false);
                    }
                  }}
                  placeholder="Enter your mobile number, e.g. 01012345678"
                  className="w-full bg-slate-950/90 border-2 border-slate-700 focus:border-cyan-400 rounded-2xl pl-10 pr-4 py-3 text-base font-bold text-white placeholder-slate-500 focus:outline-none transition-all font-mono"
                  autoFocus
                />
              </div>

              {signinError && (
                <p className="text-xs text-rose-400 mt-1.5 font-bold flex items-center gap-1.5">
                  <AlertTriangle className="w-3.5 h-3.5 shrink-0" />
                  <span>{signinError}</span>
                </p>
              )}
            </div>

            {/* Action Buttons: Resume Stopped Stage OR New Beginning Shortcut */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 pt-2 border-t border-slate-800">
              <button
                type="button"
                onClick={() => handleSignInSubmit(false)}
                className="flex-[2] py-3.5 px-4 rounded-2xl bg-gradient-to-r from-cyan-500 via-blue-600 to-indigo-600 hover:brightness-110 text-white text-xs sm:text-sm font-black flex items-center justify-center gap-2 shadow-lg shadow-cyan-500/25 transition-all active:scale-95"
              >
                <LogIn className="w-4 h-4 shrink-0" />
                <span>
                  {selectedProfile
                    ? `Resume (World ${selectedProfile.lastActiveWorld} · Stage ${selectedProfile.lastActiveSubStageId})`
                    : 'Verify & Enter Game'}
                </span>
              </button>

              <button
                type="button"
                onClick={() => handleSignInSubmit(true)}
                title="Reset progress and start fresh from World 1 · Stage 1"
                className="flex-1 py-3.5 px-3.5 rounded-2xl bg-amber-500/15 hover:bg-amber-500/25 border border-amber-500/50 text-amber-300 text-xs font-extrabold flex items-center justify-center gap-1.5 transition-all whitespace-nowrap active:scale-95"
              >
                <RotateCcw className="w-3.5 h-3.5 shrink-0" />
                <span>New Beginning</span>
              </button>
            </div>

            {onClose && isSessionAuthenticated && !isInitialSetup && (
              <button
                type="button"
                onClick={onClose}
                className="w-full py-2 rounded-xl border border-slate-700 hover:bg-slate-800 text-slate-300 text-xs font-bold transition-colors"
              >
                Cancel
              </button>
            )}
          </div>
        ) : regStep === 1 ? (
          /* ==================== STEP 1: UNIQUE USERNAME + MOBILE NUMBER ==================== */
          <form onSubmit={handleStep1Submit} className="flex flex-col gap-4">
            {/* Switch between renaming active hero or activating a brand-new hero */}
            {isSessionAuthenticated && state.hasRegisteredName && !isInitialSetup && (
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => {
                    sounds.playClick();
                    setActionMode('rename');
                    setNameInput(state.playerName);
                    setError(null);
                  }}
                  className={`flex-1 py-2 px-3 rounded-xl text-xs font-bold border transition-all ${
                    actionMode === 'rename'
                      ? 'bg-cyan-950/70 border-cyan-400 text-cyan-300'
                      : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'
                  }`}
                >
                  Rename Current Hero
                </button>
                <button
                  type="button"
                  onClick={() => {
                    sounds.playClick();
                    setActionMode('new');
                    setNameInput('');
                    setRegPhone('');
                    setError(null);
                  }}
                  className={`flex-1 py-2 px-3 rounded-xl text-xs font-bold border transition-all ${
                    actionMode === 'new'
                      ? 'bg-emerald-950/70 border-emerald-400 text-emerald-300'
                      : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'
                  }`}
                >
                  + Activate New Hero
                </button>
              </div>
            )}

            {/* Username Field */}
            <div className="relative">
              <label className="block text-xs font-bold text-slate-300 mb-1.5">
                {actionMode === 'rename'
                  ? 'Step 1 — Edit registered hero name:'
                  : 'Step 1 — Enter a unique hero username:'}
              </label>
              <div className="relative flex items-center">
                <input
                  type="text"
                  value={nameInput}
                  onChange={(e) => {
                    setNameInput(e.target.value);
                    setError(null);
                  }}
                  maxLength={25}
                  placeholder="Type your name, e.g. Adam_2027"
                  className={`w-full bg-slate-950/90 border-2 rounded-2xl pl-4 pr-28 py-3 text-base font-bold text-white placeholder-slate-500 focus:outline-none transition-all shadow-inner ${
                    isDuplicateConflict
                      ? 'border-rose-500 focus:border-rose-400'
                      : 'border-slate-700 focus:border-cyan-400'
                  }`}
                  autoFocus
                />
                <button
                  type="button"
                  onClick={handleRandomize}
                  title="Generate an available unique name"
                  className="absolute right-2.5 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-cyan-400 hover:text-cyan-300 text-xs font-bold flex items-center gap-1.5 transition-colors border border-slate-600 whitespace-nowrap"
                >
                  <Shuffle className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Random</span>
                </button>
              </div>

              {/* Duplicate Name Enforcement Banner right in Step 1 */}
              {isDuplicateConflict && matchedExistingProfile && (
                <div className="mt-2.5 p-3 rounded-2xl bg-rose-950/50 border border-rose-500/70 flex flex-col gap-2">
                  <div className="flex items-start gap-2 text-xs text-rose-200 font-bold">
                    <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                    <span>
                      Username &ldquo;{matchedExistingProfile.playerName}&rdquo; is already registered! You must change your username from Step 1 before continuing — or sign in below if this account belongs to you:
                    </span>
                  </div>
                  <div className="flex items-center justify-between gap-2 text-[11px] text-slate-300 bg-slate-950/70 px-3 py-2 rounded-xl border border-slate-800">
                    <span>
                      Checkpoint:{' '}
                      <strong className="text-cyan-300">
                        World {matchedExistingProfile.lastActiveWorld} · Stage{' '}
                        {matchedExistingProfile.lastActiveSubStageId}
                      </strong>
                    </span>
                    <button
                      type="button"
                      onClick={() => {
                        sounds.playClick();
                        setSelectedExistingName(matchedExistingProfile.playerName);
                        setActiveTab('signin');
                        setSigninError(null);
                        setError(null);
                      }}
                      className="px-3 py-1.5 rounded-lg bg-amber-400 hover:bg-amber-300 text-black font-black flex items-center gap-1 shrink-0 transition-colors whitespace-nowrap"
                    >
                      <LogIn className="w-3.5 h-3.5" />
                      <span>Go to Sign In</span>
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Mobile Number Field (required for new activation) */}
            {actionMode === 'new' && (
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1.5">
                  Mobile Number (to send 4-digit activation code):
                </label>
                <div className="relative flex items-center">
                  <Phone className="w-4 h-4 text-cyan-400 absolute left-3.5 pointer-events-none" />
                  <input
                    type="tel"
                    inputMode="tel"
                    value={regPhone}
                    onChange={(e) => {
                      setRegPhone(e.target.value);
                      setError(null);
                    }}
                    placeholder="e.g. 01012345678"
                    className="w-full bg-slate-950/90 border-2 border-slate-700 focus:border-cyan-400 rounded-2xl pl-10 pr-4 py-3 text-base font-bold text-white placeholder-slate-500 focus:outline-none transition-all font-mono"
                  />
                </div>
              </div>
            )}

            {error && !isDuplicateConflict && (
              <p className="text-xs text-rose-400 font-bold flex items-center gap-1.5">
                <AlertTriangle className="w-3.5 h-3.5 shrink-0" />
                <span>{error}</span>
              </p>
            )}

            {/* Quick Available Name Suggestions */}
            <div>
              <div className="flex items-center gap-1.5 text-xs font-bold text-slate-400 mb-2">
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                <span>One-click name suggestions:</span>
              </div>
              <div className="flex flex-wrap gap-1.5 max-h-24 overflow-y-auto p-1">
                {SUGGESTED_NAMES.map((suggestion) => {
                  const taken = registeredProfiles.some(
                    (p) => p.normalizedName === normalizePlayerName(suggestion)
                  );
                  return (
                    <button
                      key={suggestion}
                      type="button"
                      onClick={() => handleSelectSuggestion(suggestion)}
                      className={`px-2.5 py-1 rounded-xl text-xs font-medium border transition-all flex items-center gap-1 ${
                        nameInput === suggestion
                          ? 'bg-cyan-500/20 border-cyan-400 text-cyan-300 font-bold'
                          : taken
                          ? 'bg-rose-950/30 border-rose-700/40 text-rose-300/70 line-through'
                          : 'bg-slate-950 border-slate-800 text-slate-300 hover:border-slate-600 hover:text-white'
                      }`}
                    >
                      <span>{suggestion}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Step 1 Submit */}
            <div className="flex items-center gap-3 pt-3 border-t border-slate-800">
              {onClose && isSessionAuthenticated && !isInitialSetup && (
                <button
                  type="button"
                  onClick={onClose}
                  className="flex-1 py-3 rounded-2xl border border-slate-700 hover:bg-slate-800 text-slate-300 text-xs font-bold transition-colors"
                >
                  Cancel
                </button>
              )}
              <button
                type="submit"
                disabled={isDuplicateConflict}
                className={`flex-[2] py-3.5 rounded-2xl text-sm font-bold flex items-center justify-center gap-2 transition-all ${
                  isDuplicateConflict
                    ? 'bg-slate-800 text-slate-500 border border-slate-700 cursor-not-allowed'
                    : 'bg-gradient-to-r from-cyan-500 via-blue-600 to-indigo-600 hover:brightness-110 text-white shadow-lg shadow-cyan-500/25'
                }`}
              >
                {actionMode === 'rename' ? (
                  <>
                    <Check className="w-4 h-4" />
                    <span>Save New Name</span>
                  </>
                ) : (
                  <>
                    <span>Send 4-Digit Activation Code</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </div>
          </form>
        ) : (
          /* ==================== STEP 2: ENTER 4-DIGIT ACTIVATION CODE ==================== */
          <form onSubmit={handleVerifyAndActivate} className="flex flex-col gap-4">
            {/* Dispatched 4-Digit SMS Notification Banner */}
            <div className="p-4 rounded-2xl bg-emerald-950/50 border border-emerald-500/60 flex flex-col gap-2">
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2 text-emerald-300 text-xs font-bold">
                  <MessageSquareText className="w-4 h-4 shrink-0" />
                  <span>
                    Activation SMS Sent to <span className="font-mono text-white">{normalizePhoneNumber(regPhone)}</span>
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    sounds.playClick();
                    setOtpDigits(generatedOtp.split(''));
                    setError(null);
                  }}
                  className="px-2.5 py-1 rounded-lg bg-emerald-500/20 hover:bg-emerald-500/30 border border-emerald-400/50 text-emerald-200 text-[11px] font-bold transition-colors whitespace-nowrap"
                >
                  Auto-Fill Code
                </button>
              </div>
              <div className="flex items-center justify-between bg-slate-950/80 px-3.5 py-2.5 rounded-xl border border-slate-800">
                <span className="text-xs text-slate-300">
                  Your 4-digit activation code for <strong className="text-cyan-300">{nameInput.trim()}</strong>:
                </span>
                <span className="font-mono font-black text-xl tracking-[0.3em] text-amber-300">
                  {generatedOtp}
                </span>
              </div>
            </div>

            {/* 4-Digit Code Inputs */}
            <div className="flex flex-col items-center gap-2 py-2">
              <label className="text-xs font-bold text-slate-300">
                Enter the 4 digits below to activate ROBYTE:
              </label>
              <div className="flex items-center justify-center gap-3">
                {[0, 1, 2, 3].map((idx) => (
                  <input
                    key={idx}
                    ref={(el) => {
                      otpInputRefs.current[idx] = el;
                    }}
                    type="text"
                    inputMode="numeric"
                    maxLength={4}
                    value={otpDigits[idx]}
                    onChange={(e) => handleOtpDigitChange(idx, e.target.value)}
                    onKeyDown={(e) => handleOtpKeyDown(idx, e)}
                    aria-label={`Activation digit ${idx + 1}`}
                    className="w-14 h-16 sm:w-16 sm:h-16 rounded-2xl bg-slate-950 border-2 border-slate-700 focus:border-cyan-400 text-center font-mono text-2xl font-black text-white focus:outline-none shadow-inner transition-all"
                  />
                ))}
              </div>

              {error && (
                <p className="text-xs text-rose-400 mt-1 font-bold flex items-center gap-1.5">
                  <AlertTriangle className="w-3.5 h-3.5 shrink-0" />
                  <span>{error}</span>
                </p>
              )}

              <button
                type="button"
                disabled={resendCooldown > 0}
                onClick={handleResendOtp}
                className="mt-1 text-xs font-bold text-cyan-400 hover:text-cyan-300 disabled:text-slate-500 flex items-center gap-1.5 transition-colors"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>
                  {resendCooldown > 0
                    ? `Resend 4-digit code in ${resendCooldown}s`
                    : 'Resend 4-digit code'}
                </span>
              </button>
            </div>

            {/* Step 2 Submit */}
            <div className="flex items-center gap-3 pt-3 border-t border-slate-800">
              <button
                type="button"
                onClick={() => {
                  sounds.playClick();
                  setRegStep(1);
                  setError(null);
                }}
                className="flex-1 py-3 rounded-2xl border border-slate-700 hover:bg-slate-800 text-slate-300 text-xs font-bold flex items-center justify-center gap-1.5 transition-colors whitespace-nowrap"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Step 1</span>
              </button>

              <button
                type="submit"
                className="flex-[2] py-3.5 rounded-2xl bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 hover:brightness-110 text-black text-sm font-black flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/25 transition-all"
              >
                <ShieldCheck className="w-4 h-4" />
                <span>Activate &amp; Start Game</span>
              </button>
            </div>
          </form>
        )}

        {/* Active Signed-In Start Over Control (only when switching profiles inside an open session) */}
        {isSessionAuthenticated && state.hasRegisteredName && !isInitialSetup && (
          <div className="pt-3 border-t border-slate-800/90">
            {!confirmStartFresh ? (
              <button
                type="button"
                onClick={() => {
                  sounds.playClick();
                  setConfirmStartFresh(true);
                }}
                className="w-full py-2.5 px-3 rounded-xl bg-rose-950/40 hover:bg-rose-950/70 border border-rose-500/40 text-rose-300 text-xs font-bold flex items-center justify-center gap-2 transition-colors"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Start Over (Reset &ldquo;{state.playerName}&rdquo; back to Stage 1)</span>
              </button>
            ) : (
              <div className="p-3 rounded-2xl bg-rose-950/60 border border-rose-500/60 flex flex-col sm:flex-row items-center justify-between gap-2.5">
                <span className="text-xs text-rose-200 font-bold text-center sm:text-left">
                  Reset all stages for &ldquo;{state.playerName}&rdquo; and restart from World 1 · Stage 1?
                </span>
                <div className="flex items-center gap-2 shrink-0">
                  <button
                    type="button"
                    onClick={() => setConfirmStartFresh(false)}
                    className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={handleConfirmReset}
                    className="px-3 py-1.5 rounded-lg bg-rose-500 hover:bg-rose-400 text-white text-xs font-bold whitespace-nowrap"
                  >
                    Yes, Start Over
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
