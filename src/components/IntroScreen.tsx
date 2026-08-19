import React from 'react';
import {AbsoluteFill, Img, interpolate, staticFile, useCurrentFrame, useVideoConfig} from 'remotion';
import {brand} from '../brand';

export const IntroScreen: React.FC<{
  image?: string;
  title?: string;
  subtitle?: string;
  badge?: string;
}> = ({
  image,
  title = '5 MIN WORKOUT',
  subtitle = '12 POSES • 20 SEC EACH',
  badge = 'KIDMOTION',
}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const textOpacity = interpolate(frame, [0, Math.max(1, Math.round(fps * 0.25))], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const slide = interpolate(frame, [0, Math.max(1, Math.round(fps * 0.35))], [-24, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  return (
    <AbsoluteFill style={{overflow: 'hidden', background: brand.colors.softBlue, fontFamily: brand.typography.fontFamily}}>
      {image ? (
        <Img src={staticFile(image)} style={{position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover'}} />
      ) : null}

      <div style={{position: 'absolute', inset: 0, background: 'linear-gradient(90deg, rgba(44,35,65,0.82) 0%, rgba(44,35,65,0.58) 37%, rgba(44,35,65,0.12) 64%, rgba(44,35,65,0) 80%)'}} />

      <div style={{
        position: 'absolute',
        left: 82,
        top: 0,
        bottom: 0,
        width: 760,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'flex-start',
        opacity: textOpacity,
        transform: `translateX(${slide}px)`,
      }}>
        <div style={{padding: '10px 20px', borderRadius: 999, background: brand.colors.lime, color: brand.colors.navy, fontSize: 27, fontWeight: 950, letterSpacing: 1.2}}>
          {badge}
        </div>

        <div style={{marginTop: 20, maxWidth: 720, color: brand.colors.white, fontSize: 76, lineHeight: 0.98, fontWeight: 950, letterSpacing: 0.3, textShadow: '0 8px 22px rgba(0,0,0,0.18)'}}>
          {title}
        </div>

        <div style={{marginTop: 20, padding: '13px 20px', borderRadius: 18, background: 'rgba(255,255,255,0.92)', color: brand.colors.navy, fontSize: 30, lineHeight: 1.08, fontWeight: 900, boxShadow: '0 10px 26px rgba(44,35,65,0.12)'}}>
          {subtitle}
        </div>

        <div style={{marginTop: 18, color: brand.colors.white, fontSize: 27, fontWeight: 900, letterSpacing: 0.8}}>
          FOLLOW ALONG
        </div>
      </div>
    </AbsoluteFill>
  );
};
