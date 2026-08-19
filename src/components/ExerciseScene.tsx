import React from 'react';
import {AbsoluteFill, Img, staticFile, useVideoConfig} from 'remotion';
import type {Exercise} from '../types';
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

      {/*
        Google Flow already owns the exercise title + instruction inside the source image.
        The source image stays completely static so baked text is never zoomed, cropped or moved.
        Remotion adds only timer + progress.
      */}
      <CircularTimer durationInFrames={durationInFrames} totalSeconds={exercise.duration} />
      <KidProgressBar durationInFrames={durationInFrames} />
    </AbsoluteFill>
  );
};
