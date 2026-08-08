import React from 'react';
import {AbsoluteFill, useCurrentFrame, useVideoConfig} from 'remotion';
import {brand} from '../brand';
import {CircularTimer} from './CircularTimer';

export const RestScreen: React.FC<{durationInSeconds: number; nextTitle?: string}> = ({durationInSeconds, nextTitle}) => {
  useCurrentFrame();
  useVideoConfig();

  return (
    <AbsoluteFill
      style={{
        background: `linear-gradient(180deg, ${brand.colors.restTop} 0%, ${brand.colors.restBottom} 100%)`,
        alignItems: 'center',
        justifyContent: 'center',
        fontFamily: brand.fontFamily,
        padding: 80,
      }}
    >
      <div style={{fontSize: 82, fontWeight: 950, color: brand.colors.ink}}>REST</div>
      <div style={{marginTop: 28}}>
        <CircularTimer durationInSeconds={durationInSeconds} size={240} />
      </div>
      {nextTitle ? (
        <div style={{fontSize: 34, fontWeight: 800, marginTop: 34, color: brand.colors.inkSoft, textAlign: 'center'}}>
          NEXT: {nextTitle}
        </div>
      ) : null}
    </AbsoluteFill>
  );
};
