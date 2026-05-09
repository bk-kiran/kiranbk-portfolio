import { registry } from '@/lib/commandRegistry';
import { experience } from '@/lib/data';

const COLOR_MAP: Record<string, string> = {
  green: 'var(--t-green)',
  cyan: 'var(--t-cyan)',
  yellow: 'var(--t-yellow)',
  magenta: 'var(--t-magenta)',
  red: 'var(--t-red)',
};

registry.register({
  name: 'experience',
  aliases: ['exp'],
  description: 'list work history',
  usage: 'experience [--full]',
  handler(_args, flags) {
    const showFull = flags.full === true;
    const items = showFull ? experience : experience.slice(0, 3);

    return (
      <div className="space-y-5">
        {items.map(exp => (
          <div key={exp.id}>
            <div className="mb-1">
              <span style={{ color: 'var(--t-cyan)' }}>{exp.id}/</span>
              <span style={{ color: 'var(--t-text-dim)' }}> // {exp.period}</span>
            </div>
            <div className="mb-2">
              <span style={{ color: 'var(--t-text)', fontWeight: 600 }}>{exp.role}</span>
              <span style={{ color: 'var(--t-text-dim)' }}> @ {exp.company}</span>
            </div>

            {showFull && (
              <>
                <div className="space-y-1 mb-2">
                  {exp.bullets.map((bullet, i) => (
                    <div key={i} className="flex gap-2 text-xs">
                      <span style={{ color: 'var(--t-prompt)', flexShrink: 0 }}>{'>'}</span>
                      <span style={{ color: 'var(--t-text-dim)' }}>{bullet}</span>
                    </div>
                  ))}
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {exp.metrics.map((m, i) => (
                    <span
                      key={i}
                      className="text-xs px-1.5 py-0.5"
                      style={{
                        color: COLOR_MAP[m.color] ?? 'var(--t-text)',
                        border: `1px solid ${COLOR_MAP[m.color] ?? 'var(--t-border)'}`,
                        borderRadius: '3px',
                      }}
                    >
                      {m.label}
                    </span>
                  ))}
                </div>
              </>
            )}
          </div>
        ))}

        <div className="text-xs" style={{ color: 'var(--t-text-dim)' }}>
          {showFull
            ? '// showing all entries · run `experience --json` for raw'
            : `// ${experience.length} entries · run \`experience --full\` for complete view`}
        </div>
      </div>
    );
  },
});
