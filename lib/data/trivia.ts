// Question bank for `run trivia`: handwritten questions plus ones generated from
// lib/data, so the pool grows (and stays accurate) as the site data changes.
import { experience } from './experience';
import { projects } from './projects';
import { education } from './education';
import { skills } from './skills';

export type TriviaQuestion = {
  id: string;
  q: string;
  options: string[]; // shuffled again at play time
  answer: number;    // index into options
  fact: string;
};

type Handwritten = Omit<TriviaQuestion, 'id'>;

// ── handwritten ─────────────────────────────────────────────────────────────
// Convention: the correct option is listed first (answer: 0).

const HANDWRITTEN: Handwritten[] = [
  // LeeYuen Housewares
  { q: 'Which company did Kiran build a demand-forecasting model for?', options: ['LeeYuen Housewares', 'TruBridge Healthcare', 'Zyntra.io', 'Alterea'], answer: 0, fact: 'A scikit-learn model on 10 years of sales history, adopted by purchasing and sales.' },
  { q: 'Roughly how many SKUs did the LeeYuen forecasting model cover?', options: ['5,000+', '500+', '50,000+', '1,000'], answer: 0, fact: '5,000+ SKUs for UK and US clients.' },
  { q: 'Where was the LeeYuen internship based?', options: ['Hong Kong', 'Singapore', 'London', 'Boston'], answer: 0, fact: 'Summer 2025 in Hong Kong.' },
  { q: "Kiran's quotation tool cut OEM quote turnaround from 1–2 days to…", options: ['same-day', '12 hours', '1 week', '3 days'], answer: 0, fact: 'React + Spring Boot, consolidating BOM costs, supplier pricing and lead times into one interface.' },
  { q: 'The LeeYuen quotation tool consolidated pricing across how many suppliers?', options: ['55', '5', '12', '200'], answer: 0, fact: 'BOM costs, pricing across 55 suppliers, and production lead times in one interface.' },
  { q: "How many competitor sites did Kiran's price scrapers track?", options: ['6', '2', '25', '100'], answer: 0, fact: 'Dockerized Node.js scrapers on AWS tracking ~1,000 SKUs, refreshed daily.' },
  { q: "What replaced LeeYuen's manual weekly competitor price lookups?", options: ['Automated daily scrapers', 'A shared spreadsheet', 'An outsourced research team', 'A monthly vendor report'], answer: 0, fact: 'Dockerized Node.js scrapers on AWS, structured for procurement benchmarking.' },

  // TruBridge
  { q: 'At TruBridge, preprocessing clinical records went from ~20 minutes to…', options: ['under 5 minutes', 'about 15 minutes', 'under 1 second', 'about 10 minutes'], answer: 0, fact: 'Rewriting row-wise pandas operations as vectorized transforms.' },
  { q: 'Which library did Kiran use at TruBridge to model readmission predictors?', options: ['statsmodels', 'Prophet', 'Keras', 'Spark MLlib'], answer: 0, fact: 'Logistic regression and OLS in statsmodels, finding predictors at p ≤ 0.01.' },
  { q: 'Roughly how many clinical records did Kiran analyze at TruBridge?', options: ['50K+', '5K', '500K+', '5M+'], answer: 0, fact: 'With pandas and SQLAlchemy, across multiple hospital systems.' },
  { q: 'Which predictor of hospital readmission did Kiran identify at TruBridge?', options: ['Length of stay', 'Patient zip code', 'Day of the week', 'Insurance provider'], answer: 0, fact: 'Along with prior infection incidents, significant at p ≤ 0.01.' },
  { q: "TruBridge's ETL pipeline ran on…", options: ['AWS Lambda + S3', 'Azure Functions', 'Google Cloud Run', 'An on-prem Hadoop cluster'], answer: 0, fact: 'Kiran added error logging for failed ingestion runs too.' },

  // Zyntra
  { q: 'How many concurrent users did the real-time messaging at Zyntra support?', options: ['2K+', '200', '20K', '500'], answer: 0, fact: 'React, Node.js, MongoDB and Socket.IO.' },
  { q: 'By how much did JWT auth with token refresh cut auth errors at Zyntra?', options: ['60%', '10%', '35%', '90%'], answer: 0, fact: 'Token refresh plus session expiry.' },
  { q: 'Integrating REST and GraphQL APIs at Zyntra reduced render failures by…', options: ['35%', '5%', '60%', '85%'], answer: 0, fact: 'Fewer render failures and response issues.' },

  // Alterea
  { q: 'Which AI media-literacy game did Kiran work on at Alterea?', options: ['Agents of Influence', 'Fact or Fiction', 'Signal & Noise', 'Truth Quest'], answer: 0, fact: 'Kiran rebuilt its performance-analysis modal for teachers in React.' },
  { q: 'How many frontend and Firebase bugs did Kiran resolve at Alterea?', options: ['10+', '2', '50+', '100+'], answer: 0, fact: 'Including a consent form that wrongly required email and student-account display errors.' },

  // current roles
  { q: 'Which company is Kiran an open source contributor to?', options: ['Acnodal', 'Mozilla', 'HashiCorp', 'Vercel'], answer: 0, fact: 'Since June 2026.' },
  { q: 'Where did Kiran intern as a software engineer in summer 2026?', options: ['Aubot', 'Alterea', 'Zyntra.io', 'TruBridge Healthcare'], answer: 0, fact: 'May – August 2026, remote.' },

  // projects
  { q: 'What is Kapok?', options: ['An offline-first disaster-relief app', 'A chess engine', 'A receipt tracker', 'A RAG study tool'], answer: 0, fact: 'Flutter + Firebase + Mapbox, built with 15 contributors.' },
  { q: 'Who is the real-world client for Kapok?', options: ['RN Response Network', 'The Red Cross', 'FEMA', 'UMass Dining'], answer: 0, fact: 'An offline-first coordination app for field teams.' },
  { q: 'Which state-management architecture does Kapok use?', options: ['BLoC', 'Redux', 'MobX', 'Provider only'], answer: 0, fact: 'With Hive for offline storage and Firebase sync.' },
  { q: 'Dopamine Drop gamifies which platform?', options: ['Canvas LMS', 'Moodle', 'Blackboard', 'Google Classroom'], answer: 0, fact: 'XP, streaks and achievements synced with real assignments.' },
  { q: "By how much did Dopamine Drop's smart diff algorithm cut Convex function calls?", options: ['85%', '25%', '50%', '99%'], answer: 0, fact: 'With sub-10ms p95 latency.' },
  { q: 'How does StudyLens AI schedule flashcards?', options: ['SM-2 spaced repetition', 'Random shuffle', 'Leitner boxes', 'Alphabetically'], answer: 0, fact: 'Alongside an end-to-end RAG pipeline over uploaded course PDFs.' },
  { q: "What retrieval accuracy does StudyLens AI's RAG pipeline reach?", options: ['90%', '60%', '75%', '99.9%'], answer: 0, fact: 'Over uploaded course materials, with real-time streaming answers.' },
  { q: 'Which sentiment tool powers the WhatsApp Analyzer?', options: ['VADER', 'TextBlob', 'Flair', 'GPT-4'], answer: 0, fact: 'Python + Streamlit, with activity heatmaps and word clouds.' },
  { q: 'How many Monte Carlo simulations does the World Cup 2026 predictor run per run?', options: ['10K', '100', '1K', '1M'], answer: 0, fact: 'On top of XGBoost + ELO features.' },
  { q: 'Which past tournaments was the World Cup predictor backtested on?', options: ['2018 and 2022', '2010 and 2014', '2022 only', '1998 and 2002'], answer: 0, fact: 'Trained on 14,695 historical matches.' },
  { q: 'Which gradient-boosting library drives the World Cup predictor?', options: ['XGBoost', 'LightGBM', 'CatBoost', 'AdaBoost'], answer: 0, fact: 'Tuned with Optuna, served in Streamlit.' },
  { q: 'What runs Keepo’s background receipt processing?', options: ['Inngest', 'Celery', 'Sidekiq', 'cron on a VPS'], answer: 0, fact: 'Async jobs with real-time status tracking.' },
  { q: 'Keepo extracts receipts with dual LLM agents from…', options: ['OpenAI + Anthropic', 'Google + Meta', 'Mistral + Cohere', 'a single local model'], answer: 0, fact: 'An agentic PDF-extraction pipeline.' },

  // education, research, activities
  { q: 'Which student org is Kiran the treasurer of?', options: ['BUILD UMass', 'HackUMass', 'UMass ACM', 'UMass Robotics'], answer: 0, fact: 'A 70+ member org delivering pro-bono software to nonprofits and local businesses.' },
  { q: 'Roughly how many members does BUILD UMass have?', options: ['70+', '10', '300+', '1,000+'], answer: 0, fact: 'Kiran is both a software developer and treasurer.' },
  { q: 'Roughly how many students has Kiran helped as a teaching assistant?', options: ['300+', '30+', '100+', '1,000+'], answer: 0, fact: 'Across Python Programming, Computer Systems, Data Management and Software Engineering.' },
  { q: 'Which course is Kiran a TA for in Fall 2026?', options: ['Software Engineering', 'Operating Systems', 'Linear Algebra', 'Computer Networks'], answer: 0, fact: 'After Data Management, Computer Systems and Python Programming.' },
  { q: 'Which models did Kiran fine-tune at the UMass BioNLP Lab?', options: ['Clinical-T5, BioGPT & LLaMA', 'GPT-4 & Claude', 'Whisper & wav2vec', 'ResNet & ViT'], answer: 0, fact: 'With LoRA, on the MED-CALC-BENCH benchmark.' },
  { q: 'Which fine-tuning technique did Kiran use at the BioNLP Lab?', options: ['LoRA', 'RLHF', 'Full fine-tuning only', 'Knowledge distillation'], answer: 0, fact: 'On Clinical-T5, BioGPT and LLaMA.' },
  { q: 'What does the iCons program stand for?', options: ['Integrated Concentration in STEM', 'International Computing Society', 'Intro to Computer Science', 'Innovation Council'], answer: 0, fact: 'A competitive 20-credit STEM certificate at UMass Amherst.' },
  { q: 'What did Kiran’s iCons 3 project investigate?', options: ['Waste-heat recovery from CPUs', 'Microplastics in rivers', 'Solar panel efficiency', 'Traffic flow modeling'], answer: 0, fact: 'Direct-chip thermoelectric generators for data-center energy recovery.' },
  { q: 'What did Kiran’s iCons 2 project forecast?', options: ['Peak electricity use on campus', 'Dining hall demand', 'Course enrollment', 'Snowfall'], answer: 0, fact: 'ML models on real-time UMass campus energy data.' },
  { q: 'What was Kiran’s iCons 1 project about?', options: ['Wind energy', 'Water purification', 'Vaccine logistics', 'Urban farming'], answer: 0, fact: 'Sentiment analysis of rural perceptions (NLTK) plus a 3D-printed wind-powered storage prototype.' },
  { q: 'What does the RDCL lab, where Kiran does research, study?', options: ['Computational modeling of reasoning and decision making', 'Robotics control', 'Computer graphics', 'Network security'], answer: 0, fact: 'Kiran joined in September 2026.' },
  { q: 'What does CIIR at UMass focus on?', options: ['Intelligent information retrieval', 'Cybersecurity', 'Quantum computing', 'Human-computer interaction'], answer: 0, fact: 'Kiran started research there in September 2026.' },
  { q: 'When does Kiran graduate from UMass Amherst?', options: ['May 2027', 'May 2026', 'December 2026', 'May 2028'], answer: 0, fact: 'B.S. Computer Science (Honors), class of 2027.' },
];

// ── generated from lib/data ─────────────────────────────────────────────────

function slug(s: string) {
  return s.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '').slice(0, 60);
}

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

/** Correct answer + 3 distinct distractors (none equal to the answer), or null if there aren't enough. */
function mc(correct: string, pool: string[]): string[] | null {
  const distractors = shuffle([...new Set(pool)].filter(p => p !== correct)).slice(0, 3);
  return distractors.length === 3 ? [correct, ...distractors] : null;
}

function truncate(s: string, max = 130) {
  if (s.length <= max) return s;
  return `${s.slice(0, s.lastIndexOf(' ', max))}…`;
}

const pick = <T,>(arr: T[]) => arr[Math.floor(Math.random() * arr.length)];

// Entries whose details are still placeholders shouldn't feed detail questions.
const realExperience = experience.filter(e => e.bullets.some(b => b && b !== 'soon'));

function generated(): TriviaQuestion[] {
  const out: TriviaQuestion[] = [];
  const add = (id: string, q: string, options: string[] | null, fact: string) => {
    if (options) out.push({ id, q, options, answer: 0, fact });
  };

  const companies = experience.map(e => e.company);

  for (const e of experience) {
    add(`g:period:${e.id}`, `When did Kiran work at ${e.company}?`,
      mc(e.period, experience.map(x => x.period)),
      `${e.role} at ${e.company}${e.location ? `, ${e.location}` : ''}.`);
  }

  for (const e of realExperience) {
    e.bullets.forEach((b, i) => {
      add(`g:bullet:${e.id}:${i}`, `Which role is this from? “${truncate(b)}”`,
        mc(e.company, companies),
        `${e.role} at ${e.company}, ${e.period}.`);
    });

    const otherTags = realExperience.filter(x => x.id !== e.id).flatMap(x => x.tags).filter(t => !e.tags.includes(t));
    add(`g:tag:${e.id}`, `Which of these did Kiran use at ${e.company}?`,
      mc(pick(e.tags), otherTags),
      `${e.company} stack: ${e.tags.join(', ')}.`);
  }

  // Only roles that unambiguously identify one company (ignoring "Engineer"/"Engineering").
  const roleKey = (r: string) => r.toLowerCase().replace('engineering', 'engineer');
  for (const e of experience) {
    if (experience.filter(x => roleKey(x.role) === roleKey(e.role)).length > 1) continue;
    add(`g:role:${e.id}`, `Where was Kiran a ${e.role}?`,
      mc(e.company, companies),
      `${e.period}${e.location ? ` · ${e.location}` : ''}.`);
  }

  const projectNames = projects.map(p => p.name);
  for (const p of projects) {
    add(`g:oneliner:${p.id}`, `Which project is this? “${p.oneliner}”`,
      mc(p.name, projectNames), p.description);

    const otherTech = projects.filter(x => x.id !== p.id).flatMap(x => x.tech).filter(t => !p.tech.includes(t));
    add(`g:tech:${p.id}`, `Which of these is part of ${p.name}'s stack?`,
      mc(pick(p.tech), otherTech), `${p.name}: ${p.tech.join(', ')}.`);

    add(`g:status:${p.id}`, `What's the current status of ${p.name}?`,
      mc(p.status, ['Live', 'Pre-release', 'In Development', 'Archived']), p.oneliner);

    p.metrics.filter(m => /\d/.test(m)).forEach((m, i) => {
      add(`g:metric:${p.id}:${i}`, `Which project has this highlight: “${m}”?`,
        mc(p.name, projectNames), p.oneliner);
    });
  }

  const activities = education.flatMap(ed => ed.activities);
  const starts = activities.map(a => a.period.split(/\s[–-]\s/)[0].trim());
  activities.forEach((a, i) => {
    add(`g:activity:${slug(a.name)}`, `When did Kiran start ${a.role ? `as ${a.role} at ` : ''}${a.name}?`,
      mc(starts[i], starts), a.description ?? a.bullets?.[0] ?? a.period);
  });

  const groupLabel: Record<string, string> = {
    languages: 'languages', frameworks: 'frameworks', infra: 'infrastructure & databases', aiml: 'AI / ML',
  };
  for (const [group, items] of Object.entries(skills)) {
    for (const item of items) {
      add(`g:skill:${slug(item.name)}`, `On this site's tech stack, where is ${item.name} listed?`,
        mc(groupLabel[group] ?? group, Object.values(groupLabel)),
        `${groupLabel[group] ?? group}: ${items.map(i => i.name).join(', ')}.`);
    }
  }

  return out;
}

/** Every question: handwritten plus freshly generated (distractors vary per call). */
export function allQuestions(): TriviaQuestion[] {
  return [
    ...HANDWRITTEN.map(h => ({ ...h, id: `h:${slug(h.q)}` })),
    ...generated(),
  ];
}
