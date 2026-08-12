import React from 'react';
import {AbsoluteFill, Img, staticFile, useVideoConfig} from 'remotion';
import type {Exercise} from '../types';
import {ExerciseHeader} from './ExerciseHeader';
import {CircularTimer} from './CircularTimer';
import {KidProgressBar} from './KidProgressBar';

export const ExerciseScene: React.FC<{exercise: Exercise}> = ({exercise}) => {
  const {fps} = useVideoConfig();
  const durationInFrames = Math.max(1, Math.round(exercise.duration * fps));

  return (
    <AbsoluteFill style={{overflow: 'hidden', background: '#000'}}>
      <Img
        src={staticFile(exercise.image)}
        style={{position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover'}}
      />

      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: 'linear-gradient(180deg, rgba(0,0,0,0.05) 0%, rgba(0,0,0,0) 58%, rgba(0,0,0,0.12) 100%)',
        }}
      />

      <ExerciseHeader title={exercise.title} instruction={exercise.instruction} />
      <CircularTimer durationInFrames={durationInFrames} totalSeconds={exercise.duration} />
      <KidProgressBar durationInFrames={durationInFrames} />
    </AbsoluteFill>
  );
};
