import React from 'react';
import {interpolate, useCurrentFrame, useVideoConfig} from 'remotion';
import {brand} from '../brand';

export const CircularTimer: React.FC<{durationInFrames: number; totalSeconds: number}> = ({durationInFrames, totalSeconds}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const remaining = Math.max(0, Math.ceil(totalSeconds - (frame + 1) / fps));
  const endFrame = Math.max(1, durationInFrames - 1);
  const progress = interpolate(frame, [0, endFrame], [1, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const r = 62;
  const circumference = 2 * Math.PI * r;
  const dash = circumference * progress;
  const finalSeconds = remaining <= 3;

  return (
    <div style={{position: 'absolute', top: 32, left: 48, width: 160, height: 160}}>
      <svg width="160" height="160" viewBox="0 0 160 160" style={{transform: 'rotate(-90deg)', filter: 'drop-shadow(0 6px 20px rgba(0,0,0,0.18))'}}>
        {/* Background track */}
        <circle cx="80" cy="80" r={r} fill="rgba(255,255,255,0.88)" stroke="rgba(255,255,255,0.3)" strokeWidth="10" />
        {/* Progress arc */}
        <circle cx="80" cy="80" r={r} fill="none" stroke={brand.colors.sky} strokeWidth="10" strokeLinecap="round"
          strokeDasharray={`${dash} ${circumference}`} />
      </svg>
      <div
        style={{
          position: 'absolute',
          inset: 0,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontFamily: brand.typography.fontFamily,
          fontSize: finalSeconds ? 58 : 50,
          fontWeight: 800,
          color: brand.colors.navy,
        }}
      >
        {remaining}
      </div>
    </div>
  );
};
