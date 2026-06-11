# ⚽ Tactical Lens

An AI-powered football analysis tool that breaks down any match screenshot, heatmap, or pass map into detailed tactical insights — instantly.

Built for the 2026 FIFA World Cup and beyond.

---

## What It Does

Upload any football image and get a structured tactical breakdown in seconds:

- **Match Screenshots** — formations, team shape, pressing triggers, space & positioning
- **Heatmaps** — dominant zones, movement patterns, positional tendencies
- **Pass & Touch Maps** — passing networks, directional tendencies, touch distribution

You can also add your own question or context alongside the image:
> *"This is Bellingham's heatmap — compare his movement to a typical box-to-box midfielder"*

The AI adapts its analysis based on what you ask.

---

## Tech Stack

| Layer | Tool |
|---|---|
| Framework | Next.js 16 (App Router) |
| Styling | Tailwind CSS |
| AI Vision | OpenAI GPT-4o Mini |
| Deployment | Vercel |

---

## Getting Started

### 1. Clone the repo

```bash
git clone https://github.com/Vijayant-Raghav1306/tactical-lens.git
cd tactical-lens
```

### 2. Install dependencies

```bash
npm install
```

### 3. Add your OpenAI API key

Create a `.env.local` file in the root:

```bash
OPENAI_API_KEY=sk-your-key-here
```

Get your key at [platform.openai.com/api-keys](https://platform.openai.com/api-keys)

### 4. Run locally

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

---

## Deployment

Deployed on Vercel. To deploy your own:

1. Push to GitHub
2. Import repo at [vercel.com](https://vercel.com)
3. Add `OPENAI_API_KEY` as an environment variable
4. Deploy

---

## Built By

**Vijayant** — Sports tech enthusiast building at the intersection of football and AI.
