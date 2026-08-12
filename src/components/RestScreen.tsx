import React from 'react';
import {AbsoluteFill, useCurrentFrame, useVideoConfig} from 'remotion';
import {brand} from '../brand';

export const RestScreen: React.FC<{durationInSeconds: number; nextTitle?: string}> = ({durationInSeconds, nextTitle}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const remaining = Math.max(0, Math.ceil(durationInSeconds - (frame + 1) / fps));

  return (
    <AbsoluteFill
      style={{
        background: `linear-gradient(180deg, ${brand.colors.softBlue} 0%, ${brand.colors.softGreen} 100%)`,
        alignItems: 'center',
        justifyContent: 'center',
        fontFamily: brand.typography.fontFamily,
        padding: 80,
      }}
    >
      <div style={{fontSize: 82, fontWeight: 950, color: brand.colors.navy}}>REST</div>
      <div style={{marginTop: 24, width: 190, height: 190, borderRadius: 999, background: brand.colors.white, border: `12px solid ${brand.colors.sky}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: remaining <= 3 ? 70 : 64, fontWeight: 950, color: brand.colors.navy, boxShadow: '0 18px 40px rgba(23,52,91,0.15)'}}>
        {remaining}
      </div>
      {nextTitle ? (
        <div style={{fontSize: 34, fontWeight: 800, marginTop: 34, color: brand.colors.dark, textAlign: 'center'}}>
          NEXT: {nextTitle}
        </div>
      ) : null}
    </AbsoluteFill>
  );
};
