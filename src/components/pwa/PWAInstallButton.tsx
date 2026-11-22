/**
 * @license
 * Copyright (c) 2026-2027 Ahmed Ramadan Fouad Ahmed Rabei — ROBYTE — All Rights Reserved.
 * Progressive Web App (PWA) Install Trigger & Cross-Device Guide Modal.
 */

import React, { useState } from 'react';
import { usePWAInstall } from './usePWAInstall';
import { Download, Smartphone, X, CheckCircle2, Share2, MoreVertical } from 'lucide-react';
import { sounds } from '../../utils/soundEffects';

interface PWAInstallButtonProps {
  variant?: 'compact' | 'hero' | 'drawer';
}

export const PWAInstallButton: React.FC<PWAInstallButtonProps> = ({ variant = 'compact' }) => {
  const { isInstallable, isInstalled, isIOS, install } = usePWAInstall();
  const [showGuideModal, setShowGuideModal] = useState(false);

  if (isInstalled) {
    return null;
  }

  const handleClick = async () => {
    sounds.playClick();
    if (isInstallable) {
      const accepted = await install();
      if (!accepted) {
        setShowGuideModal(true);
      }
    } else {
      setShowGuideModal(true);
    }
  };

  return (
    <>
      {variant === 'hero' ? (
        <button
          onClick={handleClick}
          className="w-full sm:w-auto px-5 py-3 rounded-2xl bg-gradient-to-r from-emerald-600/90 to-teal-600/90 hover:from-emerald-500 hover:to-teal-500 border border-emerald-400/40 text-white font-bold text-sm flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(16,185,129,0.25)] transition-all active:scale-95 whitespace-nowrap"
        >
          <Smartphone className="w-4 h-4 text-emerald-200 shrink-0" />
          <span>Install Mobile App</span>
        </button>
      ) : variant === 'drawer' ? (
        <button
          onClick={handleClick}
          className={`w-full px-3.5 py-2.5 rounded-xl text-xs font-bold flex items-center justify-between gap-2 transition-all active:scale-[0.99] ${
            isInstallable
              ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-black shadow-lg hover:brightness-110'
              : 'bg-emerald-950/60 border border-emerald-500/40 text-emerald-300 hover:bg-emerald-900/60 hover:border-emerald-400'
          }`}
        >
          <span className="flex items-center gap-2">
            {isInstallable ? (
              <Download className="w-4 h-4 shrink-0" />
            ) : (
              <Smartphone className="w-4 h-4 text-emerald-400 shrink-0" />
            )}
            <span>Install on Mobile / Desktop</span>
          </span>
          <span className="text-[10px] opacity-80">PWA</span>
        </button>
      ) : (
        <button
          onClick={handleClick}
          className={`flex items-center gap-1.5 p-1.5 sm:px-3 sm:py-1.5 rounded-xl text-xs font-bold transition-all active:scale-95 whitespace-nowrap ${
            isInstallable
              ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-black shadow-lg hover:brightness-110'
              : 'bg-slate-900 border border-emerald-500/40 text-emerald-300 hover:bg-slate-800 hover:border-emerald-400'
          }`}
          title="Install ROBYTE as a standalone app"
        >
          {isInstallable ? (
            <Download className="w-3.5 h-3.5 shrink-0" />
          ) : (
            <Smartphone className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
          )}
          <span className="hidden sm:inline">Install App</span>
        </button>
      )}

      {showGuideModal && (
        <div dir="ltr" className="fixed inset-0 z-[60] flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-2xl bg-slate-900 border border-cyan-500/40 p-6 shadow-2xl text-left flex flex-col gap-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <Smartphone className="w-5 h-5 text-cyan-400 shrink-0" />
                <h3 className="text-base font-bold text-slate-100">
                  Install ROBYTE for Offline Play
                </h3>
              </div>
              <button
                onClick={() => setShowGuideModal(false)}
                className="p-1.5 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white"
                aria-label="Close install guide"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {isInstallable ? (
              <div className="flex flex-col gap-3">
                <p className="text-xs text-slate-300 leading-relaxed">
                  Your device supports instant standalone installation for full-screen gameplay even offline!
                </p>
                <button
                  onClick={async () => {
                    const ok = await install();
                    if (ok) setShowGuideModal(false);
                  }}
                  className="w-full py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-black font-extrabold text-sm flex items-center justify-center gap-2 shadow-lg hover:brightness-110"
                >
                  <Download className="w-4 h-4" />
                  <span>Install Now</span>
                </button>
              </div>
            ) : isIOS ? (
              <div className="text-xs text-slate-300 leading-relaxed flex flex-col gap-2.5 bg-slate-950/70 p-4 rounded-xl border border-slate-800">
                <div className="font-bold text-cyan-300 flex items-center gap-1.5">
                  <Share2 className="w-4 h-4" />
                  <span>How to install on iPhone / iPad (Safari):</span>
                </div>
                <p>1. Open this game link directly in <strong>Safari</strong>.</p>
                <p>2. Tap the <strong>Share</strong> icon in the bottom toolbar.</p>
                <p>3. Scroll and tap <strong>Add to Home Screen</strong>.</p>
                <p>4. Tap <strong>Add</strong> to launch ROBYTE as a full-screen app.</p>
              </div>
            ) : (
              <div className="text-xs text-slate-300 leading-relaxed flex flex-col gap-2.5 bg-slate-950/70 p-4 rounded-xl border border-slate-800">
                <div className="font-bold text-emerald-300 flex items-center gap-1.5">
                  <MoreVertical className="w-4 h-4" />
                  <span>How to install on Android (Chrome):</span>
                </div>
                <p>1. Open the game URL directly in <strong>Google Chrome</strong>.</p>
                <p>2. Tap the three-dot menu <strong>(&#8942;)</strong> in the top bar.</p>
                <p>3. Select <strong>Install app</strong> or <strong>Add to Home screen</strong>.</p>
                <div className="flex items-center gap-1.5 text-emerald-400 pt-1 font-semibold">
                  <CheckCircle2 className="w-4 h-4 shrink-0" />
                  <span>Once installed, ROBYTE launches full-screen and works offline!</span>
                </div>
              </div>
            )}

            <button
              onClick={() => setShowGuideModal(false)}
              className="w-full rounded-xl bg-slate-800 hover:bg-slate-700 py-2.5 text-xs font-bold text-slate-200 transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </>
  );
};
