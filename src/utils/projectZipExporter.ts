/**
 * @license
 * ROBYTE Project Source Code ZIP Exporter
 * Packages source files, question bank, Vite settings, and PWA manifests into a single downloadable ZIP archive.
 */

import JSZip from 'jszip';

const sourceFiles = import.meta.glob(
  [
    '/src/**/*.{ts,tsx,css}',
    '/index.html',
    '/package.json',
    '/tsconfig.json',
    '/vite.config.ts',
    '/metadata.json',
    '/LICENSE',
    '/COPYRIGHT.md',
    '/public/**/*.{json,svg}',
  ],
  { query: '?raw', import: 'default', eager: true }
);

export async function generateProjectZip(onProgress?: (percent: number, currentFile: string) => void): Promise<Blob> {
  const zip = new JSZip();

  const fileEntries = Object.entries(sourceFiles);
  const total = fileEntries.length;

  fileEntries.forEach(([filePath, content], index) => {
    const cleanPath = filePath.startsWith('/') ? filePath.slice(1) : filePath;
    zip.file(cleanPath, content as string);

    if (onProgress) {
      const pct = Math.round(((index + 1) / total) * 85);
      onProgress(pct, cleanPath);
    }
  });

  const readmeContent = `# ROBYTE · Next-Gen Programming & AI Action Adventure
### 2D Educational Action Adventure built with React 19 + TypeScript + Tailwind CSS v4 + Vite
All Rights Reserved © 2026-2027 Ahmed Ramadan Fouad Ahmed Rabei

---

## Overview
- **Curriculum Alignment:** Egyptian Baccalaureate 2nd Year — Programming & Artificial Intelligence (Part One) — Language Schools Edition (Textbook + Performances & Assessments).
- **4 Progressive Worlds:** Information Technology & Society, Cybersecurity, Web Applications, and Web & Media Design.
- **20 Sub-Stages:** 5 stages per world with escalating enemy turrets, barricades, and boss battles.
- **100 Assessment Challenges:** 25 questions per world with instant explanations and error diagnostics.
- **80% Mastery Gate:** Requires at least 20/25 correct answers to unlock the next world.
- **PWA & Cross-Platform:** Mobile multi-touch joystick, smart magnetic auto-aim, keyboard + mouse, and Gamepad API support.

---

## Local Setup

### 1. Prerequisites
- Install [Node.js](https://nodejs.org/) (v18 or higher).

### 2. Install Dependencies
\`\`\`bash
npm install
\`\`\`

### 3. Run Development Server
\`\`\`bash
npm run dev
\`\`\`
Open \`http://localhost:3000\`.

### 4. Production Build
\`\`\`bash
npm run build
\`\`\`
`;

  zip.file('README.md', readmeContent);

  if (onProgress) {
    onProgress(95, 'Compressing source archive...');
  }

  const blob = await zip.generateAsync({
    type: 'blob',
    compression: 'DEFLATE',
    compressionOptions: { level: 6 },
  });

  if (onProgress) {
    onProgress(100, 'Archive ready!');
  }

  return blob;
}

export async function downloadProjectZip(onProgress?: (percent: number, currentFile: string) => void): Promise<number> {
  const fileCount = Object.keys(sourceFiles).length + 1;
  const blob = await generateProjectZip(onProgress);
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = 'robyte-source-code.zip';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  setTimeout(() => URL.revokeObjectURL(url), 5000);
  return fileCount;
}
