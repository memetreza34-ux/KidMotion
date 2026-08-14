import React from 'react';
import {AbsoluteFill, Img, staticFile} from 'remotion';
import {brand} from '../brand';

export const SafetyDisclaimerScreen: React.FC<{image?: string}> = ({image}) => {
  return (
    <AbsoluteFill style={{overflow: 'hidden', background: brand.colors.softBlue, fontFamily: brand.typography.fontFamily}}>
      {image ? (
        <Img src={staticFile(image)} style={{position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover'}} />
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
