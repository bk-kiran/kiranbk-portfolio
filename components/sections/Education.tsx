'use client';

import { useState } from 'react';
import { education } from '@/lib/data/education';
import SectionHeader from '@/components/ui/SectionHeader';

function Chip({ label }: { label: string }) {
  return (
    <span style={{
      display: 'inline-block',
      padding: '3px 10px',
      borderRadius: 999,
      fontSize: 12,
      fontWeight: 500,
      background: 'var(--bg-secondary)',
      color: 'var(--text-dim)',
      border: '1px solid var(--border)',
    }}>
      {label}
    </span>
  );
}

type Project = NonNullable<(typeof education)[0]['activities'][0]['project']>[0];

function ExpandableProjects({ projects }: { projects: Project[] }) {
  const [open, setOpen] = useState<string | null>(null);

  return (
    <div style={{ marginTop: 16, display: 'flex', flexDirection: 'column', gap: 8 }}>
      {projects.map((proj) => {
        const isOpen = open === proj.name;
        return (
          <div
            key={proj.name}
            style={{
              borderRadius: 8,
              border: '1px solid var(--border)',
              background: 'var(--bg-secondary)',
              borderLeft: '3px solid var(--text-dim)',
              overflow: 'hidden',
            }}
          >
            <button
              onClick={() => setOpen(isOpen ? null : proj.name)}
              style={{
                width: '100%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '12px 16px',
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                gap: 12,
                textAlign: 'left',
              }}
            >
              <div style={{ flex: 1, minWidth: 0 }}>
                <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--text)', display: 'block' }}>
                  {proj.name}
                </span>
                {(proj.role || proj.period) && (
                  <span style={{ fontSize: 12, color: 'var(--text-dim)', fontStyle: 'italic' }}>
                    {[proj.role, proj.period].filter(Boolean).join(' · ')}
                  </span>
                )}
              </div>
              <svg
                width="14" height="14" viewBox="0 0 24 24"
                fill="none" stroke="currentColor" strokeWidth="2"
                strokeLinecap="round" strokeLinejoin="round"
                style={{
                  flexShrink: 0,
                  color: 'var(--text-dim)',
                  transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)',
                  transition: 'transform 200ms',
                }}
              >
                <polyline points="6 9 12 15 18 9" />
              </svg>
            </button>

            {isOpen && (
              <p style={{ fontSize: 13, color: 'var(--text-dim)', lineHeight: 1.75, padding: '0 16px 14px' }}>
                {proj.description}
              </p>
            )}
          </div>
        );
      })}
    </div>
  );
}

export default function Education() {
  return (
    <section>
      <SectionHeader title="Education" />

      {education.map((edu) => (
        <div key={edu.id} style={{ marginBottom: 48 }}>

          {/* Institution header */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 4, flexWrap: 'wrap', gap: 8 }}>
            <div>
              <h3 style={{ fontSize: 20, fontWeight: 700, marginBottom: 2 }}>{edu.institution}</h3>
              <p style={{ fontSize: 15, color: 'var(--text-dim)', fontWeight: 500 }}>{edu.degree}</p>
            </div>
            <div style={{ textAlign: 'right', flexShrink: 0 }}>
              <p style={{ fontSize: 13, color: 'var(--text-dim)' }}>{edu.period}</p>
              <p style={{ fontSize: 13, color: 'var(--text-dim)' }}>{edu.location}</p>
            </div>
          </div>

          {/* Coursework */}
          <div style={{ marginTop: 24, borderTop: '1px solid var(--border)', paddingTop: 20 }}>
            <p style={{ fontSize: 12, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--text-dim)', marginBottom: 12, fontWeight: 500 }}>
              Relevant Coursework
            </p>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
              {edu.coursework.map((course) => (
                <Chip key={course} label={course} />
              ))}
            </div>
          </div>

          {/* Activities */}
          {edu.activities.length > 0 && (
            <div style={{ marginTop: 24, borderTop: '1px solid var(--border)', paddingTop: 20 }}>
              <p style={{ fontSize: 12, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--text-dim)', marginBottom: 20, fontWeight: 500 }}>
                Activities
              </p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 28 }}>
                {edu.activities.map((act) => (
                  <div key={act.name}>
                    {/* Logo + content row */}
                    <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12 }}>

                      {/* Logo badge */}
                      {(act.logo || act.logoImg) && (
                        <div style={{
                          width: 40,
                          height: 40,
                          borderRadius: 8,
                          background: act.logoImg ? 'transparent' : (act.logoBg ?? 'var(--bg-secondary)'),
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontSize: 12,
                          fontWeight: 700,
                          color: act.logoColor ?? 'var(--text-dim)',
                          flexShrink: 0,
                          letterSpacing: '-0.02em',
                          overflow: 'hidden',
                        }}>
                          {act.logoImg ? (
                            <img
                              src={act.logoImg}
                              alt={act.name}
                              style={{ width: 40, height: 40, objectFit: 'contain', borderRadius: 8 }}
                            />
                          ) : act.logo}
                        </div>
                      )}

                      {/* Text content */}
                      <div style={{ flex: 1, minWidth: 0 }}>
                        {/* Name + period row */}
                        <div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: 4, marginBottom: 4 }}>
                          <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                            <span style={{ fontSize: 15, fontWeight: 600, color: 'var(--text)' }}>{act.name}</span>
                            {act.link && (
                              <a
                                href={act.link}
                                target="_blank"
                                rel="noopener noreferrer"
                                aria-label={`${act.name} website`}
                                style={{ color: 'var(--text-dim)', display: 'flex', alignItems: 'center', transition: 'color 150ms' }}
                                onMouseEnter={e => (e.currentTarget.style.color = 'var(--text)')}
                                onMouseLeave={e => (e.currentTarget.style.color = 'var(--text-dim)')}
                              >
                                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                  <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                                  <polyline points="15 3 21 3 21 9" />
                                  <line x1="10" y1="14" x2="21" y2="3" />
                                </svg>
                              </a>
                            )}
                          </span>
                          <span style={{ fontSize: 13, color: 'var(--text-dim)' }}>{act.period}</span>
                        </div>

                        {act.role && (
                          <p style={{ fontSize: 13, color: 'var(--text-dim)', marginBottom: 6 }}>{act.role}</p>
                        )}
                        {act.bullets && act.bullets.length > 0 ? (
                          <ul style={{ paddingLeft: 16, margin: 0, display: 'flex', flexDirection: 'column', gap: 4 }}>
                            {act.bullets.map((b, i) => (
                              <li key={i} style={{ fontSize: 14, color: 'var(--text-dim)', lineHeight: 1.7 }}>{b}</li>
                            ))}
                          </ul>
                        ) : act.description ? (
                          <p style={{ fontSize: 14, color: 'var(--text-dim)', lineHeight: 1.7 }}>{act.description}</p>
                        ) : null}

                        {act.courses && act.courses.length > 0 && (
                          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginTop: 10 }}>
                            {act.courses.map((c) => <Chip key={c} label={c} />)}
                          </div>
                        )}

                        {act.project && act.project.length > 0 && (
                          <ExpandableProjects projects={act.project} />
                        )}
                      </div>
                      {/* end text content */}

                    </div>
                    {/* end logo + content row */}
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>
      ))}
    </section>
  );
}
