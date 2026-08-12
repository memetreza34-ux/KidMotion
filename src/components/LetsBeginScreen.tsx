import React from 'react';
import {AbsoluteFill, Img, spring, staticFile, useCurrentFrame, useVideoConfig} from 'remotion';
import {brand} from '../brand';

export const LetsBeginScreen: React.FC<{image?: string}> = ({image}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const scale = spring({fps, frame, config: {damping: 14, stiffness: 160}});

  return (
    <AbsoluteFill style={{overflow: 'hidden', background: brand.colors.softBlue, fontFamily: brand.typography.fontFamily}}>
      {image ? <Img src={staticFile(image)} style={{position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover'}} /> : null}
      <div style={{position: 'absolute', inset: 0, background: 'rgba(23,52,91,0.12)'}} />
      <div style={{position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
        <div style={{transform: `scale(${scale})`, padding: '24px 44px', borderRadius: 28, background: 'rgba(23,52,91,0.82)', fontSize: 98, fontWeight: 950, color: brand.colors.white, textShadow: '0 8px 18px rgba(0,0,0,0.22)'}}>
          LET&apos;S BEGIN!
        </div>
      </div>
    </AbsoluteFill>
  );
};
