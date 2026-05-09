import { registry } from '@/lib/commandRegistry';
import { personal } from '@/lib/data';

// Each glyph is a 5×5 binary grid. 1 = filled pixel, 0 = empty.
// Rendered as CSS divs so the output is font-independent and always crisp.
const GLYPHS: Record<string, number[][]> = {
  K: [
    [1, 0, 0, 1, 0],
    [1, 0, 1, 0, 0],
    [1, 1, 0, 0, 0],
    [1, 0, 1, 0, 0],
    [1, 0, 0, 1, 0],
  ],
  I: [
    [1, 1, 1, 1, 1],
    [0, 0, 1, 0, 0],
    [0, 0, 1, 0, 0],
    [0, 0, 1, 0, 0],
    [1, 1, 1, 1, 1],
  ],
  R: [
    [1, 1, 1, 1, 0],
    [1, 0, 0, 0, 1],
    [1, 1, 1, 1, 0],
    [1, 0, 0, 1, 0],
    [1, 0, 0, 0, 1],
  ],
  A: [
    [0, 1, 1, 1, 0],
    [1, 0, 0, 0, 1],
    [1, 1, 1, 1, 1],
    [1, 0, 0, 0, 1],
    [1, 0, 0, 0, 1],
  ],
  N: [
    [1, 0, 0, 0, 1],
    [1, 1, 0, 0, 1],
    [1, 0, 1, 0, 1],
    [1, 0, 0, 1, 1],
    [1, 0, 0, 0, 1],
  ],
  B: [
    [1, 1, 1, 1, 0],
    [1, 0, 0, 0, 1],
    [1, 1, 1, 1, 0],
    [1, 0, 0, 0, 1],
    [1, 1, 1, 1, 0],
  ],
};

// px per pixel cell; gap between cells; gap between letters; word-space width
const PX = 7;
const PY = 8;
const CELL_GAP = 1;
const LETTER_GAP = 5;
const WORD_GAP = 16;

function PixelArt({ text }: { text: string }) {
  return (
    <div style={{ display: 'flex', alignItems: 'flex-start', gap: `${LETTER_GAP}px` }}>
      {text.split('').map((ch, ci) => {
        if (ch === ' ') {
          return <div key={ci} style={{ width: `${WORD_GAP}px` }} />;
        }
        const glyph = GLYPHS[ch];
        if (!glyph) return null;
        return (
          <div
            key={ci}
            style={{ display: 'flex', flexDirection: 'column', gap: `${CELL_GAP}px` }}
          >
            {glyph.map((row, r) => (
              <div key={r} style={{ display: 'flex', gap: `${CELL_GAP}px` }}>
                {row.map((bit, c) => (
                  <div
                    key={c}
                    style={{
                      width: `${PX}px`,
                      height: `${PY}px`,
                      background: bit ? 'var(--t-prompt)' : 'transparent',
                    }}
                  />
                ))}
              </div>
            ))}
          </div>
        );
      })}
    </div>
  );
}

registry.register({
  name: 'whoami',
  description: 'print bio',
  handler() {
    return (
      <div className="space-y-3">
        <div className="select-none py-1">
          <PixelArt text="KIRAN BK" />
        </div>

        <div style={{ color: 'var(--t-text)' }}>
          {personal.degree} · {personal.school} {personal.classYear} · {personal.gpa} GPA · software engineer + AI/ML
        </div>

        <div className="space-y-0.5">
          <div>
            <span style={{ color: 'var(--t-text-dim)' }}>{'→ '}</span>
            <span style={{ color: 'var(--t-green)' }}>seeking </span>
            <span style={{ color: 'var(--t-yellow)' }}>{personal.seeking[0]}</span>
          </div>
          <div>
            <span style={{ color: 'var(--t-text-dim)' }}>{'  and '}</span>
            <span style={{ color: 'var(--t-yellow)' }}>{personal.seeking[1]}</span>
          </div>
        </div>

        <div className="flex flex-wrap gap-4 pt-1">
          {personal.highlights.map((h, i) => (
            <div
              key={i}
              className="pl-3 py-1"
              style={{ borderLeft: '2px solid var(--t-green)' }}
            >
              <div
                className="text-lg font-bold leading-tight"
                style={{ color: 'var(--t-green)' }}
              >
                {h.metric}
              </div>
              <div className="text-xs" style={{ color: 'var(--t-text)' }}>
                {h.label}
              </div>
              <div className="text-xs" style={{ color: 'var(--t-text-dim)' }}>
                {'// '}{h.source}
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  },
});
