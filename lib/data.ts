export const personal = {
  name: "Kiran BK",
  school: "UMass Amherst",
  degree: "Honors CS",
  gpa: "3.9",
  classYear: "'27",
  seeking: ["SWE/AI internship · Fall 2026", "Full-time SWE/AI · 2027"],
  highlights: [
    { metric: "+82%", label: "forecast accuracy", source: "Lee Yuen" },
    { metric: "-$20K", label: "annual storage saved", source: "Lee Yuen" },
    { metric: "90%", label: "RAG retrieval accuracy", source: "StudyLensAI" },
  ],
};

export const experience = [
  {
    id: "alterea",
    company: "Alterea",
    role: "Software Developer (Part-time)",
    period: "Jan 2026 – Present",
    bullets: [
      "Building Agents of Influence — an AI-powered educational game platform using LangGraph supervisor pattern with Claude Sonnet agents",
      "Redesigned the Analysis modal UI, improving data visualization clarity for game session insights",
      "Conducted QA testing for Arcade Mode Conversation missions, identifying and documenting bugs across agent dialogue flows",
      "Collaborating on agentic pipeline architecture for multi-turn educational conversations",
    ],
    metrics: [
      { label: "LangGraph", color: "green" },
      { label: "Claude Sonnet", color: "cyan" },
      { label: "EdTech", color: "magenta" },
    ],
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
  },
];

export const projects = [
  {
    id: "dopamine-drop",
    name: "dopamine-drop/",
    featured: true,
    description: "Canvas LMS gamification layer — points, streaks, achievements, daily challenges for students",
    tech: ["next.js", "convex", "clerk", "typescript"],
    github: "https://github.com/bk-kiran/dopamine-drop",
    demo: "https://dopamine-drop.vercel.app",
    metrics: "Production deployment · Clerk auth · Convex backend",
  },
  {
    id: "studylens-ai",
    name: "studylens-ai/",
    featured: true,
    description: "Full-stack EdTech platform — query PDFs via AI chatbot, flashcards with spaced repetition, personalized exams via agentic workflows",
    tech: ["next.js", "convex", "openai", "rag", "bm25"],
    github: "https://github.com/bk-kiran/studylens-ai",
    demo: null as string | null,
    metrics: "90% retrieval accuracy · -45% PDF processing time",
  },
  {
    id: "kapok",
    name: "kapok/",
    featured: true,
    description: "Flutter disaster relief app — offline-first, 200+ volunteers across 10+ zones, MapBox task assignment, 1K+ daily field reports",
    tech: ["flutter", "dart", "firebase", "mapbox"],
    github: "https://github.com/bk-kiran/kapok",
    demo: null as string | null,
    metrics: "3x data submission rate · -40% sync time",
  },
  {
    id: "sentinel-cli",
    name: "sentinel-cli/",
    featured: false,
    description: "Agentic pre-commit code guardian — LangGraph + Tree-sitter + Claude Sonnet, multi-hop blast radius analysis, GitHub Actions integration, SQLite call graph cache",
    tech: ["python", "langgraph", "tree-sitter", "claude"],
    github: "https://github.com/bk-kiran/sentinel-cli",
    demo: null as string | null,
    metrics: undefined as string | undefined,
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
