import React from 'react';
import {useCurrentFrame, useVideoConfig} from 'remotion';

export const Timer: React.FC<{durationInSeconds: number}> = ({durationInSeconds}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const elapsed = frame / fps;
  const remaining = Math.max(0, Math.ceil(durationInSeconds - elapsed));

  return (
    <div
      style={{
        minWidth: 120,
        height: 120,
        borderRadius: 60,
        background: 'rgba(255,255,255,0.92)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: 42,
        fontWeight: 800,
        boxShadow: '0 10px 30px rgba(0,0,0,0.18)',
      }}
    >
      {remaining}
    </div>
  );
};
