import React from 'react';
import {AbsoluteFill, Img, interpolate, staticFile, useCurrentFrame, useVideoConfig} from 'remotion';
import {brand} from '../brand';

export const SafetyDisclaimerScreen: React.FC<{image?: string}> = ({image}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const totalFrames = Math.max(1, Math.round(5 * fps));

  // Ken Burns: gentle zoom
  const scale = interpolate(frame, [0, totalFrames], [1.0, 1.04], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  // Fade in
  const fadeIn = interpolate(frame, [0, Math.round(fps * 0.3)], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  return (
    <AbsoluteFill style={{overflow: 'hidden', background: brand.colors.softBlue, fontFamily: brand.typography.fontFamily, opacity: fadeIn}}>
      {image ? (
        <div style={{position: 'absolute', inset: 0, transform: `scale(${scale})`, transformOrigin: 'center center'}}>
          <Img src={staticFile(image)} style={{position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover'}} />
        </div>
      ) : null}

      <div style={{position: 'absolute', inset: 0, background: 'linear-gradient(90deg, rgba(23,52,91,0.72) 0%, rgba(23,52,91,0.40) 42%, rgba(23,52,91,0.05) 68%, rgba(23,52,91,0) 100%)'}} />

      <div style={{position: 'absolute', left: 82, top: 0, bottom: 0, width: 700, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'flex-start'}}>
        <div style={{fontSize: 66, fontWeight: 950, color: brand.colors.white, textShadow: '0 7px 18px rgba(0,0,0,0.28)'}}>SAFETY FIRST</div>
        <div style={{marginTop: 22, padding: '18px 24px', borderRadius: 22, background: 'rgba(255,255,255,0.96)', fontSize: 34, lineHeight: 1.2, fontWeight: 900, color: brand.colors.navy}}>
          Clear some space.<br />Stop if anything hurts.
        </div>
      </div>
    </AbsoluteFill>
  );
};
