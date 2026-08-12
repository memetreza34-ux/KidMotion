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
    <div style={{position: 'absolute', left: 56, right: 56, bottom: 42, height: 24, borderRadius: brand.radius.pill, background: '#DCE9F4', overflow: 'hidden', boxShadow: '0 6px 18px rgba(23,52,91,0.14)'}}>
      <div style={{width: `${width}%`, height: '100%', borderRadius: brand.radius.pill, background: brand.colors.lime}} />
    </div>
  );
};
