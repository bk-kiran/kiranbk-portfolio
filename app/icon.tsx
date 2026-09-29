import { ImageResponse } from 'next/og';

export const size = { width: 32, height: 32 };
export const contentType = 'image/png';

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%', height: '100%', display: 'flex',
          alignItems: 'center', justifyContent: 'center',
          background: '#0a0a0a', color: '#4ade80', borderRadius: 7,
          fontSize: 17, fontWeight: 700, fontFamily: 'monospace', letterSpacing: -1,
        }}
      >
        KB
      </div>
    ),
    { ...size },
  );
}
