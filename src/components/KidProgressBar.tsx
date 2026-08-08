import React from 'react';
import {interpolate, useCurrentFrame} from 'remotion';
import {brand} from '../brand';

export const KidProgressBar: React.FC<{durationInFrames: number}> = ({durationInFrames}) => {
  const frame = useCurrentFrame();
  const width = interpolate(frame, [0, durationInFrames], [0, 100], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  return (
    <div style={{position: 'absolute', left: 56, right: 56, bottom: 42, height: 24, borderRadius: brand.radius.pill, background: '#DCE9F4', overflow: 'hidden'}}>
      <div style={{width: `${width}%`, height: '100%', borderRadius: brand.radius.pill, background: brand.colors.lime}} />
    </div>
  );
};
