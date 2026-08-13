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
      <div style={{position: 'absolute', inset: 0, background: 'rgba(23,52,91,0.10)'}} />
      <div style={{position: 'absolute', left: 80, top: 0, bottom: 0, width: 720, display: 'flex', alignItems: 'center'}}>
        <div style={{transform: `scale(${scale})`, transformOrigin: 'left center', padding: '24px 44px', borderRadius: 28, background: 'rgba(23,52,91,0.86)', fontSize: 88, fontWeight: 950, color: brand.colors.white, textShadow: '0 8px 18px rgba(0,0,0,0.22)'}}>
          LET&apos;S BEGIN!
        </div>
      </div>
    </AbsoluteFill>
  );
};
