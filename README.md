# 🕵️ Deepfake Detector — Frontend

> A minimal Next.js 16 interface for uploading images, getting real/fake verdicts, and submitting corrections — backed by the Deepfake Detection API.

---

## What It Does

This is the client for the Deepfake Detector API. Users can:

- **Upload** an image (drag-and-drop or click-to-browse)
- **Get a verdict** — Real or Fake — with a confidence score
- **Submit feedback** to correct wrong predictions and improve the vector database over time

---

## Tech Stack

| Layer | Choice |
|-------|--------|
| Framework | Next.js 16 (App Router) |
| Language | TypeScript 5 |
| Styling | Tailwind CSS v4 + `tw-animate-css` |
| UI Primitives | Radix UI Dialog, Radix UI Slot |
| Icons | lucide-react |
| Utilities | clsx, tailwind-merge, class-variance-authority |

No external state library, no form library — intentionally lean.

---

## Project Structure

```
my-app/
├── app/
│   ├── page.tsx               # Home — upload form + result display
│   ├── layout.tsx
│   └── globals.css
├── components/
│   ├── upload-zone.tsx        # Image drag-and-drop / file picker
│   ├── result-card.tsx        # Verdict display (Real / Fake + confidence bar)
│   ├── feedback-dialog.tsx    # Radix Dialog — submit a correction
│   └── ui/                    # Shared button, badge, card primitives
├── lib/
│   └── api.ts                 # Typed wrappers around /predict and /feedback
├── .env.local
└── package.json
```

---

## How It Connects to the Backend

```
User drops image
      │
      ▼
POST /predict
      │
      ▼
{ isAuthentic, confidence, embedding }
      │
      ├── Show verdict card (Real / Fake)
      └── Show confidence score
              │
              ▼ (user clicks "Wrong? Correct it")
         Feedback Dialog
              │
              ▼
POST /feedback  { embedding, label }
              │
              ▼
      { status: "completed" }
```

The `embedding` returned by `/predict` is held in local state and passed directly to `/feedback` — no re-upload needed.

---

## Setup

### Prerequisites

- Node.js 20+
- The [Deepfake Detector Python backend](../backend/README.md) running on port 8000

### Install

```bash
npm install
```

### Environment Variables

Create a `.env.local` file:

```env
NEXT_PUBLIC_API_URL=http://localhost:8000
```

### Run

```bash
npm run dev
```

App runs at `http://localhost:3000`.

---

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Dev server with hot reload |
| `npm run build` | Production build |
| `npm run start` | Serve the production build |
| `npm run lint` | Run ESLint |

---

## API Integration

Two calls, defined in `lib/api.ts`:

```ts
// Classify an image
POST /predict
  body: FormData { file: File }
  → { isAuthentic: boolean, confidence: number, embedding: number[] }

// Submit a correction
POST /feedback
  body: { embedding: number[], label: 0 | 1 }
  → { status: string }
```

The backend runs at `NEXT_PUBLIC_API_URL` (defaults to `http://localhost:8000`).

---

## Known Limitations & Future Work

- **No auth** — any user can submit feedback and influence the vector database
- **Embedding held in memory only** — refreshing the page after a prediction loses the ability to give feedback
- **No batch upload** — one image at a time
- **CORS** — backend allows `http://localhost:3000` only; update `allow_origins` on the backend when deploying

---

*Next.js 16 · React 19 · TypeScript 5 · Tailwind v4 · Radix UI*
