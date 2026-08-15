import React from 'react';
import {Composition} from 'remotion';
import {WorkoutVideo, workoutDurationInFrames} from './WorkoutVideo';
import {activeWorkout} from './data/active-workout';

export const RemotionRoot: React.FC = () => {
  const fps = activeWorkout.fps ?? 30;
  const width = activeWorkout.width ?? 1920;
  const height = activeWorkout.height ?? 1080;

  return (
    <>
      <Composition
        id="KidMotionVideo"
        component={WorkoutVideo}
        durationInFrames={workoutDurationInFrames(activeWorkout)}
        fps={fps}
        width={width}
        height={height}
        defaultProps={{workout: activeWorkout}}
      />
      <Composition
        id="KidMotionShort"
        component={WorkoutVideo}
        durationInFrames={workoutDurationInFrames({...activeWorkout, width: 1080, height: 1920})}
        fps={fps}
        width={1080}
        height={1920}
        defaultProps={{workout: {...activeWorkout, width: 1080, height: 1920}}}
      />
    </>
  );
};
