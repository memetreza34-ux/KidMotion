import React from 'react';
import {AbsoluteFill, Img, interpolate, spring, staticFile, useCurrentFrame, useVideoConfig} from 'remotion';
import {brand} from '../brand';

export const GreatJobScreen: React.FC<{image?: string; subtitle?: string}> = ({image, subtitle = 'WORKOUT COMPLETE'}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const scale = spring({fps, frame, config: {damping: 14, stiffness: 150}});
  const totalFrames = Math.max(1, Math.round(5 * fps));

  // Ken Burns
  const bgScale = interpolate(frame, [0, totalFrames], [1.0, 1.05], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  // Fade in
  const fadeIn = interpolate(frame, [0, Math.round(fps * 0.3)], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  return (
    <AbsoluteFill style={{overflow: 'hidden', background: brand.colors.cream, fontFamily: brand.typography.fontFamily, opacity: fadeIn}}>
      {image ? (
        <div style={{position: 'absolute', inset: 0, transform: `scale(${bgScale})`, transformOrigin: 'center center'}}>
          <Img src={staticFile(image)} style={{position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover'}} />
        </div>
      ) : null}
      <div style={{position: 'absolute', inset: 0, background: 'linear-gradient(90deg, rgba(23,52,91,0.7) 0%, rgba(23,52,91,0.2) 52%, rgba(23,52,91,0) 78%)'}} />
      <div style={{position: 'absolute', left: 80, top: 0, bottom: 0, width: 760, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'flex-start'}}>
        <div style={{transform: `scale(${scale})`, transformOrigin: 'left center', fontSize: 94, fontWeight: 950, color: brand.colors.white, textShadow: '0 8px 20px rgba(0,0,0,0.28)'}}>GREAT JOB!</div>
        <div style={{marginTop: 18, padding: '12px 22px', borderRadius: 999, background: brand.colors.lime, fontSize: 34, fontWeight: 900, color: brand.colors.navy}}>{subtitle}</div>
      </div>
    </AbsoluteFill>
  );
};
