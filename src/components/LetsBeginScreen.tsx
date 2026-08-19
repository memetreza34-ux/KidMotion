import React from 'react';
import {AbsoluteFill, Img, staticFile} from 'remotion';
import {brand} from '../brand';

export const LetsBeginScreen: React.FC<{image?: string}> = ({image}) => {
  return (
    <AbsoluteFill style={{overflow: 'hidden', background: brand.colors.softBlue, fontFamily: brand.typography.fontFamily}}>
      {image ? <Img src={staticFile(image)} style={{position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover'}} /> : null}
      <div style={{position: 'absolute', inset: 0, background: 'linear-gradient(90deg, rgba(23,52,91,0.55) 0%, rgba(23,52,91,0.16) 48%, rgba(23,52,91,0) 72%)'}} />
      <div style={{
        position: 'absolute',
        left: 82,
        top: 0,
        bottom: 0,
        display: 'flex',
        alignItems: 'center',
      }}>
        <div style={{
          padding: '18px 30px',
          borderRadius: 24,
          background: 'rgba(255,255,255,0.95)',
          color: brand.colors.navy,
          fontSize: 64,
          fontWeight: 950,
          letterSpacing: 1,
          boxShadow: '0 10px 28px rgba(0,0,0,0.16)',
        }}>LET&apos;S BEGIN!</div>
      </div>
    </AbsoluteFill>
  );
};
