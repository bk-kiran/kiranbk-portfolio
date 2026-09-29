import { ImageResponse } from 'next/og';

export const alt = 'Kiran BK — Software Engineer · AI/ML';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

// Link-preview card (LinkedIn, iMessage, Slack, X…). Styled like the site's terminal.
export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%', height: '100%', display: 'flex', flexDirection: 'column',
          justifyContent: 'space-between', padding: '72px 80px',
          background: '#0a0a0a', color: '#fafaf9', fontFamily: 'monospace',
        }}
      >
        <div style={{ display: 'flex', fontSize: 26, color: 'rgba(255,255,255,0.45)' }}>
          <span style={{ color: '#4ade80' }}>kiran</span>
          <span>@</span>
          <span style={{ color: '#67e8f9' }}>portfolio</span>
          <span>&nbsp;~&nbsp;</span>
          <span style={{ color: '#c084fc' }}>$</span>
          <span>&nbsp;whoami</span>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <div style={{ fontSize: 96, fontWeight: 700, letterSpacing: -3, fontFamily: 'serif' }}>Kiran BK</div>
          <div style={{ fontSize: 36, color: 'rgba(255,255,255,0.7)', marginTop: 12 }}>
            Software Engineer · AI/ML · UMass Amherst &apos;27
          </div>
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 26, color: 'rgba(255,255,255,0.45)' }}>
          <span>open to full-time SWE &amp; ML roles · 2027</span>
          <span style={{ color: '#4ade80' }}>kiranbk.com</span>
        </div>
      </div>
    ),
    { ...size },
  );
}
