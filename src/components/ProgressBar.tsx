import React from 'react';
import {interpolate, useCurrentFrame, useVideoConfig} from 'remotion';

export const ProgressBar: React.FC<{durationInSeconds: number}> = ({durationInSeconds}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const progress = interpolate(frame, [0, durationInSeconds * fps], [0, 100], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  return (
    <div style={{width: '100%', height: 22, borderRadius: 999, background: 'rgba(255,255,255,0.35)', overflow: 'hidden'}}>
      <div style={{width: `${progress}%`, height: '100%', borderRadius: 999, background: 'white'}} />
    </div>
  );
};
