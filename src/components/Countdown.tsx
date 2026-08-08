import React from 'react';
import {useCurrentFrame, useVideoConfig} from 'remotion';

export const Countdown: React.FC<{seconds?: number}> = ({seconds = 3}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const value = Math.max(0, seconds - Math.floor(frame / fps));
  return (
    <div style={{fontSize: 180, fontWeight: 900, textAlign: 'center'}}>
      {value > 0 ? value : 'GO!'}
    </div>
  );
};
