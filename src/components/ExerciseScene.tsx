import React from 'react';
import {AbsoluteFill, Img, staticFile} from 'remotion';
import type {Exercise} from '../types';
import {Timer} from './Timer';
import {ProgressBar} from './ProgressBar';

export const ExerciseScene: React.FC<{exercise: Exercise}> = ({exercise}) => {
  return (
    <AbsoluteFill style={{background: 'linear-gradient(180deg,#6ad5ff 0%,#dff8ff 100%)', padding: 70, fontFamily: 'Arial, sans-serif'}}>
      <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
        <div style={{fontSize: 64, fontWeight: 900}}>{exercise.title}</div>
        <Timer durationInSeconds={exercise.duration} />
      </div>

      <div style={{flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
        <Img src={staticFile(exercise.image)} style={{maxHeight: '72%', maxWidth: '72%', objectFit: 'contain'}} />
      </div>

      <div style={{fontSize: 36, fontWeight: 700, textAlign: 'center', marginBottom: 28}}>
        {exercise.instruction}
      </div>
      <ProgressBar durationInSeconds={exercise.duration} />
    </AbsoluteFill>
  );
};
