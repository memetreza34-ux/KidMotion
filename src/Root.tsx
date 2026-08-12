import React from 'react';
import {Composition} from 'remotion';
import {WorkoutVideo, workoutDurationInFrames} from './WorkoutVideo';
import {sampleWorkout} from './data/sample-workout';

export const RemotionRoot: React.FC = () => {
  const fps = sampleWorkout.fps ?? 30;
  const width = sampleWorkout.width ?? 1920;
  const height = sampleWorkout.height ?? 1080;

  return (
    <Composition
      id="KidMotionVideo"
      component={WorkoutVideo}
      durationInFrames={workoutDurationInFrames(sampleWorkout)}
      fps={fps}
      width={width}
      height={height}
      defaultProps={{workout: sampleWorkout}}
    />
  );
};
