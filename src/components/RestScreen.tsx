import React from 'react';
import {AbsoluteFill, Img, staticFile, useVideoConfig} from 'remotion';
import {CircularTimer} from './CircularTimer';

export const RestScreen: React.FC<{durationInSeconds: number; image?: string}> = ({durationInSeconds, image}) => {
  const {fps} = useVideoConfig();
  const durationInFrames = Math.max(1, Math.round(durationInSeconds * fps));

  return (
    <AbsoluteFill style={{overflow: 'hidden', background: '#000'}}>
      {image ? (
        <Img
          src={staticFile(image)}
          style={{position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover'}}
        />
      ) : null}
      {/* Dedicated Google Flow GET READY image. Remotion adds ONLY the 5-second timer. */}
      <CircularTimer durationInFrames={durationInFrames} totalSeconds={durationInSeconds} mode="ready" />
    </AbsoluteFill>
  );
};
