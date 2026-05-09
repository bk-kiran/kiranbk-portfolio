import { registry } from '@/lib/commandRegistry';
import { contact } from '@/lib/data';

const LINKS: [string, string, string][] = [
  ['email',    `mailto:${contact.email}`, contact.email],
  ['github',   contact.github,            contact.github.replace('https://', '')],
  ['linkedin', contact.linkedin,          contact.linkedin.replace('https://', '')],
  ['resume',   contact.resume,            contact.resume],
];

registry.register({
  name: 'contact',
  description: 'email · github · linkedin · resume',
  handler() {
    return (
      <div className="space-y-3">
        <div className="space-y-2">
          {LINKS.map(([label, href, display]) => (
            <div key={label} className="flex items-baseline gap-3 text-xs">
              <span
                className="select-none"
                style={{
                  color: 'var(--color-text-dim)',
                  minWidth: '72px',
                  display: 'inline-block',
                }}
              >
                {label}
              </span>
              <a
                href={href}
                target={href.startsWith('mailto') ? undefined : '_blank'}
                rel="noopener noreferrer"
                className="hover:underline"
                style={{ color: 'var(--color-cyan)' }}
              >
                {display} ↗
              </a>
            </div>
          ))}
        </div>

        <div className="text-xs" style={{ color: 'var(--color-text-dim)' }}>
          {'// or just run `sudo hire-me` to draft an email'}
        </div>
      </div>
    );
  },
});
