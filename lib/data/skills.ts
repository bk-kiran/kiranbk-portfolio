export const skills = {
  languages: [
    { name: "Python", icon: "python" },
    { name: "TypeScript", icon: "typescript" },
    { name: "JavaScript", icon: "javascript" },
    { name: "Java", icon: "java" },
    { name: "Dart", icon: "dart" },
    { name: "C", icon: "c" },
    { name: "SQL", icon: "sql" },
  ],
  frameworks: [
    { name: "React", icon: "react" },
    { name: "Next.js", icon: "nextjs" },
    { name: "Spring Boot", icon: "springboot" },
    { name: "Node.js", icon: "nodejs" },
    { name: "Flutter", icon: "flutter" },
    { name: "FastAPI", icon: "fastapi" },
    { name: "Express", icon: "express" },
  ],
  infra: [
    { name: "AWS", icon: "aws" },
    { name: "Docker", icon: "docker" },
    { name: "Firebase", icon: "firebase" },
    { name: "Supabase", icon: "supabase" },
    { name: "PostgreSQL", icon: "postgresql" },
    { name: "MongoDB", icon: "mongodb" },
    { name: "Convex", icon: "convex" },
    { name: "Vercel", icon: "vercel" },
  ],
  aiml: [
    { name: "PyTorch", icon: "pytorch" },
    { name: "TensorFlow", icon: "tensorflow" },
    { name: "scikit-learn", icon: "scikitlearn" },
    { name: "LangGraph", icon: "langgraph" },
    { name: "Claude", icon: "anthropic" },
    { name: "HuggingFace", icon: "huggingface" },
  ],
}

// Name -> logo file in /public. Covers the categories above plus technologies
// that only show up as experience/project tags; anything missing here falls
// back to a colored text chip.
export const techLogos: Record<string, string> = {
  // Languages
  "Python": "/python.png",
  "TypeScript": "/ts.png",
  "JavaScript": "/js.png",
  "Java": "/java.png",
  "Dart": "/dart.png",
  "C": "/C_Logo.png",
  "SQL": "/sql.png",
  "HTML": "/html.png",
  "CSS": "/css.png",

  // Frameworks
  "React": "/react.png",
  "Next.js": "/nextjs.svg",
  "Spring Boot": "/spring.png",
  "Node.js": "/nodejs.webp",
  "Flutter": "/flutter.png",
  "FastAPI": "/fastapi.svg",
  "Express": "/express.png",
  "Tailwind": "/tailwind.png",

  // Infrastructure
  "AWS": "/aws.png",
  "Azure": "/azure.png",
  "Docker": "/docker.png",
  "Firebase": "/firebase.png",
  "Supabase": "/supabase.png",
  "PostgreSQL": "/psql.png",
  "MongoDB": "/mongodb.png",
  "Convex": "/convex.webp",
  "Vercel": "/vercel.webp",
  "Git": "/git.png",

  // AI / ML
  "PyTorch": "/pytorch.png",
  "TensorFlow": "/tf.png",
  "Keras": "/keras.png",
  "scikit-learn": "/sl.png",
  "LangGraph": "/lg.png",
  "Claude": "/claude.png",
  "HuggingFace": "/hf.png",
  "Hugging Face": "/hf.png",

  // Tag-only technologies (not listed in the Tech Stack section)
  "GraphQL": "/graphql.webp",
  "Socket.IO": "/socket.svg",
  "Socket.io": "/socket.svg",
  "JWT": "/jwt.jpeg",
  "pandas": "/pandas.svg",
  "Pandas": "/pandas.svg",
  "NumPy": "/numpy.svg",
  "Claude Sonnet": "/claude.png",
  "Claude API": "/claude.png",
  "Anthropic": "/claude.png",
}
