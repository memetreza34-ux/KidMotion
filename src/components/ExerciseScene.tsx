import React from 'react';
import {AbsoluteFill, Img, staticFile, useVideoConfig} from 'remotion';
import type {Exercise} from '../types';
import {CircularTimer} from './CircularTimer';

export const ExerciseScene: React.FC<{exercise: Exercise}> = ({exercise}) => {
  const {fps} = useVideoConfig();
  const durationInFrames = Math.max(1, Math.round(exercise.duration * fps));

  return (
    <AbsoluteFill style={{overflow: 'hidden', background: '#000'}}>
      <Img
        src={staticFile(exercise.image)}
        style={{position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover'}}
      />
      {/* All non-timer text is baked into the Google Flow image. Remotion adds ONLY the countdown timer. */}
      <CircularTimer durationInFrames={durationInFrames} totalSeconds={exercise.duration} />
    </AbsoluteFill>
  );
};
