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
  subtitle = '12 EASY HOLD POSES',
  badge = 'KIDMOTION',
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

  return (
    <AbsoluteFill style={{overflow: 'hidden', background: brand.colors.softBlue, fontFamily: brand.typography.fontFamily}}>
      {image ? (
        <Img src={staticFile(image)} style={{position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover'}} />
      ) : null}

      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: 'linear-gradient(90deg, rgba(23,52,91,0.78) 0%, rgba(23,52,91,0.54) 38%, rgba(23,52,91,0.10) 63%, rgba(23,52,91,0) 78%)',
        }}
      />

      <div
        style={{
          position: 'absolute',
          left: 82,
          top: 0,
          bottom: 0,
          width: 760,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'flex-start',
          opacity,
          transform: `translateX(${slide}px)`,
        }}
      >
        <div
          style={{
            padding: '10px 20px',
            borderRadius: 999,
            background: brand.colors.lime,
            color: brand.colors.navy,
            fontSize: 28,
            fontWeight: 950,
            letterSpacing: 1.4,
          }}
        >
          {badge}
        </div>

        <div
          style={{
            marginTop: 24,
            maxWidth: 720,
            color: brand.colors.white,
            fontSize: 78,
            lineHeight: 0.98,
            fontWeight: 950,
            letterSpacing: 0.4,
            textShadow: '0 8px 22px rgba(0,0,0,0.28)',
          }}
        >
          {title}
        </div>

        <div
          style={{
            marginTop: 24,
            padding: '14px 22px',
            borderRadius: 20,
            background: 'rgba(255,255,255,0.95)',
            color: brand.colors.navy,
            fontSize: 34,
            lineHeight: 1.08,
            fontWeight: 900,
            boxShadow: '0 12px 30px rgba(23,52,91,0.18)',
          }}
        >
          {subtitle}
        </div>
      </div>
    </AbsoluteFill>
  );
};
