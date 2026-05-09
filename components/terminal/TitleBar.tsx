interface Props {
  title: string;
}

export default function TitleBar({ title }: Props) {
  return (
    <div
      className="flex items-center justify-between px-4 h-10 shrink-0 border-b select-none"
      style={{ background: 'var(--t-bg-secondary)', borderColor: 'var(--t-border)' }}
    >
      {/* macOS traffic lights — fixed system colors, not theme-dependent */}
      <div className="flex items-center gap-1.5">
        <span className="w-3 h-3 rounded-full inline-block" style={{ background: '#FF5F56' }} />
        <span className="w-3 h-3 rounded-full inline-block" style={{ background: '#FEBC2E' }} />
        <span className="w-3 h-3 rounded-full inline-block" style={{ background: '#28C840' }} />
      </div>

      {/* Dynamic title */}
      <span className="text-xs absolute left-1/2 -translate-x-1/2" style={{ color: 'var(--t-text-dim)' }}>
        {title}
      </span>

      {/* Right slot — placeholder for recruiter view toggle */}
      <span className="text-xs" style={{ color: 'var(--t-text-dim)' }}>
        recruiter view ≈
      </span>
    </div>
  );
}
