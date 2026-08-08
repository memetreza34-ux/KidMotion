import React from 'react';
import {interpolate, spring, useCurrentFrame, useVideoConfig} from 'remotion';
import {brand} from '../brand';

export const GoCountdown: React.FC<{durationInFrames: number}> = ({durationInFrames}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const second = Math.floor(frame / fps);
  const labels = ['3', '2', '1', 'GO!'];
  const label = labels[Math.min(labels.length - 1, second)];
  const localFrame = frame % fps;
  const scale = spring({fps, frame: localFrame, config: {damping: 12, stiffness: 180}});
  const opacity = interpolate(frame, [0, 4, durationInFrames - 5, durationInFrames], [0, 1, 1, 0], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});

  return (
    <div style={{position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(255,255,255,0.72)', opacity}}>
      <div style={{transform: `scale(${scale})`, minWidth: 220, height: 220, borderRadius: 999, background: label === 'GO!' ? brand.colors.lime : brand.colors.sky, display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 22px 60px rgba(23,52,91,0.18)', fontFamily: brand.typography.fontFamily, fontWeight: 900, fontSize: label === 'GO!' ? 72 : 104, color: brand.colors.white}}>
        {label}
      </div>
    </div>
  );
};
