'use client';

// Paper theme colors — hardcoded so this view is always light/print-friendly
const P = {
  bg: '#f2ede4',
  border: '#c9b99a',
  text: '#282828',
  dim: '#7c6f64',
  pill: '#1a1a1a',
  pillText: '#f2ede4',
};

const EXPERIENCE = [
  {
    role: 'Software Developer',
    company: 'Alterea',
    period: 'Jan 2026 –',
    desc: 'AI-powered EdTech game platform · LangGraph + Claude Sonnet agents',
  },
  {
    role: 'Software Engineering Intern',
    company: 'LeeYuen Housewares',
    period: 'Jun–Aug 2025',
    desc: '82% forecast accuracy · −$20K storage · −15% overstock',
  },
  {
    role: 'Data Science Intern',
    company: 'TruBridge Healthcare',
    period: '2024–2025',
    desc: 'Scalable pipelines · production ML for patient analytics',
  },
  {
    role: 'Software Engineering Intern',
    company: 'Zyntra.io',
    period: 'Jul–Aug 2024',
    desc: 'Real-time messaging · 2K+ concurrent users · −60% auth errors',
  },
];

const STACK = 'Python · Java · TypeScript · React · Next.js · Spring Boot · Node · Postgres · MongoDB · AWS · Convex · LangGraph · PyTorch';

const SECTION_LABEL: React.CSSProperties = {
  fontSize: '10px',
  fontWeight: 600,
  letterSpacing: '0.12em',
  textTransform: 'uppercase',
  color: P.dim,
  marginBottom: '16px',
};

const DIVIDER: React.CSSProperties = {
  borderTop: `1px solid ${P.border}`,
  margin: '0',
};

interface Props {
  onToggle: () => void;
}

export default function RecruiterView({ onToggle }: Props) {
  return (
    <div
      style={{
        background: P.bg,
        color: P.text,
        minHeight: '100vh',
        fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Helvetica, Arial, sans-serif',
      }}
    >
      {/* Top bar */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '14px 48px',
          borderBottom: `1px solid ${P.border}`,
        }}
      >
        <span style={{ fontWeight: 700, fontSize: '14px' }}>Kiran BK</span>
        <button
          onClick={onToggle}
          style={{
            background: P.pill,
            color: P.pillText,
            border: 'none',
            borderRadius: '999px',
            padding: '8px 16px',
            fontSize: '13px',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            fontFamily: 'inherit',
            whiteSpace: 'nowrap',
          }}
        >
          <span style={{ color: '#4ade80', fontSize: '10px' }}>●</span>
          <span>Recruiter view</span>
          <span style={{ color: '#9ca3af' }}>· switch to terminal ⇄</span>
        </button>
      </div>

      {/* Hero */}
      <div
        style={{
          padding: '48px 48px 40px',
          borderBottom: `1px solid ${P.border}`,
          display: 'flex',
          alignItems: 'flex-start',
          gap: '32px',
        }}
      >
        {/* Headshot placeholder */}
        <div
          style={{
            width: 100,
            height: 100,
            borderRadius: '50%',
            background: '#d1cfc9',
            border: `1px solid ${P.border}`,
            flexShrink: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '10px',
            color: P.dim,
            fontWeight: 600,
            letterSpacing: '0.05em',
          }}
        >
          HEADSHOT
        </div>

        {/* Name + info */}
        <div style={{ flex: 1 }}>
          <h1 style={{ fontSize: '36px', fontWeight: 700, margin: '0 0 8px', lineHeight: 1.1 }}>
            Kiran BK
          </h1>
          <p style={{ margin: '0 0 4px', color: P.dim, fontSize: '15px' }}>
            Honors CS · UMass Amherst · GPA 3.9 · Class of 2027
          </p>
          <p style={{ margin: 0, fontSize: '15px' }}>
            Seeking{' '}
            <strong>SWE/AI Intern Fall &apos;26</strong>
            {' · '}
            <strong>Full-time SWE/AI &apos;27</strong>
          </p>
        </div>

        {/* Resume button */}
        <a
          href="/resume.pdf"
          target="_blank"
          rel="noopener noreferrer"
          style={{
            background: P.pill,
            color: P.pillText,
            textDecoration: 'none',
            borderRadius: '8px',
            padding: '12px 24px',
            fontSize: '15px',
            fontWeight: 600,
            whiteSpace: 'nowrap',
            flexShrink: 0,
            fontFamily: 'inherit',
          }}
        >
          Résumé ↗
        </a>
      </div>

      {/* Experience */}
      <div style={{ padding: '36px 48px 32px', borderBottom: `1px solid ${P.border}` }}>
        <div style={SECTION_LABEL}>Selected Experience</div>

        <div>
          {EXPERIENCE.map((e, i) => (
            <div key={e.company}>
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'baseline',
                  gap: '24px',
                  paddingTop: i === 0 ? 0 : '16px',
                  paddingBottom: '4px',
                }}
              >
                <span style={{ fontWeight: 600, fontSize: '15px' }}>
                  {e.role} · {e.company}
                </span>
                <span style={{ color: P.dim, fontSize: '13px', whiteSpace: 'nowrap', flexShrink: 0 }}>
                  {e.period}
                </span>
              </div>
              <p style={{ margin: '0 0 16px', color: P.dim, fontSize: '13px' }}>
                {e.desc}
              </p>
              {i < EXPERIENCE.length - 1 && <div style={DIVIDER} />}
            </div>
          ))}
        </div>
      </div>

      {/* Stack */}
      <div style={{ padding: '36px 48px' }}>
        <div style={SECTION_LABEL}>Stack</div>
        <p style={{ margin: 0, fontSize: '15px', color: P.text, lineHeight: 1.8 }}>
          {STACK}
        </p>
      </div>
    </div>
  );
}
