interface Props {
  title: string;
  onToggle: () => void;
}

export default function TitleBar({ title, onToggle }: Props) {
  return (
    <div
      className="flex items-center justify-between px-4 h-10 shrink-0 border-b select-none"
      style={{ background: 'var(--color-bg-secondary)', borderColor: 'var(--color-border)' }}
    >
      {/* macOS traffic lights — fixed system colors, not theme-dependent */}
      <div className="flex items-center gap-1.5">
        <span className="w-3 h-3 rounded-full inline-block" style={{ background: '#FF5F56' }} />
        <span className="w-3 h-3 rounded-full inline-block" style={{ background: '#FEBC2E' }} />
        <span className="w-3 h-3 rounded-full inline-block" style={{ background: '#28C840' }} />
      </div>

      {/* Dynamic title */}
      <span className="text-xs absolute left-1/2 -translate-x-1/2" style={{ color: 'var(--color-text-dim)' }}>
        {title}
      </span>

      <button
        onClick={onToggle}
        className="text-xs"
        style={{
          color: 'var(--color-text-dim)',
          background: 'transparent',
          border: 'none',
          cursor: 'pointer',
          padding: 0,
          fontFamily: 'inherit',
          fontSize: 'inherit',
        }}
      >
        recruiter view ⇄
      </button>
    </div>
  );
}
