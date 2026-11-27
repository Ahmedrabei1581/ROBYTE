# ROBYTE · AI Battlegrounds (Language Schools Edition)

A fast-paced 2D cyberpunk educational action-adventure game built for the **Egyptian Baccalaureate 2nd Year — Language Schools (Programming & Artificial Intelligence Curriculum, Part 1)**, transforming the official textbook and weekly assessments into high-speed arena combat.

> **Copyright © 2026–2027 Ahmed Ramadan Fouad Ahmed Rabei — All Rights Reserved.**

---

## Key Features

- **4 Progressive Curriculum Worlds (14 Lessons · 20 Stages):**
  1. **AI Metropolis** — Unit 1: Information Technology & Society (Lessons 1-1 to 1-4)
  2. **Cyber Fortress** — Unit 2: Cybersecurity (Lessons 2-1 to 2-3)
  3. **Web App Realm** — Unit 3: Web Applications (Lessons 3-1 to 3-3)
  4. **UX & Media Kingdom** — Unit 4: Web & Media Design (Lessons 4-1 to 4-4)
- **100 Official Curriculum & Assessment Challenges:** 100% aligned with the official merged English Textbook + Performances & Weekly Assessments (Models A, B, and C), with instant curriculum citations, error diagnostics, and an **80% Mastery Gate (20/25)** to unlock the next world.
- **Walk & Sprint Movement + Stamina HUD:** Smooth switching between Walk and Sprint via `Shift` (with `WASD` / Arrow keys), Gamepad (`RB` / `L3`), or an on-screen mobile Sprint button—complete with a stamina gauge, rapid regeneration, speed trail, and sub-stepped collision physics.
- **Mandatory Sequential Questions & Per-Question Escalating Alien Waves:**
  - Cannot skip past an unsolved question—wrong choices lock that option, show curriculum hints, and require **Try Again** until solved correctly.
  - Each question step (`Q1`–`Q5`) inside every stage escalates alien spacecraft waves (`alien-scout`, `hover-gunship`, `pulse-cruiser`, `void-splitter`, `alien-commander`) and diversifies 5 high-contrast projectile patterns (`straight`, `homing`, `wave-spread`, `splitter`, `orbital-burst`).
- **6-Hit Limit & Fair Attempt Reset:** Configurable `MAX_ALLOWED_HITS = 6` tracked live in a 6-pip HUD counter; taking a 7th hit cleanly resets the current stage attempt and hit counter.
- **Seamless In-Place Resume & Progression:** Solving a question resumes combat right at your exact position with movement keys safely reset and shield recharged (`+45`).
- **Offline PWA & Multi-Device Controls:** Installable Progressive Web App with multi-touch mobile controls, keyboard + mouse, and Gamepad API support.
- **Teacher & Student Analytics Dashboard:** Mastery tracking, weak-topic diagnostics, and JSON progress report export.

---

## Tech Stack

- **React 19** + **TypeScript**
- **Tailwind CSS v4**
- **Vite** + **vite-plugin-pwa**
- **HTML5 Canvas** (2D Action Engine) & **Web Audio API** (procedural sound effects)

---

## Local Setup & Scripts

### 1. Prerequisites
- [Node.js](https://nodejs.org/) v18 or higher

### 2. Install Dependencies
```bash
npm install
```

### 3. Run Development Server
```bash
npm run dev
```
Open `http://localhost:3000` in your browser.

### 4. Type-Check & Production Build
```bash
npm run lint
npm run build
```
The production bundle is generated in `dist/` (ready for Vercel via `vercel.json`, Netlify, or GitHub Pages).

---

## Controls

| Action | Keyboard / Mouse | Mobile / Touch | Gamepad |
| :--- | :--- | :--- | :--- |
| **Move** | `A` / `D` or `←` / `→` | Virtual Joystick | Left Stick / D-Pad |
| **Sprint** | Hold `Shift` | On-Screen Sprint Toggle | `RB` / `L3` |
| **Jump** | `W` / `↑` / `Space` | Jump Button | `A` |
| **Fire** | `J` / `Enter` / Left Click | Fire Button | `X` / `RT` |
| **Deflect** | `K` / Right Click | Deflect Button | `B` |

---

## Uploading to GitHub

```bash
git init
git add .
git commit -m "Update ROBYTE with sprint, escalating waves, 6-hit limit, and synced curriculum"
git branch -M main
git remote add origin https://github.com/<YOUR_USERNAME>/ROBYTE.git
git push -u origin main
```
