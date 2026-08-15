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
  title = '5 MIN FOOTBALL TRAINING',
  subtitle = 'BALANCE • CONTROL • STRONG POSITIONS',
  badge = 'KIDMOTION FOOTBALL',
}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const opacity = interpolate(frame, [0, Math.max(1, Math.round(fps * 0.35))], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const slide = interpolate(frame, [0, Math.max(1, Math.round(fps * 0.45))], [-34, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  // Ken Burns: slow zoom on background
  const totalFrames = Math.max(1, Math.round(12 * fps)); // intro is 12s
  const scale = interpolate(frame, [0, totalFrames], [1.0, 1.08], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  return (
    <AbsoluteFill style={{overflow: 'hidden', background: brand.colors.softBlue, fontFamily: brand.typography.fontFamily}}>
      {image ? (
        <div style={{position: 'absolute', inset: 0, transform: `scale(${scale})`, transformOrigin: '70% center'}}>
          <Img src={staticFile(image)} style={{position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover'}} />
        </div>
      ) : null}

      <div style={{position: 'absolute', inset: 0, background: 'linear-gradient(90deg, rgba(44,35,65,0.85) 0%, rgba(44,35,65,0.65) 38%, rgba(44,35,65,0.15) 64%, rgba(44,35,65,0) 80%)'}} />

      <div style={{position: 'absolute', left: 82, top: 0, bottom: 0, width: 790, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'flex-start', opacity, transform: `translateX(${slide}px)`}}>
        <div style={{fontSize: 30, fontWeight: 950, color: brand.colors.white, letterSpacing: 1.2, marginBottom: 14}}>
          WELCOME TO
        </div>

        <div style={{padding: '10px 20px', borderRadius: 999, background: brand.colors.lime, color: brand.colors.navy, fontSize: 27, fontWeight: 950, letterSpacing: 1.2}}>
          {badge}
        </div>

        <div style={{marginTop: 22, maxWidth: 740, color: brand.colors.white, fontSize: 76, lineHeight: 0.98, fontWeight: 950, letterSpacing: 0.3, textShadow: '0 8px 22px rgba(0,0,0,0.15)'}}>
          {title}
        </div>

        <div style={{marginTop: 22, padding: '13px 20px', borderRadius: 18, background: 'rgba(255,255,255,0.85)', backdropFilter: 'blur(10px)', color: brand.colors.navy, fontSize: 30, lineHeight: 1.08, fontWeight: 900, boxShadow: '0 12px 30px rgba(44,35,65,0.1)'}}>
          {subtitle}
        </div>

        <div style={{display: 'flex', gap: 14, marginTop: 22, flexWrap: 'wrap'}}>
          {['12 POSES', '20 SEC EACH', 'FOLLOW ALONG'].map((label) => (
            <div key={label} style={{padding: '11px 17px', borderRadius: 999, background: 'rgba(255,255,255,0.18)', border: '2px solid rgba(255,255,255,0.72)', color: brand.colors.white, fontSize: 24, fontWeight: 900, letterSpacing: 0.5}}>
              {label}
            </div>
          ))}
        </div>

        <div style={{marginTop: 20, color: brand.colors.white, fontSize: 29, fontWeight: 850}}>
          COPY • HOLD • HAVE FUN
        </div>
      </div>
    </AbsoluteFill>
  );
};
