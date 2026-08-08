import React from 'react';
import {AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig} from 'remotion';
import {brand} from '../brand';

export const IntroScreen: React.FC<{title: string; subtitle?: string}> = ({title, subtitle}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const scale = interpolate(frame, [0, fps * 0.35], [0.94, 1], {extrapolateRight: 'clamp'});
  const opacity = interpolate(frame, [0, fps * 0.25], [0, 1], {extrapolateRight: 'clamp'});

  return (
    <AbsoluteFill
      style={{
        background: `linear-gradient(180deg, ${brand.colors.sky} 0%, ${brand.colors.skySoft} 100%)`,
        alignItems: 'center',
        justifyContent: 'center',
        padding: 100,
        fontFamily: brand.fontFamily,
      }}
    >
      <div style={{opacity, transform: `scale(${scale})`, textAlign: 'center', maxWidth: 1500}}>
        <div style={{fontSize: 108, lineHeight: 1.02, fontWeight: 950, color: brand.colors.ink}}>{title}</div>
        {subtitle ? (
          <div style={{fontSize: 42, fontWeight: 800, marginTop: 28, color: brand.colors.inkSoft}}>{subtitle}</div>
        ) : null}
      </div>
    </AbsoluteFill>
  );
};
