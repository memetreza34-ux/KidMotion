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
  const circumference = 2 * Math.PI * 48;
  const dash = circumference * progress;
  const finalSeconds = remaining <= 3;

  return (
    <div style={{position: 'absolute', top: 38, left: 48, width: 136, height: 136}}>
      <svg width="136" height="136" viewBox="0 0 136 136" style={{transform: 'rotate(-90deg)', filter: 'drop-shadow(0 8px 18px rgba(23,52,91,0.2))'}}>
        <circle cx="68" cy="68" r="48" fill={brand.colors.white} stroke="#DCE9F4" strokeWidth="12" />
        <circle cx="68" cy="68" r="48" fill="none" stroke={brand.colors.sky} strokeWidth="12" strokeLinecap="round" strokeDasharray={`${dash} ${circumference}`} />
      </svg>
      <div
        style={{
          position: 'absolute',
          inset: 0,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontFamily: brand.typography.fontFamily,
          fontSize: finalSeconds ? 44 : 38,
          fontWeight: 950,
          color: brand.colors.navy,
        }}
      >
        {remaining}
      </div>
    </div>
  );
};
