import React from 'react';
import {AbsoluteFill, Img, interpolate, staticFile, useCurrentFrame, useVideoConfig} from 'remotion';
import {brand} from '../brand';

export const IntroScreen: React.FC<{image?: string; lines?: string[]}> = ({image, lines = []}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const cueLength = Math.max(1, Math.round(3 * fps));
  const activeIndex = Math.min(lines.length - 1, Math.max(0, Math.floor(frame / cueLength)));
  const opacity = interpolate(frame, [0, fps * 0.25], [0, 1], {extrapolateRight: 'clamp'});

  return (
    <AbsoluteFill style={{overflow: 'hidden', background: brand.colors.softBlue, fontFamily: brand.typography.fontFamily}}>
      {image ? (
        <Img src={staticFile(image)} style={{position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover'}} />
      ) : null}
      <div style={{position: 'absolute', inset: 0, background: 'linear-gradient(90deg, rgba(23,52,91,0.76) 0%, rgba(23,52,91,0.42) 48%, rgba(23,52,91,0.02) 72%)'}} />
      <div style={{position: 'absolute', left: 80, top: 90, bottom: 90, width: '54%', display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: 22, opacity}}>
        {lines.map((line, index) => (
          <div
            key={line}
            style={{
              padding: '18px 24px',
              borderRadius: 24,
              background: index === activeIndex ? 'rgba(255,255,255,0.96)' : 'rgba(255,255,255,0.24)',
              color: index === activeIndex ? brand.colors.navy : brand.colors.white,
              fontSize: index === activeIndex ? 44 : 34,
              fontWeight: 900,
              lineHeight: 1.08,
              transform: index === activeIndex ? 'scale(1)' : 'scale(0.98)',
              transformOrigin: 'left center',
            }}
          >
            {line}
          </div>
        ))}
      </div>
    </AbsoluteFill>
  );
};
