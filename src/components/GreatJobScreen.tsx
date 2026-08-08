import React from 'react';
import {spring, useCurrentFrame, useVideoConfig} from 'remotion';
import {brand} from '../brand';

export const GreatJobScreen: React.FC<{subtitle?: string}> = ({subtitle = 'You did it!'}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const scale = spring({fps, frame, config: {damping: 14, stiffness: 150}});

  return (
    <div style={{position: 'absolute', inset: 0, background: brand.colors.cream, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', fontFamily: brand.typography.fontFamily}}>
      <div style={{transform: `scale(${scale})`, width: 210, height: 210, borderRadius: 999, background: brand.colors.lime, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 110, fontWeight: 900, color: brand.colors.white, boxShadow: '0 24px 60px rgba(23,52,91,0.16)'}}>✓</div>
      <div style={{marginTop: 34, fontSize: 74, fontWeight: 900, color: brand.colors.navy}}>GREAT JOB!</div>
      <div style={{marginTop: 12, fontSize: 32, fontWeight: 700, color: brand.colors.dark}}>{subtitle}</div>
    </div>
  );
};
