import React from 'react';
import {AbsoluteFill, Img, staticFile, useVideoConfig} from 'remotion';
import type {Exercise} from '../types';
import {ExerciseHeader} from './ExerciseHeader';
import {CircularTimer} from './CircularTimer';
import {KidProgressBar} from './KidProgressBar';
import {brand} from '../brand';

export const ExerciseScene: React.FC<{exercise: Exercise}> = ({exercise}) => {
  const {fps} = useVideoConfig();
  const durationInFrames = Math.max(1, Math.round(exercise.duration * fps));

  return (
    <AbsoluteFill style={{background: `linear-gradient(180deg, ${brand.colors.softBlue} 0%, ${brand.colors.cream} 100%)`, overflow: 'hidden'}}>
      <ExerciseHeader title={exercise.title} cue={exercise.cue} instruction={exercise.instruction} />
      <CircularTimer durationInFrames={durationInFrames} totalSeconds={exercise.duration} />

      <div style={{position: 'absolute', left: 56, right: 56, top: 190, bottom: 90, display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
        <Img
          src={staticFile(exercise.image)}
          style={{maxHeight: '100%', maxWidth: '100%', objectFit: 'contain', filter: 'drop-shadow(0 22px 28px rgba(23,52,91,0.12))'}}
        />
      </div>

      <KidProgressBar durationInFrames={durationInFrames} />
    </AbsoluteFill>
  );
};
