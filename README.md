# GrooveyAI

**An AI performing-arts coaching companion for dancers, singers, musicians, actors, and stage performers — built as part of the GroovePH ecosystem.**

GrooveyAI (branded "Grooveyy" in the interface) is a full-stack Next.js web application that gives performing-arts artists an always-available, discipline-aware AI coach. It specializes in dance and choreography, vocal technique, music performance, acting, and stage/audition preparation — delivering streamed, structured coaching in a theatrical-workbook format with actionable cues.

> **Scope note:** GrooveyAI generates general coaching suggestions from a large language model. It is not a substitute for a qualified instructor, medical professional, or physical/vocal therapist.

---

## Table of Contents

- [Overview](#overview)
- [Key Features](#key-features)
- [Technology Stack](#technology-stack)
- [Project Architecture](#project-architecture)
- [Prerequisites](#prerequisites)
- [Installation and Setup](#installation-and-setup)
- [Environment Variables](#environment-variables)
- [Running the Application](#running-the-application)
- [How It Works](#how-it-works)
- [Usage Guide](#usage-guide)
- [API Documentation](#api-documentation)
- [Security and Privacy](#security-and-privacy)
- [Troubleshooting](#troubleshooting)
- [Development and Contribution](#development-and-contribution)
- [License](#license)
- [Credits](#credits)

---

## Overview

### What GrooveyAI is

GrooveyAI is a web-based AI companion that provides real-time, personalized coaching for performing-arts disciplines. Users select a discipline and proficiency level, then converse with the AI coach about technique, rehearsal strategy, audition preparation, and performance improvement. Responses stream token-by-token and are formatted as readable, actionable coaching notes.

### The problem it addresses

Practicing performers often lack an always-available second set of eyes — a coach who can explain a correction on demand, break down a drill, suggest a tempo, or help prepare an audition cut without scheduling a session. GrooveyAI provides that on-demand guidance, calibrated to the artist's discipline and skill level.

### Intended users

- **Dance artists** — alignment, balance, turns/pirouettes, musicality, choreography.
- **Singers/vocalists** — breath support, resonance, registration, range extension, vocal safety.
- **Musicians** — sight-reading, ear training, rhythm, phrasing, interpretation.
- **Actors** — technique (e.g., Stanislavski, Meisner, Uta Hagen, Chekhov), scene study, monologues.
- **Stage performers** — audition prep, cold reading, stage fright, blocking, self-tapes.

### GroovePH ecosystem

GrooveyAI is part of the **GroovePH** ecosystem — a performing-arts platform. The welcome screen showcases related GroovePH tools (Google Stitch, Google AI Studio, Google Antigravity) and links to the main GroovePH site. The companion "Grooveyy" mascot and GroovePH branding are central to the visual identity.

### Implemented vs. planned

| Capability | Status |
|---|---|
| Streaming AI coaching chat with discipline/level context | Implemented |
| Repertoire library (save, browse, filter, export) | Implemented |
| Artist profile (editable, local) | Implemented |
| Web-Audio metronome practice bar | Implemented |
| Voice dictation (Web Speech API) | Implemented |
| Multi-provider model fallback (Gemini → Groq/OpenRouter) | Implemented |
| Server-side API-key health check | Implemented |
| User accounts / cloud sync / cross-device data | **Not implemented** (data is browser-local) |

> This document only describes behavior that is present in the code. Features not listed above should not be assumed.

---

## Key Features

- **Discipline-aware coaching** — The AI adapts to one of several performing-arts disciplines (Dance, Singing, Music, Theater, Acting, Choreography, Stage Performance) and calibrates complexity to the artist's proficiency level (Beginner, Intermediate, Advanced/Audition).
- **Real-time token streaming** — Coach replies stream progressively over Server-Sent Events for an immediate, responsive feel, with a "Stop" control to halt generation.
- **Structured coaching output** — Responses are rendered as theatrical-workbook notes with headings, bullets, and styled "Tactile Cue" / "Action Verb" callouts.
- **Conversation management** — Start new rehearsal sessions, switch between past conversations, rename them via AI-generated titles, and delete or clear them.
- **Repertoire library** — Save any coach reply to a repertoire collection, filter by discipline, expand full notes, copy, and instantly drill a saved piece in a new session.
- **Artist profile** — Store a name, role, primary discipline, vocal range, and upcoming audition; view session/repertoire stats and export a full JSON backup.
- **Built-in metronome** — A client-side Web Audio metronome (adjustable 80–132 BPM with tempo labels and a beat-pulse visualizer) appears contextually for tempo-related coaching.
- **Voice input** — Dictate prompts via the browser's built-in speech recognition.
- **Resilient AI routing** — Automatic retry with exponential backoff, model fallback across Gemini variants, and optional free-tier fallback to Groq or OpenRouter during high-demand periods.
- **Transparent service status** — An in-app status indicator and a health endpoint report truthful, real-time AI provider status (never falsely reports "ready").

---

## Technology Stack

All technologies below are confirmed by `package.json`, `package-lock.json`, and the source code.

### Frontend
- **Framework:** Next.js `^16.4.0` (App Router) with React Server/Client hybrid
- **UI Library:** React `^19.0.1` / React DOM `^19.0.1`
- **Language:** TypeScript `^5.7.0`
- **Styling:** Tailwind CSS `^4.3.3` (CSS-first `@theme` config in `src/app/globals.css`) with `@tailwindcss/postcss`
- **Icons:** Google Material Symbols Outlined (web font)
- **Typography:** Inter and Plus Jakarta Sans (via Google Fonts)

### Backend / API
- **Runtime:** Next.js Route Handlers (`src/app/api/**`) running on the Node.js runtime
- **Streaming:** Server-Sent Events (`text/event-stream`)
- **Styling pipeline:** PostCSS `^8.4.38`

### AI Integration
- **Primary SDK:** `@google/genai` `^2.4.0` (Google Gemini Developer API)
- **Primary model:** `gemini-3.8-flash` (override via `GEMINI_MODEL`)
- **Gemini fallbacks (in order):** `gemini-3.1-flash-lite`, `gemini-3.5-flash`, `gemini-3-flash-preview`. The primary and the Flash-3.x fallbacks share one free-tier request quota, so `gemini-3.1-flash-lite` leads the chain as a separate quota pool that can serve traffic when the primary is exhausted.
- **Optional free-tier fallbacks:** Groq (`llama-3.3-70b-versatile`) and OpenRouter (`meta-llama/llama-3.3-70b-instruct:free`), called directly over HTTPS

### Persistence
- **Client-side storage:** Browser `localStorage` (conversations, repertoire, artist profile, welcome state). **No server-side database is used.**

### Authentication
- **None.** The application has no accounts, sessions, or user identity system. The Gemini API key is the only credential, and it lives server-side only.

### Deployment
- No deployment configuration (e.g., Vercel/Docker/CI) is committed to the repository; deployment is environment-specific.

> **Note:** `lucide-react` and `motion` are listed in `package.json` but are not currently imported by application code (the UI uses Material Symbols and CSS transitions). They are declared dependencies, not active parts of the runtime.

---

## Project Architecture

```
GrooveyAI/
├── src/
│   ├── app/                        # Next.js App Router
│   │   ├── layout.tsx              # Root layout, metadata, fonts
│   │   ├── page.tsx                # Root route → renders <App/>
│   │   ├── globals.css             # Tailwind v4 theme tokens + utilities
│   │   └── api/                    # Backend route handlers
│   │       ├── chat/route.ts       # POST  — non-streaming coaching
│   │       ├── chat/stream/route.ts# POST  — streaming coaching (SSE)
│   │       ├── chat/title/route.ts # POST  — AI session titles
│   │       └── health/route.ts     # GET   — provider health check
│   ├── components/                 # UI components
│   │   ├── ActiveCoaching.tsx      # Main chat/coaching view
│   │   ├── RepertoireView.tsx      # Saved repertoire library
│   │   ├── ArtistProfileView.tsx   # Profile editor + data export
│   │   ├── WelcomeModal.tsx        # Welcome / showcase modal
│   │   ├── StudioLobby.tsx         # (Component; not mounted by the router)
│   │   ├── Header.tsx              # Top bar (status, navigation)
│   │   ├── SideDrawer.tsx          # Slide-out session/discipline menu
│   │   ├── BottomNav.tsx           # Coach / Repertoire / Artist tabs
│   │   ├── InteractivePracticeBar.tsx # Metronome practice bar
│   │   └── MarkdownRenderer.tsx    # Lightweight custom Markdown renderer
│   ├── context/
│   │   └── ChatContext.tsx         # Global state (conversations, repertoire,
│   │                               #   profile, health, streaming) + localStorage
│   ├── lib/
│   │   └── gemini.ts               # AI core: key resolution, model fallback,
│   │                               #   retries, secondary providers, health
│   ├── services/
│   │   └── api.ts                  # Client fetch helpers (stream/title/health)
│   ├── types/
│   │   └── index.ts                # Shared TypeScript types
│   ├── utils/
│   │   └── audio.ts                # Web Audio metronome synthesizer
│   └── App.tsx                     # Root client shell (tabs, layout)
│
├── public/                         # Static assets (mascot, logos, previews)
├── package.json                    # Scripts + dependencies
├── package-lock.json               # npm lockfile
├── next.config.ts                  # Next.js config (reactStrictMode)
├── postcss.config.mjs              # PostCSS (Tailwind) config
├── tsconfig.json                   # TypeScript config
├── metadata.json                   # AI Studio project metadata
├── .env.example                    # Environment variable template
└── DESIGN.md                       # Design-system reference
```

### Key modules

| Module | Responsibility |
|---|---|
| `src/App.tsx` | Client entry shell; renders the modal, header, drawer, active view, and bottom nav based on `activeTab`. |
| `src/context/ChatContext.tsx` | Single source of truth for conversations, repertoire, artist profile, selected discipline/level, streaming state, toast messages, and server health. Hydrates from and persists to `localStorage`. |
| `src/lib/gemini.ts` | All AI integration: resolves the API key, builds the Gemini client, defines the system instruction, classifies errors, implements retry/backoff and model fallback, calls Groq/OpenRouter fallbacks, and computes truthful health. |
| `src/services/api.ts` | Client-side HTTP layer to the route handlers (SSE stream reader, title generation, health). |
| `src/components/MarkdownRenderer.tsx` | Dependency-free renderer for headings, bold/italic/code, lists, numbered steps, and styled callouts. |
| `src/utils/audio.ts` | Web Audio API metronome (oscillator click, accent on beat 1, BPM control). |

### Application routes

| Route | Rendering | Purpose |
|---|---|---|
| `/` | Client component | The full single-page application. |
| `/api/chat` | Route handler | Non-streaming coaching request. |
| `/api/chat/stream` | Route handler | Streaming coaching request (SSE). |
| `/api/chat/title` | Route handler | Generates a short session title. |
| `/api/health` | Route handler | Provider health/status. |

---

## Prerequisites

- **Node.js** `>= 20.9.0` (required by Next.js 16.4.0). Verified working on Node 24.
- **npm** (a `package-lock.json` is committed; npm is the expected package manager). Verified on npm 11.
- **A Google Gemini API key** — free tier is supported. Get one at [aistudio.google.com](https://aistudio.google.com/).
- **Optional:** A [Groq](https://console.groq.com/) and/or [OpenRouter](https://openrouter.ai/keys) API key for secondary free-tier fallback.

No database, external service, or account is otherwise required to run the app locally.

---

## Installation and Setup

> Replace `<your-repo-url>` below with the actual GitHub repository URL. The repository URL is not recorded in this project (the folder is not currently a Git repository), so the clone command is provided as an explicit placeholder.

1. **Clone the repository**

   ```bash
   git clone <your-repo-url>
   cd GrooveyAI
   ```

   *If you already have the project locally, simply `cd` into the project root and continue.*

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Create your environment file**

   Copy the provided template and add your key:

   ```bash
   cp .env.example .env.local    # macOS / Linux
   copy .env.example .env.local  # Windows (PowerShell/CMD)
   ```

   Then edit `.env.local` and set `GEMINI_API_KEY`:

   ```dotenv
   GEMINI_API_KEY="AIzaSy..."
   ```

   Use your real key from Google AI Studio. Never commit this file.

4. **Start the development server**

   ```bash
   npm run dev
   ```

The app runs at **http://localhost:3000** (see [Running the Application](#running-the-application) for details).

---

## Environment Variables

All variables are read server-side only (`src/lib/gemini.ts`); none are exposed to the browser bundle. Values below are **safe placeholders** — never place a real key in documentation or version control.

| Variable | Required | Default | Purpose |
|---|---|---|---|
| `GEMINI_API_KEY` | **Yes** | — | Primary Google Gemini Developer API key. Without it, coaching endpoints return a configuration error. Also read directly from a project-root `.env.local` / `.env` file. |
| `GEMINI_MODEL` | No | `gemini-3.8-flash` | Overrides the primary Gemini model. |
| `GOOGLE_API_KEY` | No | — | Legacy fallback alias used only if `GEMINI_API_KEY` is not defined. |
| `GROQ_API_KEY` | No | — | Enables the Groq free-tier fallback (`llama-3.3-70b-versatile`) when Gemini is at capacity. |
| `OPENROUTER_API_KEY` | No | — | Enables the OpenRouter free-model fallback (`meta-llama/llama-3.3-70b-instruct:free`). |
| `APP_URL` | No | — | Reserved for absolute URL resolution in deployment. Documented in `.env.example`; not currently read by application code. |

### Key resolution order

`GEMINI_API_KEY` is resolved by `getGeminiApiKey()` in this order: project-root `.env.local` → `process.env.GEMINI_API_KEY` → project-root `.env` → `process.env.GOOGLE_API_KEY`. Values are sanitized (trimmed, quotes stripped, accidental `Bearer ` prefix removed).

### Example `.env.local`

```dotenv
# Required — primary AI provider
GEMINI_API_KEY="AIzaSy..."

# Optional — override the primary model
# GEMINI_MODEL="gemini-3.8-flash"

# Optional — secondary free-tier fallbacks
# GROQ_API_KEY="gsk_..."
# OPENROUTER_API_KEY="sk-or-..."

# Optional — app URL for deployment
# APP_URL="http://localhost:3000"
```

> `.gitignore` excludes `.env*` while explicitly allowing `.env.example`, so real keys will not be committed. Keep it that way.

---

## Running the Application

### Available scripts

Defined in `package.json`:

| Script | Command | Description |
|---|---|---|
| `npm run dev` | `next dev` | Start the development server with hot reload. |
| `npm run build` | `next build` | Create an optimized production build. |
| `npm start` | `next start` | Serve the production build (run `build` first). |
| `npm run lint` | `next lint` | Lint via Next.js (see caveat below). |

### Local development

```bash
npm run dev
```

Open **http://localhost:3000**. (Next.js defaults to port `3000`; to change it, run `npm run dev -- -p 3001` or set `PORT`.)

### Production build

```bash
npm run build
npm start
```

> **Caveat — `npm run lint`:** the script calls `next lint`, but no ESLint dependency or config is currently committed. Depending on your Next.js version, this command may prompt you to set up ESLint interactively or report that no configuration exists. Treat linting as an optional, not-yet-configured step.

---

## How It Works

### Request flow (streaming chat)

```
User types in ActiveCoaching
        │
        ▼
ChatContext.sendMessage()  ──► generateSessionTitle()  ──► POST /api/chat/title
        │                                                     (short AI title)
        ▼
streamChatCompletion()  ──► POST /api/chat/stream
        │
        ▼
src/app/api/chat/stream/route.ts
        │  • builds contextual system instruction (discipline + level)
        │  • takes the last 16 messages as context
        │  • tries PRIMARY_MODEL, then each FALLBACK_MODEL
        │  • retries transient errors with exponential backoff + jitter
        │  • (optional) falls back to Groq → OpenRouter if all Gemini models fail
        ▼
SSE response:  data: {"text":"..."}  …  data: [DONE]
        │
        ▼
services/api.ts reads the stream → ChatContext accumulates chunks → UI renders
```

### Components

- **UI** — The app is a single client-rendered page. `ChatContext` drives which view is active and holds all in-memory + persisted state.
- **API** — Next.js Route Handlers under `src/app/api/**` act as a secure server-side proxy. The Gemini (and fallback) API keys never leave the server.
- **AI service** — `src/lib/gemini.ts` owns the system instruction (the "Grooveyy" performing-arts persona, tone, safety rules, and strict performing-arts boundary), key resolution, the model fallback chain, error classification (transient vs. permanent), retries, and the secondary providers.
- **Database** — There is no database. Persistence is browser `localStorage` (`grooveyy_conversations_v1`, `grooveyy_repertoire_v1`, `grooveyy_artist_profile_v1`, `grooveyy_welcome_dismissed`).

### Resilience model

- **Transient capacity errors** (`503`, `500`, `502`, `504`, timeouts, short `429` rate limits) → bounded exponential backoff with jitter (max 3 attempts per model, each wait capped), honouring `Retry-After` when the server supplies a short one, then advance to the next model, then optionally to Groq/OpenRouter.
- **Quota exhaustion** (`429` with a long, server-declared reset window, e.g. the free-tier daily request limit) → not retried in place, because retrying cannot succeed until the quota resets. The app fails over to another model/pool and surfaces the reset time.
- **Permanent errors** (`400`, `401`, `403`) → fail immediately with a clear message (e.g., invalid API key).
- **Unknown/unavailable models** (`404`) → skipped and the chain advances to the next model.
- **Partial streams** are never silently restarted (which would duplicate output); the client is told to resend.
- **Health** is computed by actually pinging the model (cached in memory for 60s) so the UI never falsely reports readiness.

---

## Usage Guide

1. **Open the app** at `http://localhost:3000`. A welcome modal introduces the companion; dismiss it to continue.
2. **Pick a discipline and level** (e.g., Dance · Intermediate) so coaching is calibrated. These settings are sent with each request.
3. **Start a rehearsal session** from the Coach tab. Either tap a starter prompt or type your own question.
4. **Ask for coaching** in plain language — e.g., "How do I improve my pirouette balance?", "Teach me a baritone warm-up", "Break down a Stanislavski monologue approach", "What BPM should I practice this patter at?".
5. **Use the composer extras:**
   - *Mic* — dictate your question via speech.
   - *Attach* — reference a repertoire file by name (the file is referenced by filename in the prompt; contents are not uploaded).
   - *Enter* to send, *Shift+Enter* for a new line.
6. **Watch the stream** — replies appear progressively; press **Stop** to halt.
7. **Save useful replies** — tap the bookmark on a coach message to add it to your Repertoire library.
8. **Drill saved pieces** — in the Repertoire tab, filter by discipline, expand notes, and use "Drill on Stage →" to open a new session seeded with that piece.
9. **Use the metronome** — for tempo-related coaching an interactive practice bar appears with adjustable BPM (80–132).
10. **Manage data** — in the Artist tab, edit your profile, view stats, export a full JSON backup, or clear rehearsal history.

> Conversations, repertoire, and profile persist in your browser's `localStorage`. Clearing site data or using a different browser/device starts fresh.

---

## API Documentation

The app exposes four Next.js Route Handlers. All are server-side and intended for the app's own client. Request/response bodies are JSON.

### `POST /api/chat/stream` — Streaming coaching (used by the app)

Streams the coach's reply as Server-Sent Events.

**Request body**

```json
{
  "messages": [
    { "role": "user", "content": "How do I improve my pirouette balance?" },
    { "role": "model", "content": "..." }
  ],
  "discipline": "Dance",
  "level": "Intermediate"
}
```

- `messages` (required, non-empty array) — conversation history; only the **last 16** messages are used.
- `discipline` (optional) — one of `General | Dance | Singing | Music | Theater | Acting | Choreography | Stage Performance`.
- `level` (optional) — one of `All | Beginner | Intermediate | Advanced / Audition`.

**Response** — `text/event-stream`:

```
data: {"text":"Great "}

data: {"text":"question! "}

data: {"text":"Focus on ..."}

data: [DONE]
```

If a failure occurs before any chunk is sent, the stream emits `data: {"error":"<friendly message>"}` followed by `data: [DONE]`.

**Errors:** `400` if `messages` is invalid; `500` if `GEMINI_API_KEY` is not configured.

---

### `POST /api/chat` — Non-streaming coaching

Same request body as above. Returns the full reply in one JSON response.

**Response**

```json
{ "text": "Great question! Focus on ..." }
```

**Errors:** `400` (invalid `messages`), `500` (missing key or generation failure).

---

### `POST /api/chat/title` — Generate a session title

**Request body**

```json
{ "prompt": "How do I improve my pirouette balance?" }
```

**Response**

```json
{ "title": "Pirouette Balance Improvement" }
```

If the API key is missing, the endpoint degrades gracefully by returning a truncated version of the prompt instead of erroring.

---

### `GET /api/health` — Provider health

**Query parameters**

- `fresh` — set to `true` to bypass the 60-second cache and re-ping the provider.

**Response**

```json
{
  "status": "ready",
  "provider": "Google Gemini (Fallback Active)",
  "model": "gemini-3.1-flash-lite",
  "activeProvider": "gemini",
  "message": "Free-tier quota exhausted on gemini-3.8-flash. Serving via gemini-3.1-flash-lite.",
  "hasKey": true,
  "fallbackModels": ["gemini-3.1-flash-lite", "gemini-3.5-flash", "gemini-3-flash-preview"],
  "secondaryFallbackAvailable": false,
  "freeTierNote": "Automatic model failover is active.",
  "checkedAt": 1730000000000
}
```

`status` is one of `ready | connecting | unavailable | quota-exhausted | configuration-error`. The value reflects a real probe of the model, so it is trustworthy. `quota-exhausted` means the provider's free-tier request quota is spent and only resets after the window reported in `message` — retrying sooner will not help, and the remedy is to use a different key tier or configure a fallback provider.

---

## Security and Privacy

- **API keys stay server-side.** `GEMINI_API_KEY`, `GROQ_API_KEY`, and `OPENROUTER_API_KEY` are only read in server modules (`src/lib/gemini.ts`). The client bundle contains no secrets.
- **No credentials in source.** Never commit `.env` or `.env.local`; `.gitignore` already excludes them while keeping `.env.example`.
- **Error messages are sanitized.** User-facing errors are formatted to avoid leaking credentials or raw internal detail.
- **No user accounts or tracking.** There is no authentication, no session cookies, and no analytics or third-party tracking in the application code.
- **Data stays local.** Conversations, repertoire, and profile are stored in your browser's `localStorage` and are not transmitted to any application database. Note that anything you type into the coach is sent to the configured AI provider (Google Gemini, and optionally Groq/OpenRouter) to generate a reply, subject to that provider's terms.
- **Rendered model output is safe by construction.** The Markdown renderer does not use `dangerouslySetInnerHTML`; model output is rendered as React text nodes.

> No formal security audit, penetration test, or compliance certification is documented for this project. Treat it as a work in progress.

---

## Troubleshooting

**`GEMINI_API_KEY is not configured` / `configuration-error`**
Create `.env.local` in the project root and set `GEMINI_API_KEY`, then restart the dev server. Confirm the key is valid at [aistudio.google.com](https://aistudio.google.com/).

**`401 UNAUTHENTICATED` / `API key not valid`**
The key is invalid or revoked. Generate a new key and replace the old one. Do not wrap the key in quotes-with-`Bearer`; the app strips an accidental `Bearer ` prefix but a malformed key will still fail.

**"The AI coaching service is temporarily at capacity"**
The model is at capacity (503) or briefly rate-limited. The app retries with bounded backoff and falls back to other Gemini models automatically. Optionally set `GROQ_API_KEY` or `OPENROUTER_API_KEY` for an additional free-tier fallback.

**"The AI coaching service has reached its free-tier request quota for today" / header shows "Quota Reached"**
This is **not** a temporary outage: the Google Gemini free tier limits requests per day, and that limit has been used up. Retrying sooner will not help — the app reports the reset window returned by Google. To restore service immediately, either enable billing on the Google AI project (raises the limit), use a different API key, or set `GROQ_API_KEY` / `OPENROUTER_API_KEY` so a non-Gemini provider can serve requests. Check current usage at [ai.dev/rate-limit](https://ai.dev/rate-limit).

**Port 3000 already in use**
Run on a different port: `npm run dev -- -p 3001`, or set the `PORT` environment variable.

**`npm run lint` prompts for setup or reports no configuration**
No ESLint dependency/config is committed. Either run `next lint` interactively to generate one, or skip linting for now.

**Metronome produces no sound**
Browsers block audio until a user gesture. Click the metronome **play** button to start audio (the app only starts audio from a click). Also confirm your system volume and that the tab is not muted.

**Changes to `.env.local` not taking effect**
Environment files are read at server start. Stop and restart the dev server.

**Data disappeared between sessions**
Data lives in `localStorage`, which is cleared by private/incognito windows, clearing site data, or switching browsers/devices. Use the **Artist → Export Backup (JSON)** option to save a copy.

**A file I attached did not influence the reply**
The attach control records the file **name** in your prompt; it does not upload file contents. Paste the relevant text directly if you need the model to read it.

---

## Development and Contribution

### Local workflow

1. Fork/clone the project and `npm install`.
2. Configure `.env.local` as described above.
3. Run `npm run dev` and develop against `http://localhost:3000`.
4. Keep TypeScript strictness (`tsconfig.json` currently sets `"strict": false`) in mind and avoid introducing `any` where a shared type in `src/types/index.ts` fits.
5. Before opening a change, run `npm run build` to confirm the production build succeeds.

### Where to make changes

- **Coach chat view** → `src/components/ActiveCoaching.tsx`
- **AI behavior, model fallback, health** → `src/lib/gemini.ts`
- **State & persistence** → `src/context/ChatContext.tsx`
- **Design tokens/theme** → `src/app/globals.css` (reference: `DESIGN.md`)
- **New API endpoint** → add a route under `src/app/api/`

### Conventions observed

- Shared TypeScript types live in `src/types/index.ts`.
- Tailwind utilities are used with occasional arbitrary hex values matching the established palette.
- Icons are Material Symbols font glyphs (`<span className="material-symbols-outlined">name</span>`).
- No formal contribution guide, commit convention, or CI workflow is committed yet. If you want to formalize these (e.g., a `CONTRIBUTING.md`, PR template, or lint/CI setup), that can be added.

---

## Roadmap

The repository does not include a formal roadmap or issue tracker, so none is invented here. Natural next steps (not commitments) include adding user accounts with cloud sync, an ESLint/CI setup, real file-upload context, and a dedicated Markdown library. Track or prioritize these as the project evolves.

---

## License

**No license file is present in this repository.** The project's licensing status has not been declared. Until an explicit `LICENSE` file is added, all rights are reserved by default and no open-source permissions should be assumed. If you intend to make GrooveyAI public or open source, please add a `LICENSE` file (e.g., MIT, Apache-2.0) and update this section.

---

## Credits

- **GrooveyAI** ("Grooveyy") is part of the **GroovePH** performing-arts ecosystem.
- Built with **Next.js**, **React**, **Tailwind CSS**, and the **Google Gemini Developer API** (`@google/genai`).
- Built with **Google AI Studio**, with acknowledgments to related ecosystem tools (Google Stitch, Google Antigravity).
- Mascot and GroovePH brand assets are original to the GroovePH project.

Branding, licensing, and external links referenced in the interface (including the GroovePH site and tool links) are maintained by the project owner.