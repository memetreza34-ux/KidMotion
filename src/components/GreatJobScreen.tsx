import React from 'react';
import {AbsoluteFill, Img, spring, staticFile, useCurrentFrame, useVideoConfig} from 'remotion';
import {brand} from '../brand';

export const GreatJobScreen: React.FC<{image?: string; subtitle?: string}> = ({image, subtitle = 'WORKOUT COMPLETE'}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const textScale = spring({fps, frame, config: {damping: 14, stiffness: 150}});

  return (
    <AbsoluteFill style={{overflow: 'hidden', background: brand.colors.cream, fontFamily: brand.typography.fontFamily}}>
      {image ? (
        <Img src={staticFile(image)} style={{position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover'}} />
      ) : null}
      <div style={{position: 'absolute', inset: 0, background: 'linear-gradient(90deg, rgba(23,52,91,0.70) 0%, rgba(23,52,91,0.20) 52%, rgba(23,52,91,0) 78%)'}} />
      <div style={{position: 'absolute', left: 80, top: 0, bottom: 0, width: 720, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'flex-start'}}>
        <div style={{transform: `scale(${textScale})`, transformOrigin: 'left center', fontSize: 90, fontWeight: 950, color: brand.colors.white, textShadow: '0 8px 20px rgba(0,0,0,0.28)'}}>GREAT JOB!</div>
        <div style={{marginTop: 16, padding: '11px 20px', borderRadius: 999, background: brand.colors.lime, fontSize: 32, fontWeight: 900, color: brand.colors.navy}}>{subtitle}</div>
      </div>
    </AbsoluteFill>
  );
};
