import React from 'react';
import {interpolate, useCurrentFrame} from 'remotion';
import {brand} from '../brand';

export const KidProgressBar: React.FC<{durationInFrames: number}> = ({durationInFrames}) => {
  const frame = useCurrentFrame();
  const endFrame = Math.max(1, durationInFrames - 1);
  const width = interpolate(frame, [0, endFrame], [0, 100], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  return (
    <div style={{position: 'absolute', left: 56, right: 56, bottom: 42, height: 12, borderRadius: brand.radius.pill, background: 'rgba(255,255,255,0.35)', overflow: 'hidden'}}>
      <div style={{width: `${width}%`, height: '100%', borderRadius: brand.radius.pill, background: 'rgba(255,255,255,0.85)'}} />
    </div>
  );
};
