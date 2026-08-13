import React from 'react';
import {AbsoluteFill, Img, staticFile, useCurrentFrame, useVideoConfig} from 'remotion';
import {brand} from '../brand';

export const RestScreen: React.FC<{durationInSeconds: number; nextTitle?: string; image?: string}> = ({durationInSeconds, nextTitle, image}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const remaining = Math.max(0, Math.ceil(durationInSeconds - (frame + 1) / fps));

  return (
    <AbsoluteFill style={{overflow: 'hidden', background: brand.colors.softBlue, fontFamily: brand.typography.fontFamily}}>
      {image ? (
        <Img src={staticFile(image)} style={{position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover'}} />
      ) : null}
      <div style={{position: 'absolute', inset: 0, background: 'rgba(234,247,255,0.52)'}} />

      <div style={{position: 'absolute', left: 74, top: 68, display: 'flex', alignItems: 'center', gap: 22}}>
        <div style={{padding: '16px 28px', borderRadius: 24, background: 'rgba(23,52,91,0.9)', color: brand.colors.white, fontSize: 58, fontWeight: 950, boxShadow: '0 12px 30px rgba(23,52,91,0.2)'}}>REST</div>
        <div style={{width: 126, height: 126, borderRadius: 999, background: 'rgba(255,255,255,0.97)', border: `10px solid ${brand.colors.sky}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 48, fontWeight: 950, color: brand.colors.navy, boxShadow: '0 12px 30px rgba(23,52,91,0.18)'}}>
          {remaining}
        </div>
      </div>

      {nextTitle ? (
        <div style={{position: 'absolute', left: 74, bottom: 72, maxWidth: 760, padding: '16px 24px', borderRadius: 20, background: 'rgba(255,255,255,0.95)', color: brand.colors.navy, fontSize: 31, lineHeight: 1.1, fontWeight: 900, boxShadow: '0 10px 28px rgba(23,52,91,0.16)'}}>
          NEXT: {nextTitle}
        </div>
      ) : null}
    </AbsoluteFill>
  );
};
