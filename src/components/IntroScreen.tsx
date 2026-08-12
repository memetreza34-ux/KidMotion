import React from 'react';
import {AbsoluteFill, Img, interpolate, staticFile, useCurrentFrame, useVideoConfig} from 'remotion';
import type {IntroCue} from '../types';
import {brand} from '../brand';

export const IntroScreen: React.FC<{image?: string; cues?: IntroCue[]}> = ({image, cues = []}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const now = frame / fps;
  const opacity = interpolate(frame, [0, fps * 0.25], [0, 1], {extrapolateRight: 'clamp'});

  let activeIndex = cues.findIndex((cue) => now >= cue.start && now < cue.end);
  if (activeIndex < 0 && cues.length > 0) {
    activeIndex = now >= cues[cues.length - 1].end ? cues.length - 1 : 0;
  }

  return (
    <AbsoluteFill style={{overflow: 'hidden', background: brand.colors.softBlue, fontFamily: brand.typography.fontFamily}}>
      {image ? (
        <Img src={staticFile(image)} style={{position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover'}} />
      ) : null}
      <div style={{position: 'absolute', inset: 0, background: 'linear-gradient(90deg, rgba(23,52,91,0.78) 0%, rgba(23,52,91,0.44) 48%, rgba(23,52,91,0.02) 72%)'}} />

      <div style={{position: 'absolute', left: 80, top: 90, bottom: 90, width: '54%', display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: 22, opacity}}>
        {cues.map((cue, index) => {
          const isActive = index === activeIndex;
          const isRevealed = index <= activeIndex;
          if (!isRevealed) return null;

          return (
            <div
              key={`${cue.start}-${cue.text}`}
              style={{
                padding: '18px 24px',
                borderRadius: 24,
                background: isActive ? 'rgba(255,255,255,0.97)' : 'rgba(255,255,255,0.22)',
                color: isActive ? brand.colors.navy : brand.colors.white,
                fontSize: isActive ? 44 : 34,
                fontWeight: 900,
                lineHeight: 1.08,
                transform: isActive ? 'scale(1)' : 'scale(0.98)',
                transformOrigin: 'left center',
                boxShadow: isActive ? '0 12px 28px rgba(23,52,91,0.20)' : 'none',
              }}
            >
              {cue.text}
            </div>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};
