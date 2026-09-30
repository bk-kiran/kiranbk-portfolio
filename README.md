# kiranbk.com

Personal site for Kiran BK: a portfolio with a built-in terminal. Press the `>_` button, or run
`help` once it's open.

## Stack

- **Next.js 16** (App Router, Turbopack) + React 19, deployed on Vercel
- **kiran-bot** (`ask`): retrieval-augmented chat over the site data, résumé, and `corpus/`
  - Voyage `voyage-3-lite` embeddings, with a local vector index (`lib/rag/index.json`) ranked in memory
  - Claude (`claude-opus-5`) streams the answers from an edge route (`app/api/ask`)
- **Terminal apps**: daily about-me Wordle, trivia (130+ questions, many generated from `lib/data`),
  Snake, a typing test, and Matrix rain

## Develop

```bash
npm install
cp .env.local.example .env.local   # add VOYAGE_API_KEY and ANTHROPIC_API_KEY
npm run dev                        # http://localhost:3001
```

To test from another device on your network, add your laptop's IP to `allowedDevOrigins`
in `next.config.ts`.

## Content

| What | Where |
|---|---|
| Experience, projects, education, skills | `lib/data/*.ts` |
| Contact info and what you're looking for | `lib/data/personal.ts` |
| Wordle answers and blurbs | `lib/data/wordle.ts` |
| Handwritten trivia | `lib/data/trivia.ts` (the rest is generated from `lib/data`) |
| Extra kiran-bot knowledge | `corpus/` (see `corpus/README.md`) |

**After changing `lib/data`, `corpus/`, or `public/resume.pdf`, rebuild kiran-bot's index and commit it:**

```bash
npm run ingest -- --dry   # preview
npm run ingest            # writes lib/rag/index.json + manifest.json
```

## Deploy

Set `ANTHROPIC_API_KEY` and `VOYAGE_API_KEY` in the Vercel project. `/api/ask` has a
per-instance rate limit (10 requests/min per IP) and caps input sizes. For real protection, also
set a monthly spend limit in the Anthropic console and a rate-limit rule in Vercel's firewall.
