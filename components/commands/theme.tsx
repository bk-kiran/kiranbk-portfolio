import { registry } from '@/lib/commandRegistry';
import { type ThemeName, themes } from '@/lib/themes';
import { setThemeImperative } from '@/lib/themeStore';

type T = (typeof themes)[ThemeName];

const THEME_NAMES = Object.keys(themes) as ThemeName[];

const PALETTE_COLORS = (t: T) => [t.bg, t.green, t.cyan, t.yellow, t.magenta, t.red, t.prompt];

function ThemeCard({ name, t }: { name: ThemeName; t: T }) {
  return (
    <div
      style={{
        background: t.bg,
        border: `1px solid ${t.border}`,
        borderRadius: '6px',
        overflow: 'hidden',
        fontFamily: 'monospace',
        fontSize: '11px',
        lineHeight: '1.6',
        minWidth: 0,
      }}
    >
      {/* title bar */}
      <div
        style={{
          background: t.bgSecondary,
          borderBottom: `1px solid ${t.border}`,
          padding: '5px 10px',
          display: 'flex',
          alignItems: 'center',
          gap: '6px',
        }}
      >
        <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#FF5F56', display: 'inline-block', flexShrink: 0 }} />
        <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#FEBC2E', display: 'inline-block', flexShrink: 0 }} />
        <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#28C840', display: 'inline-block', flexShrink: 0 }} />
        <span style={{ color: t.textDim, marginLeft: '6px', fontSize: '10px', letterSpacing: '0.05em' }}>
          THEME · {name.toUpperCase()}
        </span>
      </div>

      {/* terminal body */}
      <div style={{ padding: '8px 12px', display: 'flex', flexDirection: 'column', gap: '1px' }}>
        <div>
          <span style={{ color: t.prompt }}>kiran@portfolio</span>
          <span style={{ color: t.textDim }}> $ </span>
          <span style={{ color: t.text }}>whoami</span>
        </div>
        <div style={{ color: t.text }}>Kiran BK · CS &apos;27</div>
        <div style={{ color: t.green }}>seeking SWE/AI</div>
        <div style={{ color: t.green }}>+82% accuracy</div>
        <div style={{ color: t.cyan }}>./resume.pdf</div>
        <div style={{ color: t.red }}>error: humility.exe</div>

        {/* palette swatches */}
        <div style={{ display: 'flex', gap: '3px', paddingTop: '6px' }}>
          {PALETTE_COLORS(t).map((c, i) => (
            <span
              key={i}
              style={{
                display: 'inline-block',
                width: 14,
                height: 14,
                borderRadius: '3px',
                background: c,
                border: `1px solid ${t.border}`,
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

function ThemeList() {
  return (
    <div>
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: '12px',
          maxWidth: '560px',
        }}
      >
        {THEME_NAMES.map(name => (
          <ThemeCard key={name} name={name} t={themes[name]} />
        ))}
      </div>
      <div style={{ color: 'var(--color-text-dim)', fontSize: '0.8em', marginTop: '10px' }}>
        {'// '}
        <span style={{ color: 'var(--color-green)' }}>theme</span>
        {' '}
        <span style={{ color: 'var(--color-yellow)' }}>&lt;name&gt;</span>
        {'  ·  '}
        <span style={{ color: 'var(--color-green)' }}>theme reset</span>
      </div>
    </div>
  );
}

function Swatches({ t }: { t: T }) {
  return (
    <span style={{ display: 'inline-flex', gap: '3px', verticalAlign: 'middle' }}>
      {PALETTE_COLORS(t).map((c, i) => (
        <span
          key={i}
          style={{
            display: 'inline-block',
            width: 12,
            height: 12,
            borderRadius: '2px',
            background: c,
          }}
        />
      ))}
    </span>
  );
}

registry.register({
  name: 'theme',
  description: 'switch color theme  (theme list | theme reset)',
  usage: 'theme <name|list|reset>',
  handler(args) {
    const sub = args[0];

    if (!sub || sub === 'list') {
      return <ThemeList />;
    }

    if (sub === 'reset') {
      setThemeImperative('tokyonight');
      return (
        <div>
          <span style={{ color: 'var(--color-text-dim)' }}>{'// '}</span>
          <span style={{ color: 'var(--color-green)' }}>theme reset to tokyonight</span>
          {'  '}
          <Swatches t={themes.tokyonight} />
        </div>
      );
    }

    if ((THEME_NAMES as string[]).includes(sub)) {
      setThemeImperative(sub as ThemeName);
      const t = themes[sub as ThemeName];
      return (
        <div>
          <span style={{ color: 'var(--color-text-dim)' }}>{'// '}</span>
          <span style={{ color: t.green }}>theme switched to {sub}</span>
          {'  '}
          <Swatches t={t} />
        </div>
      );
    }

    return (
      <div style={{ color: 'var(--color-text-dim)' }}>
        {'// unknown theme — try: '}
        {THEME_NAMES.map((n, i) => (
          <span key={n}>
            <span style={{ color: 'var(--color-yellow)' }}>{n}</span>
            {i < THEME_NAMES.length - 1 && ' | '}
          </span>
        ))}
      </div>
    );
  },
});
