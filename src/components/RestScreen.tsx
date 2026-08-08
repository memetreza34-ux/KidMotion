import React from 'react';
import {AbsoluteFill, useCurrentFrame, useVideoConfig} from 'remotion';

export const RestScreen: React.FC<{durationInSeconds: number; nextTitle?: string}> = ({durationInSeconds, nextTitle}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const remaining = Math.max(0, Math.ceil(durationInSeconds - frame / fps));

  return (
    <AbsoluteFill style={{background: 'linear-gradient(180deg,#f6f8ff 0%,#d8e7ff 100%)', alignItems: 'center', justifyContent: 'center', fontFamily: 'Arial, sans-serif'}}>
      <div style={{fontSize: 84, fontWeight: 900}}>REST</div>
      <div style={{fontSize: 150, fontWeight: 900, marginTop: 20}}>{remaining}</div>
      {nextTitle ? <div style={{fontSize: 34, fontWeight: 700, marginTop: 30}}>Next: {nextTitle}</div> : null}
    </AbsoluteFill>
  );
};
