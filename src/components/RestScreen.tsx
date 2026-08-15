import React from 'react';
import {AbsoluteFill, Img, interpolate, staticFile, useCurrentFrame, useVideoConfig} from 'remotion';
import {brand} from '../brand';

export const RestScreen: React.FC<{durationInSeconds: number; image?: string}> = ({durationInSeconds, image}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const totalFrames = Math.max(1, Math.round(durationInSeconds * fps));
  const remaining = Math.max(0, Math.ceil(durationInSeconds - (frame + 1) / fps));
  const opacity = interpolate(frame, [0, 8], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  const circumference = 2 * Math.PI * 46;
  const dash = circumference * (remaining / Math.max(1, durationInSeconds));

  // Ken Burns: gentle slow zoom out from 1.05 → 1.0 (reverse of exercise = visual variety)
  const scale = interpolate(frame, [0, totalFrames], [1.05, 1.0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  // Fade in (0.3s)
  const fadeIn = interpolate(frame, [0, Math.round(fps * 0.3)], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  return (
    <AbsoluteFill style={{overflow: 'hidden', background: brand.colors.softBlue, fontFamily: brand.typography.fontFamily}}>
      <div style={{
        position: 'absolute', inset: 0,
        transform: `scale(${scale})`,
        transformOrigin: 'center center',
        opacity: fadeIn,
      }}>
        {image ? <Img src={staticFile(image)} style={{position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover'}} /> : null}
      </div>

      {/* Subtle dark vignette at top */}
      <div style={{position: 'absolute', inset: 0, background: 'linear-gradient(180deg, rgba(0,0,0,0.22) 0%, rgba(0,0,0,0) 22%)'}} />

      {/* REST badge — top left */}
      <div style={{position: 'absolute', top: 42, left: 48, opacity}}>
        <div style={{
          padding: '10px 28px',
          borderRadius: 999,
          background: 'rgba(255,255,255,0.92)',
          color: brand.colors.navy,
          fontSize: 38,
          fontWeight: 900,
          letterSpacing: 2,
          boxShadow: '0 4px 16px rgba(0,0,0,0.1)',
        }}>REST</div>
      </div>

      {/* Countdown timer — top right */}
      <div style={{position: 'absolute', top: 38, right: 48, width: 118, height: 118, opacity}}>
        <svg width="118" height="118" viewBox="0 0 118 118" style={{transform: 'rotate(-90deg)'}}>
          <circle cx="59" cy="59" r="46" fill="rgba(255,255,255,0.85)" stroke="rgba(255,255,255,0.3)" strokeWidth="6" />
          <circle cx="59" cy="59" r="46" fill="none" stroke={brand.colors.sky} strokeWidth="6" strokeLinecap="round"
            strokeDasharray={`${dash} ${circumference}`} />
        </svg>
        <div style={{
          position: 'absolute', inset: 0,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 38, fontWeight: 700, color: brand.colors.navy,
        }}>{remaining}</div>
      </div>
    </AbsoluteFill>
  );
};
