interface SectionHeaderProps {
  title: string;
  subtitle?: string;
}

export default function SectionHeader({ title, subtitle }: SectionHeaderProps) {
  return (
    <div style={{ marginBottom: 0 }}>
      <h2 style={{
        fontWeight: 700,
        fontSize: 24,
        color: 'var(--text)',
        marginBottom: subtitle ? 4 : 0,
        lineHeight: 1.3,
      }}>
        {title}
      </h2>
      {subtitle && (
        <p style={{ fontSize: 14, color: 'var(--text-dim)', marginBottom: 16 }}>
          {subtitle}
        </p>
      )}
      <div style={{
        width: 32,
        height: 2,
        background: 'var(--accent)',
        marginTop: subtitle ? 0 : 12,
        marginBottom: 24,
      }} />
    </div>
  );
}
