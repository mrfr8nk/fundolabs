# FundoLabs — AI Virtual Science Lab

## Overview
FundoLabs is an AI-powered virtual science lab for ZIMSEC O-Level and A-Level students in Zimbabwe and Africa. Students can perform interactive simulations, get AI tutoring, take exam-style quizzes, and generate lab reports.

## Stack
- **Framework**: TanStack Start (React + Vite) via `@lovable.dev/vite-tanstack-config`
- **Database**: Supabase (PostgreSQL, auth, realtime)
- **Styling**: Tailwind CSS v4, custom glassmorphism classes
- **Animations**: Framer Motion
- **Icons**: Lucide React
- **Notifications**: Sonner toast
- **Dev server**: Port 8080 (forced by Lovable config)

## Key Architecture Notes
- The Lovable vite config forces port **8080** — cannot be changed to 5000
- App is accessible at `$REPLIT_DEV_DOMAIN` (port 8080)
- Route files must avoid complex Unicode strings (TanStack router generator fails on them)
- AI tutor response strings are extracted to `src/lib/aiTutorResponses.ts` to avoid this issue
- Local experiment data is in `src/data/experiments.ts` (20 experiments) as Supabase fallback

## Project Structure
```
src/
  routes/
    index.tsx              — Homepage (glassmorphism hero, animated lab demos, pricing, footer)
    _app.dashboard.tsx     — Dashboard with stats, featured experiments, learning goals
    _app.labs.tsx          — Experiments list with search, filter, save/bookmark
    _app.labs.$slug.tsx    — Interactive simulation with AI Ask panel, step checklist
    _app.tutor.tsx         — AI chat tutor (FundoBot, ZIMSEC-aware)
    _app.exam.tsx          — Exam mode with timer, AI marking, score saving
    _app.reports.tsx       — Lab reports: generate, view, download
  components/
    labs/simulations/
      TitrationSimulation.tsx
      OhmsLawSimulation.tsx
      PendulumSimulation.tsx
      GenericSimulation.tsx
  data/
    experiments.ts         — 20 local experiments with tools, steps, safetyNotes, expectedResults
  lib/
    aiTutorResponses.ts    — AI response logic (extracted from route files to avoid unicode issues)
supabase/
  migrations/
    20260502000000_more_experiments.sql  — 40+ experiments + saved_experiments + share_token tables
```

## Supabase Tables
- `experiments` — experiment records
- `lab_sessions` — user session data
- `reports` — AI-generated lab reports
- `exam_attempts` — exam scores
- `saved_experiments` — bookmarked experiments (user_id, experiment_id)
- `ai_conversations` — tutor chat history
- `profiles` — user profiles

## Features Implemented
1. **Homepage** — Glassmorphism UI, parallax hero, animated experiment demos, pricing, testimonials, pro footer
2. **Dashboard** — Stats, quick links, featured experiments, learning goals, daily tips
3. **Labs** — 20+ experiments with search, level filter, save/bookmark
4. **Experiment Simulation** — Interactive simulations (titration, Ohm's law, pendulum), AI Ask panel, step checklist, report editor, save/share/download
5. **AI Tutor (FundoBot)** — ZIMSEC-aware rule-based responses for chemistry and physics
6. **Exam Mode** — Multiple choice exams with timer, AI marking, score saving to Supabase
7. **Lab Reports** — Generate AI reports from experiments, download as text, view history

## Development
```bash
npm run dev   # Starts on port 8080
```
