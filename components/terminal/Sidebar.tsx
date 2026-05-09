'use client';

interface NavItem {
  label: string;
  section: string;
  cmd: string;
}

const NAV_ITEMS: NavItem[] = [
  { label: '~/', section: '~', cmd: 'whoami' },
  { label: 'about/', section: 'about', cmd: 'about' },
  { label: 'experience/', section: 'experience', cmd: 'experience' },
  { label: 'projects/', section: 'projects', cmd: 'projects' },
  { label: 'apps/', section: 'apps', cmd: 'apps' },
  { label: 'contact/', section: 'contact', cmd: 'contact' },
];

interface Props {
  activeSection: string;
  onNavigate: (cmd: string) => void;
}

export default function Sidebar({ activeSection, onNavigate }: Props) {
  return (
    <aside
      className="w-60 shrink-0 flex flex-col h-full overflow-y-auto border-r text-xs"
      style={{
        background: 'var(--color-bg-secondary)',
        borderColor: 'var(--color-border)',
        color: 'var(--color-text)',
      }}
    >
      {/* Quick Links */}
      <div className="px-4 pt-5 pb-2">
        <p
          className="text-[10px] font-semibold tracking-widest uppercase mb-3 select-none"
          style={{ color: 'var(--color-text-dim)' }}
        >
          Quick Links
        </p>
        <nav className="space-y-0.5">
          {NAV_ITEMS.map(item => {
            const isActive = activeSection === item.section;
            return (
              <button
                key={item.section}
                onClick={() => onNavigate(item.cmd)}
                className="w-full text-left flex items-center gap-1.5 px-2 py-1 rounded transition-colors"
                style={{
                  background: isActive ? 'var(--color-border)' : 'transparent',
                  color: isActive ? 'var(--color-text)' : 'var(--color-text-dim)',
                }}
              >
                <span
                  className="w-3 shrink-0 select-none"
                  style={{ color: isActive ? 'var(--color-prompt)' : 'transparent' }}
                >
                  {'>'}
                </span>
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>
      </div>

      <div className="mx-4 my-2 border-t" style={{ borderColor: 'var(--color-border)' }} />

      {/* External */}
      <div className="px-4 py-2">
        <p
          className="text-[10px] font-semibold tracking-widest uppercase mb-3 select-none"
          style={{ color: 'var(--color-text-dim)' }}
        >
          External
        </p>
        <div className="space-y-1.5">
          <a
            href="/resume.pdf"
            target="_blank"
            rel="noopener noreferrer"
            className="block px-2 hover:underline"
            style={{ color: 'var(--color-yellow)' }}
          >
            resume.pdf
          </a>
          <a
            href="https://github.com/bk-kiran"
            target="_blank"
            rel="noopener noreferrer"
            className="block px-2 hover:underline"
            style={{ color: 'var(--color-cyan)' }}
          >
            github ↗
          </a>
          <a
            href="https://linkedin.com/in/kiranbk"
            target="_blank"
            rel="noopener noreferrer"
            className="block px-2 hover:underline"
            style={{ color: 'var(--color-cyan)' }}
          >
            linkedin ↗
          </a>
          <a
            href="mailto:kbalasundara@umass.edu"
            className="block px-2 hover:underline"
            style={{ color: 'var(--color-cyan)' }}
          >
            kiran@email.com
          </a>
        </div>
      </div>

      <div className="mx-4 my-2 border-t" style={{ borderColor: 'var(--color-border)' }} />

      {/* Uptime */}
      <div className="px-4 py-2 mt-auto pb-5">
        <p
          className="text-[10px] font-semibold tracking-widest uppercase mb-2 select-none"
          style={{ color: 'var(--color-text-dim)' }}
        >
          uptime
        </p>
        <div className="flex items-center gap-1.5 px-2">
          <span
            className="w-1.5 h-1.5 rounded-full shrink-0"
            style={{ background: 'var(--color-green)' }}
          />
          <span style={{ color: 'var(--color-green)' }}>online</span>
          <span style={{ color: 'var(--color-text-dim)' }}>· seeking &apos;26/&apos;27</span>
        </div>
      </div>
    </aside>
  );
}
