// Daily answers for `run wordle`. Every word is 5 letters and tied to something
// on this site. The blurb is shown after the puzzle ends ("why this word").
export type WordleEntry = { word: string; blurb: string; link?: string };

export const WORDLE_WORDS: WordleEntry[] = [
  { word: 'REACT', blurb: 'The frontend in most of my work — Zyntra messaging, the Lee Yuen quotation tool, and the Alterea insights modal.', link: '/experience' },
  { word: 'UMASS', blurb: 'UMass Amherst — B.S. Computer Science, graduating May 2027.', link: '/education' },
  { word: 'KAPOK', blurb: 'Kapok: an offline-first Flutter disaster-relief app built with 15 contributors for a real client.', link: 'https://github.com/ShreyanshMisra/Kapok' },
  { word: 'KEEPO', blurb: 'Keepo: an AI receipt tracker with dual LLM extraction agents and async Inngest jobs.', link: 'https://github.com/bk-kiran/Keepo' },
  { word: 'NUMPY', blurb: 'NumPy + pandas powered the clinical-record analysis at TruBridge Healthcare.', link: '/experience' },
  { word: 'PANDA', blurb: 'pandas: I vectorized row-wise transforms at TruBridge, cutting preprocessing from ~20 min to under 5.', link: '/experience' },
  { word: 'MODEL', blurb: 'At Lee Yuen I built a scikit-learn demand-forecasting model on 10 years of sales across 5,000+ SKUs.', link: '/experience' },
  { word: 'GRAPH', blurb: 'GraphQL at Zyntra, LangGraph at Alterea — graphs keep showing up.', link: '/experience' },
  { word: 'TOKEN', blurb: 'JWT auth with token refresh at Zyntra cut auth errors by 60%.', link: '/experience' },
  { word: 'AGENT', blurb: 'I helped build the agentic pipeline behind multi-turn educational conversations at Alterea.', link: '/experience' },
  { word: 'LEARN', blurb: 'scikit-learn: the forecasting pipeline at Lee Yuen and the World Cup 2026 predictor.', link: '/projects' },
  { word: 'QUOTE', blurb: 'My React + Spring Boot quotation tool took OEM quote turnaround from 1–2 days to same-day.', link: '/experience' },
  { word: 'PRICE', blurb: 'Dockerized Node.js scrapers on AWS tracked ~1,000 SKU prices across 6 competitor sites daily.', link: '/experience' },
  { word: 'SALES', blurb: 'Ten years of sales history fed the Lee Yuen demand-forecasting model.', link: '/experience' },
  { word: 'STOCK', blurb: 'Forecasting SKU-level demand replaced manual reorder estimates for the purchasing team.', link: '/experience' },
  { word: 'MONGO', blurb: 'MongoDB + Socket.IO backed real-time messaging for 2K+ concurrent users at Zyntra.', link: '/experience' },
  { word: 'VADER', blurb: 'VADER sentiment scoring drives the WhatsApp Analyzer dashboard.', link: 'https://whatsappchatanalyser.streamlit.app' },
  { word: 'CHATS', blurb: 'WhatsApp Analyzer: upload a chat export, get sentiment, heatmaps and word clouds.', link: 'https://github.com/bk-kiran/whatsappchatanalyser' },
  { word: 'WORLD', blurb: 'The World Cup 2026 Predictor runs 10K Monte Carlo simulations per run on XGBoost predictions.', link: 'https://github.com/bk-kiran/worldcup-2026-predictor' },
  { word: 'MATCH', blurb: 'The World Cup predictor trains on 14,695 historical matches.', link: 'https://github.com/bk-kiran/worldcup-2026-predictor' },
  { word: 'STUDY', blurb: 'StudyLens AI: a RAG study platform — query your PDFs, generate flashcards and exams.', link: 'https://study-lens-ai-coral.vercel.app' },
  { word: 'EXAMS', blurb: 'StudyLens AI generates multi-step practice exams from uploaded course material.', link: 'https://study-lens-ai-coral.vercel.app' },
  { word: 'CARDS', blurb: 'StudyLens AI schedules flashcards with SM-2 spaced repetition.', link: 'https://study-lens-ai-coral.vercel.app' },
  { word: 'QUERY', blurb: "Type 'ask' in the terminal — kiran-bot answers your query with RAG over this site.", link: undefined },
  { word: 'EMBED', blurb: 'Voyage embeddings + Upstash Vector power kiran-bot and StudyLens retrieval.', link: undefined },
  { word: 'CHUNK', blurb: "kiran-bot retrieves the top chunks of my résumé and projects before answering. Try '/sources' inside ask.", link: undefined },
  { word: 'LEVEL', blurb: 'Dopamine Drop gamifies Canvas LMS with XP, levels, streaks and achievements.', link: 'https://dopamine-drop.vercel.app' },
  { word: 'DROPS', blurb: 'Dopamine Drop: a smart diff sync cut Convex function calls by 85%.', link: 'https://github.com/bk-kiran/dopamine-drop' },
  { word: 'CLERK', blurb: 'Clerk handles auth for Dopamine Drop and Keepo.', link: '/projects' },
  { word: 'ASYNC', blurb: 'Keepo processes receipts in async Inngest background jobs with real-time status.', link: 'https://github.com/bk-kiran/Keepo' },
  { word: 'BUILD', blurb: 'BUILD UMass: I am a software developer and treasurer for a 70+ member pro-bono software org.', link: 'https://www.buildumass.com/' },
  { word: 'ICONS', blurb: 'iCons scholar — interdisciplinary STEM research on wind energy, energy forecasting and waste-heat recovery.', link: '/education' },
  { word: 'MARCO', blurb: 'MS MARCO: one of the benchmarks for my self-improving dense retrieval research at CIIR.', link: '/experience' },
  { word: 'GRADE', blurb: 'As a TA I grade, hold office hours and answer Piazza questions for 300+ students.', link: '/education' },
  { word: 'HOURS', blurb: 'Weekly TA office hours across Software Engineering, Data Management, Systems and Python.', link: '/education' },
  { word: 'LLAMA', blurb: 'At the BioNLP Lab I fine-tuned Clinical-T5, BioGPT and LLaMA with LoRA on MedCalc-Bench.', link: '/experience' },
  { word: 'TORCH', blurb: 'PyTorch + Hugging Face for clinical LLM fine-tuning at the BioNLP Lab.', link: '/experience' },
  { word: 'BENCH', blurb: 'MedCalc-Bench: the clinical-calculation benchmark behind my BioNLP research, presented at the URV Symposium.', link: '/experience' },
  { word: 'POWER', blurb: 'iCons 2: ML models predicting peak electricity use from live UMass campus data.', link: '/education' },
  { word: 'STACK', blurb: 'Full-stack by default: React/Next.js up front, Spring Boot, Node or Convex behind.', link: '/projects' },
  { word: 'DENSE', blurb: 'At CIIR I research self-improving dense retrieval with hard-negative mining and LLM-generated training signals.', link: '/experience' },
  { word: 'CODES', blurb: 'This whole terminal is a React component — commands, the ask sub-shell and these games.', link: 'https://github.com/bk-kiran' },
];

const EPOCH = new Date(2026, 8, 28); // day #1 of kiranbk wordle (local time)

function localMidnight(d: Date) {
  return new Date(d.getFullYear(), d.getMonth(), d.getDate());
}

export function dayNumber(date = new Date()): number {
  return Math.round((localMidnight(date).getTime() - EPOCH.getTime()) / 86_400_000) + 1;
}

export function dateKey(date = new Date()): string {
  const d = localMidnight(date);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

// Fixed pseudo-random permutation so consecutive days don't walk the list in order,
// and every word is used once per cycle before any repeats.
function mulberry32(seed: number) {
  return () => {
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const ORDER = (() => {
  const idx = WORDLE_WORDS.map((_, i) => i);
  const rand = mulberry32(1704);
  for (let i = idx.length - 1; i > 0; i--) {
    const j = Math.floor(rand() * (i + 1));
    [idx[i], idx[j]] = [idx[j], idx[i]];
  }
  return idx;
})();

export function entryForDate(date = new Date()): WordleEntry {
  const n = WORDLE_WORDS.length;
  const i = (((dayNumber(date) - 1) % n) + n) % n;
  return WORDLE_WORDS[ORDER[i]];
}
