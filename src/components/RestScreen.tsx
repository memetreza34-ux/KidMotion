import React from 'react';
import {AbsoluteFill, Img, staticFile, useCurrentFrame, useVideoConfig} from 'remotion';
import {brand} from '../brand';

export const RestScreen: React.FC<{durationInSeconds: number; image?: string}> = ({durationInSeconds, image}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const remaining = Math.max(0, Math.ceil(durationInSeconds - (frame + 1) / fps));
  const circumference = 2 * Math.PI * 38;
  const dash = circumference * (remaining / Math.max(1, durationInSeconds));

  return (
    <AbsoluteFill style={{overflow: 'hidden', background: brand.colors.softBlue, fontFamily: brand.typography.fontFamily}}>
      {image ? (
        <Img
          src={staticFile(image)}
          style={{position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover'}}
        />
      ) : null}

      <div style={{position: 'absolute', inset: 0, background: 'linear-gradient(180deg, rgba(0,0,0,0.18) 0%, rgba(0,0,0,0) 20%)'}} />

      {/*
        Keep ALL Rest UI in the top-left safe zone.
        The Google Flow instruction cloud already lives top-right, so Rest UI must never overlap it.
      */}
      <div style={{
        position: 'absolute',
        top: 36,
        left: 48,
        display: 'flex',
        alignItems: 'center',
        gap: 14,
        padding: '8px 14px 8px 24px',
        borderRadius: 999,
        background: 'rgba(255,255,255,0.94)',
        boxShadow: '0 6px 20px rgba(0,0,0,0.14)',
      }}>
        <div style={{
          color: brand.colors.navy,
          fontSize: 36,
          fontWeight: 950,
          letterSpacing: 2,
        }}>REST</div>

        <div style={{position: 'relative', width: 92, height: 92}}>
          <svg width="92" height="92" viewBox="0 0 92 92" style={{transform: 'rotate(-90deg)'}}>
            <circle cx="46" cy="46" r="38" fill="rgba(255,255,255,0.9)" stroke="rgba(23,52,91,0.12)" strokeWidth="6" />
            <circle
              cx="46"
              cy="46"
              r="38"
              fill="none"
              stroke={brand.colors.sky}
              strokeWidth="6"
              strokeLinecap="round"
              strokeDasharray={`${dash} ${circumference}`}
            />
          </svg>
          <div style={{
            position: 'absolute',
            inset: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: brand.colors.navy,
            fontSize: 34,
            fontWeight: 900,
          }}>{remaining}</div>
        </div>
      </div>
    </AbsoluteFill>
  );
};
