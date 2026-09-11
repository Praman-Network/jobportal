import { ImageResponse } from 'next/og';

// Route segment config
export const runtime = 'edge';

// Image metadata
export const alt = 'Praman Jobs — Internship & Job Board';
export const size = {
  width: 1200,
  height: 630,
};

export const contentType = 'image/png';

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          height: '100%',
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: '#07080a',
          backgroundImage: 'radial-gradient(circle at 50% -20%, rgba(0, 240, 255, 0.15) 0%, transparent 60%)',
          color: '#ffffff',
          fontFamily: 'sans-serif',
        }}
      >
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '40px',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            borderRadius: '24px',
            backgroundColor: 'rgba(11, 13, 20, 0.6)',
          }}
        >
          {/* Cyan Badge */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '8px 16px',
              borderRadius: '9999px',
              backgroundColor: 'rgba(0, 240, 255, 0.1)',
              border: '1px solid rgba(0, 240, 255, 0.3)',
              color: '#00F0FF',
              fontSize: '20px',
              fontWeight: 'bold',
              letterSpacing: '2px',
              textTransform: 'uppercase',
              marginBottom: '32px',
            }}
          >
            PRAMAN JOBS IS LIVE
          </div>

          {/* Heading */}
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              fontSize: '72px',
              fontWeight: '800',
              lineHeight: 1.1,
              textAlign: 'center',
              marginBottom: '24px',
            }}
          >
            <span style={{ color: '#ffffff' }}>Find top talent with</span>
            <span style={{ color: '#00F0FF' }}>Zero Dead Links</span>
          </div>

          {/* Description */}
          <div
            style={{
              fontSize: '32px',
              color: '#a1a1aa',
              textAlign: 'center',
              maxWidth: '800px',
              lineHeight: 1.4,
            }}
          >
            The decentralized protocol for verifiable talent. Curated tech opportunities across India and Remote.
          </div>
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}
