import { registry } from '@/lib/commandRegistry';
import { projects } from '@/lib/data';

registry.register({
  name: 'projects',
  aliases: ['proj'],
  description: 'list builds',
  usage: 'projects [--featured|--all]',
  handler(_args, flags) {
    const showAll = flags.all === true;
    const items = showAll ? projects : projects.filter(p => p.featured);
    const total = projects.length;

    return (
      <div className="space-y-5">
        <div className="text-xs" style={{ color: 'var(--color-text-dim)' }}>
          {'// '}{items.length} of {total} shown
          {!showAll && ' · `projects --all` for full list'}
        </div>

        {items.map(proj => (
          <div key={proj.id}>
            <div className="mb-1">
              <span style={{ color: 'var(--color-text-dim)' }}>{'📁 '}</span>
              <span style={{ color: 'var(--color-cyan)', fontWeight: 600 }}>{proj.name}</span>
            </div>

            <p className="text-xs mb-2" style={{ color: 'var(--color-text)' }}>
              {proj.description}
            </p>

            <div className="flex flex-wrap gap-1.5 mb-2">
              {proj.tech.map(t => (
                <span
                  key={t}
                  className="text-xs px-1.5 py-0.5"
                  style={{
                    color: 'var(--color-text-dim)',
                    border: '1px solid var(--color-border)',
                    borderRadius: '3px',
                  }}
                >
                  {t}
                </span>
              ))}
            </div>

            {proj.metrics && (
              <div className="text-xs mb-1.5" style={{ color: 'var(--color-text-dim)' }}>
                {proj.metrics}
              </div>
            )}

            <div className="flex gap-4 text-xs">
              <a
                href={proj.github}
                target="_blank"
                rel="noopener noreferrer"
                style={{ color: 'var(--color-yellow)' }}
                className="hover:underline"
              >
                github ↗
              </a>
              {proj.demo && (
                <a
                  href={proj.demo}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ color: 'var(--color-yellow)' }}
                  className="hover:underline"
                >
                  demo ↗
                </a>
              )}
            </div>
          </div>
        ))}
      </div>
    );
  },
});
