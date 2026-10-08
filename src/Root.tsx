import React from 'react';
import {Composition} from 'remotion';
import {WorkoutVideo, workoutDurationInFrames} from './WorkoutVideo';
import {LearningVideo, learningDurationInFrames} from './LearningVideo';
import {activeWorkout} from './data/active-workout';
import {activeLearning} from './data/active-learning';

export const RemotionRoot: React.FC = () => {
  const workoutFps = activeWorkout.fps ?? 30;
  const learningFps = activeLearning.fps ?? 30;

  return (
    <>
      <Composition
        id="KidMotionVideo"
        component={WorkoutVideo}
        durationInFrames={workoutDurationInFrames(activeWorkout)}
        fps={workoutFps}
        width={activeWorkout.width ?? 1920}
        height={activeWorkout.height ?? 1080}
        defaultProps={{workout: activeWorkout}}
      />

      <Composition
        id="KidMotionLearning"
        component={LearningVideo}
        durationInFrames={Math.max(1, learningDurationInFrames(activeLearning))}
        fps={learningFps}
        width={activeLearning.width ?? 1920}
        height={activeLearning.height ?? 1080}
        defaultProps={{video: activeLearning}}
      />
    </>
  );
};
