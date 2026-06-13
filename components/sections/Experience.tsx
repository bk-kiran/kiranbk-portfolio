'use client';

import { experience } from '@/lib/data/experience';
import { skills } from '@/lib/data/skills';
import SectionHeader from '@/components/ui/SectionHeader';

const TECH_LOGOS: Record<string, string> = {
  'Python': '/python.png',
  'JavaScript': '/js.png',
  'Java': '/java.png',
  'C': '/C_Logo.png',
  'CSS': '/css.png',
  'HTML': '/html.png',
  'React': '/react.png',
  'Next.js': '/nextjs.svg',
  'Node.js': '/nodejs.webp',
  'FastAPI': '/fastapi.svg',
  'Tailwind': '/tailwind.png',
  'AWS': '/aws.png',
  'Azure': '/azure.png',
  'MongoDB': '/mongodb.png',
  'PostgreSQL': '/psql.png',
  'SQL': '/sql.png',
  'Supabase': '/supabase.png',
  'Git': '/git.png',
  'PyTorch': '/pytorch.png',
  'TensorFlow': '/tf.png',
  'Hugging Face': '/hf.png',
  'HuggingFace': '/hf.png',
  'Keras': '/keras.png',
  'TypeScript': '/ts.png',
  'Dart': '/dart.png',
  'Spring Boot': '/spring.png',
  "Flutter": '/flutter.png',
  "Express": '/express.png',
  "Docker": '/docker.png',
  "Firebase": '/firebase.png',
  "Convex": '/convex.webp',
  "Vercel": '/vercel.webp',
  "scikit-learn": '/sl.png',
  "LangGraph": '/lg.png',
  "Claude": '/claude.png'


};

const CHIP_COLORS: Record<string, string> = {
  'Python': '#3776AB',
  'TypeScript': '#3178C6',
  'JavaScript': '#b8920f',
  'Java': '#c87400',
  'Dart': '#0175C2',
  'C': '#00599C',
  'SQL': '#336791',
  'React': '#0891b2',
  'Next.js': '#555',
  'Spring Boot': '#6DB33F',
  'Node.js': '#339933',
  'Flutter': '#0553B1',
  'FastAPI': '#009688',
  'Express': '#555',
  'AWS': '#c97700',
  'Docker': '#2496ED',
  'Firebase': '#dd7700',
  'Supabase': '#259f6e',
  'PostgreSQL': '#4169E1',
  'MongoDB': '#47A248',
  'Convex': '#e05c1a',
  'Vercel': '#555',
  'Tailwind': '#06B6D4',
  'Clerk': '#6C47FF',
  'Upstash': '#008f6b',
  'PyTorch': '#EE4C2C',
  'TensorFlow': '#c95a00',
  'scikit-learn': '#d97706',
  'LangGraph': '#7c3aed',
  'Claude Sonnet': '#7c3aed',
  'Claude API': '#7c3aed',
  'HuggingFace': '#c97706',
  'pandas': '#6b21a8',
  'NumPy': '#4DABCF',
  'SQLAlchemy': '#6b7280',
  'ETL': '#6b7280',
  'Socket.IO': '#444',
  'GraphQL': '#d4007a',
  'JWT': '#d63384',
  'BLoC': '#1565C0',
  'Hive': '#cc8800',
  'Mapbox': '#4264FB',
  'Inngest': '#6366f1',
  'Anthropic': '#7c3aed',
  'EdTech': '#10b981',
  'Leadership': '#6b7280',
  'Full-Stack': '#0369a1',
  'Nonprofit': '#15803d',
  'PDF.js': '#b91c1c',
  'NLTK': '#1F77B4',
  'VADER': '#1F77B4',
  'matplotlib': '#11557C',
  'XGBoost': '#EC5300',
  'Streamlit': '#FF4B4B',
  'Optuna': '#6366f1',
};

function chipColor(tech: string) {
  return CHIP_COLORS[tech] ?? '#6b7280';
}

function TechChip({ tech, size = 'sm' }: { tech: string; size?: 'sm' | 'md' }) {
  const color = chipColor(tech);
  return (
    <span style={{
      display: 'inline-block',
      padding: size === 'md' ? '3px 10px' : '2px 7px',
      borderRadius: 4,
      fontSize: size === 'md' ? 12 : 11,
      fontWeight: 500,
      background: color + '18',
      color,
      border: `1px solid ${color}38`,
      lineHeight: '20px',
      whiteSpace: 'nowrap',
    }}>
      {tech}
    </span>
  );
}

type ExperienceItem = typeof experience[0];

function ExperienceCard({ item }: { item: ExperienceItem }) {
  return (
    <div style={{
      padding: '24px 0',
      borderBottom: '1px solid var(--border)',
    }}>
      {/* Header row */}
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12, marginBottom: 10 }}>
        {/* Logo badge */}
        <div style={{
          width: 40,
          height: 40,
          borderRadius: 8,
          background: item.logoImg ? 'transparent' : item.logoBg,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: 12,
          fontWeight: 700,
          color: item.logoColor,
          flexShrink: 0,
          letterSpacing: '-0.02em',
          overflow: 'hidden',
        }}>
          {item.logoImg ? (
            <img
              src={item.logoImg}
              alt={item.company}
              style={{ width: 40, height: 40, objectFit: 'contain', borderRadius: 8 }}
            />
          ) : item.logo}
        </div>

        <div style={{ flex: 1, minWidth: 0 }}>
          {/* Company name + period */}
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'baseline',
            flexWrap: 'wrap',
            gap: '0 12px',
          }}>
            <span style={{ fontWeight: 600, fontSize: 15, color: 'var(--text)' }}>
              {item.link ? (
                <a
                  href={item.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ color: 'var(--text)', textDecoration: 'none' }}
                  onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--accent)')}
                  onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--text)')}
                >
                  {item.company} ↗
                </a>
              ) : item.company}
            </span>
            <span style={{
              fontSize: 12,
              color: 'var(--text-dim)',
              fontFamily: 'monospace',
              flexShrink: 0,
            }}>
              {item.period}
            </span>
          </div>
          {/* Role + location */}
          <div style={{ fontSize: 13, color: 'var(--text-dim)', marginTop: 2 }}>
            {item.role} · {item.location}
          </div>
        </div>
      </div>

      {/* Bullets */}
      <ul style={{ paddingLeft: 18, marginBottom: 12 }}>
        {item.bullets.map((bullet, i) => (
          <li key={i} style={{
            fontSize: 13,
            color: 'var(--text)',
            lineHeight: 1.65,
            marginBottom: 3,
          }}>
            {bullet}
          </li>
        ))}
      </ul>

      {/* Metrics (if any) */}
      {'metrics' in item && item.metrics && (
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 10 }}>
          {item.metrics.map((m: string) => (
            <span key={m} style={{
              fontSize: 11,
              fontWeight: 600,
              color: 'var(--accent)',
              background: 'var(--accent)12',
              border: '1px solid var(--accent)30',
              borderRadius: 4,
              padding: '1px 7px',
            }}>
              {m}
            </span>
          ))}
        </div>
      )}

      {/* Tech chips / logos */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 5 }}>
        {item.tags.map((tag) => {
          const logo = TECH_LOGOS[tag];
          return logo ? (
            <span key={tag} title={tag} style={{
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: 28,
              height: 28,
              borderRadius: 6,
              border: '1px solid var(--border)',
              background: 'var(--bg-secondary)',
              padding: 4,
            }}>
              <img src={logo} alt={tag} style={{ width: 18, height: 18, objectFit: 'contain' }} />
            </span>
          ) : (
            <TechChip key={tag} tech={tag} />
          );
        })}
      </div>
    </div>
  );
}

const CATEGORY_LABELS: Record<string, string> = {
  languages: 'Languages',
  frameworks: 'Frameworks',
  infra: 'Infrastructure',
  aiml: 'AI / ML',
};

export default function Experience() {
  return (
    <section>
      <SectionHeader title="Experience" />

      {/* Experience cards */}
      <div>
        {experience.map((item) => (
          <ExperienceCard key={item.id} item={item} />
        ))}
      </div>

      {/* Tech Stack */}
      <div style={{ marginTop: 52 }}>
        <div style={{
          fontSize: 12,
          fontWeight: 500,
          color: 'var(--text-dim)',
          textTransform: 'uppercase',
          letterSpacing: '0.1em',
          marginBottom: 24,
        }}>
          Tech Stack
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {(Object.entries(skills) as [keyof typeof skills, typeof skills[keyof typeof skills]][]).map(([cat, items]) => (
            <div key={cat}>
              <div style={{
                fontSize: 10,
                fontWeight: 700,
                color: 'var(--text-dim)',
                textTransform: 'uppercase',
                letterSpacing: '0.1em',
                marginBottom: 8,
              }}>
                {CATEGORY_LABELS[cat] ?? cat}
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                {items.map((skill) => {
                  const logo = TECH_LOGOS[skill.name];
                  return logo ? (
                    <div key={skill.name} title={skill.name} style={{
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      gap: 5,
                      padding: '8px 10px',
                      borderRadius: 8,
                      border: '1px solid var(--border)',
                      background: 'var(--bg-secondary)',
                      minWidth: 52,
                    }}>
                      <img src={logo} alt={skill.name} style={{ width: 28, height: 28, objectFit: 'contain' }} />
                      <span style={{ fontSize: 10, color: 'var(--text-dim)', fontWeight: 500, textAlign: 'center', lineHeight: 1.2 }}>
                        {skill.name}
                      </span>
                    </div>
                  ) : (
                    <TechChip key={skill.name} tech={skill.name} size="md" />
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
