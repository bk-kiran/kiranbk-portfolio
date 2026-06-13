export const personal = {
  name: "Kiran BK",
  school: "UMass Amherst",
  degree: "Honors CS",
  gpa: "3.8",
  classYear: "'27",
  seeking: ["SWE/AI internship · Fall 2026", "Full-time SWE/AI · 2027"],
  highlights: [
    { metric: "+82%", label: "forecast accuracy", source: "Lee Yuen" },
    { metric: "-$20K", label: "annual storage saved", source: "Lee Yuen" },
    { metric: "90%", label: "RAG retrieval accuracy", source: "StudyLensAI" },
  ],
};

export interface Project {
  id: string;
  name: string;
  featured: boolean;
  oneliner: string;
  description: string;
  tech: string[];
  hardest: string;
  metrics: string[];
  github: string;
  demo: string | null;
  status: string;
}

export const projects: Project[] = [
  {
    id: "dopamine-drop",
    name: "dopamine-drop/",
    featured: true,
    oneliner: "Gamified academic productivity platform syncing with Canvas LMS — students earn XP, level up, and maintain streaks by completing real assignments.",
    description: "Canvas LMS gamification layer with real-time sync, smart diff algorithm, achievements, streaks, and daily challenges.",
    tech: ["next.js", "convex", "clerk", "typescript", "tailwind", "upstash", "zod", "framer-motion"],
    hardest: "Designed a smart diff algorithm that reduced Convex function calls by 85% while improving perceived performance via optimistic UI updates — Canvas has no webhooks so everything must be polled.",
    metrics: [
      "85% reduction in Convex function calls via diff-based upserts",
      "Sub-10ms p95 latency on database queries via compound indexes",
      "Sub-100ms real-time data propagation via WebSocket subscriptions",
      "Zero-to-dashboard in <60 seconds from Canvas token input",
      "12+ achievements, 7 level tiers, daily challenges, streak shields",
    ],
    github: "https://github.com/bk-kiran/dopamine-drop",
    demo: "https://dopamine-drop.vercel.app",
    status: "Live",
  },
  {
    id: "studylens-ai",
    name: "studylens-ai/",
    featured: true,
    oneliner: "AI-powered study platform where students upload course PDFs and get a RAG-backed chat assistant, auto-generated flashcards, and custom practice exams.",
    description: "Full-stack EdTech platform with end-to-end RAG pipeline, SM-2 spaced repetition, and multi-step exam generation.",
    tech: ["next.js", "convex", "openai", "typescript", "tailwind", "pdf.js", "radix-ui", "resend"],
    hardest: "Built full RAG pipeline without a dedicated vector DB — client-side PDF chunking via PDF.js, 1536-dim embeddings in Convex's native vector index, top-15 chunk retrieval via cosine similarity, all within free-tier limits.",
    metrics: [
      "Top-15 chunk retrieval using 1536-dim vector embeddings",
      "SM-2 spaced repetition algorithm (same as Anki)",
      "Multi-step exam generation: 5–50 questions at variable difficulty",
      "Real-time streaming AI responses",
    ],
    github: "https://github.com/bk-kiran/StudyLensAI",
    demo: "https://study-lens-ai-coral.vercel.app",
    status: "Live",
  },
  {
    id: "kapok",
    name: "kapok/",
    featured: true,
    oneliner: "Flutter mobile app for coordinating volunteer disaster relief teams — offline-first task assignment, interactive maps, and team management.",
    description: "Offline-first disaster relief coordination app with BLoC architecture, Mapbox integration, and Firebase sync.",
    tech: ["flutter", "dart", "firebase", "mapbox", "hive", "bloc", "github-actions"],
    hardest: "Offline-first sync with conflict resolution — queued writes in Hive replay against Firestore in correct order on reconnect without stomping concurrent changes from other team members.",
    metrics: [
      "15 contributors across 4 semesters",
      "Real client handoff to RN Response Network (National Nurses United)",
      "Role-based access control across 3 tiers",
      "Multi-language support: English + Spanish",
      "App store submission in progress",
    ],
    github: "https://github.com/ShreyanshMisra/Kapok",
    demo: null,
    status: "Pre-release",
  },
  {
    id: "worldcup-predictor",
    name: "worldcup-2026-predictor/",
    featured: false,
    oneliner: "ML system predicting every World Cup 2026 match using ELO ratings, XGBoost, and 10,000 Monte Carlo tournament simulations.",
    description: "End-to-end ML pipeline with temporal feature engineering, Poisson regression, XGBoost, and Streamlit frontend.",
    tech: ["python", "xgboost", "scikit-learn", "pandas", "numpy", "scipy", "optuna", "streamlit", "poisson-regression"],
    hardest: "Temporal feature engineering without data leakage — rolling form stats computed using shift(1) before rolling so each match's features only use information available before that match.",
    metrics: [
      "Trained on 14,695 competitive matches (1993–2026)",
      "54–56% accuracy backtested on 2018 and 2022 World Cups",
      "10% Brier score improvement over naive baseline",
      "333 teams with ELO ratings computed from scratch across 49k matches",
      "10,000 full tournament simulations per run",
    ],
    github: "https://github.com/bk-kiran/worldcup-2026-predictor",
    demo: null,
    status: "In development — launching June 11 2026",
  },
  {
    id: "keepo",
    name: "keepo/",
    featured: false,
    oneliner: "AI-powered receipt tracker that extracts, categorizes, and organizes spending data from uploaded PDF receipts using dual LLM agents.",
    description: "Agentic PDF extraction pipeline with dual-model AI (OpenAI + Claude), async background jobs via Inngest, and real-time status tracking.",
    tech: ["next.js", "convex", "clerk", "typescript", "inngest", "openai", "anthropic", "tailwind", "radix-ui"],
    hardest: "Building a reliable agentic extraction pipeline across receipts with wildly inconsistent layouts — dual LLM agents (OpenAI + Claude) run as async Inngest background jobs with structured field extraction and graceful failure handling.",
    metrics: [
      "Dual-LLM extraction agents (OpenAI + Anthropic Claude)",
      "Async background processing via Inngest",
      "Real-time status tracking: pending → processed",
      "Smart search across merchant, date, amount, category",
    ],
    github: "https://github.com/bk-kiran/Keepo",
    demo: null,
    status: "In development",
  },
  {
    id: "whatsapp-analyzer",
    name: "whatsapp-chat-analyser/",
    featured: false,
    oneliner: "Upload a WhatsApp group chat export and get instant visual analytics — sentiment scores, activity heatmaps, word clouds, and emoji breakdowns.",
    description: "Python + Streamlit analytics dashboard for WhatsApp exports with VADER sentiment analysis and matplotlib visualizations.",
    tech: ["python", "streamlit", "pandas", "nltk", "vader", "matplotlib", "seaborn", "wordcloud"],
    hardest: "Parsing and normalizing raw WhatsApp .txt exports with inconsistent locale-dependent formatting — inconsistent date formats, system messages, media placeholders, varying 12hr/24hr timestamps.",
    metrics: [
      "Sentiment ranking: top 3 nicest vs bottom 3 users by VADER score",
      "Visualizations: yearly timeline, daily/monthly charts, heatmap, word cloud",
      "Handles group_notification system messages and media placeholders",
    ],
    github: "https://github.com/bk-kiran/whatsappchatanalyser",
    demo: "https://whatsappchatanalyser.streamlit.app",
    status: "Live",
  },
];

export interface ExperienceEntry {
  id: string;
  company: string;
  role: string;
  period: string;
  bullets: string[];
  metrics: { label: string; color: string }[];
  tech: string[];
  link: string | null;
}

export const experience: ExperienceEntry[] = [
  {
    id: "alterea",
    company: "Alterea",
    role: "Software Developer (Part-time)",
    period: "Jan 2026 – Present",
    bullets: [
      "Building Agents of Influence — an AI-powered educational game platform",
      "Redesigned the Analysis modal UI, improving data visualization clarity for game session insights",
      "Conducted QA testing for Arcade Mode Conversation missions, identifying and documenting bugs across agent dialogue flows",
      "Collaborating on agentic pipeline architecture for multi-turn educational conversations",
    ],
    metrics: [
      { label: "LangGraph", color: "green" },
      { label: "Claude Sonnet", color: "cyan" },
      { label: "EdTech", color: "magenta" },
    ],
    tech: ["langgraph", "claude", "ai", "edtech", "typescript"],
    link: null,
  },
  {
    id: "lee-yuen",
    company: "LeeYuen Housewares",
    role: "Software Engineering Intern",
    period: "Jun 2025 – Aug 2025",
    bullets: [
      "Shipped demand forecasting pipeline with Python, scikit-learn, AWS — 82% SKU prediction accuracy",
      "Engineered React + Spring Boot microservice architecture, reducing quotation turnaround by 30%",
      "Deployed Dockerized Node.js microservices benchmarking 10K+ SKUs, cutting scraping runtime by 40%",
      "Scaled systems with CI/CD pipelines for 5K+ daily users, improving uptime from 95% to 99%",
    ],
    metrics: [
      { label: "+82% accuracy", color: "green" },
      { label: "-$20K/yr storage", color: "green" },
      { label: "-15% overstock", color: "cyan" },
    ],
    tech: ["python", "scikit-learn", "aws", "react", "spring-boot", "docker", "node", "ml", "forecasting"],
    link: null,
  },
  {
    id: "trubridge",
    company: "TruBridge Healthcare",
    role: "Data Science Intern",
    period: "Dec 2024 – Feb 2025",
    bullets: [
      "Multivariate analysis on 50K+ healthcare records via pandas, NumPy, SQLAlchemy",
      "Modeled hospital readmission rates with logistic regression + OLS, identifying high-impact predictors (p ≤ 0.01)",
      "Owned end-to-end ETL on AWS Lambda + S3, reducing preprocessing runtime by 35%",
    ],
    metrics: [
      { label: "50K+ records", color: "green" },
      { label: "-35% runtime", color: "cyan" },
    ],
    tech: ["python", "pandas", "numpy", "aws", "sql", "etl", "ml", "data-science", "healthcare"],
    link: null,
  },
  {
    id: "zyntra",
    company: "Zyntra.io",
    role: "Software Engineering Intern",
    period: "Jul 2024 – Aug 2024",
    bullets: [
      "Launched real-time distributed messaging with React, Node.js, MongoDB, Socket.IO for 2K+ concurrent users",
      "Integrated REST + GraphQL APIs, reducing render failures and API issues by 35%",
      "Implemented JWT auth with token refresh, cutting auth-related errors by 60%",
    ],
    metrics: [
      { label: "2K+ concurrent users", color: "green" },
      { label: "-60% auth errors", color: "cyan" },
    ],
    tech: ["react", "node", "mongodb", "socket.io", "graphql", "rest", "jwt", "real-time", "distributed"],
    link: null,
  },
  {
    id: "build-umass",
    company: "BUILD UMass",
    role: "Software Developer + Treasurer",
    period: "Sep 2025 – Present",
    bullets: [
      "One of 70+ member student-run org delivering pro-bono software to nonprofits and local businesses",
      "Leading client-facing software projects as Software Developer — full-stack builds from scoping to delivery",
      "Managing org finances as Treasurer — budgeting, reimbursements, and financial planning for 70+ member org",
      "Coordinating General Body Meetings, new member onboarding, and cross-team collaboration",
    ],
    metrics: [
      { label: "70+ members", color: "green" },
      { label: "Pro-bono SWE", color: "cyan" },
      { label: "VP level", color: "magenta" },
    ],
    tech: ["leadership", "full-stack", "nonprofit", "agile", "client-projects", "react", "typescript"],
    link: "https://www.buildumass.com/",
  },
];

export const skills = {
  languages: ["Python", "Java", "TypeScript", "JavaScript", "C", "C++", "SQL", "Dart"],
  frameworks: ["React", "Next.js", "Spring Boot", "Node.js", "Express", "Flutter", "FastAPI", "Angular"],
  infra: ["AWS", "Docker", "Kubernetes", "Firebase", "Supabase", "PostgreSQL", "MongoDB", "Convex"],
  aiml: ["PyTorch", "TensorFlow", "scikit-learn", "LangGraph", "RAG", "Voyage AI", "Claude API", "HuggingFace"],
};

export const contact = {
  email: "kiranbk1704@gmail.com",
  github: "https://github.com/bk-kiran",
  linkedin: "https://linkedin.com/in/bk-kiran",
  resume: "/resume.pdf",
  site: "https://kiranbk.com",
};
