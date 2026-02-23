# AI Auto Video Maker

A full-stack AI-assisted video automation app that creates Shorts, Reels, and YouTube videos from script + media uploads.

## Folder Structure

```txt
ai-auto-video-maker/
├── client/                     # React + Tailwind frontend (creator dashboard/editor)
│   ├── src/
│   │   ├── components/
│   │   │   ├── PreviewPlayer.jsx
│   │   │   ├── SectionCard.jsx
│   │   │   └── TimelineEditor.jsx
│   │   ├── lib/api.js
│   │   ├── App.jsx
│   │   ├── index.css
│   │   └── main.jsx
│   ├── index.html
│   ├── tailwind.config.js
│   ├── postcss.config.js
│   ├── vite.config.js
│   └── package.json
├── server/                     # Node API + FFmpeg renderer
│   ├── src/
│   │   ├── services/
│   │   │   ├── automationService.js
│   │   │   └── renderService.js
│   │   ├── utils/templates.js
│   │   └── index.js
│   ├── uploads/
│   ├── renders/
│   └── package.json
├── package.json                # npm workspaces root
└── README.md
```

## Features Included

- Aspect ratio selector: **9:16**, **16:9**, **1:1**
- Inputs: script, images, clips, voiceover, music, background
- Reference style prompt for video/animation/caption style
- Auto mode + manual mode
- AI automation pipeline:
  - script scene splitting
  - media keyword matching
  - hook/main/CTA structure
  - auto captions
  - transition + animation + SFX hints
- Built-in templates:
  - Quiz
  - Guess/Challenge
  - Top List
  - Storytelling
  - Motivational
  - Comparison
- Timeline editor:
  - scene-level duration control
- Preview player + one-click MP4 render
- Dark UI + responsive layout

## Setup

### 1) Install dependencies

```bash
npm install
```

### 2) Install FFmpeg

Ensure `ffmpeg` is installed and available in PATH.

- Ubuntu/Debian:

```bash
sudo apt update && sudo apt install -y ffmpeg
```

- macOS:

```bash
brew install ffmpeg
```

### 3) Run app

```bash
npm run dev
```

- Frontend: `http://localhost:5173`
- Backend: `http://localhost:4000`

## API Endpoints

- `GET /api/templates` → available video templates
- `POST /api/project/generate` → upload assets + generate AI project plan
- `POST /api/project/render` → FFmpeg render to MP4

## Notes on Rendering

This starter uses a deterministic FFmpeg render pipeline (first matched scene media) to produce a valid MP4 quickly. The generated plan includes enough metadata to extend into multi-scene stitched timelines, beat sync, subtitle burn-ins, advanced transitions, and AI voice timing alignment.
