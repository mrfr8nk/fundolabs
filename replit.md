# FundoLabs — AI Virtual Science Lab

## Overview
FundoLabs is an AI-powered virtual science lab for ZIMSEC O-Level and A-Level students in Zimbabwe and Africa. Students can perform interactive simulations, get AI tutoring, take exam-style quizzes, and generate lab reports.

## Stack
- **Framework**: TanStack Start (React + Vite) via `@lovable.dev/vite-tanstack-config`
- **Database**: Supabase (PostgreSQL, auth, realtime)
- **Styling**: Tailwind CSS v4, custom glassmorphism classes
- **Animations**: Framer Motion, SVG SMIL animations
- **Icons**: Lucide React
- **Notifications**: Sonner toast
- **AI**: BK9 API (`https://api.bk9.dev/ai/BK94`) with Llama 4 Scout model
- **Dev server**: Port 8080 (Lovable config) proxied from 5000 via proxy.mjs

## Key Architecture Notes
- The Lovable vite config forces port **8080** — proxied to port 5000 via `proxy.mjs` (run alongside with `node proxy.mjs & npm run dev`)
- App is accessible at `$REPLIT_DEV_DOMAIN`
- Route files must avoid complex Unicode strings (TanStack router generator fails on them)
- Local experiment data is in `src/data/experiments.ts` (20 experiments) as Supabase fallback
- BK9 API is called directly from the browser — has CORS support, with a local fallback on failure
- All simulations are SVG-based with requestAnimationFrame/setInterval animation

## Project Structure
```
src/
  routes/
    index.tsx              — Homepage (glassmorphism hero, animated lab demos, pricing, footer)
    _app.dashboard.tsx     — Dashboard with stats, featured experiments, learning goals
    _app.labs.tsx          — Experiments list with search, filter, save/bookmark
    _app.labs.$slug.tsx    — Enlarged simulation modal, BK9 AI chat, step checklist, report editor
    _app.tutor.tsx         — AI chat tutor (FundoBot powered by BK9 Llama 4)
    _app.exam.tsx          — Exam mode with timer, AI marking, score saving
    _app.reports.tsx       — Lab reports: generate, view, download
  components/
    labs/simulations/
      TitrationSimulation.tsx   — pH curve graph, animated drop, fume/colour change
      OhmsLawSimulation.tsx     — LED glow, LDR, buzzer, V-I graph, animated electrons
      PendulumSimulation.tsx    — Real swing animation, T² vs L graph, g calculation
      ProjectileSimulation.tsx  — Animated ball trajectory, range/height markers, controls
      FlameTestSimulation.tsx   — 7 metal ions, animated coloured flames, step procedure
      RatesSimulation.tsx       — Gas syringe, CO2 bubbles, 4-variable controls, rate graph
      GenericSimulation.tsx     — Animated particle simulation for remaining experiments
  data/
    experiments.ts         — 20 local experiments with tools, steps, safetyNotes, expectedResults
  lib/
    bk9api.ts             — BK9 API client (askBK9 function) with intelligent fallback
    aiTutorResponses.ts   — Legacy rule-based responses (kept as reference)
supabase/
  migrations/
    20260502000000_more_experiments.sql  — 40+ experiments + saved_experiments + share_token tables
```

## Simulation Routing (in _app.labs.$slug.tsx)
| slug | Component |
|------|-----------|
| acid-base-titration | TitrationSimulation |
| ohms-law, parallel-series-circuits | OhmsLawSimulation |
| pendulum | PendulumSimulation |
| projectile-motion | ProjectileSimulation |
| flame-tests | FlameTestSimulation |
| rates-of-reaction | RatesSimulation |
| everything else | GenericSimulation |

## Supabase Tables
- `experiments` — experiment records
- `lab_sessions` — user session data
- `reports` — AI-generated lab reports
- `exam_attempts` — exam scores
- `saved_experiments` — bookmarked experiments (user_id, experiment_id)
- `ai_conversations` — tutor chat history
- `profiles` — user profiles

## Features Implemented
1. **Homepage** — Glassmorphism UI, parallax hero, animated experiment demos, pricing, testimonials
2. **Dashboard** — Stats, quick links, featured experiments, learning goals
3. **Labs** — 20+ experiments with search, level filter, save/bookmark
4. **Simulations** — 6 custom-built interactive simulations with real physics/chemistry:
   - Live graphs (pH curve, V-I, T²-L, gas volume vs time)
   - Animated particles (electrons, bubbles, fumes, flames)
   - Real-time calculations (g from pendulum, resistance from gradient)
   - Fullscreen mode (click "Full Screen" button on any simulation)
5. **AI Tutor (FundoBot)** — BK9 Llama 4 Scout AI, ZIMSEC-aware, fallback to rule-based
6. **Ask AI in Labs** — Contextual BK9 AI per experiment with chat history
7. **Exam Mode** — Multiple choice exams with timer, AI marking, score saving
8. **Lab Reports** — Generate, edit observations/conclusions, download as .txt

## Development
```bash
node proxy.mjs & npm run dev   # Starts on port 8080, proxied from 5000
```

## BK9 API
```
GET https://api.bk9.dev/ai/BK94
Params: BK9 (system prompt, max 1000 chars), q (question), model (meta-llama/llama-4-scout-17b-16e-instruct)
Response: { status: true, BK9: "response text" }
```
