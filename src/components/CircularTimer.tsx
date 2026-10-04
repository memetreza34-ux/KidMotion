import React from 'react';
import {interpolate, useCurrentFrame, useVideoConfig} from 'remotion';
import {brand} from '../brand';

export const CircularTimer: React.FC<{
  durationInFrames: number;
  totalSeconds: number;
  mode?: 'exercise' | 'ready';
}> = ({durationInFrames, totalSeconds, mode = 'exercise'}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();

  // Show 20..1 or 5..1. The scene cuts exactly when the countdown reaches zero,
  // so viewers never see a confusing "0" frame.
  const remaining = Math.max(1, Math.ceil(totalSeconds - frame / fps));
  const progress = interpolate(frame, [0, Math.max(1, durationInFrames)], [1, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  const size = 192;
  const center = size / 2;
  const radius = 74;
  const circumference = 2 * Math.PI * radius;
  const dash = circumference * progress;
  const accent = mode === 'ready' ? brand.colors.lime : brand.colors.sky;
  const finalSeconds = remaining <= 3;

  const pulseFrame = frame % Math.max(1, fps);
  const pulse = finalSeconds
    ? interpolate(pulseFrame, [0, Math.max(1, fps * 0.35), Math.max(1, fps - 1)], [1, 1.045, 1], {
        extrapolateLeft: 'clamp',
        extrapolateRight: 'clamp',
      })
    : 1;

  return (
    <div
      style={{
        position: 'absolute',
        top: 26,
        left: 26,
        width: size,
        height: size,
        transform: `scale(${pulse})`,
        transformOrigin: 'center',
      }}
    >
      <svg
        width={size}
        height={size}
        viewBox={`0 0 ${size} ${size}`}
        style={{
          transform: 'rotate(-90deg)',
          filter: 'drop-shadow(0 10px 24px rgba(0,0,0,0.28))',
        }}
      >
        <circle
          cx={center}
          cy={center}
          r={82}
          fill="rgba(18, 25, 42, 0.78)"
          stroke="rgba(255,255,255,0.92)"
          strokeWidth="4"
        />
        <circle
          cx={center}
          cy={center}
          r={radius}
          fill="rgba(255,255,255,0.12)"
          stroke="rgba(255,255,255,0.24)"
          strokeWidth="13"
        />
        <circle
          cx={center}
          cy={center}
          r={radius}
          fill="none"
          stroke={accent}
          strokeWidth="13"
          strokeLinecap="round"
          strokeDasharray={`${dash} ${circumference}`}
        />
      </svg>
      <div
        style={{
          position: 'absolute',
          inset: 0,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontFamily: brand.typography.fontFamily,
          fontSize: finalSeconds ? 72 : 66,
          lineHeight: 1,
          fontWeight: 900,
          color: brand.colors.white,
          textShadow: '0 3px 10px rgba(0,0,0,0.4)',
          fontVariantNumeric: 'tabular-nums',
        }}
      >
        {remaining}
      </div>
    </div>
  );
};
