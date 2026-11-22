/**
 * @license
 * Copyright (c) 2026-2027 Ahmed Ramadan Fouad Ahmed Rabei — ROBYTE — All Rights Reserved.
 * Curriculum Architecture & Academic Roadmap Modal — Units 1–4 (14 Lessons, 100 Questions).
 */

import React, { useState } from 'react';
import { X, Layers, Compass, ArrowRight } from 'lucide-react';
import { sounds } from '../../utils/soundEffects';

interface CurriculumMapModalProps {
  onClose: () => void;
  onSelectWorld?: (worldId: number) => void;
}

export const CurriculumMapModal: React.FC<CurriculumMapModalProps> = ({ onClose, onSelectWorld }) => {
  const [activeUnit, setActiveUnit] = useState<number>(1);

  const unitsData = [
    {
      id: 1,
      officialTitle: 'Unit 1: Information Technology and Society',
      gameWorldTitle: 'AI Metropolis',
      badge: 'Core Computing & AI',
      pedagogicalConcept:
        'Establishes historical awareness of the IT revolution alongside emerging computing paradigms (Edge, AR/VR, Quantum), AI mechanics, and AI ethics.',
      lessons: [
        {
          code: '1-1',
          title: 'Development of IT and Social Transformation',
          keyPoints: [
            'Mainframes & ENIAC vacuum-tube era (1940s–1960s) to personal computers (1970s–1980s)',
            'Commercial Internet & Web revolution (1990s) through Smartphones & Cloud Computing (2000s–2010s+)',
            "E-commerce, cashless digital payments, and Moore's Law + nanoscale quantum tunneling limits",
            'Edge Computing for real-time autonomous vehicles, AR vs. VR, and Quantum qubits',
          ],
        },
        {
          code: '1-2',
          title: 'How AI Works',
          keyPoints: [
            'Concentric hierarchy: AI > Machine Learning > Deep Learning > Generative AI',
            'Statistical pattern learning vs. explicit rule-based programming',
            'Artificial Neural Networks (ANN), hidden layers, and iterative weight adjustment',
            'Generative AI (GenAI) models and AI hallucination verification safeguards',
          ],
        },
        {
          code: '1-3',
          title: 'AI in Daily Life and Industry',
          keyPoints: [
            'Recommendation engines, voice assistants, machine translation, and facial recognition',
            'Healthcare imaging diagnostics (X-ray & CT scans) with mandatory human doctor confirmation',
            'Smart agriculture yield/pest prediction & manufacturing quality inspection / predictive maintenance',
            'The AI Black-Box problem and precautions regarding copyright, privacy, and bias',
          ],
        },
        {
          code: '1-4',
          title: 'Ethical Issues with AI',
          keyPoints: [
            'Sources of Algorithmic Bias (biased/insufficient training data, historical tendencies, proxy variables)',
            'Explainable AI (XAI) for transparent, auditable automated decisions',
            'Responsibility (roles and duties) vs. Accountability (identifying answerable entities)',
            'Four Core Principles of AI Ethics: Fairness, Transparency, Privacy Protection, and Accountability',
          ],
        },
      ],
      relationship:
        'Lays the foundational computing and AI literacy needed before securing systems, networks, and sensitive data in Unit 2.',
    },
    {
      id: 2,
      officialTitle: 'Unit 2: Cybersecurity',
      gameWorldTitle: 'Cyber Fortress',
      badge: 'Security & Defense',
      pedagogicalConcept:
        'Transitions from understanding IT systems to hardening them against modern threats through cryptography, network architecture, and incident response.',
      lessons: [
        {
          code: '2-1',
          title: 'Cryptographic Technologies and Authentication',
          keyPoints: [
            'HTTPS & TLS handshake using public-key exchange and digital certificates',
            'Hybrid encryption pairing public-key exchange with fast symmetric encryption',
            'Digital signatures detecting tampering & impersonation and supporting non-repudiation',
            'Multi-Factor Authentication (MFA / 2FA): Knowledge, Possession, and Biometric traits',
          ],
        },
        {
          code: '2-2',
          title: 'Network Security Design',
          keyPoints: [
            'Firewalls monitoring and filtering traffic according to security rules',
            'Virtual Private Networks (VPNs) creating encrypted virtual tunnels for remote work',
            'Demilitarized Zone (DMZ) isolating public-facing servers from the internal network',
            'Defense in Depth (4 layers) and Zero Trust Approach (Never automatically trust internal devices)',
          ],
        },
        {
          code: '2-3',
          title: 'Incident Response and Risk Management',
          keyPoints: [
            'Protecting against information leakage, data tampering, and service disruption',
            '6 Incident Response Stages: Preparation, Detection, Containment, Eradication, Recovery, Lessons Learned',
            'Why Containment precedes Eradication to limit spread before removing the root threat',
            'Risk Assessment Matrix: Risk Level = Impact × Likelihood to set remediation priority',
          ],
        },
      ],
      relationship:
        'Supplies the essential security standards (HTTPS, TLS, MFA, access control) that Unit 3 web applications must enforce in production.',
    },
    {
      id: 3,
      officialTitle: 'Unit 3: Web Applications',
      gameWorldTitle: 'Web App Realm',
      badge: 'Full-Stack Engineering',
      pedagogicalConcept:
        'Delivers practical architecture of interactive cloud web applications across 3 tiers, HTTP/API protocols, JSON data exchange, and responsive frontends.',
      lessons: [
        {
          code: '3-1',
          title: 'The Overall Structure of Web Applications',
          keyPoints: [
            'Three-Tier Architecture: Frontend (display/input), Backend (processing/control), and Database (storage)',
            'Client-server request lifecycle and separation of responsibilities',
            'Real-world architectures: Video-sharing platforms, E-commerce sites, and SNS',
          ],
        },
        {
          code: '3-2',
          title: 'Web Application Communication Methods',
          keyPoints: [
            'Client-Server Model and HTTPS (HTTP over TLS encryption)',
            'Request methods: GET (retrieving resources/pages) vs. POST (submitting login/form payloads)',
            'Essential HTTP status codes: 200 (Success), 404 (Not Found), 500 (Internal Server Error)',
            'APIs (Application Programming Interfaces) and structured JSON payloads (objects & arrays)',
          ],
        },
        {
          code: '3-3',
          title: 'Fundamentals of Frontend Technology',
          keyPoints: [
            'Core Web Triad: HTML (structure), CSS (visual styling), JavaScript (interactive behavior)',
            'Semantic HTML (<header>, <nav>, <main>, <footer>) improving Accessibility and Search Engines',
            'Responsive Design adjusting layouts to different screen sizes and Mobile-First strategy',
            'Modern libraries and frameworks: React, Vue (progressive), and Next.js (built on React)',
          ],
        },
      ],
      relationship:
        'Connects engineering and security directly to Unit 4, where software must be shaped around real users and iteratively refined.',
    },
    {
      id: 4,
      officialTitle: 'Unit 4: Web and Media Design',
      gameWorldTitle: 'UX & Media Kingdom',
      badge: 'UX & Continuous Iteration',
      pedagogicalConcept:
        'Unites software engineering with human-centered design via cross-media strategy, Personas, CRAP visual design, quantitative/qualitative UX evaluation, and PDCA/A-B iteration.',
      lessons: [
        {
          code: '4-1',
          title: 'Types and Characteristics of Media',
          keyPoints: [
            'Comparing Television, Radio, Printed Newspapers, Websites, SNS, and Email/Direct Messaging',
            'One-way mass broadcast vs. two-way interactive digital media (forms & comments)',
            'Selecting and combining complementary media based on purpose, target audience, and resources',
          ],
        },
        {
          code: '4-2',
          title: 'Information Design and User Experience for Websites',
          keyPoints: [
            'User-Centered Design (UCD), research-based Personas, and low-detail Wireframes before visual styling',
            'The four CRAP Principles: Contrast, Repetition, Alignment (following language direction), and Proximity',
            'Usability (ease of achieving goals) vs. Accessibility (equal use for people with disabilities)',
          ],
        },
        {
          code: '4-3',
          title: 'Methods for Evaluating Websites',
          keyPoints: [
            'Quantitative Analytics (numerical metrics) vs. Qualitative Research (Usability testing & Interviews)',
            'Core Web Analytics Metrics: Page Views (PV), Bounce Rate, and Conversion Rate (CVR)',
            'Expert Heuristic Evaluation (Consistency, Visibility of System Status, Error Prevention)',
          ],
        },
        {
          code: '4-4',
          title: 'Iterative Improvement Process for Websites',
          keyPoints: [
            'PDCA Continuous Improvement Cycle: Plan → Do → Check → Act',
            'Non-linear Design Thinking: Empathize → Define → Ideate → Prototype → Test',
            'Controlled A/B Testing: isolating one variable under randomized live traffic',
          ],
        },
      ],
      relationship:
        'Closes the complete engineering lifecycle by continuously evaluating, securing, and improving the applications built across all four units.',
    },
  ];

  const current = unitsData.find((u) => u.id === activeUnit) || unitsData[0];

  return (
    <div dir="ltr" className="fixed inset-0 z-50 flex items-center justify-center p-3 md:p-6 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-4xl bg-slate-900 border border-slate-700 rounded-2xl p-5 md:p-7 shadow-2xl overflow-y-auto max-h-[92vh] flex flex-col gap-6 text-left">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-4 gap-3">
          <div className="flex items-center gap-3">
            <button
              onClick={() => {
                sounds.playClick();
                onClose();
              }}
              className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
              aria-label="Close Curriculum Overview"
            >
              <X className="w-5 h-5" />
            </button>
            <div>
              <div className="flex items-center gap-2">
                <Compass className="w-5 h-5 text-cyan-400 shrink-0" />
                <h2 className="text-lg md:text-xl font-bold font-cyber text-slate-100">
                  Curriculum Architecture &amp; Academic Roadmap
                </h2>
              </div>
              <p className="text-xs text-slate-400">
                Programming &amp; Artificial Intelligence — Part One (Language Schools Edition)
              </p>
            </div>
          </div>

          <span className="hidden sm:inline px-3 py-1 rounded-full bg-cyan-950 text-cyan-400 border border-cyan-800 text-xs font-bold font-tech whitespace-nowrap">
            14 Lessons · 100 Questions
          </span>
        </div>

        {/* Cumulative Flowchart Strip (LTR Left-to-Right) */}
        <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 flex flex-col gap-2">
          <h3 className="text-xs font-bold text-slate-300 flex items-center gap-2">
            <Layers className="w-4 h-4 text-cyan-400" />
            <span>Progressive Engineering &amp; Knowledge Flow Across All 4 Worlds:</span>
          </h3>
          <div className="flex flex-col md:flex-row items-center justify-between gap-2 text-xs font-tech pt-1">
            <div className="flex-1 p-2.5 rounded-lg bg-cyan-950/40 border border-cyan-500/40 text-cyan-300 text-center w-full">
              <strong className="block text-[11px] text-cyan-400">1. Computing &amp; AI Core</strong>
              <span>AI Metropolis</span>
            </div>
            <ArrowRight className="hidden md:inline w-4 h-4 text-slate-500 shrink-0" />
            <div className="flex-1 p-2.5 rounded-lg bg-emerald-950/40 border border-emerald-500/40 text-emerald-300 text-center w-full">
              <strong className="block text-[11px] text-emerald-400">2. Cyber Defense</strong>
              <span>Cyber Fortress</span>
            </div>
            <ArrowRight className="hidden md:inline w-4 h-4 text-slate-500 shrink-0" />
            <div className="flex-1 p-2.5 rounded-lg bg-blue-950/40 border border-blue-500/40 text-blue-300 text-center w-full">
              <strong className="block text-[11px] text-blue-400">3. App Architecture</strong>
              <span>Web App Realm</span>
            </div>
            <ArrowRight className="hidden md:inline w-4 h-4 text-slate-500 shrink-0" />
            <div className="flex-1 p-2.5 rounded-lg bg-amber-950/40 border border-amber-500/40 text-amber-300 text-center w-full">
              <strong className="block text-[11px] text-amber-400">4. UX &amp; Iteration</strong>
              <span>UX &amp; Media Kingdom</span>
            </div>
          </div>
        </div>

        {/* Unit Selector Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1">
          {unitsData.map((u) => (
            <button
              key={u.id}
              onClick={() => {
                sounds.playClick();
                setActiveUnit(u.id);
              }}
              className={`px-3.5 py-2 rounded-xl border text-xs font-bold transition-all whitespace-nowrap flex items-center gap-2 ${
                activeUnit === u.id
                  ? 'bg-slate-800 text-white border-cyan-400 shadow-md ring-1 ring-cyan-500/50'
                  : 'bg-slate-900 text-slate-400 border-slate-800 hover:text-slate-200'
              }`}
            >
              <span>World {u.id}</span>
              <span className="hidden sm:inline">({u.badge})</span>
            </button>
          ))}
        </div>

        {/* Active Unit Detail Panel */}
        <div className="bg-slate-950/80 p-5 rounded-2xl border border-slate-800 flex flex-col gap-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-3">
            <div>
              <span className="text-xs text-cyan-400 font-bold">{current.officialTitle}</span>
              <h3 className="text-base md:text-lg font-bold text-slate-100 font-cyber mt-0.5">
                {current.gameWorldTitle}
              </h3>
            </div>
            {onSelectWorld && (
              <button
                onClick={() => {
                  sounds.playClick();
                  onSelectWorld(current.id);
                  onClose();
                }}
                className="px-4 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-xs flex items-center gap-1.5 transition-colors self-start sm:self-auto whitespace-nowrap"
              >
                <span>Enter World</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          <div className="text-xs text-slate-300 leading-relaxed bg-slate-900/60 p-3 rounded-xl border border-slate-800">
            <strong className="text-cyan-400 block mb-1">Unit Learning Objective:</strong>
            {current.pedagogicalConcept}
          </div>

          {/* Lessons & Key Topics */}
          <div className="flex flex-col gap-3">
            <strong className="text-xs text-slate-300">Lessons &amp; Field Assessment Focus:</strong>
            <div className="grid grid-cols-1 gap-2.5">
              {current.lessons.map((l) => (
                <div key={l.code} className="p-3 rounded-xl bg-slate-900 border border-slate-800/80 flex flex-col gap-1.5 text-xs">
                  <div className="flex items-center gap-2 font-bold text-slate-200">
                    <span className="px-2 py-0.5 rounded bg-slate-800 text-cyan-400 font-mono text-[11px] shrink-0">
                      Lesson {l.code}
                    </span>
                    <span>{l.title}</span>
                  </div>
                  <ul className="list-disc list-inside text-slate-400 space-y-1 pl-2 text-[11px]">
                    {l.keyPoints.map((kp, idx) => (
                      <li key={idx} className="leading-relaxed">
                        {kp}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>

          {/* Cross-Unit Connection */}
          <div className="p-3 rounded-xl bg-slate-900/40 border border-slate-800 text-[11px] text-slate-400">
            <span className="font-bold text-amber-400">Cross-Unit Integration: </span>
            <span>{current.relationship}</span>
          </div>
        </div>

        {/* Footer Close */}
        <div className="flex justify-end pt-2 border-t border-slate-800">
          <button
            onClick={() => {
              sounds.playClick();
              onClose();
            }}
            className="px-5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold transition-colors"
          >
            Close Roadmap
          </button>
        </div>
      </div>
    </div>
  );
};
