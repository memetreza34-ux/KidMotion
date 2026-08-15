import React from 'react';
import {AbsoluteFill, Img, interpolate, staticFile, useCurrentFrame, useVideoConfig} from 'remotion';
import type {Exercise} from '../types';
import {CircularTimer} from './CircularTimer';
import {KidProgressBar} from './KidProgressBar';

export const ExerciseScene: React.FC<{exercise: Exercise}> = ({exercise}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const durationInFrames = Math.max(1, Math.round(exercise.duration * fps));

  // Ken Burns: gentle slow zoom from 1.0 → 1.06 over the full duration
  const scale = interpolate(frame, [0, durationInFrames], [1.0, 1.06], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  // Fade in at start (0.3s)
  const fadeIn = interpolate(frame, [0, Math.round(fps * 0.3)], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  return (
    <AbsoluteFill style={{overflow: 'hidden', background: '#000'}}>
      <div style={{
        position: 'absolute', inset: 0,
        transform: `scale(${scale})`,
        transformOrigin: 'center center',
        opacity: fadeIn,
      }}>
        <Img
          src={staticFile(exercise.image)}
          style={{position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover'}}
        />
      </div>

      {/*
        Exercise title + short instruction are already part of the approved Google Flow image.
        Remotion must NOT duplicate them.
      */}
      <CircularTimer durationInFrames={durationInFrames} totalSeconds={exercise.duration} />
      <KidProgressBar durationInFrames={durationInFrames} />
    </AbsoluteFill>
  );
};
