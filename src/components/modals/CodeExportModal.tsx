/**
 * @license
 * Copyright (c) 2026-2027 Ahmed Ramadan Fouad Ahmed Rabei — ROBYTE — All Rights Reserved.
 * ROBYTE Source Code ZIP Exporter & Live File Inspector Modal.
 */

import React, { useState } from 'react';
import { WORLDS_DATA } from '../../data/curriculumData';
import { sounds } from '../../utils/soundEffects';
import { downloadProjectZip } from '../../utils/projectZipExporter';

import curriculumDataRaw from '../../data/curriculumData.ts?raw';
import actionCanvasRaw from '../game/ActionGameCanvas.tsx?raw';
import gameContextRaw from '../../context/GameContext.tsx?raw';
import appRaw from '../../App.tsx?raw';
import titleScreenRaw from '../game/TitleScreen.tsx?raw';
import worldMapRaw from '../game/WorldMap.tsx?raw';
import indexHtmlRaw from '../../../index.html?raw';
import packageJsonRaw from '../../../package.json?raw';

import {
  X,
  Download,
  Copy,
  Check,
  FileText,
  Code2,
  FolderArchive,
  Link2,
  AlertCircle,
  Loader2,
  Eye,
} from 'lucide-react';

interface CodeExportModalProps {
  onClose: () => void;
}

export const CodeExportModal: React.FC<CodeExportModalProps> = ({ onClose }) => {
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [downloadStatus, setDownloadStatus] = useState<string | null>(null);
  const [isGeneratingZip, setIsGeneratingZip] = useState(false);
  const [zipProgress, setZipProgress] = useState(0);
  const [zipCurrentFile, setZipCurrentFile] = useState('');
  const [activeTab, setActiveTab] = useState<'zip' | 'viewer'>('zip');
  const [selectedFileKey, setSelectedFileKey] = useState<
    'app' | 'canvas' | 'title' | 'map' | 'questions' | 'context' | 'html' | 'pkg'
  >('app');

  const baseUrl = typeof window !== 'undefined' ? window.location.origin : '';

  const safeCopyToClipboard = async (text: string): Promise<boolean> => {
    if (typeof navigator !== 'undefined' && navigator.clipboard && document.hasFocus()) {
      try {
        await navigator.clipboard.writeText(text);
        return true;
      } catch {
        // Fallback below
      }
    }

    try {
      const textarea = document.createElement('textarea');
      textarea.value = text;
      textarea.setAttribute('readonly', '');
      textarea.style.position = 'fixed';
      textarea.style.top = '0';
      textarea.style.left = '-9999px';
      textarea.style.opacity = '0';
      document.body.appendChild(textarea);
      textarea.focus({ preventScroll: true });
      textarea.select();
      textarea.setSelectionRange(0, text.length);
      const ok = document.execCommand('copy');
      document.body.removeChild(textarea);
      if (ok) return true;
    } catch {
      // Fallback below
    }

    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      try {
        window.focus();
        await navigator.clipboard.writeText(text);
        return true;
      } catch {
        return false;
      }
    }
    return false;
  };

  const sourceFilesMap: Record<string, { name: string; desc: string; content: string }> = {
    app: {
      name: 'src/App.tsx',
      desc: 'Root shell, slide-out Options side drawer & checkpoint routing',
      content: appRaw,
    },
    canvas: {
      name: 'src/components/game/ActionGameCanvas.tsx',
      desc: '60fps action platformer engine, enemy turrets, mobile FOV & smart aim',
      content: actionCanvasRaw,
    },
    title: {
      name: 'src/components/game/TitleScreen.tsx',
      desc: 'ROBYTE hero landing screen & animated cyber grid',
      content: titleScreenRaw,
    },
    map: {
      name: 'src/components/game/WorldMap.tsx',
      desc: '4 Worlds, 20 sub-stages & 80% mastery progression map',
      content: worldMapRaw,
    },
    questions: {
      name: 'src/data/curriculumData.ts',
      desc: '100-question Language Schools curriculum bank, heroes, weapons & perks',
      content: curriculumDataRaw,
    },
    context: {
      name: 'src/context/GameContext.tsx',
      desc: 'Unique player registry, auto-resume state & localStorage persistence',
      content: gameContextRaw,
    },
    html: {
      name: 'index.html',
      desc: 'Entry HTML document, fonts & PWA metadata',
      content: indexHtmlRaw,
    },
    pkg: {
      name: 'package.json',
      desc: 'Project dependencies & build scripts',
      content: packageJsonRaw,
    },
  };

  const copyText = async (text: string, id: string) => {
    const ok = await safeCopyToClipboard(text);
    if (ok) {
      setCopiedId(id);
      sounds.playVictory();
      setTimeout(() => setCopiedId(null), 2500);
    } else {
      setDownloadStatus('Clipboard access blocked here; select text manually and press Ctrl+C.');
      setTimeout(() => setDownloadStatus(null), 4000);
    }
  };

  const handleLiveZipDownload = async () => {
    sounds.playClick();
    setIsGeneratingZip(true);
    setZipProgress(5);
    setZipCurrentFile('Collecting ROBYTE source files...');
    setDownloadStatus(null);

    try {
      const count = await downloadProjectZip((pct, currentFile) => {
        setZipProgress(pct);
        setZipCurrentFile(currentFile);
      });
      sounds.playVictory();
      setDownloadStatus(`Prepared & downloaded complete archive (${count} files) as robyte-source-code.zip!`);
    } catch {
      setDownloadStatus('Could not package dynamically; use the static ZIP download button or direct URL below.');
    } finally {
      setIsGeneratingZip(false);
      setTimeout(() => setDownloadStatus(null), 6000);
    }
  };

  const handleRobustDownload = async (fileUrl: string, filename: string) => {
    sounds.playClick();
    setDownloadStatus(`Preparing ${filename}...`);
    try {
      const response = await fetch(fileUrl);
      if (!response.ok) throw new Error('Download failed');
      const blob = await response.blob();
      const blobUrl = URL.createObjectURL(blob);

      const a = document.createElement('a');
      a.href = blobUrl;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);

      setTimeout(() => URL.revokeObjectURL(blobUrl), 10000);
      sounds.playVictory();
      setDownloadStatus(`Started downloading ${filename}!`);
    } catch {
      const a = document.createElement('a');
      a.href = fileUrl;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      setDownloadStatus(`Download requested for ${filename}`);
    } finally {
      setTimeout(() => setDownloadStatus(null), 4000);
    }
  };

  const downloadQuestionsJSON = () => {
    sounds.playClick();
    const dataStr = JSON.stringify(WORLDS_DATA, null, 2);
    const blob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'robyte-questions-bank.json';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    setTimeout(() => URL.revokeObjectURL(url), 2000);
  };

  return (
    <div dir="ltr" className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 md:p-6 bg-black/90 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-4xl bg-slate-900 border border-slate-700 rounded-2xl p-4 md:p-6 shadow-2xl overflow-y-auto max-h-[94vh] flex flex-col gap-4 text-left">
        {/* Modal Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-3 gap-3">
          <div className="flex items-center gap-3">
            <button
              onClick={() => {
                sounds.playClick();
                onClose();
              }}
              className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
              aria-label="Close Source Export"
            >
              <X className="w-5 h-5" />
            </button>
            <div>
              <div className="flex items-center gap-2">
                <FolderArchive className="w-5 h-5 text-emerald-400 shrink-0" />
                <h2 className="text-base md:text-lg font-bold font-cyber text-slate-100">
                  ROBYTE Source Code Package &amp; Inspector
                </h2>
              </div>
              <p className="text-xs text-slate-400">
                Download the complete ROBYTE ZIP archive, export the 100-question JSON bank, or inspect &amp; copy source files
              </p>
            </div>
          </div>

          <span className="hidden sm:inline px-3 py-1 rounded-full bg-emerald-950 text-emerald-400 border border-emerald-800 text-xs font-bold font-tech whitespace-nowrap">
            Latest Build
          </span>
        </div>

        {/* Navigation Tabs */}
        <div className="flex items-center gap-1.5 border-b border-slate-800 pb-2 overflow-x-auto">
          <button
            onClick={() => setActiveTab('zip')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap flex items-center gap-1.5 ${
              activeTab === 'zip'
                ? 'bg-emerald-600 text-white shadow-md'
                : 'text-slate-300 hover:text-white hover:bg-slate-800'
            }`}
          >
            <Download className="w-4 h-4" />
            <span>1. Download Full Source (ZIP)</span>
          </button>

          <button
            onClick={() => setActiveTab('viewer')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap flex items-center gap-1.5 ${
              activeTab === 'viewer'
                ? 'bg-cyan-600 text-white shadow-md'
                : 'text-slate-300 hover:text-white hover:bg-slate-800'
            }`}
          >
            <Eye className="w-4 h-4" />
            <span>2. Live Source Viewer &amp; Copy</span>
          </button>
        </div>

        {downloadStatus && (
          <div className="p-2.5 rounded-lg bg-emerald-950/90 border border-emerald-500 text-emerald-300 text-xs font-bold text-center">
            {downloadStatus}
          </div>
        )}

        {/* Tab 1: Full ZIP & Question Bank */}
        {activeTab === 'zip' && (
          <div className="flex flex-col gap-4">
            <div className="p-4 md:p-5 rounded-2xl bg-slate-950 border-2 border-emerald-500/50 flex flex-col gap-3.5">
              <div className="flex items-start gap-3">
                <div className="w-11 h-11 rounded-xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400 shrink-0">
                  <FolderArchive className="w-6 h-6" />
                </div>
                <div className="flex-1">
                  <h3 className="text-sm md:text-base font-bold text-white font-cyber flex flex-wrap items-center gap-2">
                    <span>Complete ROBYTE Project Archive (ZIP)</span>
                    <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-500/25 text-emerald-300 border border-emerald-500/40">
                      React 19 + TypeScript + Vite
                    </span>
                  </h3>
                  <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                    Bundles all <code className="text-cyan-300 font-mono">src/</code> components, curriculum bank, and configuration files (<code className="text-cyan-300 font-mono">package.json</code>, <code className="text-cyan-300 font-mono">vite.config.ts</code>, <code className="text-cyan-300 font-mono">index.html</code>) ready for local dev or deployment.
                  </p>
                </div>
              </div>

              {isGeneratingZip && (
                <div className="bg-slate-900 p-3 rounded-xl border border-slate-800 flex flex-col gap-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-emerald-300 font-bold truncate max-w-[75%]">{zipCurrentFile}</span>
                    <span className="font-cyber text-cyan-400 font-bold tabular-nums">{zipProgress}%</span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-slate-950 overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-emerald-500 to-cyan-400 transition-all duration-150"
                      style={{ width: `${zipProgress}%` }}
                    />
                  </div>
                </div>
              )}

              <button
                onClick={handleLiveZipDownload}
                disabled={isGeneratingZip}
                className="w-full py-3.5 rounded-xl bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 hover:brightness-110 text-black font-extrabold text-xs md:text-sm flex items-center justify-center gap-2 shadow-[0_0_25px_rgba(16,185,129,0.35)] active:scale-95 transition-all disabled:opacity-60"
              >
                {isGeneratingZip ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    <span>Packaging Source Archive...</span>
                  </>
                ) : (
                  <>
                    <Download className="w-5 h-5" />
                    <span>Download Live Source ZIP (robyte-source-code.zip)</span>
                  </>
                )}
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
              <div className="p-4 rounded-xl bg-slate-950 border border-cyan-500/40 flex flex-col justify-between gap-3">
                <div>
                  <strong className="text-xs text-cyan-400 font-cyber block">Direct Static Archive Link</strong>
                  <p className="text-[11px] text-slate-300 mt-1 leading-relaxed">
                    If iframe sandboxing blocks downloads, copy the direct URL and open it in a new browser tab:
                  </p>
                </div>
                <div className="flex flex-col gap-1.5">
                  <button
                    onClick={() => copyText(`${baseUrl}/robyte-source-code.zip`, 'url-src')}
                    className="w-full py-2 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-xs flex items-center justify-center gap-1.5 transition-colors"
                  >
                    {copiedId === 'url-src' ? <Check className="w-3.5 h-3.5" /> : <Link2 className="w-3.5 h-3.5" />}
                    <span>{copiedId === 'url-src' ? 'Download Link Copied!' : 'Copy Direct Download URL'}</span>
                  </button>
                  <button
                    onClick={() => handleRobustDownload('/robyte-source-code.zip', 'robyte-source-code.zip')}
                    className="w-full py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-700 text-[11px] flex items-center justify-center gap-1"
                  >
                    <Download className="w-3 h-3" />
                    <span>Download Pre-Packaged ZIP</span>
                  </button>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-slate-950 border border-amber-500/40 flex flex-col justify-between gap-3">
                <div>
                  <strong className="text-xs text-amber-400 font-cyber block">Standalone Question Bank (JSON)</strong>
                  <p className="text-[11px] text-slate-300 mt-1 leading-relaxed">
                    Export all 4 Worlds, 20 Sub-Stages, and 100 Language Schools questions as structured JSON.
                  </p>
                </div>
                <button
                  onClick={downloadQuestionsJSON}
                  className="w-full py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-amber-400 border border-slate-700 text-xs font-bold flex items-center justify-center gap-1.5 transition-colors"
                >
                  <FileText className="w-3.5 h-3.5" />
                  <span>Download robyte-questions-bank.json</span>
                </button>
              </div>
            </div>

            <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-start gap-2.5 text-xs leading-relaxed text-amber-200/90">
              <AlertCircle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
              <div>
                Tip: If a preview frame restricts direct downloads, switch to the <strong>&ldquo;Live Source Viewer &amp; Copy&rdquo;</strong> tab or copy the <strong>&ldquo;Direct Download URL&rdquo;</strong> into a standalone browser tab.
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: Live Source Code Viewer */}
        {activeTab === 'viewer' && (
          <div className="bg-slate-950 p-4 rounded-2xl border border-cyan-500/40 flex flex-col gap-3">
            <div className="flex flex-col gap-2">
              <div>
                <h3 className="text-xs md:text-sm font-bold text-white font-cyber flex items-center gap-2">
                  <Code2 className="w-4 h-4 text-cyan-400" />
                  <span>Live Source File Inspector</span>
                </h3>
                <p className="text-[11px] text-slate-400">
                  Select any core file to inspect and copy its full source code in one click
                </p>
              </div>

              <div className="flex items-center gap-1.5 flex-wrap">
                {[
                  { key: 'app', label: 'App.tsx' },
                  { key: 'canvas', label: 'ActionGameCanvas.tsx' },
                  { key: 'title', label: 'TitleScreen.tsx' },
                  { key: 'map', label: 'WorldMap.tsx' },
                  { key: 'questions', label: 'curriculumData.ts' },
                  { key: 'context', label: 'GameContext.tsx' },
                  { key: 'html', label: 'index.html' },
                  { key: 'pkg', label: 'package.json' },
                ].map((item) => (
                  <button
                    key={item.key}
                    onClick={() =>
                      setSelectedFileKey(
                        item.key as 'app' | 'canvas' | 'title' | 'map' | 'questions' | 'context' | 'html' | 'pkg'
                      )
                    }
                    className={`px-2.5 py-1.5 rounded-lg text-xs font-bold transition-colors ${
                      selectedFileKey === item.key
                        ? 'bg-cyan-500 text-black'
                        : 'bg-slate-900 text-slate-300 border border-slate-800 hover:border-slate-700'
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 bg-slate-900 px-3 py-2 rounded-xl border border-slate-800 text-xs">
              <div>
                <strong className="text-cyan-400 font-mono">{sourceFilesMap[selectedFileKey]?.name}</strong>
                <span className="text-slate-400 text-[11px] ml-2">· {sourceFilesMap[selectedFileKey]?.desc}</span>
              </div>
              <button
                onClick={() => copyText(sourceFilesMap[selectedFileKey]?.content || '', `file-${selectedFileKey}`)}
                className="px-3.5 py-1.5 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow active:scale-95 transition-all shrink-0 whitespace-nowrap"
              >
                {copiedId === `file-${selectedFileKey}` ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-white" />
                    <span>Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>Copy File</span>
                  </>
                )}
              </button>
            </div>

            <div className="relative bg-slate-900/90 rounded-xl border border-slate-800 p-3 max-h-72 overflow-y-auto font-mono text-[11px] text-slate-200 text-left">
              <pre className="select-all leading-relaxed whitespace-pre-wrap">
                {sourceFilesMap[selectedFileKey]?.content}
              </pre>
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="flex justify-between items-center pt-2 border-t border-slate-800 text-xs text-slate-400 flex-wrap gap-2">
          <span>ROBYTE · Copyright &copy; 2026–2027 Ahmed Ramadan Fouad Ahmed Rabei</span>
          <button
            onClick={() => {
              sounds.playClick();
              onClose();
            }}
            className="px-5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
