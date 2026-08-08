import React from 'react';
import {AbsoluteFill} from 'remotion';
import {brand} from '../brand';
import {CircularTimer} from './CircularTimer';

export const RestScreen: React.FC<{durationInSeconds: number; nextTitle?: string}> = ({durationInSeconds, nextTitle}) => {
  return (
    <AbsoluteFill
      style={{
        background: `linear-gradient(180deg, ${brand.colors.softBlue} 0%, ${brand.colors.softGreen} 100%)`,
        alignItems: 'center',
        justifyContent: 'center',
        fontFamily: brand.typography.fontFamily,
        padding: 80,
      }}
    >
      <div style={{fontSize: 82, fontWeight: 950, color: brand.colors.navy}}>REST</div>
      <div style={{marginTop: 28}}>
        <CircularTimer durationInSeconds={durationInSeconds} size={240} />
      </div>
      {nextTitle ? (
        <div style={{fontSize: 34, fontWeight: 800, marginTop: 34, color: brand.colors.dark, textAlign: 'center'}}>
          NEXT: {nextTitle}
        </div>
      ) : null}
    </AbsoluteFill>
  );
};
