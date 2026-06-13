'use client';

import { projects } from '@/lib/data/projects';
import SectionHeader from '@/components/ui/SectionHeader';

const STATUS_COLORS: Record<string, { bg: string; color: string }> = {
  Live:           { bg: '#dcfce7', color: '#15803d' },
  'Pre-release':  { bg: '#dbeafe', color: '#1d4ed8' },
  'In Development': { bg: '#fef3c7', color: '#b45309' },
};

function StatusBadge({ status }: { status: string }) {
  const { bg, color } = STATUS_COLORS[status] ?? { bg: 'var(--bg-secondary)', color: 'var(--text-dim)' };
  return (
    <span style={{
      padding: '2px 9px',
      borderRadius: 999,
      fontSize: 11,
      fontWeight: 600,
      background: bg,
      color,
      letterSpacing: '0.02em',
      flexShrink: 0,
    }}>
      {status}
    </span>
  );
}

function TechChip({ label }: { label: string }) {
  return (
    <span style={{
      padding: '2px 9px',
      borderRadius: 999,
      fontSize: 11,
      fontWeight: 500,
      background: 'var(--bg-secondary)',
      color: 'var(--text-dim)',
      border: '1px solid var(--border)',
    }}>
      {label}
    </span>
  );
}

function ExternalIcon() {
  return (
    <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
      <polyline points="15 3 21 3 21 9" />
      <line x1="10" y1="14" x2="21" y2="3" />
    </svg>
  );
}

function GitHubIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" />
    </svg>
  );
}

export default function Projects() {
  const featured = projects.filter((p) => p.featured);
  const others   = projects.filter((p) => !p.featured);

  return (
    <section>
      <SectionHeader title="Projects" />

      {/* Featured */}
      <div style={{ display: 'grid', gap: 16, marginBottom: 32 }}>
        {featured.map((project) => (
          <div
            key={project.id}
            style={{
              padding: '24px 28px',
              borderRadius: 10,
              border: '1px solid var(--border)',
              background: 'var(--bg)',
              transition: 'background 150ms, border-color 150ms',
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLDivElement).style.background = 'var(--bg-secondary)';
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLDivElement).style.background = 'var(--bg)';
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10, gap: 12 }}>
              <h3 style={{ fontSize: 17, fontWeight: 700, letterSpacing: '-0.01em' }}>{project.name}</h3>
              <StatusBadge status={project.status} />
            </div>

            <p style={{ fontSize: 14, color: 'var(--text-dim)', lineHeight: 1.65, marginBottom: 16 }}>
              {project.oneliner}
            </p>

            {project.metrics && project.metrics.length > 0 && (
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 14 }}>
                {project.metrics.map((m) => (
                  <span key={m} style={{
                    fontSize: 11,
                    color: 'var(--text-dim)',
                    border: '1px solid var(--border)',
                    borderRadius: 4,
                    padding: '2px 8px',
                    fontFamily: "'Courier New', monospace",
                    letterSpacing: '0.02em',
                  }}>
                    {m}
                  </span>
                ))}
              </div>
            )}

            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 18 }}>
              {project.tech.map((t) => <TechChip key={t} label={t} />)}
            </div>

            <div style={{ display: 'flex', gap: 16 }}>
              <a
                href={project.github}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: 'flex', alignItems: 'center', gap: 5,
                  fontSize: 12, color: 'var(--text-dim)',
                  textDecoration: 'none', transition: 'color 150ms',
                }}
                onMouseEnter={(e) => { (e.currentTarget as HTMLAnchorElement).style.color = 'var(--text)'; }}
                onMouseLeave={(e) => { (e.currentTarget as HTMLAnchorElement).style.color = 'var(--text-dim)'; }}
              >
                <GitHubIcon /> GitHub
              </a>
              {project.demo && (
                <a
                  href={project.demo}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    display: 'flex', alignItems: 'center', gap: 5,
                    fontSize: 12, color: 'var(--text-dim)',
                    textDecoration: 'none', transition: 'color 150ms',
                  }}
                  onMouseEnter={(e) => { (e.currentTarget as HTMLAnchorElement).style.color = 'var(--text)'; }}
                  onMouseLeave={(e) => { (e.currentTarget as HTMLAnchorElement).style.color = 'var(--text-dim)'; }}
                >
                  <ExternalIcon /> Live demo
                </a>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Others */}
      {others.length > 0 && (
        <>
          <p style={{ fontSize: 11, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--text-dim)', fontWeight: 500, marginBottom: 14 }}>
            More
          </p>
          <div style={{ display: 'grid', gap: 10 }}>
            {others.map((project) => (
              <div
                key={project.id}
                style={{
                  padding: '16px 20px',
                  borderRadius: 8,
                  border: '1px solid var(--border)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: 16,
                  transition: 'background 150ms',
                  flexWrap: 'wrap',
                }}
                onMouseEnter={(e) => { (e.currentTarget as HTMLDivElement).style.background = 'var(--bg-secondary)'; }}
                onMouseLeave={(e) => { (e.currentTarget as HTMLDivElement).style.background = 'transparent'; }}
              >
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 4 }}>
                    <span style={{ fontSize: 15, fontWeight: 600 }}>{project.name}</span>
                    <StatusBadge status={project.status} />
                  </div>
                  <p style={{ fontSize: 13, color: 'var(--text-dim)', lineHeight: 1.5 }}>{project.oneliner}</p>
                </div>
                <div style={{ display: 'flex', gap: 12, flexShrink: 0 }}>
                  <a
                    href={project.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{ color: 'var(--text-dim)', transition: 'color 150ms', display: 'flex', alignItems: 'center' }}
                    onMouseEnter={(e) => { (e.currentTarget as HTMLAnchorElement).style.color = 'var(--text)'; }}
                    onMouseLeave={(e) => { (e.currentTarget as HTMLAnchorElement).style.color = 'var(--text-dim)'; }}
                    aria-label={`${project.name} GitHub`}
                  >
                    <GitHubIcon />
                  </a>
                  {project.demo && (
                    <a
                      href={project.demo}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{ color: 'var(--text-dim)', transition: 'color 150ms', display: 'flex', alignItems: 'center' }}
                      onMouseEnter={(e) => { (e.currentTarget as HTMLAnchorElement).style.color = 'var(--text)'; }}
                      onMouseLeave={(e) => { (e.currentTarget as HTMLAnchorElement).style.color = 'var(--text-dim)'; }}
                      aria-label={`${project.name} demo`}
                    >
                      <ExternalIcon />
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </section>
  );
}
