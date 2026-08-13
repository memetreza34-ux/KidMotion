import React from 'react';
import {AbsoluteFill, Img, staticFile, useCurrentFrame, useVideoConfig} from 'remotion';
import {brand} from '../brand';

export const RestScreen: React.FC<{durationInSeconds: number; nextTitle?: string; image?: string}> = ({durationInSeconds, nextTitle, image}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const remaining = Math.max(0, Math.ceil(durationInSeconds - (frame + 1) / fps));

  return (
    <AbsoluteFill style={{overflow: 'hidden', background: brand.colors.softBlue, fontFamily: brand.typography.fontFamily}}>
      {image ? <Img src={staticFile(image)} style={{position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover'}} /> : null}
      <div style={{position: 'absolute', inset: 0, background: 'linear-gradient(90deg, rgba(23,52,91,0.32) 0%, rgba(23,52,91,0.10) 42%, rgba(23,52,91,0) 70%)'}} />

      <div style={{position: 'absolute', left: 70, top: 62, display: 'flex', alignItems: 'center', gap: 18}}>
        <div style={{padding: '14px 26px', borderRadius: 22, background: 'rgba(23,52,91,0.92)', color: brand.colors.white, fontSize: 54, fontWeight: 950}}>REST</div>
        <div style={{width: 118, height: 118, borderRadius: 999, background: brand.colors.white, border: `9px solid ${brand.colors.sky}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 46, fontWeight: 950, color: brand.colors.navy}}>
          {remaining}
        </div>
      </div>

      {nextTitle ? (
        <div style={{position: 'absolute', left: 70, bottom: 72, maxWidth: 760, padding: '14px 22px', borderRadius: 18, background: 'rgba(255,255,255,0.96)', color: brand.colors.navy, fontSize: 30, lineHeight: 1.1, fontWeight: 900}}>
          NEXT: {nextTitle}
        </div>
      ) : null}
    </AbsoluteFill>
  );
};
