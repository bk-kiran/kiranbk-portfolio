import { registry } from '@/lib/commandRegistry';
import { skills } from '@/lib/data';

const SECTIONS: [string, string[]][] = [
  ['Languages', skills.languages],
  ['Frameworks', skills.frameworks],
  ['Infra / Cloud', skills.infra],
  ['AI / ML', skills.aiml],
];

registry.register({
  name: 'skills',
  description: 'languages, frameworks, infra, AI/ML',
  handler() {
    return (
      <div className="space-y-4">
        {SECTIONS.map(([label, items]) => (
          <div key={label}>
            <div
              className="text-[10px] font-semibold tracking-widest uppercase mb-2 select-none"
              style={{ color: 'var(--t-text-dim)' }}
            >
              {label}
            </div>
            <div className="flex flex-wrap gap-1.5">
              {items.map(skill => (
                <span
                  key={skill}
                  className="text-xs px-2 py-0.5"
                  style={{
                    color: 'var(--t-text)',
                    border: '1px solid var(--t-border)',
                    borderRadius: '3px',
                  }}
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
    );
  },
});
