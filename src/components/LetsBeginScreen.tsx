import React from 'react';
import {spring, useCurrentFrame, useVideoConfig} from 'remotion';
import {brand} from '../brand';

export const LetsBeginScreen: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const scale = spring({fps, frame, config: {damping: 14, stiffness: 160}});

  return (
    <div style={{position: 'absolute', inset: 0, background: brand.colors.softBlue, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: brand.typography.fontFamily}}>
      <div style={{transform: `scale(${scale})`, fontSize: 104, fontWeight: 900, color: brand.colors.navy, textShadow: '0 8px 0 rgba(55,184,255,0.18)'}}>
        LET&apos;S BEGIN!
      </div>
    </div>
  );
};
